import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { createVCardSchema, updateVCardSchema } from '../utils/validators';
import { generateVCF, generateVCFFilename } from '../utils/vcf';
import { authMiddleware } from '../middleware/auth';
import type { Env } from '../types';

type Variables = {
    user: {
        userId: string;
        email: string;
        role: string;
    };
};

const vcards = new Hono<{ Bindings: Env; Variables: Variables }>();

// Apply auth middleware to all routes except public ones
vcards.use('*', async (c, next) => {
    const path = c.req.path;
    // Skip auth for public routes
    if (path.includes('/public/')) {
        return await next();
    }
    // Apply auth for all other routes
    return await authMiddleware(c as any, next);
});

// Helper: Generate unique ID
function generateId(): string {
    return `vcard_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

// GET /api/vcards - List user's vCards
vcards.get('/', async (c) => {
    const user = c.get('user');

    const vcards = await c.env.DB
        .prepare('SELECT * FROM vcards WHERE user_id = ? ORDER BY created_at DESC')
        .bind(user.userId)
        .all();

    return c.json({ vcards: vcards.results || [] });
});

// POST /api/vcards - Create new vCard
vcards.post('/', zValidator('json', createVCardSchema), async (c) => {
    const user = c.get('user');
    const data = c.req.valid('json');

    // Check slug uniqueness for this user
    const existing = await c.env.DB
        .prepare('SELECT id FROM vcards WHERE user_id = ? AND slug = ?')
        .bind(user.userId, data.slug)
        .first();

    if (existing) {
        return c.json({ error: 'Slug already exists' }, 400);
    }

    const vcardId = generateId();
    const now = new Date().toISOString();

    await c.env.DB
        .prepare(`
            INSERT INTO vcards (
                id, user_id, name, job_title, company, email, phone, whatsapp,
                website, address, bio, photo_url, social_links, template_id,
                slug, theme_color, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `)
        .bind(
            vcardId,
            user.userId,
            data.name,
            data.job_title || null,
            data.company || null,
            data.email || null,
            data.phone || null,
            data.whatsapp || null,
            data.website || null,
            data.address || null,
            data.bio || null,
            data.photo_url || null,
            data.social_links || null,
            data.template_id || 'modern',
            data.slug,
            data.theme_color || '#6366F1',
            now
        )
        .run();

    const vcard = await c.env.DB
        .prepare('SELECT * FROM vcards WHERE id = ?')
        .bind(vcardId)
        .first();

    return c.json({ vcard }, 201);
});

// GET /api/vcards/:id - Get vCard by ID (private)
vcards.get('/:id', async (c) => {
    const user = c.get('user');
    const vcardId = c.req.param('id');

    const vcard = await c.env.DB
        .prepare('SELECT * FROM vcards WHERE id = ? AND user_id = ?')
        .bind(vcardId, user.userId)
        .first();

    if (!vcard) {
        return c.json({ error: 'vCard not found' }, 404);
    }

    return c.json({ vcard });
});

// PATCH /api/vcards/:id - Update vCard
vcards.patch('/:id', zValidator('json', updateVCardSchema), async (c) => {
    const user = c.get('user');
    const vcardId = c.req.param('id');
    const data = c.req.valid('json');

    // Verify ownership
    const existing = await c.env.DB
        .prepare('SELECT id FROM vcards WHERE id = ? AND user_id = ?')
        .bind(vcardId, user.userId)
        .first();

    if (!existing) {
        return c.json({ error: 'vCard not found' }, 404);
    }

    // Build update query dynamically
    const updates: string[] = [];
    const values: any[] = [];

    if (data.name !== undefined) {
        updates.push('name = ?');
        values.push(data.name);
    }
    if (data.job_title !== undefined) {
        updates.push('job_title = ?');
        values.push(data.job_title);
    }
    if (data.company !== undefined) {
        updates.push('company = ?');
        values.push(data.company);
    }
    if (data.email !== undefined) {
        updates.push('email = ?');
        values.push(data.email);
    }
    if (data.phone !== undefined) {
        updates.push('phone = ?');
        values.push(data.phone);
    }
    if (data.whatsapp !== undefined) {
        updates.push('whatsapp = ?');
        values.push(data.whatsapp);
    }
    if (data.website !== undefined) {
        updates.push('website = ?');
        values.push(data.website);
    }
    if (data.address !== undefined) {
        updates.push('address = ?');
        values.push(data.address);
    }
    if (data.bio !== undefined) {
        updates.push('bio = ?');
        values.push(data.bio);
    }
    if (data.photo_url !== undefined) {
        updates.push('photo_url = ?');
        values.push(data.photo_url);
    }
    if (data.social_links !== undefined) {
        updates.push('social_links = ?');
        values.push(data.social_links);
    }
    if (data.template_id !== undefined) {
        updates.push('template_id = ?');
        values.push(data.template_id);
    }
    if (data.theme_color !== undefined) {
        updates.push('theme_color = ?');
        values.push(data.theme_color);
    }

    if (updates.length === 0) {
        return c.json({ error: 'No fields to update' }, 400);
    }

    values.push(vcardId);

    await c.env.DB
        .prepare(`UPDATE vcards SET ${updates.join(', ')} WHERE id = ?`)
        .bind(...values)
        .run();

    const vcard = await c.env.DB
        .prepare('SELECT * FROM vcards WHERE id = ?')
        .bind(vcardId)
        .first();

    return c.json({ vcard });
});

// DELETE /api/vcards/:id - Delete vCard
vcards.delete('/:id', async (c) => {
    const user = c.get('user');
    const vcardId = c.req.param('id');

    // Verify ownership
    const existing = await c.env.DB
        .prepare('SELECT id FROM vcards WHERE id = ? AND user_id = ?')
        .bind(vcardId, user.userId)
        .first();

    if (!existing) {
        return c.json({ error: 'vCard not found' }, 404);
    }

    await c.env.DB
        .prepare('DELETE FROM vcards WHERE id = ?')
        .bind(vcardId)
        .run();

    return c.json({ success: true });
});

// GET /api/vcards/public/:slug - Get vCard by slug (PUBLIC - no auth)
vcards.get('/public/:slug', async (c) => {
    const slug = c.req.param('slug');

    const vcard = await c.env.DB
        .prepare('SELECT * FROM vcards WHERE slug = ?')
        .bind(slug)
        .first();

    if (!vcard) {
        return c.json({ error: 'vCard not found' }, 404);
    }

    return c.json({ vcard });
});

// GET /api/vcards/:id/download - Download VCF file
vcards.get('/:id/download', async (c) => {
    const user = c.get('user');
    const vcardId = c.req.param('id');

    const vcard = await c.env.DB
        .prepare('SELECT * FROM vcards WHERE id = ? AND user_id = ?')
        .bind(vcardId, user.userId)
        .first();

    if (!vcard) {
        return c.json({ error: 'vCard not found' }, 404);
    }

    // Generate VCF content
    const vcfContent = generateVCF(vcard as any);
    const filename = generateVCFFilename(vcard.name as string);

    // Return as downloadable file
    return new Response(vcfContent, {
        headers: {
            'Content-Type': 'text/vcard; charset=utf-8',
            'Content-Disposition': `attachment; filename="${filename}"`,
        },
    });
});

// GET /api/vcards/public/:slug/download - Download VCF file (PUBLIC)
vcards.get('/public/:slug/download', async (c) => {
    const slug = c.req.param('slug');

    const vcard = await c.env.DB
        .prepare('SELECT * FROM vcards WHERE slug = ?')
        .bind(slug)
        .first();

    if (!vcard) {
        return c.json({ error: 'vCard not found' }, 404);
    }

    // Generate VCF content
    const vcfContent = generateVCF(vcard as any);
    const filename = generateVCFFilename(vcard.name as string);

    // Return as downloadable file
    return new Response(vcfContent, {
        headers: {
            'Content-Type': 'text/vcard; charset=utf-8',
            'Content-Disposition': `attachment; filename="${filename}"`,
        },
    });
});

export default vcards;
