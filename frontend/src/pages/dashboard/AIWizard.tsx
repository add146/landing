import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wand2, ArrowRight, ArrowLeft, Check, Sparkles, AlertCircle } from 'lucide-react';
import aiService from '../../services/ai';
import client from '../../api/client';

const steps = [
    { id: 1, name: 'Describe', description: 'Tell us about your website' },
    { id: 2, name: 'Configure', description: 'Choose AI provider and style' },
    { id: 3, name: 'Generate', description: 'AI creates your website' },
    { id: 4, name: 'Review', description: 'Preview and customize' },
];

export default function AIWizard() {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Form state
    const [description, setDescription] = useState('');
    const [websiteName, setWebsiteName] = useState('');
    const [industry, setIndustry] = useState('');
    const [style, setStyle] = useState('modern');
    const [provider, setProvider] = useState('gemini');
    const [providers, setProviders] = useState<any[]>([]);

    // Generated website
    const [generatedWebsite, setGeneratedWebsite] = useState<any>(null);

    // Load providers on mount
    useState(() => {
        loadProviders();
    });

    const loadProviders = async () => {
        const availableProviders = await aiService.getProviders();
        setProviders(availableProviders.filter(p => p.available));

        // Set default to first available provider
        if (availableProviders.length > 0) {
            const preferred = aiService.getPreferredProvider();
            const preferredAvailable = availableProviders.find(p => p.name === preferred && p.available);
            setProvider(preferredAvailable?.name || availableProviders[0].name);
        }
    };

    const handleNext = async () => {
        setError('');

        if (currentStep === 1) {
            if (!description.trim()) {
                setError('Please describe your website');
                return;
            }
            setCurrentStep(2);
        } else if (currentStep === 2) {
            if (!provider) {
                setError('Please select an AI provider');
                return;
            }
            setCurrentStep(3);
            await generateWebsite();
        } else if (currentStep === 3) {
            setCurrentStep(4);
        } else if (currentStep === 4) {
            await createWebsite();
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
            setError('');
        }
    };

    const generateWebsite = async () => {
        setLoading(true);
        setError('');

        try {
            const website = await aiService.generateWebsite(description, provider, {
                industry,
                style,
            });

            // Set website name from generation or form
            if (!websiteName && website.name) {
                setWebsiteName(website.name);
            }

            setGeneratedWebsite(website);
            setCurrentStep(4);
        } catch (error: any) {
            console.error('Generation error:', error);
            setError(error.message || 'Failed to generate website. Please try again.');
            setCurrentStep(2); // Go back to config
        } finally {
            setLoading(false);
        }
    };

    const regenerate = () => {
        setCurrentStep(3);
        generateWebsite();
    };

    const createWebsite = async () => {
        if (!generatedWebsite) return;

        setLoading(true);
        setError('');

        try {
            // Create website
            const websiteResponse = await client.post('/api/websites', {
                name: websiteName || generatedWebsite.name,
                slug: (websiteName || generatedWebsite.name).toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                description: generatedWebsite.description || description,
                is_published: false,
            });

            const websiteId = websiteResponse.data.website.id;

            // Create pages
            for (const page of generatedWebsite.pages) {
                const pageResponse = await client.post('/api/pages', {
                    website_id: websiteId,
                    title: page.title,
                    slug: page.slug,
                    is_published: false,
                });

                const pageId = pageResponse.data.page.id;

                // Create sections for each page
                for (let i = 0; i < page.sections.length; i++) {
                    const section = page.sections[i];
                    await client.post('/api/sections', {
                        page_id: pageId,
                        type: section.type,
                        layout_variant: section.layout_variant || 'default',
                        content: JSON.stringify(section.content || {}),
                        order_index: i,
                    });
                }
            }

            // Navigate to website pages
            navigate(`/dashboard/websites/${websiteId}/pages`);
        } catch (error: any) {
            console.error('Create website error:', error);
            setError(error.response?.data?.error || 'Failed to create website');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                    <Wand2 className="w-8 h-8 mr-3 text-purple-600" />
                    AI Website Wizard
                </h1>
                <p className="text-gray-600 mt-2">Let AI create a professional website for you in minutes</p>
            </div>

            {/* Steps Indicator */}
            <nav aria-label="Progress" className="mb-8">
                <ol className="flex items-center justify-center space-x-4">
                    {steps.map((step, index) => (
                        <li key={step.id} className="flex items-center">
                            <div className={`flex items-center ${index < steps.length - 1 ? 'mr-4' : ''}`}>
                                <div className={`
                                    flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors
                                    ${currentStep > step.id
                                        ? 'bg-purple-600 border-purple-600 text-white'
                                        : currentStep === step.id
                                            ? 'border-purple-600 text-purple-600'
                                            : 'border-gray-300 text-gray-500'
                                    }
                                `}>
                                    {currentStep > step.id ? (
                                        <Check className="w-5 h-5" />
                                    ) : (
                                        <span className="text-sm font-semibold">{step.id}</span>
                                    )}
                                </div>
                                <div className="ml-3 hidden sm:block">
                                    <p className={`text-sm font-medium ${currentStep >= step.id ? 'text-gray-900' : 'text-gray-500'}`}>
                                        {step.name}
                                    </p>
                                    <p className="text-xs text-gray-500">{step.description}</p>
                                </div>
                            </div>
                            {index < steps.length - 1 && (
                                <div className={`h-0.5 w-12 ${currentStep > step.id ? 'bg-purple-600' : 'bg-gray-300'}`} />
                            )}
                        </li>
                    ))}
                </ol>
            </nav>

            {/* Error Message */}
            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
                    <AlertCircle className="w-5 h-5 text-red-600 mr-3 mt-0.5" />
                    <div>
                        <p className="text-sm font-medium text-red-800">{error}</p>
                    </div>
                </div>
            )}

            {/* Step Content */}
            <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                {/* Step 1: Describe */}
                {currentStep === 1 && (
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Describe Your Website</h2>
                            <p className="text-gray-600 mb-6">
                                Tell us what kind of website you want to create. Be as detailed as possible for better results.
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Website Description <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={6}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="Example: A modern SaaS landing page for an AI-powered project management tool. Target audience is tech startups and agencies. Should include features section, pricing, testimonials, and call-to-action."
                            />
                            <p className="text-xs text-gray-500 mt-2">
                                {description.length}/1000 characters
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Industry (Optional)
                                </label>
                                <select
                                    value={industry}
                                    onChange={(e) => setIndustry(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                >
                                    <option value="">Select industry</option>
                                    <option value="technology">Technology</option>
                                    <option value="saas">SaaS</option>
                                    <option value="ecommerce">E-commerce</option>
                                    <option value="agency">Agency</option>
                                    <option value="consulting">Consulting</option>
                                    <option value="healthcare">Healthcare</option>
                                    <option value="education">Education</option>
                                    <option value="finance">Finance</option>
                                    <option value="real-estate">Real Estate</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Style Preference
                                </label>
                                <select
                                    value={style}
                                    onChange={(e) => setStyle(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                >
                                    <option value="modern">Modern</option>
                                    <option value="minimal">Minimal</option>
                                    <option value="professional">Professional</option>
                                    <option value="creative">Creative</option>
                                    <option value="corporate">Corporate</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 2: Configure */}
                {currentStep === 2 && (
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Choose AI Provider</h2>
                            <p className="text-gray-600 mb-6">
                                Select which AI provider to use for generating your website.
                            </p>
                        </div>

                        <div className="space-y-4">
                            {providers.length > 0 ? (
                                providers.map((p) => (
                                    <label
                                        key={p.name}
                                        className={`
                                            block p-4 border-2 rounded-lg cursor-pointer transition-colors
                                            ${provider === p.name
                                                ? 'border-purple-600 bg-purple-50'
                                                : 'border-gray-200 hover:border-purple-300'
                                            }
                                        `}
                                    >
                                        <div className="flex items-center">
                                            <input
                                                type="radio"
                                                name="provider"
                                                value={p.name}
                                                checked={provider === p.name}
                                                onChange={(e) => setProvider(e.target.value)}
                                                className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                                            />
                                            <div className="ml-4 flex-1">
                                                <div className="flex items-center justify-between">
                                                    <span className="font-medium text-gray-900">{p.label}</span>
                                                    <div className="flex space-x-2">
                                                        {p.costEffective && (
                                                            <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                                                                Cost-Effective
                                                            </span>
                                                        )}
                                                        {p.popular && (
                                                            <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                                                                Popular
                                                            </span>
                                                        )}
                                                        {p.creative && (
                                                            <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded">
                                                                Creative
                                                            </span>
                                                        )}
                                                        {p.free && (
                                                            <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
                                                                Free
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </label>
                                ))
                            ) : (
                                <div className="text-center py-8">
                                    <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-600">No AI providers configured.</p>
                                    <p className="text-sm text-gray-500 mt-2">
                                        Please contact your administrator to configure AI providers.
                                    </p>
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Website Name (Optional)
                            </label>
                            <input
                                type="text"
                                value={websiteName}
                                onChange={(e) => setWebsiteName(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="AI will suggest a name if left empty"
                            />
                        </div>
                    </div>
                )}

                {/* Step 3: Generate */}
                {currentStep === 3 && (
                    <div className="text-center py-12">
                        <Sparkles className="w-16 h-16 text-purple-600 mx-auto mb-6 animate-pulse" />
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Generating Your Website...</h2>
                        <p className="text-gray-600 mb-8">
                            AI is creating your website structure and content. This may take a moment.
                        </p>
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                    </div>
                )}

                {/* Step 4: Review */}
                {currentStep === 4 && generatedWebsite && (
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">Review Your Website</h2>
                            <p className="text-gray-600 mb-6">
                                Your AI-generated website is ready! Review the structure below.
                            </p>
                        </div>

                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                {websiteName || generatedWebsite.name}
                            </h3>
                            {generatedWebsite.description && (
                                <p className="text-gray-700 mb-4">{generatedWebsite.description}</p>
                            )}

                            <div className="space-y-4">
                                <h4 className="font-medium text-gray-900">Pages ({generatedWebsite.pages.length}):</h4>
                                {generatedWebsite.pages.map((page: any, index: number) => (
                                    <div key={index} className="bg-white rounded-lg p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <h5 className="font-medium text-gray-900">{page.title}</h5>
                                            <span className="text-xs text-gray-500">/{page.slug}</span>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {page.sections.map((section: any, sIdx: number) => (
                                                <span
                                                    key={sIdx}
                                                    className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full"
                                                >
                                                    {section.type}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                            <p className="text-sm text-gray-600">
                                <strong>Note:</strong> After creation, you can edit all content, add more sections, customize designs, and publish your pages.
                            </p>
                        </div>
                    </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                    <button
                        onClick={handleBack}
                        disabled={currentStep === 1 || loading}
                        className="flex items-center px-4 py-2 text-gray-700 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back
                    </button>

                    <div className="flex items-center space-x-3">
                        {currentStep === 4 && generatedWebsite && (
                            <button
                                onClick={regenerate}
                                disabled={loading}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                            >
                                Regenerate
                            </button>
                        )}
                        <button
                            onClick={handleNext}
                            disabled={loading || (currentStep === 2 && providers.length === 0)}
                            className="flex items-center px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                    Processing...
                                </>
                            ) : (
                                <>
                                    {currentStep === 4 ? 'Create Website' : 'Next'}
                                    {currentStep < 4 && <ArrowRight className="w-5 h-5 ml-2" />}
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
