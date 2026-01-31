import { useState, useEffect } from 'react';
import { X, Wand2, Sparkles, AlertCircle } from 'lucide-react';
import aiService from '../../services/ai';

interface AISectionModalProps {
    onClose: () => void;
    onInsert: (section: any) => void;
}

const sectionTypes = [
    { value: 'hero', label: 'Hero Banner', description: 'Eye-catching header with headline and CTA' },
    { value: 'features', label: 'Features', description: 'Showcase product/service features' },
    { value: 'pricing', label: 'Pricing Plans', description: 'Display pricing tiers and options' },
    { value: 'testimonials', label: 'Testimonials', description: 'Customer reviews and quotes' },
    { value: 'cta', label: 'Call to Action', description: 'Encourage users to take action' },
    { value: 'contact', label: 'Contact Form', description: 'Get in touch section with details' },
    { value: 'about', label: 'About Us', description: 'Company or team information' },
    { value: 'services', label: 'Services', description: 'List of services or offerings' },
];

const layoutVariants: Record<string, string[]> = {
    hero: ['centered', 'split', 'full-width'],
    features: ['grid', 'list', 'cards'],
    pricing: ['cards', 'table', 'comparison'],
    testimonials: ['grid', 'carousel', 'list'],
    cta: ['centered', 'split', 'banner'],
    contact: ['form', 'split', 'centered'],
    about: ['split', 'centered', 'timeline'],
    services: ['grid', 'cards', 'list'],
};

