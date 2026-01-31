// Cloudflare Workers environment types
export interface Env {
    DB: D1Database;
    STORAGE: R2Bucket;
    SESSIONS: KVNamespace;
    JWT_SECRET: string;
    FRONTEND_URL: string;
    Variables?: {
        user: JWTPayload;
    };
}

// Database Models
export interface User {
    id: string;
    email: string;
    password_hash: string;
    name: string;
    role: 'admin' | 'user';
    avatar_url: string | null;
    created_at: string;
    updated_at: string;
}

export interface Website {
    id: string;
    user_id: string;
    name: string;
    slug: string;
    custom_domain: string | null;
    theme_id: string | null;
    theme_settings: string | null; // JSON
    favicon_url: string | null;
    custom_css: string | null;
    custom_js: string | null;
    seo_default: string | null; // JSON
    status: 'draft' | 'published';
    created_at: string;
    updated_at: string;
}

export interface Page {
    id: string;
    website_id: string;
    title: string;
    slug: string;
    page_type: string;
    seo_title: string | null;
    seo_description: string | null;
    seo_keywords: string | null;
    og_image: string | null;
    twitter_card: string | null; // JSON
    sort_order: number;
    is_published: number;
    created_at: string;
}

export interface Section {
    id: string;
    page_id: string;
    section_type: string;
    layout_variant: number;
    content: string | null; // JSON
    settings: string | null; // JSON
    sort_order: number;
    is_visible: number;
    created_at: string;
}

export interface Element {
    id: string;
    section_id: string;
    parent_id: string | null;
    element_type: string;
    content: string | null; // JSON
    style_desktop: string | null; // JSON
    style_tablet: string | null; // JSON
    style_mobile: string | null; // JSON
    animation: string | null; // JSON
    sort_order: number;
    is_visible: number;
    created_at: string;
}

export interface VCard {
    id: string;
    user_id: string;
    name: string;
    job_title: string | null;
    company: string | null;
    email: string | null;
    phone: string | null;
    whatsapp: string | null;
    website: string | null;
    address: string | null;
    bio: string | null;
    photo_url: string | null;
    social_links: string | null; // JSON
    template_id: string | null;
    slug: string;
    theme_color: string;
    created_at: string;
}

// JWT Payload
export interface JWTPayload {
    userId: string;
    email: string;
    role: string;
}

// Request/Response Types
export interface AuthResponse {
    user: {
        id: string;
        email: string;
        name: string;
        role: string;
    };
    token: string;
}
