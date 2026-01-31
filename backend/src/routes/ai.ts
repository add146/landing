import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { getAIProvider, isProviderAvailable } from '../utils/ai/providers';
import { prompts, parseAIResponse, validateWebsiteStructure, validateSectionContent } from '../utils/ai/prompts';
import type { Env } from '../types';

type Variables = {
    user: {
        userId: string;
        email: string;
        role: string;
    };
};

const ai = new Hono<{ Bindings: Env; Variables: Variables }>();

// Validation schemas
const providerSchema = z.enum(['gemini', 'openai', 'claude', 'perplexity', 'ollama']);

const generateWebsiteSchema = z.object({
    description: z.string().min(10).max(1000),
    provider: providerSchema.default('gemini'),
    industry: z.string().optional(),
    style: z.string().optional(),
});

const generateSectionSchema = z.object({
    type: z.enum(['hero', 'features', 'pricing', 'testimonials', 'cta', 'contact', 'about', 'services']),
    context: z.string().min(10).max(500),
    provider: providerSchema.default('gemini'),
    layout: z.string().optional(),
});

const generateLegalSchema = z.object({
    type: z.enum(['privacy-policy', 'terms-of-service', 'cookie-policy']),
    companyName: z.string().min(1),
    website: z.string().url(),
    email: z.string().email(),
    provider: providerSchema.default('gemini'),
});

const optimizeSEOSchema = z.object({
    content: z.string().min(50).max(5000),
    pageName: z.string().optional(),
    provider: providerSchema.default('gemini'),
});

const improveContentSchema = z.object({
    text: z.string().min(10).max(2000),
    tone: z.enum(['professional', 'casual', 'persuasive', 'technical']),
    purpose: z.string().optional(),
    provider: providerSchema.default('gemini'),
});

// GET /api/ai/providers - List available providers
ai.get('/providers', async (c) => {
    const env = c.env;

    const providers = [
        { name: 'gemini', label: 'Google Gemini', available: isProviderAvailable('gemini', env), costEffective: true },
        { name: 'openai', label: 'OpenAI GPT-4', available: isProviderAvailable('openai', env), popular: true },
        { name: 'claude', label: 'Anthropic Claude', available: isProviderAvailable('claude', env), creative: true },
        { name: 'perplexity', label: 'Perplexity', available: isProviderAvailable('perplexity', env), research: true },
        { name: 'ollama', label: 'Ollama (Local)', available: isProviderAvailable('ollama', env), free: true },
    ];

    return c.json({ providers });
});

// POST /api/ai/generate-website - Generate complete website structure
ai.post('/generate-website', zValidator('json', generateWebsiteSchema), async (c) => {
    const user = c.get('user');
    const { description, provider, industry, style } = c.req.valid('json');

    try {
        // Check provider availability
        if (!isProviderAvailable(provider, c.env)) {
            return c.json({ error: `Provider ${provider} is not configured` }, 400);
        }

        // Get AI provider
        const aiProvider = getAIProvider(provider, c.env);

        // Generate website structure
        const prompt = prompts.websiteWizard(description, industry, style);
        const response = await aiProvider.generateText(prompt, {
            temperature: 0.7,
            maxTokens: 3000,
        });

        // Parse response
        const websiteData = parseAIResponse(response);

        // Validate structure
        if (!validateWebsiteStructure(websiteData)) {
            return c.json({ error: 'Invalid website structure generated' }, 500);
        }

        return c.json({
            success: true,
            website: websiteData,
            provider: provider,
        });
    } catch (error: any) {
        console.error('Generate website error:', error);
        return c.json({ error: error.message || 'Failed to generate website' }, 500);
    }
});

