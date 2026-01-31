import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    ChevronLeft,
    Eye,
    Save,
    Monitor,
    Tablet,
    Smartphone
} from 'lucide-react';
import { useEditorStore } from '../../store/editorStore';
import Canvas from '../../components/editor/Canvas';
import LeftToolbar from '../../components/editor/LeftToolbar';
import SettingsPanel from '../../components/editor/SettingsPanel';
import PreviewModal from '../../components/editor/PreviewModal';
import PublishWorkflow from '../../components/editor/PublishWorkflow';

export default function PageEditor() {
    const { pageId } = useParams<{ pageId: string }>();
    const navigate = useNavigate();
    const {
        currentPage,
        loadPage,
        previewDevice,
        setPreviewDevice,
        isSaving,
    } = useEditorStore();

    const [loading, setLoading] = useState(true);
    const [showPreview, setShowPreview] = useState(false);
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

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!currentPage) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Page not found</h2>
                    <Link to="/dashboard" className="text-blue-600 hover:underline">
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
        <div className="h-screen flex flex-col bg-gray-50">
            {/* Top Bar */}
            <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
                {/* Left: Back button */}
                <div className="flex items-center space-x-4">
                    <Link
                        to="/dashboard"
                        className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5 mr-1" />
                        <span className="text-sm font-medium">Back</span>
                    </Link>
                    <div className="border-l border-gray-300 h-6"></div>
                    <div>
                        <h1 className="text-lg font-semibold text-gray-900">
                            {currentPage.title}
                        </h1>
                        <p className="text-xs text-gray-500">/{currentPage.slug}</p>
                    </div>
                </div>

                {/* Center: Device switcher */}
                <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                    {(Object.entries(deviceIcons) as [typeof previewDevice, typeof Monitor][]).map(([device, Icon]) => (
                        <button
                            key={device}
                            onClick={() => setPreviewDevice(device)}
                            className={`
                p-2 rounded transition-colors
                ${previewDevice === device
                                    ? 'bg-white text-blue-600 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                                }
              `}
                            title={device.charAt(0).toUpperCase() + device.slice(1)}
                        >
                            <Icon className="w-5 h-5" />
                        </button>
                    ))}
                </div>

                {/* Right: Actions */}
                <div className="flex items-center space-x-2">
                    {isSaving && (
                        <div className="flex items-center text-sm text-gray-600">
                            <Save className="w-4 h-4 mr-1 animate-pulse" />
                            Saving...
                        </div>
                    )}
                    <button
                        onClick={() => setShowPreview(true)}
                        className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                    </button>
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
            <div className="flex-1 flex overflow-hidden">
                {/* Left Toolbar */}
                <aside className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
                    <LeftToolbar />
                </aside>

                {/* Canvas */}
                <main className="flex-1 overflow-y-auto">
                    <Canvas />
                </main>

                {/* Right Settings Panel */}
                <aside className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
                    <SettingsPanel />
                </aside>
            </div>

            {/* Preview Modal */}
            {showPreview && (
                <PreviewModal onClose={() => setShowPreview(false)} />
            )}
        </div>
    );
}
