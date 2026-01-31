import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Share2, QrCode, ExternalLink, CreditCard } from 'lucide-react';
import client from '../../api/client';
import QRCodeGenerator from '../../components/vcard/QRCodeGenerator';

interface VCard {
    id: string;
    name: string;
    job_title?: string;
    company?: string;
    slug: string;
    theme_color: string;
    photo_url?: string;
    template_id: string;
}

export default function VCardsList() {
    const [vcards, setVCards] = useState<VCard[]>([]);
    const [loading, setLoading] = useState(true);
    const [showQR, setShowQR] = useState<string | null>(null);

    useEffect(() => {
        loadVCards();
    }, []);

    const loadVCards = async () => {
        try {
            const response = await client.get('/api/vcards');
            setVCards(response.data.vcards || []);
        } catch (error) {
            console.error('Failed to load vCards:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Delete vCard "${name}"?`)) return;

        try {
            await client.delete(`/api/vcards/${id}`);
            setVCards(vcards.filter(v => v.id !== id));
        } catch (error) {
            console.error('Failed to delete vCard:', error);
            alert('Failed to delete vCard');
        }
    };

    const getPublicUrl = (slug: string) => {
        return `${window.location.origin}/card/${slug}`;
    };

    const copyShareLink = (slug: string) => {
        const url = getPublicUrl(slug);
        navigator.clipboard.writeText(url);
        alert('Link copied to clipboard!');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Digital Business Cards</h1>
                    <p className="text-gray-600 mt-1">Create and manage your vCards</p>
                </div>
                <Link
                    to="/dashboard/vcards/create"
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Create vCard
                </Link>
            </div>

            {/* Empty state */}
            {vcards.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
                    <CreditCard className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No vCards yet</h3>
                    <p className="text-gray-600 mb-4">Create your first digital business card</p>
                    <Link
                        to="/dashboard/vcards/create"
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Create vCard
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {vcards.map((vcard) => (
                        <div
                            key={vcard.id}
                            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                        >
                            {/* Card Header with theme color */}
                            <div
                                className="h-24 relative"
                                style={{ backgroundColor: vcard.theme_color }}
                            >
                                {vcard.photo_url && (
                                    <img
                                        src={vcard.photo_url}
                                        alt={vcard.name}
                                        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-20 h-20 rounded-full border-4 border-white object-cover"
                                    />
                                )}
                            </div>

                            {/* Card Content */}
                            <div className={`p-6 ${vcard.photo_url ? 'pt-12' : 'pt-6'}`}>
                                <h3 className="text-lg font-semibold text-gray-900 text-center mb-1">
                                    {vcard.name}
                                </h3>
                                {vcard.job_title && (
                                    <p className="text-sm text-gray-600 text-center mb-1">
                                        {vcard.job_title}
                                    </p>
                                )}
                                {vcard.company && (
                                    <p className="text-sm text-gray-500 text-center mb-4">
                                        {vcard.company}
                                    </p>
                                )}

                                <div className="text-center mb-4">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                        /{vcard.slug}
                                    </span>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center justify-center space-x-2">
                                    <Link
                                        to={`/dashboard/vcards/${vcard.id}/edit`}
                                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        title="Edit"
                                    >
                                        <Edit className="w-5 h-5" />
                                    </Link>
                                    <button
                                        onClick={() => copyShareLink(vcard.slug)}
                                        className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                        title="Copy link"
                                    >
                                        <Share2 className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => setShowQR(vcard.slug)}
                                        className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                                        title="QR Code"
                                    >
                                        <QrCode className="w-5 h-5" />
                                    </button>
                                    <a
                                        href={getPublicUrl(vcard.slug)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                        title="View public page"
                                    >
                                        <ExternalLink className="w-5 h-5" />
                                    </a>
                                    <button
                                        onClick={() => handleDelete(vcard.id, vcard.name)}
                                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* QR Code Modal */}
            {showQR && (
                <QRCodeGenerator
                    url={getPublicUrl(showQR)}
                    onClose={() => setShowQR(null)}
                />
            )}
        </div>
    );
}
