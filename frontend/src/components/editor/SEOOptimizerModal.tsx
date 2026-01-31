import { useState, useEffect } from 'react';
import { X, Search, Sparkles, AlertCircle, RefreshCw, Check } from 'lucide-react';
import aiService from '../../services/ai';

interface SEOOptimizerModalProps {
    pageTitle: string;
    pageContent: string;
    currentSEO?: {
        title?: string;
        description?: string;
        keywords?: string;
    };
    onClose: () => void;
    onSave: (seo: { title: string; description: string; keywords: string }) => void;
}

export default function SEOOptimizerModal({
    pageTitle,
    pageContent,
    currentSEO,
    onClose,
    onSave
}: SEOOptimizerModalProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [result, setResult] = useState<any>(currentSEO?.title ? currentSEO : null);
    const [context, setContext] = useState('');
    const [provider, setProvider] = useState('gemini');

    useEffect(() => {
        loadProviders();
    }, []);

    const loadProviders = async () => {
        const available = await aiService.getProviders();
        if (available.length > 0) {
            const preferred = aiService.getPreferredProvider();
            const p = available.find(a => a.name === preferred && a.available);
            setProvider(p?.name || available[0].name);
        }
    };

    const handleGenerate = async () => {
        setLoading(true);
        setError('');

        try {
            // Combine page title, content, and user context
            const fullContext = `
                Page Title: ${pageTitle}
                User Context: ${context}
                Page Content Summary: ${pageContent.substring(0, 1000)}...
            `;

            const seoData = await aiService.optimizeSEO(fullContext, provider);
            setResult(seoData);
        } catch (error: any) {
            console.error('SEO generation error:', error);
            setError(error.message || 'Failed to generate SEO metadata');
        } finally {
            setLoading(false);
        }
    };

    const handleAccept = () => {
        if (result) {
            onSave({
                title: result.title,
                description: result.description,
                keywords: Array.isArray(result.keywords) ? result.keywords.join(', ') : result.keywords,
            });
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-t-lg">
                    <div className="flex items-center">
                        <Search className="w-6 h-6 mr-3" />
                        <div>
                            <h2 className="text-xl font-semibold">AI SEO Optimizer</h2>
                            <p className="text-sm text-blue-100 mt-1">
                                Generate meta tags and keywords
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-white/80 hover:text-white transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Error */}
                {error && (
                    <div className="mx-6 mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
                        <AlertCircle className="w-5 h-5 text-red-600 mr-3 mt-0.5" />
                        <p className="text-sm text-red-800">{error}</p>
                    </div>
                )}

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Target Audience & Goals (Optional)
                        </label>
                        <textarea
                            value={context}
                            onChange={(e) => setContext(e.target.value)}
                            rows={2}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="E.g., Local customers looking for premium coffee..."
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Giving AI context helps better target keywords.
                        </p>
                    </div>

                    {!result ? (
                        <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                            <Sparkles className="w-12 h-12 text-blue-300 mx-auto mb-3" />
                            <p className="text-gray-600 font-medium">Ready to optimize</p>
                            <p className="text-sm text-gray-500">
                                AI will analyze your page content to generate SEO tags.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                            <div>
                                <label className="block text-xs font-medium text-gray-500 uppercase mb-1">
                                    Meta Title
                                </label>
                                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-900 font-medium">
                                    {result.title}
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 uppercase mb-1">
                                    Meta Description
                                </label>
                                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-900 text-sm">
                                    {result.description}
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 uppercase mb-1">
                                    Keywords
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {Array.isArray(result.keywords)
                                        ? result.keywords.map((k: string, i: number) => (
                                            <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs border border-gray-200">
                                                {k}
                                            </span>
                                        ))
                                        : result.keywords.split(',').map((k: string, i: number) => (
                                            <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs border border-gray-200">
                                                {k.trim()}
                                            </span>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
                    >
                        Cancel
                    </button>
                    <div className="flex space-x-3">
                        <button
                            onClick={handleGenerate}
                            disabled={loading}
                            className={`
                                flex items-center px-4 py-2 border border-gray-300 rounded-lg 
                                ${loading ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50'}
                            `}
                        >
                            {loading ? (
                                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                                <Sparkles className="w-4 h-4 mr-2" />
                            )}
                            {result ? 'Regenerate' : 'Generate SEO Tags'}
                        </button>

                        {result && (
                            <button
                                onClick={handleAccept}
                                className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                            >
                                <Check className="w-4 h-4 mr-2" />
                                Apply Changes
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
