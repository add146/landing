import { useState, useEffect } from 'react';
import { X, Wand2, Sparkles, RefreshCw, Check, AlertCircle } from 'lucide-react';
import aiService from '../../services/ai';

interface ContentImproverModalProps {
    initialContent: string;
    onClose: () => void;
    onSave: (content: string) => void;
}

const improvementTypes = [
    { value: 'improve', label: 'Improve Writing', description: 'Enhance clarity and flow' },
    { value: 'shorter', label: 'Make Shorter', description: 'Condense the text' },
    { value: 'longer', label: 'Make Longer', description: 'Expand with more details' },
    { value: 'professional', label: 'More Professional', description: 'Formal business tone' },
    { value: 'persuasive', label: 'More Persuasive', description: 'Compelling marketing copy' },
    { value: 'casual', label: 'More Casual', description: 'Friendly and relaxed tone' },
    { value: 'grammar', label: 'Fix Grammar', description: 'Correct errors only' },
];

export default function ContentImproverModal({ initialContent, onClose, onSave }: ContentImproverModalProps) {
    const [originalContent, setOriginalContent] = useState(initialContent);
    const [improvedContent, setImprovedContent] = useState('');
    const [selectedType, setSelectedType] = useState('improve');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
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

    const handleImprove = async () => {
        if (!originalContent.trim()) {
            setError('Please enter some text to improve');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // Map our types to API types or default to professional
            const apiTone = (['professional', 'casual', 'persuasive', 'technical'].includes(selectedType)
                ? selectedType
                : 'professional') as 'professional' | 'casual' | 'persuasive' | 'technical';

            // Pass the specific instruction if it's not a tone (e.g. shorter, longer, grammar)
            const purpose = ['shorter', 'longer', 'grammar', 'improve'].includes(selectedType) ? selectedType : undefined;

            const result = await aiService.improveContent(originalContent, apiTone, provider, purpose);
            setImprovedContent(result.improved);
        } catch (error: any) {
            console.error('Improvement error:', error);
            setError(error.message || 'Failed to improve content');
        } finally {
            setLoading(false);
        }
    };

    const handleAccept = () => {
        onSave(improvedContent);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
                    <div className="flex items-center">
                        <Wand2 className="w-6 h-6 mr-3" />
                        <div>
                            <h2 className="text-xl font-semibold">AI Content Improver</h2>
                            <p className="text-sm text-purple-100 mt-1">
                                Enhance your text with AI
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
                    {/* Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Original Text
                        </label>
                        <textarea
                            value={originalContent}
                            onChange={(e) => setOriginalContent(e.target.value)}
                            rows={4}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="Enter text to improve..."
                        />
                    </div>

                    {/* Controls */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Improvement Type
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {improvementTypes.map((type) => (
                                <button
                                    key={type.value}
                                    onClick={() => setSelectedType(type.value)}
                                    className={`
                                        px-3 py-2 text-sm font-medium rounded-lg border transition-all text-left
                                        ${selectedType === type.value
                                            ? 'border-purple-600 bg-purple-50 text-purple-700'
                                            : 'border-gray-200 text-gray-700 hover:border-purple-300'
                                        }
                                    `}
                                >
                                    {type.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Result */}
                    {improvedContent && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    AI Suggestion
                                </label>
                                <span className="text-xs text-purple-600 font-medium flex items-center">
                                    <Sparkles className="w-3 h-3 mr-1" />
                                    Generated by {provider}
                                </span>
                            </div>
                            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                                <p className="text-gray-800 whitespace-pre-wrap">{improvedContent}</p>
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
                            onClick={handleImprove}
                            disabled={loading || !originalContent.trim()}
                            className={`
                                flex items-center px-4 py-2 border border-gray-300 rounded-lg 
                                ${loading ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50'}
                            `}
                        >
                            {loading ? (
                                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                                <Wand2 className="w-4 h-4 mr-2" />
                            )}
                            {improvedContent ? 'Regenerate' : 'Generate'}
                        </button>

                        {improvedContent && (
                            <button
                                onClick={handleAccept}
                                className="flex items-center px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-sm"
                            >
                                <Check className="w-4 h-4 mr-2" />
                                Use Text
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