export default function AISectionModal({ onClose, onInsert }: AISectionModalProps) {
    const [step, setStep] = useState<'config' | 'generating' | 'preview'>('config');
    const [sectionType, setSectionType] = useState('hero');
    const [context, setContext] = useState('');
    const [layout, setLayout] = useState('');
    const [provider, setProvider] = useState('gemini');
    const [providers, setProviders] = useState<any[]>([]);
    const [generatedSection, setGeneratedSection] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        loadProviders();
    }, []);

    useEffect(() => {
        // Set default layout when section type changes
        const variants = layoutVariants[sectionType] || [];
        setLayout(variants[0] || '');
    }, [sectionType]);

    const loadProviders = async () => {
        const availableProviders = await aiService.getProviders();
        const available = availableProviders.filter(p => p.available);
        setProviders(available);

        if (available.length > 0) {
            const preferred = aiService.getPreferredProvider();
            const preferredAvailable = available.find(p => p.name === preferred);
            setProvider(preferredAvailable?.name || available[0].name);
        }
    };

    const handleGenerate = async () => {
        if (!context.trim()) {
            setError('Please provide context for the section');
            return;
        }

        setError('');
        setLoading(true);
        setStep('generating');

        try {
            const section = await aiService.generateSection(sectionType, context, provider, layout);
            setGeneratedSection(section);
            setStep('preview');
        } catch (error: any) {
            setError(error.message || 'Failed to generate section');
            setStep('config');
        } finally {
            setLoading(false);
        }
    };

    const handleRegenerate = () => {
        setStep('config');
        setGeneratedSection(null);
    };

    const handleInsert = () => {
        if (generatedSection) {
            onInsert(generatedSection);
            onClose();
        }
    };

    const selectedTypeInfo = sectionTypes.find(t => t.value === sectionType);

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                    <div className="flex items-center">
                        <Wand2 className="w-6 h-6 mr-3" />
                        <div>
                            <h2 className="text-xl font-semibold">AI Section Generator</h2>
                            <p className="text-sm text-purple-100 mt-1">
                                Let AI create a section for you
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

                {/* Error Message */}
                {error && (
                    <div className="mx-6 mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
                        <AlertCircle className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-red-800">{error}</p>
                    </div>
                )}

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {/* Step 1: Configuration */}
                    {step === 'config' && (
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Section Type <span className="text-red-500">*</span>
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {sectionTypes.map((type) => (
                                        <label
                                            key={type.value}
                                            className={`
                                                relative flex flex-col p-4 border-2 rounded-lg cursor-pointer transition-all
                                                ${sectionType === type.value
                                                    ? 'border-purple-600 bg-purple-50'
                                                    : 'border-gray-200 hover:border-purple-300'
                                                }
                                            `}
                                        >
                                            <input
                                                type="radio"
                                                name="sectionType"
                                                value={type.value}
                                                checked={sectionType === type.value}
                                                onChange={(e) => setSectionType(e.target.value)}
                                                className="sr-only"
                                            />
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="font-medium text-gray-900">
                                                    {type.label}
                                                </span>
                                                {sectionType === type.value && (
                                                    <Sparkles className="w-4 h-4 text-purple-600" />
                                                )}
                                            </div>
                                            <span className="text-xs text-gray-500">
                                                {type.description}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {layoutVariants[sectionType] && layoutVariants[sectionType].length > 1 && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Layout Variant
                                    </label>
                                    <select
                                        value={layout}
                                        onChange={(e) => setLayout(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    >
                                        {layoutVariants[sectionType].map((variant) => (
                                            <option key={variant} value={variant}>
                                                {variant.charAt(0).toUpperCase() + variant.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Context / Description <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    value={context}
                                    onChange={(e) => setContext(e.target.value)}
                                    rows={4}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    placeholder={`Describe what this ${selectedTypeInfo?.label.toLowerCase()} section should be about...\n\nExample: An AI-powered analytics platform for startups. Target audience is tech-savvy entrepreneurs.`}
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    {context.length}/500 characters
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    AI Provider
                                </label>
                                <select
                                    value={provider}
                                    onChange={(e) => setProvider(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                >
                                    {providers.map((p) => (
                                        <option key={p.name} value={p.name}>
                                            {p.label}
                                            {p.costEffective && ' (Cost-Effective)'}
                                            {p.popular && ' (Popular)'}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Generating */}
                    {step === 'generating' && (
                        <div className="text-center py-12">
                            <Sparkles className="w-16 h-16 text-purple-600 mx-auto mb-6 animate-pulse" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                Generating {selectedTypeInfo?.label} Section...
                            </h3>
                            <p className="text-gray-600 mb-8">
                                AI is creating the perfect content for your section
                            </p>
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                        </div>
                    )}

                    {/* Step 3: Preview */}
                    {step === 'preview' && generatedSection && (
                        <div className="space-y-6">
                            <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
                                <div className="flex items-center mb-4">
                                    <Sparkles className="w-5 h-5 text-purple-600 mr-2" />
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Generated {selectedTypeInfo?.label} Section
                                    </h3>
                                </div>

                                <div className="bg-white rounded-lg p-6 shadow-sm">
                                    <div className="space-y-4">
                                        <div>
                                            <span className="text-xs font-medium text-gray-500 uppercase">
                                                Section Type
                                            </span>
                                            <p className="text-sm text-gray-900 mt-1">
                                                {generatedSection.type} - {generatedSection.layout_variant}
                                            </p>
                                        </div>

                                        <div>
                                            <span className="text-xs font-medium text-gray-500 uppercase">
                                                Content Preview
                                            </span>
                                            <div className="mt-2 p-4 bg-gray-50 rounded border border-gray-200">
                                                <pre className="text-sm text-gray-900 whitespace-pre-wrap overflow-x-auto">
                                                    {JSON.stringify(generatedSection.content, null, 2)}
                                                </pre>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <p className="text-sm text-blue-800">
                                    <strong>Tip:</strong> After inserting, you can edit all content,
                                    customize styles, and rearrange elements in the visual editor.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
                    {step === 'preview' ? (
                        <>
                            <button
                                onClick={handleRegenerate}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-white transition-colors"
                            >
                                Regenerate
                            </button>
                            <button
                                onClick={handleInsert}
                                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                            >
                                Insert Section
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={onClose}
                                className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleGenerate}
                                disabled={loading || !context.trim() || providers.length === 0}
                                className="flex items-center px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <Wand2 className="w-5 h-5 mr-2" />
                                        Generate with AI
                                    </>
                                )}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
