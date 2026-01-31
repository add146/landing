import type { D1Database } from '@cloudflare/workers-types';

/**
 * Verify that a user owns a specific website
 */
export async function verifyWebsiteOwnership(
    userId: string,
    websiteId: string,
    db: D1Database
): Promise<boolean> {
    const result = await db
        .prepare('SELECT id FROM websites WHERE id = ? AND user_id = ?')
        .bind(websiteId, userId)
        .first();

    return result !== null;
}

/**
 * Verify that a user owns a specific page (via website ownership)
 */
export async function verifyPageOwnership(
    userId: string,
    pageId: string,
    db: D1Database
): Promise<boolean> {
    const result = await db
        .prepare(`
            SELECT p.id 
            FROM pages p
            JOIN websites w ON p.website_id = w.id
            WHERE p.id = ? AND w.user_id = ?
        `)
        .bind(pageId, userId)
        .first();

    return result !== null;
}

/**
 * Verify that a user owns a specific section (via page → website ownership)
 */
export async function verifySectionOwnership(
    userId: string,
    sectionId: string,
    db: D1Database
): Promise<boolean> {
    const result = await db
        .prepare(`
            SELECT s.id 
            FROM sections s
            JOIN pages p ON s.page_id = p.id
            JOIN websites w ON p.website_id = w.id
            WHERE s.id = ? AND w.user_id = ?
        `)
        .bind(sectionId, userId)
        .first();

    return result !== null;
}

/**
 * Verify that a user owns a specific element (via section → page → website ownership)
 */
export async function verifyElementOwnership(
    userId: string,
    elementId: string,
    db: D1Database
): Promise<boolean> {
    const result = await db
        .prepare(`
            SELECT e.id 
            FROM elements e
            JOIN sections s ON e.section_id = s.id
            JOIN pages p ON s.page_id = p.id
            JOIN websites w ON p.website_id = w.id
            WHERE e.id = ? AND w.user_id = ?
        `)
        .bind(elementId, userId)
        .first();

    return result !== null;
}

/**
 * Verify that a user owns a specific media file
 */
export async function verifyMediaOwnership(
    userId: string,
    mediaId: string,
    db: D1Database
): Promise<boolean> {
    const result = await db
        .prepare('SELECT id FROM media WHERE id = ? AND user_id = ?')
        .bind(mediaId, userId)
        .first();

    return result !== null;
}

/**
 * Get website owner's user ID
 */
export async function getWebsiteOwner(
    websiteId: string,
    db: D1Database
): Promise<string | null> {
    const result = await db
        .prepare('SELECT user_id FROM websites WHERE id = ?')
        .bind(websiteId)
        .first<{ user_id: string }>();

    return result?.user_id || null;
}
