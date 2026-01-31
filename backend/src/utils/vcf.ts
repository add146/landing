// VCF (vCard File Format) Generator - vCard 3.0 Standard
// Generates .vcf files for importing contacts into phones/address books

interface VCardData {
    name: string;
    job_title?: string | null;
    company?: string | null;
    email?: string | null;
    phone?: string | null;
    whatsapp?: string | null;
    website?: string | null;
    address?: string | null;
    bio?: string | null;
    photo_url?: string | null;
}

/**
 * Generate a vCard 3.0 format string
 * @param vcard - vCard data object
 * @returns VCF file content as string
 */
export function generateVCF(vcard: VCardData): string {
    const lines: string[] = [];

    // Start vCard
    lines.push('BEGIN:VCARD');
    lines.push('VERSION:3.0');

    // Full Name (required)
    lines.push(`FN:${escapeVCF(vcard.name)}`);

    // Structured Name (N) - Last;First;Middle;Prefix;Suffix
    // For simplicity, treating the full name as First Name
    const nameParts = vcard.name.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    lines.push(`N:${escapeVCF(lastName)};${escapeVCF(firstName)};;;`);

    // Organization & Title
    if (vcard.company) {
        lines.push(`ORG:${escapeVCF(vcard.company)}`);
    }
    if (vcard.job_title) {
        lines.push(`TITLE:${escapeVCF(vcard.job_title)}`);
    }

    // Phone Numbers
    if (vcard.phone) {
        lines.push(`TEL;TYPE=CELL:${escapeVCF(vcard.phone)}`);
    }
    if (vcard.whatsapp) {
        lines.push(`TEL;TYPE=WORK:${escapeVCF(vcard.whatsapp)}`);
    }

    // Email
    if (vcard.email) {
        lines.push(`EMAIL;TYPE=INTERNET:${escapeVCF(vcard.email)}`);
    }

    // Website
    if (vcard.website) {
        lines.push(`URL:${escapeVCF(vcard.website)}`);
    }

    // Address
    if (vcard.address) {
        // ADR: Post Office Box;Extended Address;Street;City;State;Postal Code;Country
        // For simplicity, putting full address in Street field
        lines.push(`ADR;TYPE=WORK:;;${escapeVCF(vcard.address)};;;;`);
    }

    // Note (Bio)
    if (vcard.bio) {
        lines.push(`NOTE:${escapeVCF(vcard.bio)}`);
    }

    // Photo URL (some clients support this)
    if (vcard.photo_url) {
        lines.push(`PHOTO;VALUE=URL:${vcard.photo_url}`);
    }

    // End vCard
    lines.push('END:VCARD');

    return lines.join('\r\n');
}

/**
 * Escape special characters in vCard fields
 * @param value - String to escape
 * @returns Escaped string
 */
function escapeVCF(value: string): string {
    return value
        .replace(/\\/g, '\\\\')  // Backslash
        .replace(/;/g, '\\;')    // Semicolon
        .replace(/,/g, '\\,')    // Comma
        .replace(/\n/g, '\\n');  // Newline
}

/**
 * Generate filename for VCF download
 * @param name - Person's name
 * @returns Sanitized filename
 */
export function generateVCFFilename(name: string): string {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') + '.vcf';
}
