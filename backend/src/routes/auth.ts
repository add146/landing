import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import type { Env, User } from '../types';
import { hashPassword, verifyPassword, generateToken, generateId } from '../utils/crypto';

const auth = new Hono<{ Bindings: Env }>();

// Validation schemas
const registerSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    name: z.string().min(2, 'Name must be at least 2 characters'),
});

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

/**
 * POST /api/auth/register
 * Register a new user account
 */
auth.post('/register', zValidator('json', registerSchema), async (c) => {
    try {
        const { email, password, name } = c.req.valid('json');

        // Check if user already exists
        const existingUser = await c.env.DB.prepare('SELECT id FROM users WHERE email = ?')
            .bind(email)
            .first<User>();

        if (existingUser) {
            return c.json({ error: 'User with this email already exists' }, 400);
        }

        // Hash password
        const passwordHash = await hashPassword(password);

        // Create user
        const userId = generateId();
        const now = new Date().toISOString();

        await c.env.DB.prepare(
            `INSERT INTO users (id, email, password_hash, name, role, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
        )
            .bind(userId, email, passwordHash, name, 'user', now, now)
            .run();

        // Generate JWT token
        const token = await generateToken(
            {
                userId,
                email,
                role: 'user',
            },
            c.env.JWT_SECRET
        );

        return c.json(
            {
                user: {
                    id: userId,
                    email,
                    name,
                    role: 'user',
                },
                token,
            },
            201
        );
    } catch (error) {
        console.error('Registration error:', error);
        return c.json({ error: 'Registration failed' }, 500);
    }
});

/**
 * POST /api/auth/login
 * Login with email and password
 */
auth.post('/login', zValidator('json', loginSchema), async (c) => {
    try {
        const { email, password } = c.req.valid('json');

        // Find user by email
        const user = await c.env.DB.prepare('SELECT * FROM users WHERE email = ?')
            .bind(email)
            .first<User>();

        if (!user) {
            return c.json({ error: 'Invalid email or password' }, 401);
        }

        // Verify password
        const isValidPassword = await verifyPassword(password, user.password_hash);

        if (!isValidPassword) {
            return c.json({ error: 'Invalid email or password' }, 401);
        }

        // Generate JWT token
        const token = await generateToken(
            {
                userId: user.id,
                email: user.email,
                role: user.role,
            },
            c.env.JWT_SECRET
        );

        return c.json({
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
            token,
        });
    } catch (error) {
        console.error('Login error:', error);
        return c.json({ error: 'Login failed' }, 500);
    }
});

/**
 * POST /api/auth/logout
 * Logout (client-side token removal, optionally blacklist token)
 */
auth.post('/logout', async (c) => {
    // In a stateless JWT system, logout is handled client-side by removing the token
    // Optionally, we could add token to a blacklist in KV store
    return c.json({ message: 'Logged out successfully' });
});

export default auth;
