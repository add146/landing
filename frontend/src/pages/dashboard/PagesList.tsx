import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Plus, FileText, Edit2, Trash2, ChevronLeft, ToggleLeft, ToggleRight } from 'lucide-react';
import client from '../../api/client';

interface Page {
    id: string;
    website_id: string;
    title: string;
    slug: string;
    page_type: string;
    is_published: number;
    sort_order: number;
    created_at: string;
}

interface Website {
    id: string;
    name: string;
    slug: string;
}

export default function PagesList() {
    const { id: websiteId } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [website, setWebsite] = useState<Website | null>(null);
    const [pages, setPages] = useState<Page[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (websiteId) {
            loadWebsite();
            loadPages();
        }
    }, [websiteId]);

    const loadWebsite = async () => {
        try {
            const response = await client.get(`/api/websites/${websiteId}`);
            setWebsite(response.data.website);
        } catch (error) {
            console.error('Failed to load website:', error);
        }
    };

    const loadPages = async () => {
        try {
            setLoading(true);
            const response = await client.get(`/api/pages?website_id=${websiteId}`);
            setPages(response.data.pages);
        } catch (error) {
            console.error('Failed to load pages:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreatePage = async () => {
        const title = prompt('Page title:');
        if (!title) return;

        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

        try {
            const response = await client.post('/api/pages', {
                website_id: websiteId,
                title,
                slug,
                page_type: 'landing',
            });
            await loadPages();
            // Navigate to editor
            navigate(`/editor/${response.data.page.id}`);
        } catch (error: any) {
            alert(error.response?.data?.error || 'Failed to create page');
        }
    };

    const handleTogglePublish = async (pageId: string) => {
        try {
            await client.patch(`/api/pages/${pageId}/publish`);
            await loadPages();
        } catch (error) {
            console.error('Failed to toggle publish status:', error);
            alert('Failed to update page');
        }
    };

    const handleDeletePage = async (pageId: string) => {
        if (!confirm('Are you sure you want to delete this page?')) {
            return;
        }

        try {
            await client.delete(`/api/pages/${pageId}`);
            await loadPages();
        } catch (error) {
            console.error('Failed to delete page:', error);
            alert('Failed to delete page');
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
            <div className="mb-6">
                <Link
                    to="/dashboard"
                    className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
                >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Back to Websites
                </Link>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            {website?.name || 'Website'} - Pages
                        </h1>
                        <p className="mt-2 text-gray-600">
                            Manage pages for this website
                        </p>
                    </div>
                    <button
                        onClick={handleCreatePage}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Create Page
                    </button>
                </div>
            </div>

            {/* Pages List */}
            {pages.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
                    <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No pages yet
                    </h3>
                    <p className="text-gray-600 mb-6">
                        Create your first page to get started
                    </p>
                    <button
                        onClick={handleCreatePage}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Create Page
                    </button>
                </div>
            ) : (
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Page Title
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Slug
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {pages.map((page) => (
                                <tr key={page.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">
                                            {page.title}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500 font-mono">
                                            /{page.slug}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`
                        px-2 py-1 text-xs font-medium rounded-full
                        ${page.is_published
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-gray-100 text-gray-800'
                                                }
                      `}
                                        >
                                            {page.is_published ? 'Published' : 'Draft'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end space-x-2">
                                            <button
                                                onClick={() => navigate(`/editor/${page.id}`)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Edit page"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleTogglePublish(page.id)}
                                                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                                title={page.is_published ? 'Unpublish' : 'Publish'}
                                            >
                                                {page.is_published ? (
                                                    <ToggleRight className="w-4 h-4 text-green-600" />
                                                ) : (
                                                    <ToggleLeft className="w-4 h-4" />
                                                )}
                                            </button>
                                            <button
                                                onClick={() => handleDeletePage(page.id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete page"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
