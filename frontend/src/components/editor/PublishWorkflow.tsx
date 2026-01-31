import { useState } from 'react';
import { Share2, Globe, ExternalLink, Copy, Check } from 'lucide-react';
import client from '../../api/client';

interface PublishWorkflowProps {
    pageId: string;
    pageTitle: string;
    pageSlug: string;
    websiteSlug: string;
    isPublished: boolean;
    onPublishChange: (published: boolean) => void;
}

export default function PublishWorkflow({
    pageId,
    pageTitle,
    pageSlug,
    websiteSlug,
    isPublished,
    onPublishChange,
}: PublishWorkflowProps) {
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    // Construct the public URL (assuming Cloudflare Pages deployment)
    const publicUrl = `https://${websiteSlug}.pages.dev/${pageSlug}`;

    const handleTogglePublish = async () => {
        try {
            setLoading(true);
            await client.patch(`/api/pages/${pageId}/publish`);
            onPublishChange(!isPublished);

            // Show modal if publishing
            if (!isPublished) {
                setShowModal(true);
            }
        } catch (error) {
            console.error('Failed to toggle publish:', error);
            alert('Failed to update publish status');
        } finally {
            setLoading(false);
        }
    };

    const handleCopyUrl = () => {
        navigator.clipboard.writeText(publicUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <>
            {/* Publish Button */}
            <button
                onClick={handleTogglePublish}
                disabled={loading}
                className={`
          flex items-center px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50
          ${isPublished
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }
        `}
            >
                <Share2 className="w-4 h-4 mr-2" />
                {loading ? 'Updating...' : isPublished ? 'Published' : 'Publish'}
            </button>

            {/* Success Modal */}
            {showModal && isPublished && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-lg w-full shadow-xl">
                        {/* Header */}
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center">
                                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
                                    <Globe className="w-6 h-6 text-green-600" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900">
                                        Page Published! 🎉
                                    </h2>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Your page is now live and accessible
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Page Title
                                </label>
                                <p className="text-lg font-semibold text-gray-900">
                                    {pageTitle}
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Public URL
                                </label>
                                <div className="flex items-center space-x-2">
                                    <div className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg font-mono text-sm text-gray-700 overflow-x-auto">
                                        {publicUrl}
                                    </div>
                                    <button
                                        onClick={handleCopyUrl}
                                        className="px-3 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg transition-colors"
                                        title="Copy URL"
                                    >
                                        {copied ? (
                                            <Check className="w-5 h-5 text-green-600" />
                                        ) : (
                                            <Copy className="w-5 h-5 text-gray-600" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <p className="text-sm text-blue-800">
                                    <strong>Note:</strong> It may take a few minutes for your changes to appear on the live site due to CDN caching.
                                </p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="p-6 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
                            >
                                Close
                            </button>
                            <a
                                href={publicUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <ExternalLink className="w-4 h-4 mr-2" />
                                View Live Page
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
