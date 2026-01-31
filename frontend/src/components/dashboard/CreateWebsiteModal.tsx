import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface CreateWebsiteModalProps {
    onClose: () => void;
    onCreate: (data: { name: string; slug: string }) => Promise<void>;
}

export default function CreateWebsiteModal({ onClose, onCreate }: CreateWebsiteModalProps) {
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Auto-generate slug from name
    useEffect(() => {
        if (name) {
            const generatedSlug = name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-|-$/g, '');
            setSlug(generatedSlug);
        }
    }, [name]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!name.trim()) {
            setError('Website name is required');
            return;
        }

        if (!slug.trim()) {
            setError('Slug is required');
            return;
        }

        if (!/^[a-z0-9-]+$/.test(slug)) {
            setError('Slug must contain only lowercase letters, numbers, and hyphens');
            return;
        }

        try {
            setLoading(true);
            await onCreate({ name: name.trim(), slug: slug.trim() });
        } catch (err: any) {
            setError(err.message || 'Failed to create website');
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Create New Website
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6">
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        {/* Name Field */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                Website Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="My Awesome Website"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                disabled={loading}
                                autoFocus
                            />
                        </div>

                        {/* Slug Field */}
                        <div>
                            <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
                                Slug
                            </label>
                            <input
                                type="text"
                                id="slug"
                                value={slug}
                                onChange={(e) => setSlug(e.target.value.toLowerCase())}
                                placeholder="my-awesome-website"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                                disabled={loading}
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                Used in URL: <span className="font-mono">{slug || 'your-slug'}.pages.dev</span>
                            </p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-6 flex items-center justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Creating...' : 'Create Website'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
