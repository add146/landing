import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import type { Env } from '../types';
import { authMiddleware } from '../middleware/auth';
import { verifyMediaOwnership, verifyWebsiteOwnership } from '../utils/ownership';
import { generateId } from '../utils/crypto';

const media = new Hono<{ Bindings: Env }>();

// All routes require authentication
media.use('*', authMiddleware);

// POST /api/media/upload - Upload file to R2
media.post('/upload', async (c) => {
    const user = c.get('user');

    try {
        // Parse multipart form data
        const formData = await c.req.formData();
        const file = formData.get('file') as File | null;
        const websiteId = formData.get('website_id') as string | null;

        if (!file) {
            return c.json({ error: 'No file provided' }, 400);
        }

        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
        if (!validTypes.includes(file.type)) {
            return c.json({ error: 'Invalid file type. Only images allowed.' }, 400);
        }

        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            return c.json({ error: 'File too large. Maximum 5MB.' }, 400);
        }

        // If website_id provided, verify ownership
        if (websiteId) {
            const hasAccess = await verifyWebsiteOwnership(user.userId, websiteId, c.env.DB);
            if (!hasAccess) {
                return c.json({ error: 'Website not found' }, 404);
            }
        }

        // Generate unique filename
        const timestamp = Date.now();
        const randomStr = Math.random().toString(36).substring(7);
        const ext = file.name.split('.').pop();
        const uniqueFilename = `${timestamp}-${randomStr}.${ext}`;

        // R2 key: users/{user_id}/media/{filename}
        const r2Key = `users/${user.userId}/media/${uniqueFilename}`;

        // Upload to R2
        const arrayBuffer = await file.arrayBuffer();
        await c.env.STORAGE.put(r2Key, arrayBuffer, {
            httpMetadata: {
                contentType: file.type,
            },
        });

        // Save to database
        const mediaId = generateId();
        const now = new Date().toISOString();

        await c.env.DB
            .prepare(`
                INSERT INTO media (
                    id, user_id, website_id, filename, r2_key, mime_type, size, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `)
            .bind(
                mediaId,
                user.userId,
                websiteId || null,
                file.name,
                r2Key,
                file.type,
                file.size,
                now
            )
            .run();

        const mediaRecord = await c.env.DB
            .prepare('SELECT * FROM media WHERE id = ?')
            .bind(mediaId)
            .first();

        // Construct public URL (assuming R2 public access is enabled)
        const publicUrl = `https://pub-landing-page-assets.r2.dev/${r2Key}`;

        // Return format compatible with GrapesJS Asset Manager
        return c.json({
            data: [{
                src: publicUrl,
                type: 'image',
                name: file.name,
                width: 0, // Optional
                height: 0 // Optional
            }],
            // Keep original data for other uses
            media: mediaRecord
        }, 201);
    } catch (error) {
        console.error('Upload error:', error);
        return c.json({ error: 'Upload failed' }, 500);
    }
});

// GET /api/media - List user's media files
media.get('/', async (c) => {
    const user = c.get('user');
    const websiteId = c.req.query('website_id');

    let query = 'SELECT * FROM media WHERE user_id = ?';
    const params: any[] = [user.userId];

    if (websiteId) {
        query += ' AND website_id = ?';
        params.push(websiteId);
    }

    query += ' ORDER BY created_at DESC';

    const { results } = await c.env.DB
        .prepare(query)
        .bind(...params)
        .all();

    return c.json({ media: results });
});

// GET /api/media/:id - Get media details
media.get('/:id', async (c) => {
    const user = c.get('user');
    const { id } = c.req.param();

    // Verify ownership
    const hasAccess = await verifyMediaOwnership(user.userId, id, c.env.DB);
    if (!hasAccess) {
        return c.json({ error: 'Media not found' }, 404);
    }

    const mediaRecord = await c.env.DB
        .prepare('SELECT * FROM media WHERE id = ?')
        .bind(id)
        .first();

    return c.json({ media: mediaRecord });
});

// GET /api/media/:id/url - Get signed/public R2 URL
media.get('/:id/url', async (c) => {
    const user = c.get('user');
    const { id } = c.req.param();

    // Verify ownership
    const hasAccess = await verifyMediaOwnership(user.userId, id, c.env.DB);
    if (!hasAccess) {
        return c.json({ error: 'Media not found' }, 404);
    }

    const mediaRecord = await c.env.DB
        .prepare('SELECT r2_key FROM media WHERE id = ?')
        .bind(id)
        .first<{ r2_key: string }>();

    if (!mediaRecord) {
        return c.json({ error: 'Media not found' }, 404);
    }

    // For public access, we'll use R2 custom domain or similar
    // For now, return a placeholder that includes the R2 key
    // In production, configure R2 public bucket URL or use Cloudflare Images
    const publicUrl = `https://pub-${c.env.STORAGE.name}.r2.dev/${mediaRecord.r2_key}`;

    return c.json({ url: publicUrl });
});

// DELETE /api/media/:id - Delete from R2 and database
media.delete('/:id', async (c) => {
    const user = c.get('user');
    const { id } = c.req.param();

    // Verify ownership
    const hasAccess = await verifyMediaOwnership(user.userId, id, c.env.DB);
    if (!hasAccess) {
        return c.json({ error: 'Media not found' }, 404);
    }

    // Get R2 key
    const mediaRecord = await c.env.DB
        .prepare('SELECT r2_key FROM media WHERE id = ?')
        .bind(id)
        .first<{ r2_key: string }>();

    if (mediaRecord) {
        // Delete from R2
        try {
            await c.env.STORAGE.delete(mediaRecord.r2_key);
        } catch (error) {
            console.error('R2 delete error:', error);
            // Continue even if R2 delete fails
        }
    }

    // Delete from database
    await c.env.DB
        .prepare('DELETE FROM media WHERE id = ?')
        .bind(id)
        .run();

    return c.body(null, 204);
});

export default media;
