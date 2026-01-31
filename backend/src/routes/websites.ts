import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import type { Env, JWTPayload } from '../types';
import { authMiddleware } from '../middleware/auth';
import { createWebsiteSchema, updateWebsiteSchema } from '../utils/validators';
import { verifyWebsiteOwnership } from '../utils/ownership';
import { generateId } from '../utils/crypto';

type Variables = {
    user: JWTPayload;
};

const websites = new Hono<{ Bindings: Env; Variables: Variables }>();

// All routes require authentication
websites.use('*', authMiddleware);

// GET /api/websites - List all user's websites
websites.get('/', async (c) => {
    const user = c.get('user');

    const { results } = await c.env.DB
        .prepare(`
            SELECT id, name, slug, custom_domain, status, created_at, updated_at
            FROM websites
            WHERE user_id = ?
            ORDER BY created_at DESC
        `)
        .bind(user.userId)
        .all();

    return c.json({ websites: results });
});

// POST /api/websites - Create new website
websites.post('/', zValidator('json', createWebsiteSchema), async (c) => {
    const user = c.get('user');
    const data = c.req.valid('json');

    // Check slug uniqueness for this user
    const existing = await c.env.DB
        .prepare('SELECT id FROM websites WHERE user_id = ? AND slug = ?')
        .bind(user.userId, data.slug)
        .first();

    if (existing) {
        return c.json({ error: 'Slug already exists' }, 400);
    }

    const websiteId = generateId();
    const now = new Date().toISOString();

    await c.env.DB
        .prepare(`
            INSERT INTO websites (
                id, user_id, name, slug, custom_domain, theme_id, theme_settings,
                favicon_url, custom_css, custom_js, seo_default, status, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'draft', ?, ?)
        `)
        .bind(
            websiteId,
            user.userId,
            data.name,
            data.slug,
            data.custom_domain || null,
            data.theme_id || null,
            data.theme_settings || null,
            data.favicon_url || null,
            data.custom_css || null,
            data.custom_js || null,
            data.seo_default || null,
            now,
            now
        )
        .run();

    const website = await c.env.DB
        .prepare('SELECT * FROM websites WHERE id = ?')
        .bind(websiteId)
        .first();

    return c.json({ website }, 201);
});

// GET /api/websites/:id - Get single website
websites.get('/:id', async (c) => {
    const user = c.get('user');
    const { id } = c.req.param();

    // Verify ownership
    const hasAccess = await verifyWebsiteOwnership(user.userId, id, c.env.DB);
    if (!hasAccess) {
        return c.json({ error: 'Website not found' }, 404);
    }

    const website = await c.env.DB
        .prepare('SELECT * FROM websites WHERE id = ?')
        .bind(id)
        .first();

    return c.json({ website });
});

// PATCH /api/websites/:id - Update website
websites.patch('/:id', zValidator('json', updateWebsiteSchema), async (c) => {
    const user = c.get('user');
    const { id } = c.req.param();
    const data = c.req.valid('json');

    // Verify ownership
    const hasAccess = await verifyWebsiteOwnership(user.userId, id, c.env.DB);
    if (!hasAccess) {
        return c.json({ error: 'Website not found' }, 404);
    }

    // If slug is being updated, check uniqueness
    if (data.slug) {
        const existing = await c.env.DB
            .prepare('SELECT id FROM websites WHERE user_id = ? AND slug = ? AND id != ?')
            .bind(user.userId, data.slug, id)
            .first();

        if (existing) {
            return c.json({ error: 'Slug already exists' }, 400);
        }
    }

    // Build UPDATE query dynamically
    const updates: string[] = [];
    const values: any[] = [];

    if (data.name !== undefined) { updates.push('name = ?'); values.push(data.name); }
    if (data.slug !== undefined) { updates.push('slug = ?'); values.push(data.slug); }
    if (data.custom_domain !== undefined) { updates.push('custom_domain = ?'); values.push(data.custom_domain); }
    if (data.theme_id !== undefined) { updates.push('theme_id = ?'); values.push(data.theme_id); }
    if (data.theme_settings !== undefined) { updates.push('theme_settings = ?'); values.push(data.theme_settings); }
    if (data.favicon_url !== undefined) { updates.push('favicon_url = ?'); values.push(data.favicon_url); }
    if (data.custom_css !== undefined) { updates.push('custom_css = ?'); values.push(data.custom_css); }
    if (data.custom_js !== undefined) { updates.push('custom_js = ?'); values.push(data.custom_js); }
    if (data.seo_default !== undefined) { updates.push('seo_default = ?'); values.push(data.seo_default); }

    updates.push('updated_at = ?');
    values.push(new Date().toISOString());
    values.push(id);

    if (updates.length > 1) { // More than just updated_at
        await c.env.DB
            .prepare(`UPDATE websites SET ${updates.join(', ')} WHERE id = ?`)
            .bind(...values)
            .run();
    }

    const website = await c.env.DB
        .prepare('SELECT * FROM websites WHERE id = ?')
        .bind(id)
        .first();

    return c.json({ website });
});

// DELETE /api/websites/:id - Delete website
websites.delete('/:id', async (c) => {
    const user = c.get('user');
    const { id } = c.req.param();

    // Verify ownership
    const hasAccess = await verifyWebsiteOwnership(user.userId, id, c.env.DB);
    if (!hasAccess) {
        return c.json({ error: 'Website not found' }, 404);
    }

    // Delete cascade: website → pages → sections → elements
    // D1 doesn't support CASCADE DELETE, so we do it manually

    // Get all pages
    const { results: pages } = await c.env.DB
        .prepare('SELECT id FROM pages WHERE website_id = ?')
        .bind(id)
        .all<{ id: string }>();

    // Delete elements and sections for each page
    for (const page of pages) {
        const { results: sections } = await c.env.DB
            .prepare('SELECT id FROM sections WHERE page_id = ?')
            .bind(page.id)
            .all<{ id: string }>();

        for (const section of sections) {
            await c.env.DB
                .prepare('DELETE FROM elements WHERE section_id = ?')
                .bind(section.id)
                .run();
        }

        await c.env.DB
            .prepare('DELETE FROM sections WHERE page_id = ?')
            .bind(page.id)
            .run();
    }

    // Delete pages
    await c.env.DB
        .prepare('DELETE FROM pages WHERE website_id = ?')
        .bind(id)
        .run();

    // Delete website
    await c.env.DB
        .prepare('DELETE FROM websites WHERE id = ?')
        .bind(id)
        .run();

    return c.body(null, 204);
});

// POST /api/websites/:id/publish - Publish website
websites.post('/:id/publish', async (c) => {
    const user = c.get('user');
    const { id } = c.req.param();

    // Verify ownership
    const hasAccess = await verifyWebsiteOwnership(user.userId, id, c.env.DB);
    if (!hasAccess) {
        return c.json({ error: 'Website not found' }, 404);
    }

    await c.env.DB
        .prepare('UPDATE websites SET status = ?, updated_at = ? WHERE id = ?')
        .bind('published', new Date().toISOString(), id)
        .run();

    const website = await c.env.DB
        .prepare('SELECT * FROM websites WHERE id = ?')
        .bind(id)
        .first();

    return c.json({ website });
});

export default websites;
