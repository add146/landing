import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import type { Env } from '../types';
import { authMiddleware } from '../middleware/auth';
import { createElementSchema, updateElementSchema, reorderElementsSchema } from '../utils/validators';
import { verifyElementOwnership, verifySectionOwnership } from '../utils/ownership';
import { generateId } from '../utils/crypto';

const elements = new Hono<{ Bindings: Env }>();

// All routes require authentication
elements.use('*', authMiddleware);

// GET /api/elements?section_id=xxx - List elements in a section
elements.get('/', async (c) => {
    const user = c.get('user');
    const sectionId = c.req.query('section_id');

    if (!sectionId) {
        return c.json({ error: 'section_id is required' }, 400);
    }

    // Verify user owns the section
    const hasAccess = await verifySectionOwnership(user.userId, sectionId, c.env.DB);
    if (!hasAccess) {
        return c.json({ error: 'Section not found' }, 404);
    }

    const { results } = await c.env.DB
        .prepare(`
            SELECT *
            FROM elements
            WHERE section_id = ?
            ORDER BY sort_order ASC
        `)
        .bind(sectionId)
        .all();

    return c.json({ elements: results });
});

// POST /api/elements - Create new element
elements.post('/', zValidator('json', createElementSchema), async (c) => {
    const user = c.get('user');
    const data = c.req.valid('json');

    // Verify user owns the section
    const hasAccess = await verifySectionOwnership(user.userId, data.section_id, c.env.DB);
    if (!hasAccess) {
        return c.json({ error: 'Section not found' }, 404);
    }

    const elementId = generateId();
    const now = new Date().toISOString();

    await c.env.DB
        .prepare(`
            INSERT INTO elements (
                id, section_id, parent_id, element_type, content, style_desktop,
                style_tablet, style_mobile, animation, sort_order, is_visible, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `)
        .bind(
            elementId,
            data.section_id,
            data.parent_id || null,
            data.element_type,
            data.content || null,
            data.style_desktop || null,
            data.style_tablet || null,
            data.style_mobile || null,
            data.animation || null,
            data.sort_order || 0,
            data.is_visible !== undefined ? data.is_visible : 1,
            now
        )
        .run();

    const element = await c.env.DB
        .prepare('SELECT * FROM elements WHERE id = ?')
        .bind(elementId)
        .first();

    return c.json({ element }, 201);
});

// GET /api/elements/:id - Get element details
elements.get('/:id', async (c) => {
    const user = c.get('user');
    const { id } = c.req.param();

    // Verify ownership
    const hasAccess = await verifyElementOwnership(user.userId, id, c.env.DB);
    if (!hasAccess) {
        return c.json({ error: 'Element not found' }, 404);
    }

    const element = await c.env.DB
        .prepare('SELECT * FROM elements WHERE id = ?')
        .bind(id)
        .first();

    return c.json({ element });
});

// PATCH /api/elements/:id - Update element
elements.patch('/:id', zValidator('json', updateElementSchema), async (c) => {
    const user = c.get('user');
    const { id } = c.req.param();
    const data = c.req.valid('json');

    // Verify ownership
    const hasAccess = await verifyElementOwnership(user.userId, id, c.env.DB);
    if (!hasAccess) {
        return c.json({ error: 'Element not found' }, 404);
    }

    // Build UPDATE query
    const updates: string[] = [];
    const values: any[] = [];

    if (data.parent_id !== undefined) { updates.push('parent_id = ?'); values.push(data.parent_id); }
    if (data.element_type !== undefined) { updates.push('element_type = ?'); values.push(data.element_type); }
    if (data.content !== undefined) { updates.push('content = ?'); values.push(data.content); }
    if (data.style_desktop !== undefined) { updates.push('style_desktop = ?'); values.push(data.style_desktop); }
    if (data.style_tablet !== undefined) { updates.push('style_tablet = ?'); values.push(data.style_tablet); }
    if (data.style_mobile !== undefined) { updates.push('style_mobile = ?'); values.push(data.style_mobile); }
    if (data.animation !== undefined) { updates.push('animation = ?'); values.push(data.animation); }
    if (data.sort_order !== undefined) { updates.push('sort_order = ?'); values.push(data.sort_order); }
    if (data.is_visible !== undefined) { updates.push('is_visible = ?'); values.push(data.is_visible); }

    values.push(id);

    if (updates.length > 0) {
        await c.env.DB
            .prepare(`UPDATE elements SET ${updates.join(', ')} WHERE id = ?`)
            .bind(...values)
            .run();
    }

    const element = await c.env.DB
        .prepare('SELECT * FROM elements WHERE id = ?')
        .bind(id)
        .first();

    return c.json({ element });
});

// DELETE /api/elements/:id - Delete element
elements.delete('/:id', async (c) => {
    const user = c.get('user');
    const { id } = c.req.param();

    // Verify ownership
    const hasAccess = await verifyElementOwnership(user.userId, id, c.env.DB);
    if (!hasAccess) {
        return c.json({ error: 'Element not found' }, 404);
    }

    await c.env.DB
        .prepare('DELETE FROM elements WHERE id = ?')
        .bind(id)
        .run();

    return c.body(null, 204);
});

// PATCH /api/elements/reorder - Reorder elements (drag & drop)
elements.patch('/reorder', zValidator('json', reorderElementsSchema), async (c) => {
    const user = c.get('user');
    const { elements: reorderData } = c.req.valid('json');

    // Verify ownership and update sort_order for each element
    for (const item of reorderData) {
        const hasAccess = await verifyElementOwnership(user.userId, item.id, c.env.DB);
        if (!hasAccess) {
            return c.json({ error: `Element ${item.id} not found` }, 404);
        }

        await c.env.DB
            .prepare('UPDATE elements SET sort_order = ? WHERE id = ?')
            .bind(item.sort_order, item.id)
            .run();
    }

    return c.json({ success: true });
});

export default elements;
