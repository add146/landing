import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Download, Share2 } from 'lucide-react';
import axios from 'axios';
import VCardPreview from '../../components/vcard/VCardPreview';

interface VCard {
    id: string;
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
    social_links?: string;
    theme_color: string;
    slug: string;
}

export default function PublicVCard() {
    const { slug } = useParams<{ slug: string }>();
    const [vcard, setVCard] = useState<VCard | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        loadVCard();
        updateMetaTags();
    }, [slug]);

    const loadVCard = async () => {
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'https://api.example.com';
            const response = await axios.get(`${API_URL}/api/vcards/public/${slug}`);
            setVCard(response.data.vcard);

            // Update title after loading
            if (response.data.vcard) {
                document.title = `${response.data.vcard.name} - Digital Business Card`;
            }
        } catch (error) {
            console.error('Failed to load vCard:', error);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    const updateMetaTags = () => {
        // Set default title
        document.title = 'Digital Business Card';

        // Add/update meta tags for SEO
        const setMetaTag = (property: string, content: string) => {
            let meta = document.querySelector(`meta[property="${property}"]`);
            if (!meta) {
                meta = document.querySelector(`meta[name="${property}"]`);
            }
            if (!meta) {
                meta = document.createElement('meta');
                if (property.startsWith('og:')) {
                    meta.setAttribute('property', property);
                } else {
                    meta.setAttribute('name', property);
                }
                document.head.appendChild(meta);
            }
            meta.setAttribute('content', content);
        };

        setMetaTag('description', 'View my digital business card');
        setMetaTag('og:title', 'Digital Business Card');
        setMetaTag('og:description', 'View my digital business card');
        setMetaTag('og:type', 'profile');
    };

    const handleDownloadVCF = async () => {
        if (!slug) return;

        try {
            const API_URL = import.meta.env.VITE_API_URL || 'https://api.example.com';
            const response = await axios.get(`${API_URL}/api/vcards/public/${slug}/download`, {
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${slug}.vcf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Failed to download VCF:', error);
            alert('Failed to download contact file');
        }
    };

    const handleShare = async () => {
        const url = window.location.href;

        // Try native Web Share API
        if (navigator.share) {
            try {
                await navigator.share({
                    title: vcard?.name ? `${vcard.name}'s Digital Business Card` : 'Digital Business Card',
                    text: vcard?.bio || 'Check out my digital business card',
                    url: url,
                });
                return;
            } catch (error) {
                // User cancelled or error - fall back to clipboard
            }
        }

        // Fallback: copy to clipboard
        try {
            await navigator.clipboard.writeText(url);
            alert('Link copied to clipboard!');
        } catch (error) {
            console.error('Failed to share:', error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error || !vcard) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                    <p className="text-xl text-gray-600 mb-8">vCard not found</p>
                    <a
                        href="/"
                        className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Go Home
                    </a>
                </div>
            </div>
        );
    }

    const vcardData = {
        ...vcard,
        social_links: vcard.social_links ? JSON.parse(vcard.social_links) : [],
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Action Buttons */}
                <div className="flex justify-center space-x-3 mb-6">
                    <button
                        onClick={handleDownloadVCF}
                        className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                    >
                        <Download className="w-5 h-5 mr-2" />
                        Save Contact
                    </button>
                    <button
                        onClick={handleShare}
                        className="flex items-center px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors shadow-sm"
                    >
                        <Share2 className="w-5 h-5 mr-2" />
                        Share
                    </button>
                </div>

                {/* vCard Display */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <VCardPreview vcard={vcardData} />
                </div>

                {/* Footer */}
                <div className="text-center mt-8 text-sm text-gray-500">
                    <p>Powered by PageBuilder</p>
                </div>
            </div>
        </div>
    );
}
