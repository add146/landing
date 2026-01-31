import { Hono } from 'hono';
import { cors } from 'hono/cors';
import type { Env } from './types';
import auth from './routes/auth';

const app = new Hono<{ Bindings: Env }>();

// CORS middleware
app.use('*', cors({
    origin: (origin) => origin, // Allow all origins in development
    allowMethods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));

// Health check
app.get('/', (c) => {
    return c.json({
        name: 'Landing Page Builder API',
        version: '1.0.0',
        status: 'healthy',
    });
});

// API routes
app.route('/api/auth', auth);

// 404 handler
app.notFound((c) => {
    return c.json({ error: 'Not found' }, 404);
});

// Error handler
app.onError((err, c) => {
    console.error('Error:', err);
    return c.json({ error: 'Internal server error' }, 500);
});

export default app;
