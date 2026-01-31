import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    ArrowLeft,
    Eye,
    Monitor,
    Tablet,
    Smartphone,
    Undo,
    Redo,
    Settings,
    BarChart3
} from 'lucide-react';
import { useEditorStore } from '../../store/editorStore';
import Canvas from '../../components/editor/Canvas';
import LeftToolbar from '../../components/editor/LeftToolbar';
import SettingsPanel from '../../components/editor/SettingsPanel';
import PreviewModal from '../../components/editor/PreviewModal';
import PublishWorkflow from '../../components/editor/PublishWorkflow';
import AISectionModal from '../../components/editor/AISectionModal';
import SEOOptimizerModal from '../../components/editor/SEOOptimizerModal';

export default function PageEditor() {
    const { pageId } = useParams<{ pageId: string }>();
    const navigate = useNavigate();
    const {
        currentPage,
        sections,
        elements,
        loadPage,
        updatePage,
        previewDevice,
        setPreviewDevice,
    } = useEditorStore();

    const [loading, setLoading] = useState(true);
    const [showPreview, setShowPreview] = useState(false);
    const [showAIModal, setShowAIModal] = useState(false);
    const [showSEOModal, setShowSEOModal] = useState(false);
    const [isPublished, setIsPublished] = useState(false);
    const [websiteSlug, setWebsiteSlug] = useState('');

    useEffect(() => {
        if (pageId) {
            loadPage(pageId)
                .then(() => setLoading(false))
                .catch((error) => {
                    console.error('Failed to load page:', error);
                    alert('Failed to load page');
                    navigate('/dashboard');
                });
        }
    }, [pageId]);

    // Load website slug and publish status
    useEffect(() => {
        if (currentPage) {
            setIsPublished(!!currentPage.is_published);

            // Fetch website details to get slug
            import('../../api/client').then(({ default: client }) => {
                client.get(`/api/websites/${currentPage.website_id}`)
                    .then(response => {
                        setWebsiteSlug(response.data.website.slug);
                    })
                    .catch(error => {
                        console.error('Failed to load website:', error);
                    });
            });
        }
    }, [currentPage]);

    const handleAIInsert = async (section: any) => {
        // Insert AI-generated section
        try {
            // Create section via API directly since we have custom content
            const client = await import('../../api/client').then(m => m.default);
            await client.post('/api/sections', {
                page_id: pageId,
                type: section.type,
                layout_variant: section.layout_variant || 'default',
                content: JSON.stringify(section.content),
                order_index: 999, // Add at the end
            });

            // Reload page to show new section
            if (pageId) {
                await loadPage(pageId);
            }
        } catch (error) {
            console.error('Failed to insert AI section:', error);
            alert('Failed to insert section');
        }
    };

    const handleSaveSEO = async (seoData: { title: string; description: string; keywords: string }) => {
        try {
            await updatePage({
                seo_title: seoData.title,
                seo_description: seoData.description,
                seo_keywords: seoData.keywords,
            });
            alert('SEO settings saved successfully!');
        } catch (error) {
            console.error('Failed to save SEO:', error);
            alert('Failed to save SEO settings');
        }
    };

    const getPageContent = () => {
        // Aggregate text content from all sections
        let content = '';
        sections.forEach(section => {
            // Add section content
            if (section.content && typeof section.content === 'object') {
                content += JSON.stringify(section.content) + ' ';
            }
            // Add element content
            const sectionElements = elements[section.id] || [];
            sectionElements.forEach(el => {
                const elContent = typeof el.content === 'string'
                    ? JSON.parse(el.content)
                    : el.content;

                if (elContent.text) content += elContent.text + ' ';
                if (elContent.alt) content += elContent.alt + ' ';
            });
        });
        return content;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!currentPage) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Page not found</h2>
                    <Link to="/dashboard" className="text-primary hover:underline">
                        Return to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    const deviceIcons = {
        desktop: Monitor,
        tablet: Tablet,
        mobile: Smartphone,
    };

    return (
        <div className="h-screen flex flex-col bg-background-light overflow-hidden font-sans text-slate-900">
            {/* Header */}
            <header className="flex items-center justify-between px-4 py-2 border-b border-slate-200 bg-white shrink-0 h-14 z-50 relative">
                {/* Left: Back & Title */}
                <div className="flex items-center gap-4">
                    <Link to="/dashboard" className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-slate-900 w-48 truncate">{currentPage.title}</span>
                            <span className="text-[10px] text-slate-400">/{currentPage.slug} • v2.4</span>
                        </div>
                        <button
                            onClick={() => setShowSEOModal(true)}
                            className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-medium text-slate-600 transition-colors"
                            title="Page Settings & SEO"
                        >
                            <Settings className="w-4 h-4" />
                            <span>Page Settings</span>
                        </button>
                        <div className="flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded-full text-[10px] font-bold border border-green-100">
                            <BarChart3 className="w-3 h-3" />
                            SEO: 92/100
                        </div>
                    </div>
                </div>

                {/* Center: Device Switcher & Undo/Redo */}
                <div className="flex items-center gap-2">
                    <div className="flex bg-slate-100 rounded-lg p-1 mr-2 gap-1">
                        {(Object.entries(deviceIcons) as [typeof previewDevice, typeof Monitor][]).map(([device, Icon]) => (
                            <button
                                key={device}
                                onClick={() => setPreviewDevice(device)}
                                className={`
                                    p-2 rounded transition-colors
                                    ${previewDevice === device
                                        ? 'bg-white text-primary shadow-sm'
                                        : 'text-slate-500 hover:text-slate-800'
                                    }
                                `}
                                title={device.charAt(0).toUpperCase() + device.slice(1)}
                            >
                                <Icon className="w-5 h-5" />
                            </button>
                        ))}
                    </div>
                    <div className="h-6 w-px bg-slate-200 mx-1"></div>
                    <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 disabled:opacity-50" title="Undo (Coming Soon)">
                        <Undo className="w-5 h-5" />
                    </button>
                    <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 disabled:opacity-50" title="Redo (Coming Soon)">
                        <Redo className="w-5 h-5" />
                    </button>
                </div>

                {/* Right: Preview & Publish */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowPreview(true)}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <Eye className="w-4 h-4" />
                        <span className="hidden sm:inline">Preview</span>
                    </button>

                    {/* We reuse PublishWorkflow component but we might want to style it to match 'bg-primary' etc */}
                    {/* For now, let's keep it as is, or use the design's button if PublishWorkflow allows custom trigger */}
                    {/* Design has: bg-primary text-white ... flex gap-2 Rocket icon */}
                    <PublishWorkflow
                        pageId={currentPage.id}
                        pageTitle={currentPage.title}
                        pageSlug={currentPage.slug}
                        websiteSlug={websiteSlug}
                        isPublished={isPublished}
                        onPublishChange={setIsPublished}
                    />
                </div>
            </header>

            {/* Editor Layout */}
            <div className="flex-1 flex overflow-hidden relative">
                {/* Left Toolbar */}
                <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 z-20">
                    <LeftToolbar onAIClick={() => setShowAIModal(true)} />
                </aside>

                {/* Canvas Area */}
                <main className="flex-1 bg-slate-100 relative overflow-hidden flex flex-col bg-grid-pattern z-0" id="canvas-area">
                    {/* Floating Navigator (Optional, adding placeholder or leaving for future) */}

                    <div className="flex-1 overflow-auto flex justify-center items-start p-12">
                        {/* Canvas Wrapper */}
                        <div className="min-h-[900px] bg-white shadow-2xl ring-1 ring-slate-200 transition-all origin-top">
                            <Canvas />
                        </div>
                    </div>
                </main>

                {/* Right Settings Panel */}
                <aside className="w-80 bg-white border-l border-slate-200 flex flex-col shrink-0 overflow-y-auto z-20 shadow-[-5px_0_15px_rgba(0,0,0,0.02)]">
                    <SettingsPanel />
                </aside>
            </div>

            {/* Preview Modal */}
            {showPreview && (
                <PreviewModal onClose={() => setShowPreview(false)} />
            )}

            {/* AI Section Modal */}
            {showAIModal && (
                <AISectionModal
                    onClose={() => setShowAIModal(false)}
                    onInsert={handleAIInsert}
                />
            )}

            {/* SEO Optimizer Modal */}
            {showSEOModal && (
                <SEOOptimizerModal
                    pageTitle={currentPage.title}
                    pageContent={getPageContent()}
                    currentSEO={{
                        title: currentPage.seo_title,
                        description: currentPage.seo_description,
                        keywords: currentPage.seo_keywords,
                    }}
                    onClose={() => setShowSEOModal(false)}
                    onSave={handleSaveSEO}
                />
            )}
        </div>
    );
}
