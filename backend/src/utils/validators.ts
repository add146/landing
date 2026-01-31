import { z } from 'zod';

// Website Schemas
export const createWebsiteSchema = z.object({
    name: z.string().min(1, 'Name is required').max(100),
    slug: z.string()
        .min(1, 'Slug is required')
        .max(100)
        .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
    custom_domain: z.string().url().optional().nullable(),
    theme_id: z.string().optional().nullable(),
    theme_settings: z.string().optional().nullable(), // JSON string
    favicon_url: z.string().url().optional().nullable(),
    custom_css: z.string().optional().nullable(),
    custom_js: z.string().optional().nullable(),
    seo_default: z.string().optional().nullable(), // JSON string
});

export const updateWebsiteSchema = createWebsiteSchema.partial();

// Page Schemas
export const createPageSchema = z.object({
    website_id: z.string().min(1, 'Website ID is required'),
    title: z.string().min(1, 'Title is required').max(200),
    slug: z.string()
        .min(1, 'Slug is required')
        .max(200)
        .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
    page_type: z.enum(['landing', 'blog', 'product', 'custom']).default('landing'),
    seo_title: z.string().max(60).optional().nullable(),
    seo_description: z.string().max(160).optional().nullable(),
    seo_keywords: z.string().max(255).optional().nullable(),
    og_image: z.string().url().optional().nullable(),
    twitter_card: z.string().optional().nullable(), // JSON string
    content_json: z.string().optional().nullable(), // GrapesJS JSON
    content_html: z.string().optional().nullable(), // GrapesJS HTML
});

export const updatePageSchema = createPageSchema.partial().omit({ website_id: true });

// Section Schemas
export const createSectionSchema = z.object({
    page_id: z.string().min(1, 'Page ID is required'),
    section_type: z.enum(['hero', 'features', 'testimonials', 'pricing', 'cta', 'contact', 'custom']),
    layout_variant: z.number().int().min(1).max(10).default(1),
    content: z.string().optional().nullable(), // JSON string
    settings: z.string().optional().nullable(), // JSON string
    sort_order: z.number().int().min(0).default(0),
    is_visible: z.number().int().min(0).max(1).default(1),
});

export const updateSectionSchema = createSectionSchema.partial().omit({ page_id: true });

export const reorderSectionsSchema = z.object({
    sections: z.array(z.object({
        id: z.string(),
        sort_order: z.number().int().min(0),
    })),
});

// Element Schemas
export const createElementSchema = z.object({
    section_id: z.string().min(1, 'Section ID is required'),
    parent_id: z.string().optional().nullable(),
    element_type: z.enum(['heading', 'text', 'image', 'button', 'video', 'icon', 'spacer', 'divider']),
    content: z.string().optional().nullable(), // JSON string
    style_desktop: z.string().optional().nullable(), // JSON string
    style_tablet: z.string().optional().nullable(), // JSON string
    style_mobile: z.string().optional().nullable(), // JSON string
    animation: z.string().optional().nullable(), // JSON string
    sort_order: z.number().int().min(0).default(0),
    is_visible: z.number().int().min(0).max(1).default(1),
});

export const updateElementSchema = createElementSchema.partial().omit({ section_id: true });

export const reorderElementsSchema = z.object({
    elements: z.array(z.object({
        id: z.string(),
        sort_order: z.number().int().min(0),
    })),
});

// Media Schemas
export const uploadMediaSchema = z.object({
    filename: z.string().min(1, 'Filename is required'),
    mime_type: z.string().regex(/^image\/(jpeg|png|gif|webp|svg\+xml)$/, 'Invalid image type'),
    size: z.number().int().max(5 * 1024 * 1024, 'File too large (max 5MB)'),
    website_id: z.string().optional().nullable(),
});

// vCard Schemas
export const createVCardSchema = z.object({
    name: z.string().min(1, 'Name is required').max(100),
    job_title: z.string().max(100).optional().nullable(),
    company: z.string().max(100).optional().nullable(),
    email: z.string().email('Invalid email').optional().nullable(),
    phone: z.string().max(20).optional().nullable(),
    whatsapp: z.string().max(20).optional().nullable(),
    website: z.string().url('Invalid URL').optional().nullable(),
    address: z.string().max(200).optional().nullable(),
    bio: z.string().max(500).optional().nullable(),
    photo_url: z.string().url('Invalid URL').optional().nullable(),
    social_links: z.string().optional().nullable(), // JSON string
    template_id: z.string().max(50).default('modern'),
    slug: z.string()
        .min(1, 'Slug is required')
        .max(100)
        .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
    theme_color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid hex color').default('#6366F1'),
});

export const updateVCardSchema = createVCardSchema.partial().omit({ slug: true });
