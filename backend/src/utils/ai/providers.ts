// AI Provider Interface and Implementations

export interface GenerateOptions {
    temperature?: number;
    maxTokens?: number;
    model?: string;
}

export interface StreamOptions extends GenerateOptions {
    onChunk?: (chunk: string) => void;
}

export interface AIProvider {
    name: string;
    generateText(prompt: string, options?: GenerateOptions): Promise<string>;
}

export interface AIResponse {
    text: string;
    provider: string;
    model: string;
    tokensUsed?: number;
}

// Google Gemini Provider
import { GoogleGenerativeAI } from '@google/generative-ai';

export class GeminiProvider implements AIProvider {
    name = 'gemini';
    private client: GoogleGenerativeAI;
    private apiKey: string;

    constructor(apiKey: string) {
        if (!apiKey) {
            throw new Error('Gemini API key is required');
        }
        this.apiKey = apiKey;
        this.client = new GoogleGenerativeAI(apiKey);
    }

    async generateText(prompt: string, options?: GenerateOptions): Promise<string> {
        try {
            const model = this.client.getGenerativeModel({
                model: options?.model || 'gemini-2.5-flash'
            });

            const result = await model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (error: any) {
            console.error('Gemini API error:', error);
            throw new Error(`Gemini generation failed: ${error.message}`);
        }
    }
}

// OpenAI Provider
import OpenAI from 'openai';

export class OpenAIProvider implements AIProvider {
    name = 'openai';
    private client: OpenAI;

    constructor(apiKey: string) {
        if (!apiKey) {
            throw new Error('OpenAI API key is required');
        }
        this.client = new OpenAI({ apiKey });
    }

    async generateText(prompt: string, options?: GenerateOptions): Promise<string> {
        try {
            const completion = await this.client.chat.completions.create({
                model: options?.model || 'gpt-4o-mini',
                messages: [{ role: 'user', content: prompt }],
                temperature: options?.temperature || 0.7,
                max_tokens: options?.maxTokens || 2000,
            });

            return completion.choices[0]?.message?.content || '';
        } catch (error: any) {
            console.error('OpenAI API error:', error);
            throw new Error(`OpenAI generation failed: ${error.message}`);
        }
    }
}

// Claude (Anthropic) Provider
import Anthropic from '@anthropic-ai/sdk';

export class ClaudeProvider implements AIProvider {
    name = 'claude';
    private client: Anthropic;

    constructor(apiKey: string) {
        if (!apiKey) {
            throw new Error('Anthropic API key is required');
        }
        this.client = new Anthropic({ apiKey });
    }

    async generateText(prompt: string, options?: GenerateOptions): Promise<string> {
        try {
            const message = await this.client.messages.create({
                model: options?.model || 'claude-3-5-sonnet-20241022',
                max_tokens: options?.maxTokens || 2000,
                temperature: options?.temperature || 0.7,
                messages: [{ role: 'user', content: prompt }],
            });

            const content = message.content[0];
            if (content.type === 'text') {
                return content.text;
            }
            return '';
        } catch (error: any) {
            console.error('Claude API error:', error);
            throw new Error(`Claude generation failed: ${error.message}`);
        }
    }
}

// Perplexity Provider (uses OpenAI-compatible API)
export class PerplexityProvider implements AIProvider {
    name = 'perplexity';
    private apiKey: string;

    constructor(apiKey: string) {
        if (!apiKey) {
            throw new Error('Perplexity API key is required');
        }
        this.apiKey = apiKey;
    }

    async generateText(prompt: string, options?: GenerateOptions): Promise<string> {
        try {
            const response = await fetch('https://api.perplexity.ai/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: options?.model || 'llama-3.1-sonar-small-128k-online',
                    messages: [{ role: 'user', content: prompt }],
                    temperature: options?.temperature || 0.7,
                    max_tokens: options?.maxTokens || 2000,
                }),
            });

            if (!response.ok) {
                throw new Error(`Perplexity API error: ${response.statusText}`);
            }

            const data: any = await response.json();
            return data.choices[0]?.message?.content || '';
        } catch (error: any) {
            console.error('Perplexity API error:', error);
            throw new Error(`Perplexity generation failed: ${error.message}`);
        }
    }
}

// Ollama Provider (local/self-hosted)
export class OllamaProvider implements AIProvider {
    name = 'ollama';
    private baseURL: string;

    constructor(baseURL: string = 'http://localhost:11434') {
        this.baseURL = baseURL;
    }

    async generateText(prompt: string, options?: GenerateOptions): Promise<string> {
        try {
            const response = await fetch(`${this.baseURL}/api/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: options?.model || 'llama2',
                    prompt: prompt,
                    stream: false,
                }),
            });

            if (!response.ok) {
                throw new Error(`Ollama API error: ${response.statusText}`);
            }

            const data: any = await response.json();
            return data.response || '';
        } catch (error: any) {
            console.error('Ollama API error:', error);
            throw new Error(`Ollama generation failed: ${error.message}`);
        }
    }
}

// Provider Factory
export function getAIProvider(provider: string, env: any): AIProvider {
    switch (provider.toLowerCase()) {
        case 'gemini':
            return new GeminiProvider(env.GEMINI_API_KEY);
        case 'openai':
            return new OpenAIProvider(env.OPENAI_API_KEY);
        case 'claude':
            return new ClaudeProvider(env.ANTHROPIC_API_KEY);
        case 'perplexity':
            return new PerplexityProvider(env.PERPLEXITY_API_KEY);
        case 'ollama':
            return new OllamaProvider(env.OLLAMA_BASE_URL);
        default:
            throw new Error(`Unknown AI provider: ${provider}`);
    }
}

// Helper function to validate provider availability
export function isProviderAvailable(provider: string, env: any): boolean {
    switch (provider.toLowerCase()) {
        case 'gemini':
            return !!env.GEMINI_API_KEY;
        case 'openai':
            return !!env.OPENAI_API_KEY;
        case 'claude':
            return !!env.ANTHROPIC_API_KEY;
        case 'perplexity':
            return !!env.PERPLEXITY_API_KEY;
        case 'ollama':
            return !!env.OLLAMA_BASE_URL;
        default:
            return false;
    }
}
