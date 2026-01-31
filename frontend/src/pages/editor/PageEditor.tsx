import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useEditorStore } from '../../store/editorStore';
import GrapesEditor from '../../components/editor/GrapesEditor';
// import Canvas from '../../components/editor/Canvas';
// import LeftToolbar from '../../components/editor/LeftToolbar';
// import SettingsPanel from '../../components/editor/SettingsPanel';
// import PreviewModal from '../../components/editor/PreviewModal';
// import PublishWorkflow from '../../components/editor/PublishWorkflow';
// import AISectionModal from '../../components/editor/AISectionModal';
// import SEOOptimizerModal from '../../components/editor/SEOOptimizerModal';

export default function PageEditor() {
    const { pageId } = useParams<{ pageId: string }>();
    const navigate = useNavigate();
    const {
        currentPage,
        loadPage,
    } = useEditorStore();

    const [loading, setLoading] = useState(true);

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

    return (
        <GrapesEditor />
    );
}