// POST /api/ai/generate-section - Generate section content
ai.post('/generate-section', zValidator('json', generateSectionSchema), async (c) => {
    const { type, context, provider, layout } = c.req.valid('json');

    try {
        if (!isProviderAvailable(provider, c.env)) {
            return c.json({ error: `Provider ${provider} is not configured` }, 400);
        }

        const aiProvider = getAIProvider(provider, c.env);
        const prompt = prompts.sectionGenerator(type, context, layout);
        const response = await aiProvider.generateText(prompt, {
            temperature: 0.7,
            maxTokens: 1500,
        });

        const sectionData = parseAIResponse(response);

        if (!validateSectionContent(sectionData)) {
            return c.json({ error: 'Invalid section content generated' }, 500);
        }

        return c.json({
            success: true,
            section: sectionData,
            provider: provider,
        });
    } catch (error: any) {
        console.error('Generate section error:', error);
        return c.json({ error: error.message || 'Failed to generate section' }, 500);
    }
});

// POST /api/ai/generate-legal - Generate legal pages
ai.post('/generate-legal', zValidator('json', generateLegalSchema), async (c) => {
    const { type, companyName, website, email, provider } = c.req.valid('json');

    try {
        if (!isProviderAvailable(provider, c.env)) {
            return c.json({ error: `Provider ${provider} is not configured` }, 400);
        }

        const aiProvider = getAIProvider(provider, c.env);
        const prompt = prompts.legalPage(type, companyName, website, email);
        const response = await aiProvider.generateText(prompt, {
            temperature: 0.5, // Lower temperature for legal content
            maxTokens: 4000,
        });

        return c.json({
            success: true,
            content: response,
            type: type,
            provider: provider,
        });
    } catch (error: any) {
        console.error('Generate legal error:', error);
        return c.json({ error: error.message || 'Failed to generate legal page' }, 500);
    }
});

// POST /api/ai/optimize-seo - Generate SEO metadata
ai.post('/optimize-seo', zValidator('json', optimizeSEOSchema), async (c) => {
    const { content, pageName, provider } = c.req.valid('json');

    try {
        if (!isProviderAvailable(provider, c.env)) {
            return c.json({ error: `Provider ${provider} is not configured` }, 400);
        }

        const aiProvider = getAIProvider(provider, c.env);
        const prompt = prompts.seoOptimizer(content, pageName);
        const response = await aiProvider.generateText(prompt, {
            temperature: 0.6,
            maxTokens: 500,
        });

        const seoData = parseAIResponse(response);

        return c.json({
            success: true,
            seo: seoData,
            provider: provider,
        });
    } catch (error: any) {
        console.error('Optimize SEO error:', error);
        return c.json({ error: error.message || 'Failed to optimize SEO' }, 500);
    }
});

// POST /api/ai/improve-content - Improve existing content
ai.post('/improve-content', zValidator('json', improveContentSchema), async (c) => {
    const { text, tone, purpose, provider } = c.req.valid('json');

    try {
        if (!isProviderAvailable(provider, c.env)) {
            return c.json({ error: `Provider ${provider} is not configured` }, 400);
        }

        const aiProvider = getAIProvider(provider, c.env);
        const prompt = prompts.contentImprover(text, tone, purpose);
        const response = await aiProvider.generateText(prompt, {
            temperature: 0.7,
            maxTokens: 1000,
        });

        const improvedData = parseAIResponse(response);

        return c.json({
            success: true,
            original: text,
            improved: improvedData.improved,
            changes: improvedData.changes || [],
            provider: provider,
        });
    } catch (error: any) {
        console.error('Improve content error:', error);
        return c.json({ error: error.message || 'Failed to improve content' }, 500);
    }
});

// POST /api/ai/test - Test AI provider connectivity
ai.post('/test', zValidator('json', z.object({ provider: providerSchema })), async (c) => {
    const { provider } = c.req.valid('json');

    try {
        if (!isProviderAvailable(provider, c.env)) {
            return c.json({
                success: false,
                error: `Provider ${provider} is not configured. Please add API key.`,
            }, 400);
        }

        const aiProvider = getAIProvider(provider, c.env);
        const response = await aiProvider.generateText('Say "Hello, I am working correctly!"', {
            maxTokens: 50,
        });

        return c.json({
            success: true,
            provider: provider,
            response: response.substring(0, 100),
            message: 'Provider is working correctly',
        });
    } catch (error: any) {
        console.error('Test provider error:', error);
        return c.json({
            success: false,
            provider: provider,
            error: error.message,
        }, 500);
    }
});

export default ai;
