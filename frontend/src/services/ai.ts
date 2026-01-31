// AI Service - Client-side API wrapper for AI features
import client from '../api/client';

export interface AIProvider {
    name: string;
    label: string;
    available: boolean;
    costEffective?: boolean;
    popular?: boolean;
    creative?: boolean;
    research?: boolean;
    free?: boolean;
}

export interface WebsiteGeneration {
    name: string;
    description: string;
    pages: Array<{
        title: string;
        slug: string;
        is_published: boolean;
        sections: any[];
    }>;
}

export interface SectionGeneration {
    type: string;
    layout_variant: string;
    content: any;
}

export interface SEOData {
    title: string;
    description: string;
    keywords: string;
    ogTitle?: string;
    ogDescription?: string;
    recommendations?: string[];
}

export interface ContentImprovement {
    improved: string;
    changes: string[];
}

class AIService {
    /**
     * Get list of available AI providers
     */
    async getProviders(): Promise<AIProvider[]> {
        try {
            const response = await client.get('/api/ai/providers');
            return response.data.providers || [];
        } catch (error) {
            console.error('Failed to get AI providers:', error);
            return [];
        }
    }

    /**
     * Test AI provider connectivity
     */
    async testProvider(provider: string): Promise<{ success: boolean; message?: string; error?: string }> {
        try {
            const response = await client.post('/api/ai/test', { provider });
            return response.data;
        } catch (error: any) {
            return {
                success: false,
                error: error.response?.data?.error || error.message || 'Failed to test provider',
            };
        }
    }

    /**
     * Generate complete website structure with AI
     */
    async generateWebsite(
        description: string,
        provider: string = 'gemini',
        options?: {
            industry?: string;
            style?: string;
        }
    ): Promise<WebsiteGeneration> {
        try {
            const response = await client.post('/api/ai/generate-website', {
                description,
                provider,
                ...options,
            });

            if (!response.data.success) {
                throw new Error(response.data.error || 'Generation failed');
            }

            return response.data.website;
        } catch (error: any) {
            console.error('Generate website error:', error);
            throw new Error(error.response?.data?.error || error.message || 'Failed to generate website');
        }
    }

    /**
     * Generate section content with AI
     */
    async generateSection(
        type: string,
        context: string,
        provider: string = 'gemini',
        layout?: string
    ): Promise<SectionGeneration> {
        try {
            const response = await client.post('/api/ai/generate-section', {
                type,
                context,
                provider,
                layout,
            });

            if (!response.data.success) {
                throw new Error(response.data.error || 'Generation failed');
            }

            return response.data.section;
        } catch (error: any) {
            console.error('Generate section error:', error);
            throw new Error(error.response?.data?.error || error.message || 'Failed to generate section');
        }
    }

    /**
     * Generate legal page content (privacy policy, terms, etc.)
     */
    async generateLegal(
        type: 'privacy-policy' | 'terms-of-service' | 'cookie-policy',
        companyInfo: {
            companyName: string;
            website: string;
            email: string;
        },
        provider: string = 'gemini'
    ): Promise<string> {
        try {
            const response = await client.post('/api/ai/generate-legal', {
                type,
                ...companyInfo,
                provider,
            });

            if (!response.data.success) {
                throw new Error(response.data.error || 'Generation failed');
            }

            return response.data.content;
        } catch (error: any) {
            console.error('Generate legal error:', error);
            throw new Error(error.response?.data?.error || error.message || 'Failed to generate legal content');
        }
    }

    /**
     * Generate SEO metadata with AI
     */
    async optimizeSEO(
        content: string,
        provider: string = 'gemini',
        pageName?: string
    ): Promise<SEOData> {
        try {
            const response = await client.post('/api/ai/optimize-seo', {
                content,
                provider,
                pageName,
            });

            if (!response.data.success) {
                throw new Error(response.data.error || 'Optimization failed');
            }

            return response.data.seo;
        } catch (error: any) {
            console.error('Optimize SEO error:', error);
            throw new Error(error.response?.data?.error || error.message || 'Failed to optimize SEO');
        }
    }

    /**
     * Improve existing content with AI
     */
    async improveContent(
        text: string,
        tone: 'professional' | 'casual' | 'persuasive' | 'technical',
        provider: string = 'gemini',
        purpose?: string
    ): Promise<ContentImprovement> {
        try {
            const response = await client.post('/api/ai/improve-content', {
                text,
                tone,
                provider,
                purpose,
            });

            if (!response.data.success) {
                throw new Error(response.data.error || 'Improvement failed');
            }

            return {
                improved: response.data.improved,
                changes: response.data.changes || [],
            };
        } catch (error: any) {
            console.error('Improve content error:', error);
            throw new Error(error.response?.data?.error || error.message || 'Failed to improve content');
        }
    }

    /**
     * Get user's preferred AI provider from settings
     */
    getPreferredProvider(): string {
        return localStorage.getItem('ai_provider') || 'gemini';
    }

    /**
     * Set user's preferred AI provider
     */
    setPreferredProvider(provider: string): void {
        localStorage.setItem('ai_provider', provider);
    }
}

export const aiService = new AIService();
export default aiService;
