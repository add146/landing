import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import type { Env } from '../types';
import { authMiddleware } from '../middleware/auth';
import { createPageSchema, updatePageSchema } from '../utils/validators';
import { verifyPageOwnership, verifyWebsiteOwnership } from '../utils/ownership';
import { generateId } from '../utils/crypto';

const pages = new Hono<{ Bindings: Env }>();

// All routes require authentication
pages.use('*', authMiddleware);

// GET /api/pages?website_id=xxx - List pages for a website
pages.get('/', async (c) => {
    const user = c.get('user');
    const websiteId = c.req.query('website_id');

    if (!websiteId) {
        return c.json({ error: 'website_id is required' }, 400);
    }

    // Verify user owns the website
    const hasAccess = await verifyWebsiteOwnership(user.userId, websiteId, c.env.DB);
    if (!hasAccess) {
        return c.json({ error: 'Website not found' }, 404);
    }

    const { results } = await c.env.DB
        .prepare(`
            SELECT id, website_id, title, slug, page_type, is_published, sort_order, created_at
            FROM pages
            WHERE website_id = ?
            ORDER BY sort_order ASC, created_at DESC
        `)
        .bind(websiteId)
        .all();

    return c.json({ pages: results });
});

// POST /api/pages - Create new page
pages.post('/', zValidator('json', createPageSchema), async (c) => {
    const user = c.get('user');
    const data = c.req.valid('json');

    // Verify user owns the website
    const hasAccess = await verifyWebsiteOwnership(user.userId, data.website_id, c.env.DB);
    if (!hasAccess) {
        return c.json({ error: 'Website not found' }, 404);
    }

    // Check slug uniqueness within website
    const existing = await c.env.DB
        .prepare('SELECT id FROM pages WHERE website_id = ? AND slug = ?')
        .bind(data.website_id, data.slug)
        .first();

    if (existing) {
        return c.json({ error: 'Slug already exists in this website' }, 400);
    }

    const pageId = generateId();
    const now = new Date().toISOString();

    await c.env.DB
        .prepare(`
            INSERT INTO pages (
                id, website_id, title, slug, page_type, seo_title, seo_description,
                seo_keywords, og_image, twitter_card, sort_order, is_published, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, ?)
        `)
        .bind(
            pageId,
            data.website_id,
            data.title,
            data.slug,
            data.page_type || 'landing',
            data.seo_title || null,
            data.seo_description || null,
            data.seo_keywords || null,
            data.og_image || null,
            data.twitter_card || null,
            now
        )
        .run();

    const page = await c.env.DB
        .prepare('SELECT * FROM pages WHERE id = ?')
        .bind(pageId)
        .first();

    return c.json({ page }, 201);
});

// GET /api/pages/:id - Get page details with sections
pages.get('/:id', async (c) => {
    const user = c.get('user');
    const { id } = c.req.param();

    // Verify ownership
    const hasAccess = await verifyPageOwnership(user.userId, id, c.env.DB);
    if (!hasAccess) {
        return c.json({ error: 'Page not found' }, 404);
    }

    const page = await c.env.DB
        .prepare('SELECT * FROM pages WHERE id = ?')
        .bind(id)
        .first();

    // Get sections for this page
    const { results: sections } = await c.env.DB
        .prepare(`
            SELECT id, section_type, layout_variant, content, settings, sort_order, is_visible
            FROM sections
            WHERE page_id = ?
            ORDER BY sort_order ASC
        `)
        .bind(id)
        .all();

    return c.json({ page, sections });
});

// PATCH /api/pages/:id - Update page
pages.patch('/:id', zValidator('json', updatePageSchema), async (c) => {
    const user = c.get('user');
    const { id } = c.req.param();
    const data = c.req.valid('json');

    // Verify ownership
    const hasAccess = await verifyPageOwnership(user.userId, id, c.env.DB);
    if (!hasAccess) {
        return c.json({ error: 'Page not found' }, 404);
    }

    // If slug is being updated, check uniqueness
    if (data.slug) {
        const page = await c.env.DB
            .prepare('SELECT website_id FROM pages WHERE id = ?')
            .bind(id)
            .first<{ website_id: string }>();

        const existing = await c.env.DB
            .prepare('SELECT id FROM pages WHERE website_id = ? AND slug = ? AND id != ?')
            .bind(page!.website_id, data.slug, id)
            .first();

        if (existing) {
            return c.json({ error: 'Slug already exists' }, 400);
        }
    }

    // Build UPDATE query
    const updates: string[] = [];
    const values: any[] = [];

    if (data.title !== undefined) { updates.push('title = ?'); values.push(data.title); }
    if (data.slug !== undefined) { updates.push('slug = ?'); values.push(data.slug); }
    if (data.page_type !== undefined) { updates.push('page_type = ?'); values.push(data.page_type); }
    if (data.seo_title !== undefined) { updates.push('seo_title = ?'); values.push(data.seo_title); }
    if (data.seo_description !== undefined) { updates.push('seo_description = ?'); values.push(data.seo_description); }
    if (data.seo_keywords !== undefined) { updates.push('seo_keywords = ?'); values.push(data.seo_keywords); }
    if (data.og_image !== undefined) { updates.push('og_image = ?'); values.push(data.og_image); }
    if (data.twitter_card !== undefined) { updates.push('twitter_card = ?'); values.push(data.twitter_card); }

    values.push(id);

    if (updates.length > 0) {
        await c.env.DB
            .prepare(`UPDATE pages SET ${updates.join(', ')} WHERE id = ?`)
            .bind(...values)
            .run();
    }

    const page = await c.env.DB
        .prepare('SELECT * FROM pages WHERE id = ?')
        .bind(id)
        .first();

    return c.json({ page });
});

// DELETE /api/pages/:id - Delete page and cascade
pages.delete('/:id', async (c) => {
    const user = c.get('user');
    const { id } = c.req.param();

    // Verify ownership
    const hasAccess = await verifyPageOwnership(user.userId, id, c.env.DB);
    if (!hasAccess) {
        return c.json({ error: 'Page not found' }, 404);
    }

    // Delete cascade: page → sections → elements
    const { results: sections } = await c.env.DB
        .prepare('SELECT id FROM sections WHERE page_id = ?')
        .bind(id)
        .all<{ id: string }>();

    for (const section of sections) {
        await c.env.DB
            .prepare('DELETE FROM elements WHERE section_id = ?')
            .bind(section.id)
            .run();
    }

    await c.env.DB
        .prepare('DELETE FROM sections WHERE page_id = ?')
        .bind(id)
        .run();

    await c.env.DB
        .prepare('DELETE FROM pages WHERE id = ?')
        .bind(id)
        .run();

    return c.body(null, 204);
});

// PATCH /api/pages/:id/publish - Toggle publish status
pages.patch('/:id/publish', async (c) => {
    const user = c.get('user');
    const { id } = c.req.param();

    // Verify ownership
    const hasAccess = await verifyPageOwnership(user.userId, id, c.env.DB);
    if (!hasAccess) {
        return c.json({ error: 'Page not found' }, 404);
    }

    // Toggle publish status
    const page = await c.env.DB
        .prepare('SELECT is_published FROM pages WHERE id = ?')
        .bind(id)
        .first<{ is_published: number }>();

    const newStatus = page!.is_published === 1 ? 0 : 1;

    await c.env.DB
        .prepare('UPDATE pages SET is_published = ? WHERE id = ?')
        .bind(newStatus, id)
        .run();

    const updated = await c.env.DB
        .prepare('SELECT * FROM pages WHERE id = ?')
        .bind(id)
        .first();

    return c.json({ page: updated });
});

export default pages;
