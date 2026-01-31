import { useState, useEffect } from 'react';
import { Plus, Globe, Edit2, Trash2, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import client from '../../api/client';
import CreateWebsiteModal from '../../components/dashboard/CreateWebsiteModal';

interface Website {
    id: string;
    name: string;
    slug: string;
    custom_domain: string | null;
    status: 'draft' | 'published';
    created_at: string;
    updated_at: string;
}

export default function WebsitesList() {
    const [websites, setWebsites] = useState<Website[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        loadWebsites();
    }, []);

    const loadWebsites = async () => {
        try {
            setLoading(true);
            const response = await client.get('/api/websites');
            setWebsites(response.data.websites);
        } catch (error) {
            console.error('Failed to load websites:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateWebsite = async (data: { name: string; slug: string }) => {
        try {
            await client.post('/api/websites', data);
            await loadWebsites();
            setShowCreateModal(false);
        } catch (error: any) {
            throw new Error(error.response?.data?.error || 'Failed to create website');
        }
    };

    const handleDeleteWebsite = async (id: string) => {
        if (!confirm('Are you sure? This will delete all pages and content.')) {
            return;
        }

        try {
            await client.delete(`/api/websites/${id}`);
            await loadWebsites();
        } catch (error) {
            console.error('Failed to delete website:', error);
            alert('Failed to delete website');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">My Websites</h1>
                    <p className="mt-2 text-gray-600">
                        Manage your landing pages and websites
                    </p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Create Website
                </button>
            </div>

            {/* Websites Grid */}
            {websites.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
                    <Globe className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No websites yet
                    </h3>
                    <p className="text-gray-600 mb-6">
                        Get started by creating your first website
                    </p>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Create Website
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {websites.map((website) => (
                        <div
                            key={website.id}
                            className="bg-white rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all cursor-pointer group"
                        >
                            {/* Card Header */}
                            <div
                                onClick={() => navigate(`/dashboard/websites/${website.id}/pages`)}
                                className="p-6 border-b border-gray-100"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                            {website.name}
                                        </h3>
                                        <p className="text-sm text-gray-500 mt-1">
                                            {website.custom_domain || `${website.slug}.pages.dev`}
                                        </p>
                                    </div>
                                    <span
                                        className={`
                      px-2 py-1 text-xs font-medium rounded-full
                      ${website.status === 'published'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-gray-100 text-gray-800'
                                            }
                    `}
                                    >
                                        {website.status === 'published' ? 'Published' : 'Draft'}
                                    </span>
                                </div>

                                <div className="flex items-center text-xs text-gray-500">
                                    <Globe className="w-4 h-4 mr-1" />
                                    Created {new Date(website.created_at).toLocaleDateString()}
                                </div>
                            </div>

                            {/* Card Actions */}
                            <div className="p-4 bg-gray-50 flex items-center justify-between">
                                <button
                                    onClick={() => navigate(`/dashboard/websites/${website.id}/pages`)}
                                    className="flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium"
                                >
                                    <Edit2 className="w-4 h-4 mr-1" />
                                    Manage Pages
                                </button>
                                <div className="flex items-center space-x-2">
                                    {website.custom_domain && (
                                        <a
                                            href={`https://${website.custom_domain}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                                            title="Open website"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                        </a>
                                    )}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteWebsite(website.id);
                                        }}
                                        className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                                        title="Delete website"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create Website Modal */}
            {showCreateModal && (
                <CreateWebsiteModal
                    onClose={() => setShowCreateModal(false)}
                    onCreate={handleCreateWebsite}
                />
            )}
        </div>
    );
}
