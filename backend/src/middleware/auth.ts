import { Context } from 'hono';
import { verifyToken } from '../utils/crypto';
import type { Env, JWTPayload } from '../types';

// Extend Context with authenticated user
export interface AuthContext extends Context {
    env: Env;
    var: {
        user: JWTPayload;
    };
}

/**
 * JWT Authentication Middleware
 * Verifies JWT token from Authorization header and attaches user to context
 */
export async function authMiddleware(c: Context<{ Bindings: Env }>, next: () => Promise<void>) {
    const authHeader = c.req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return c.json({ error: 'Unauthorized - No token provided' }, 401);
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    const payload = await verifyToken(token, c.env.JWT_SECRET);

    if (!payload) {
        return c.json({ error: 'Unauthorized - Invalid token' }, 401);
    }

    // Attach user to context
    c.set('user', payload);

    await next();
}

/**
 * Admin-only middleware
 * Requires authMiddleware to be applied first
 */
export async function adminMiddleware(c: Context, next: () => Promise<void>) {
    const user = c.get('user') as JWTPayload;

    if (user.role !== 'admin') {
        return c.json({ error: 'Forbidden - Admin access required' }, 403);
    }

    await next();
}
