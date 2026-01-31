import { Mail, Phone, MapPin, Globe, MessageCircle, Linkedin, Twitter, Instagram, Facebook, Github, Youtube, ExternalLink } from 'lucide-react';

interface SocialLink {
    platform: string;
    url: string;
}

interface VCardData {
    name: string;
    job_title?: string;
    company?: string;
    email?: string;
    phone?: string;
    whatsapp?: string;
    website?: string;
    address?: string;
    bio?: string;
    photo_url?: string;
    social_links?: SocialLink[];
    theme_color: string;
}

interface VCardPreviewProps {
    vcard: VCardData;
}

const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
        case 'linkedin': return Linkedin;
        case 'twitter': return Twitter;
        case 'instagram': return Instagram;
        case 'facebook': return Facebook;
        case 'github': return Github;
        case 'youtube': return Youtube;
        default: return ExternalLink;
    }
};

export default function VCardPreview({ vcard }: VCardPreviewProps) {
    return (
        <div className="max-w-md mx-auto">
            {/* Header with theme color */}
            <div
                className="h-32 relative"
                style={{ backgroundColor: vcard.theme_color }}
            >
                {vcard.photo_url && (
                    <img
                        src={vcard.photo_url}
                        alt={vcard.name}
                        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-24 h-24 rounded-full border-4 border-white object-cover"
                        onError={(e) => {
                            e.currentTarget.style.display = 'none';
                        }}
                    />
                )}
            </div>

            {/* Content */}
            <div className={`p-6 ${vcard.photo_url ? 'pt-16' : 'pt-6'}`}>
                {/* Name & Title */}
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">
                        {vcard.name || 'Your Name'}
                    </h1>
                    {vcard.job_title && (
                        <p className="text-gray-600 font-medium mb-1">
                            {vcard.job_title}
                        </p>
                    )}
                    {vcard.company && (
                        <p className="text-gray-500 text-sm">
                            {vcard.company}
                        </p>
                    )}
                </div>

                {/* Bio */}
                {vcard.bio && (
                    <div className="mb-6">
                        <p className="text-gray-700 text-sm text-center leading-relaxed">
                            {vcard.bio}
                        </p>
                    </div>
                )}

                {/* Contact Buttons */}
                <div className="space-y-2 mb-6">
                    {vcard.email && (
                        <a
                            href={`mailto:${vcard.email}`}
                            className="flex items-center w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <Mail className="w-5 h-5 text-gray-600 mr-3" />
                            <span className="text-gray-900 text-sm">{vcard.email}</span>
                        </a>
                    )}

                    {vcard.phone && (
                        <a
                            href={`tel:${vcard.phone}`}
                            className="flex items-center w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <Phone className="w-5 h-5 text-gray-600 mr-3" />
                            <span className="text-gray-900 text-sm">{vcard.phone}</span>
                        </a>
                    )}

                    {vcard.whatsapp && (
                        <a
                            href={`https://wa.me/${vcard.whatsapp.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center w-full px-4 py-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                        >
                            <MessageCircle className="w-5 h-5 text-green-600 mr-3" />
                            <span className="text-gray-900 text-sm">WhatsApp</span>
                        </a>
                    )}

                    {vcard.website && (
                        <a
                            href={vcard.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <Globe className="w-5 h-5 text-gray-600 mr-3" />
                            <span className="text-gray-900 text-sm truncate">{vcard.website}</span>
                        </a>
                    )}

                    {vcard.address && (
                        <div className="flex items-start w-full px-4 py-3 bg-gray-50 rounded-lg">
                            <MapPin className="w-5 h-5 text-gray-600 mr-3 mt-0.5" />
                            <span className="text-gray-900 text-sm">{vcard.address}</span>
                        </div>
                    )}
                </div>

                {/* Social Links */}
                {vcard.social_links && vcard.social_links.length > 0 && (
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-3 text-center">
                            Connect With Me
                        </h3>
                        <div className="flex flex-wrap justify-center gap-3">
                            {vcard.social_links.map((link, index) => {
                                if (!link.platform || !link.url) return null;
                                const Icon = getSocialIcon(link.platform);
                                return (
                                    <a
                                        key={index}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                                        title={link.platform}
                                    >
                                        <Icon className="w-5 h-5 text-gray-700" />
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {!vcard.email && !vcard.phone && !vcard.whatsapp && !vcard.website && !vcard.address && (
                    <p className="text-center text-gray-400 text-sm py-8">
                        Add contact information to see preview
                    </p>
                )}
            </div>
        </div>
    );
}
