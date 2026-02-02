import { Hono } from 'hono';
import { cors } from 'hono/cors';
import type { Env } from './types';
import auth from './routes/auth';
import websites from './routes/websites';
import pages from './routes/pages';
import sections from './routes/sections';
import elements from './routes/elements';
import media from './routes/media';
import vcards from './routes/vcards';
import ai from './routes/ai';
import { authMiddleware } from './middleware/auth';

const app = new Hono<{ Bindings: Env }>();

// CORS middleware
app.use('*', cors({
    origin: (origin) => {
        // Allow localhost
        if (origin.includes('localhost')) return origin;
        // Allow landing-bzy.pages.dev and all its subdomains
        if (origin.endsWith('landing-bzy.pages.dev')) return origin;
        // Allow production domain
        if (origin === 'https://build.khibroh.com') return origin;

        // Default to production for unknown
        return 'https://landing-bzy.pages.dev';
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
app.route('/api/vcards', vcards);

// AI routes (protected)
app.use('/api/ai/*', authMiddleware);
app.route('/api/ai', ai);

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
