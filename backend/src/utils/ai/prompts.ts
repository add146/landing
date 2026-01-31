// AI Prompts Library
// Reusable prompts for different AI tasks

export const prompts = {
    /**
     * Website Wizard - Generate complete website structure
     */
    websiteWizard: (description: string, industry?: string, style?: string) => `
You are an expert web designer. Generate a complete website structure based on this description:

Description: "${description}"
${industry ? `Industry: ${industry}` : ''}
${style ? `Style: ${style}` : ''}

Return ONLY valid JSON (no markdown, no code blocks) in this exact format:
{
  "name": "Website Name",
  "description": "Brief description",
  "pages": [
    {
      "title": "Home",
      "slug": "home",
      "is_published": true,
      "sections": [
        {
          "type": "hero",
          "layout_variant": "centered",
          "content": {
            "heading": "Main headline",
            "subheading": "Supporting text",
            "cta_text": "Get Started",
            "cta_url": "#contact"
          }
        }
      ]
    }
  ]
}

Include these section types where appropriate:
- hero (main banner)
- features (product features)
- about (company info)
- services (what you offer)
- pricing (pricing plans)
- testimonials (customer reviews)
- cta (call to action)
- contact (contact form)
- footer (footer links)

Make the content professional, engaging, and relevant to the description.
`,

    /**
     * Section Generator - Generate content for specific section types
     */
    sectionGenerator: (type: string, context: string, layout?: string) => `
You are an expert copywriter. Generate content for a ${type} section.

Context: "${context}"
${layout ? `Layout: ${layout}` : ''}

Return ONLY valid JSON (no markdown, no code blocks) based on the section type:

For HERO section:
{
  "type": "hero",
  "layout_variant": "centered",
  "content": {
    "heading": "Compelling headline (5-10 words)",
    "subheading": "Supporting text explaining value proposition (15-25 words)",
    "cta_text": "Action button text (2-3 words)",
    "cta_url": "#appropriate-section",
    "image_url": "https://via.placeholder.com/1200x600"
  }
}

For FEATURES section:
{
  "type": "features",
  "layout_variant": "grid",
  "content": {
    "heading": "Section heading",
    "subheading": "Section description",
    "features": [
      {
        "icon": "star",
        "title": "Feature name",
        "description": "Feature description (20-30 words)"
      }
    ]
  }
}

For PRICING section:
{
  "type": "pricing",
  "layout_variant": "cards",
  "content": {
    "heading": "Choose Your Plan",
    "subheading": "Flexible pricing for every need",
    "plans": [
      {
        "name": "Plan name",
        "price": "$29",
        "period": "per month",
        "features": ["Feature 1", "Feature 2", "Feature 3"],
        "cta_text": "Get Started",
        "highlighted": false
      }
    ]
  }
}

For TESTIMONIALS section:
{
  "type": "testimonials",
  "layout_variant": "grid",
  "content": {
    "heading": "What Our Customers Say",
    "testimonials": [
      {
        "quote": "Testimonial text (30-50 words)",
        "author": "Author Name",
        "role": "Job Title, Company",
        "avatar": "https://via.placeholder.com/100"
      }
    ]
  }
}

For CTA section:
{
  "type": "cta",
  "layout_variant": "centered",
  "content": {
    "heading": "Call to action headline",
    "subheading": "Supporting text",
    "cta_text": "Button text",
    "cta_url": "#contact"
  }
}

For CONTACT section:
{
  "type": "contact",
  "layout_variant": "form",
  "content": {
    "heading": "Get In Touch",
    "subheading": "We'd love to hear from you",
    "email": "contact@example.com",
    "phone": "+1 (555) 123-4567",
    "address": "123 Main St, City, Country"
  }
}

Generate professional, engaging content appropriate for the context.
`,

    /**
     * Legal Page Generator - Privacy Policy, Terms, etc.
     */
    legalPage: (type: string, companyName: string, website: string, email: string) => `
You are a legal content specialist. Generate a comprehensive ${type} for:

Company: ${companyName}
Website: ${website}
Contact: ${email}

Return plain text (not JSON) with proper formatting using markdown:
- Use ## for section headings
- Use numbered lists for main sections
- Use bullet points for sub-items
- Include effective date at the top
- Be thorough and professional

${type === 'privacy-policy' ? `
Include these sections:
1. Information We Collect
2. How We Use Your Information
3. Data Storage and Security
4. Cookies and Tracking
5. Third-Party Services
6. Your Rights (GDPR compliance)
7. Children's Privacy
8. Changes to This Policy
9. Contact Us

Focus on SaaS business practices.
` : ''}

${type === 'terms-of-service' ? `
Include these sections:
1. Acceptance of Terms
2. Description of Service
3. User Accounts and Registration
4. User Responsibilities
5. Prohibited Activities
6. Intellectual Property Rights
7. Payment and Billing (if applicable)
8. Limitation of Liability
9. Termination
10. Dispute Resolution
11. Changes to Terms
12. Contact Information
` : ''}

${type === 'cookie-policy' ? `
Include these sections:
1. What Are Cookies
2. How We Use Cookies
3. Types of Cookies We Use
4. Managing Cookies
5. Third-Party Cookies
6. Your Choices
7. Updates to This Policy
` : ''}

Make it comprehensive, legally sound, and easy to understand.
`,

    /**
     * SEO Optimizer - Generate meta tags
     */
    seoOptimizer: (content: string, pageName?: string) => `
You are an SEO specialist. Analyze this page content and generate optimized SEO metadata:

Page: ${pageName || 'Homepage'}
Content: "${content.substring(0, 500)}..."

Return ONLY valid JSON (no markdown, no code blocks):
{
  "title": "SEO-optimized title (50-60 characters, include keywords)",
  "description": "Compelling meta description (150-160 characters)",
  "keywords": "keyword1, keyword2, keyword3, keyword4, keyword5",
  "ogTitle": "Social media title (can be longer, more engaging)",
  "ogDescription": "Social media description (can be more casual)",
  "recommendations": [
    "SEO tip 1",
    "SEO tip 2"
  ]
}

Make the title and description compelling for both search engines and users.
Include relevant keywords naturally.
`,

    /**
     * Content Improver - Enhance existing text
     */
    contentImprover: (text: string, tone: string, purpose?: string) => `
You are an expert copywriter. Improve this text with a ${tone} tone:

Original: "${text}"
${purpose ? `Purpose: ${purpose}` : ''}

Return ONLY valid JSON (no markdown, no code blocks):
{
  "improved": "The improved version of the text",
  "changes": [
    "Explanation of change 1",
    "Explanation of change 2"
  ]
}

Improvements should:
- Match the ${tone} tone
- Be more engaging and clear
- Fix any grammar or style issues
- Maintain the original intent
- Be concise yet impactful

${tone === 'professional' ? 'Use formal language, avoid slang.' : ''}
${tone === 'casual' ? 'Use friendly, conversational language.' : ''}
${tone === 'persuasive' ? 'Use compelling language that drives action.' : ''}
${tone === 'technical' ? 'Use precise, technical language.' : ''}
`,

    /**
     * Image Description Generator - For alt text
     */
    imageDescription: (context: string) => `
Generate a descriptive alt text for an image in this context:

Context: "${context}"

Return ONLY valid JSON (no markdown, no code blocks):
{
  "alt": "Concise, descriptive alt text (10-15 words)",
  "longDescription": "Detailed description for screen readers (optional)"
}

Make it descriptive for accessibility while being SEO-friendly.
`,

    /**
     * Color Palette Generator
     */
    colorPalette: (description: string, mood?: string) => `
You are a color theory expert. Generate a color palette for:

Description: "${description}"
${mood ? `Mood: ${mood}` : ''}

Return ONLY valid JSON (no markdown, no code blocks):
{
  "primary": "#hexcode",
  "secondary": "#hexcode",
  "accent": "#hexcode",
  "background": "#hexcode",
  "text": "#hexcode",
  "reasoning": "Brief explanation of color choices"
}

Ensure colors are accessible (WCAG AA compliant) and harmonious.
`,
};

// Helper function to parse JSON responses
export function parseAIResponse(response: string): any {
    try {
        // Remove markdown code blocks if present
        const cleaned = response
            .replace(/```json\n?/g, '')
            .replace(/```\n?/g, '')
            .trim();

        return JSON.parse(cleaned);
    } catch (error) {
        console.error('Failed to parse AI response:', error);
        console.error('Response was:', response);
        throw new Error('AI returned invalid JSON. Please try again.');
    }
}

// Helper to validate website structure
export function validateWebsiteStructure(data: any): boolean {
    return (
        data &&
        typeof data.name === 'string' &&
        Array.isArray(data.pages) &&
        data.pages.length > 0 &&
        data.pages[0].sections &&
        Array.isArray(data.pages[0].sections)
    );
}

// Helper to validate section content
export function validateSectionContent(data: any): boolean {
    return (
        data &&
        typeof data.type === 'string' &&
        typeof data.content === 'object'
    );
}
