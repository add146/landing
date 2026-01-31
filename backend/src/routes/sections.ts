import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import type { Env } from '../types';
import { authMiddleware } from '../middleware/auth';
import { createSectionSchema, updateSectionSchema, reorderSectionsSchema } from '../utils/validators';
import { verifySectionOwnership, verifyPageOwnership } from '../utils/ownership';
import { generateId } from '../utils/crypto';

const sections = new Hono<{ Bindings: Env }>();

// All routes require authentication
sections.use('*', authMiddleware);

// GET /api/sections?page_id=xxx - List sections for a page
sections.get('/', async (c) => {
    const user = c.get('user');
    const pageId = c.req.query('page_id');

    if (!pageId) {
        return c.json({ error: 'page_id is required' }, 400);
    }

    // Verify user owns the page
    const hasAccess = await verifyPageOwnership(user.userId, pageId, c.env.DB);
    if (!hasAccess) {
        return c.json({ error: 'Page not found' }, 404);
    }

    const { results } = await c.env.DB
        .prepare(`
            SELECT *
            FROM sections
            WHERE page_id = ?
            ORDER BY sort_order ASC
        `)
        .bind(pageId)
        .all();

    return c.json({ sections: results });
});

// POST /api/sections - Create new section
sections.post('/', zValidator('json', createSectionSchema), async (c) => {
    const user = c.get('user');
    const data = c.req.valid('json');

    // Verify user owns the page
    const hasAccess = await verifyPageOwnership(user.userId, data.page_id, c.env.DB);
    if (!hasAccess) {
        return c.json({ error: 'Page not found' }, 404);
    }

    const sectionId = generateId();
    const now = new Date().toISOString();

    await c.env.DB
        .prepare(`
            INSERT INTO sections (
                id, page_id, section_type, layout_variant, content, settings,
                sort_order, is_visible, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `)
        .bind(
            sectionId,
            data.page_id,
            data.section_type,
            data.layout_variant || 1,
            data.content || null,
            data.settings || null,
            data.sort_order || 0,
            data.is_visible !== undefined ? data.is_visible : 1,
            now
        )
        .run();

    const section = await c.env.DB
        .prepare('SELECT * FROM sections WHERE id = ?')
        .bind(sectionId)
        .first();

    return c.json({ section }, 201);
});

// GET /api/sections/:id - Get section details with elements
sections.get('/:id', async (c) => {
    const user = c.get('user');
    const { id } = c.req.param();

    // Verify ownership
    const hasAccess = await verifySectionOwnership(user.userId, id, c.env.DB);
    if (!hasAccess) {
        return c.json({ error: 'Section not found' }, 404);
    }

    const section = await c.env.DB
        .prepare('SELECT * FROM sections WHERE id = ?')
        .bind(id)
        .first();

    // Get elements for this section
    const { results: elements } = await c.env.DB
        .prepare(`
            SELECT *
            FROM elements
            WHERE section_id = ?
            ORDER BY sort_order ASC
        `)
        .bind(id)
        .all();

    return c.json({ section, elements });
});

// PATCH /api/sections/:id - Update section
sections.patch('/:id', zValidator('json', updateSectionSchema), async (c) => {
    const user = c.get('user');
    const { id } = c.req.param();
    const data = c.req.valid('json');

    // Verify ownership
    const hasAccess = await verifySectionOwnership(user.userId, id, c.env.DB);
    if (!hasAccess) {
        return c.json({ error: 'Section not found' }, 404);
    }

    // Build UPDATE query
    const updates: string[] = [];
    const values: any[] = [];

    if (data.section_type !== undefined) { updates.push('section_type = ?'); values.push(data.section_type); }
    if (data.layout_variant !== undefined) { updates.push('layout_variant = ?'); values.push(data.layout_variant); }
    if (data.content !== undefined) { updates.push('content = ?'); values.push(data.content); }
    if (data.settings !== undefined) { updates.push('settings = ?'); values.push(data.settings); }
    if (data.sort_order !== undefined) { updates.push('sort_order = ?'); values.push(data.sort_order); }
    if (data.is_visible !== undefined) { updates.push('is_visible = ?'); values.push(data.is_visible); }

    values.push(id);

    if (updates.length > 0) {
        await c.env.DB
            .prepare(`UPDATE sections SET ${updates.join(', ')} WHERE id = ?`)
            .bind(...values)
            .run();
    }

    const section = await c.env.DB
        .prepare('SELECT * FROM sections WHERE id = ?')
        .bind(id)
        .first();

    return c.json({ section });
});

// DELETE /api/sections/:id - Delete section and elements
sections.delete('/:id', async (c) => {
    const user = c.get('user');
    const { id } = c.req.param();

    // Verify ownership
    const hasAccess = await verifySectionOwnership(user.userId, id, c.env.DB);
    if (!hasAccess) {
        return c.json({ error: 'Section not found' }, 404);
    }

    // Delete all elements first
    await c.env.DB
        .prepare('DELETE FROM elements WHERE section_id = ?')
        .bind(id)
        .run();

    // Delete section
    await c.env.DB
        .prepare('DELETE FROM sections WHERE id = ?')
        .bind(id)
        .run();

    return c.body(null, 204);
});

// PATCH /api/sections/reorder - Reorder sections (drag & drop)
sections.patch('/reorder', zValidator('json', reorderSectionsSchema), async (c) => {
    const user = c.get('user');
    const { sections: reorderData } = c.req.valid('json');

    // Verify ownership and update sort_order for each section
    for (const item of reorderData) {
        const hasAccess = await verifySectionOwnership(user.userId, item.id, c.env.DB);
        if (!hasAccess) {
            return c.json({ error: `Section ${item.id} not found` }, 404);
        }

        await c.env.DB
            .prepare('UPDATE sections SET sort_order = ? WHERE id = ?')
            .bind(item.sort_order, item.id)
            .run();
    }

    return c.json({ success: true });
});

export default sections;
