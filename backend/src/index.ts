import { Hono } from 'hono';
import { cors } from 'hono/cors';
import type { Env } from './types';
import auth from './routes/auth';
import websites from './routes/websites';
import pages from './routes/pages';
import sections from './routes/sections';
import elements from './routes/elements';
import media from './routes/media';

const app = new Hono<{ Bindings: Env }>();

// CORS middleware
app.use('*', cors({
    origin: (origin) => {
        const allowedOrigins = [
            'https://landing-bzy.pages.dev',
            'https://build.khibroh.com',
            'http://localhost:5173',
            'http://localhost:3000',
        ];
        return allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
    },
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

app.get('/health', (c) => {
    return c.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
    });
});

// API routes
app.route('/api/auth', auth);
app.route('/api/websites', websites);
app.route('/api/pages', pages);
app.route('/api/sections', sections);
app.route('/api/elements', elements);
app.route('/api/media', media);

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
