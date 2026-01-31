import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, Save, Eye, Download, QrCode } from 'lucide-react';
import client from '../../api/client';
import VCardPreview from '../../components/vcard/VCardPreview';
import SocialLinksEditor from '../../components/vcard/SocialLinksEditor';
import QRCodeGenerator from '../../components/vcard/QRCodeGenerator';

interface SocialLink {
    platform: string;
    url: string;
}

interface VCardForm {
    name: string;
    job_title: string;
    company: string;
    email: string;
    phone: string;
    whatsapp: string;
    website: string;
    address: string;
    bio: string;
    photo_url: string;
    social_links: SocialLink[];
    template_id: string;
    slug: string;
    theme_color: string;
}

export default function VCardBuilder() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);

    const [form, setForm] = useState<VCardForm>({
        name: '',
        job_title: '',
        company: '',
        email: '',
        phone: '',
        whatsapp: '',
        website: '',
        address: '',
        bio: '',
        photo_url: '',
        social_links: [],
        template_id: 'modern',
        slug: '',
        theme_color: '#6366F1',
    });

    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(isEdit);
    const [showQR, setShowQR] = useState(false);

    useEffect(() => {
        if (isEdit) {
            loadVCard();
        }
    }, [id]);

    const loadVCard = async () => {
        try {
            const response = await client.get(`/api/vcards/${id}`);
            const vcard = response.data.vcard;

            setForm({
                ...vcard,
                social_links: vcard.social_links ? JSON.parse(vcard.social_links) : [],
            });
        } catch (error) {
            console.error('Failed to load vCard:', error);
            alert('Failed to load vCard');
            navigate('/dashboard/vcards');
        } finally {
            setLoading(false);
        }
    };

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    };

    const handleChange = (field: keyof VCardForm, value: any) => {
        setForm(prev => ({
            ...prev,
            [field]: value,
        }));

        // Auto-generate slug from name
        if (field === 'name' && !isEdit) {
            setForm(prev => ({
                ...prev,
                slug: generateSlug(value),
            }));
        }
    };

    const handleSave = async () => {
        if (!form.name.trim()) {
            alert('Name is required');
            return;
        }

        if (!form.slug.trim()) {
            alert('Slug is required');
            return;
        }

        try {
            setSaving(true);

            const payload = {
                ...form,
                social_links: form.social_links.length > 0 ? JSON.stringify(form.social_links) : null,
            };

            if (isEdit) {
                await client.patch(`/api/vcards/${id}`, payload);
            } else {
                await client.post('/api/vcards', payload);
            }

            navigate('/dashboard/vcards');
        } catch (error: any) {
            console.error('Failed to save vCard:', error);
            alert(error.response?.data?.error || 'Failed to save vCard');
        } finally {
            setSaving(false);
        }
    };

    const handleDownloadVCF = async () => {
        if (!id) return;

        try {
            const response = await client.get(`/api/vcards/${id}/download`, {
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${form.slug || 'vcard'}.vcf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Failed to download VCF:', error);
            alert('Failed to download contact file');
        }
    };

    const getPublicUrl = () => {
        return `${window.location.origin}/card/${form.slug}`;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                    <Link
                        to="/dashboard/vcards"
                        className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {isEdit ? 'Edit vCard' : 'Create vCard'}
                        </h1>
                        <p className="text-gray-600 mt-1">
                            {isEdit ? 'Update your digital business card' : 'Create a new digital business card'}
                        </p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    {isEdit && (
                        <>
                            <button
                                onClick={handleDownloadVCF}
                                className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                <Download className="w-5 h-5 mr-2" />
                                Download VCF
                            </button>
                            <button
                                onClick={() => setShowQR(true)}
                                className="flex items-center px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
                            >
                                <QrCode className="w-5 h-5 mr-2" />
                                QR Code
                            </button>
                            <a
                                href={getPublicUrl()}
                                target="_blank"
                                rel="noopen noreferrer"
                                className="flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                            >
                                <Eye className="w-5 h-5 mr-2" />
                                View Live
                            </a>
                        </>
                    )}
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                        <Save className="w-5 h-5 mr-2" />
                        {saving ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </div>

            {/* Split Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left: Form */}
                <div className="space-y-6">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={(e) => handleChange('name', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="John Doe"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Job Title
                                </label>
                                <input
                                    type="text"
                                    value={form.job_title}
                                    onChange={(e) => handleChange('job_title', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Senior Developer"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Company
                                </label>
                                <input
                                    type="text"
                                    value={form.company}
                                    onChange={(e) => handleChange('company', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Acme Inc."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    URL Slug <span className="text-red-500">*</span>
                                </label>
                                <div className="flex items-center">
                                    <span className="text-sm text-gray-500 mr-2">/card/</span>
                                    <input
                                        type="text"
                                        value={form.slug}
                                        onChange={(e) => handleChange('slug', e.target.value)}
                                        disabled={isEdit}
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                                        placeholder="john-doe"
                                    />
                                </div>
                                {isEdit && (
                                    <p className="text-xs text-gray-500 mt-1">Slug cannot be changed after creation</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={(e) => handleChange('email', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="john@example.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Phone
                                </label>
                                <input
                                    type="tel"
                                    value={form.phone}
                                    onChange={(e) => handleChange('phone', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="+1234567890"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    WhatsApp
                                </label>
                                <input
                                    type="tel"
                                    value={form.whatsapp}
                                    onChange={(e) => handleChange('whatsapp', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="+1234567890"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Website
                                </label>
                                <input
                                    type="url"
                                    value={form.website}
                                    onChange={(e) => handleChange('website', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="https://example.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Address
                                </label>
                                <input
                                    type="text"
                                    value={form.address}
                                    onChange={(e) => handleChange('address', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="123 Main St, City, Country"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">About</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Bio
                                </label>
                                <textarea
                                    value={form.bio}
                                    onChange={(e) => handleChange('bio', e.target.value)}
                                    rows={4}
                                    maxLength={500}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Brief description about yourself..."
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    {form.bio.length}/500 characters
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Photo URL
                                </label>
                                <input
                                    type="url"
                                    value={form.photo_url}
                                    onChange={(e) => handleChange('photo_url', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="https://example.com/photo.jpg"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Upload image to media library and paste URL here
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Social Links</h2>
                        <SocialLinksEditor
                            links={form.social_links}
                            onChange={(links) => handleChange('social_links', links)}
                        />
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Customization</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Theme Color
                                </label>
                                <div className="flex items-center space-x-3">
                                    <input
                                        type="color"
                                        value={form.theme_color}
                                        onChange={(e) => handleChange('theme_color', e.target.value)}
                                        className="w-16 h-10 rounded border border-gray-300 cursor-pointer"
                                    />
                                    <input
                                        type="text"
                                        value={form.theme_color}
                                        onChange={(e) => handleChange('theme_color', e.target.value)}
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="#6366F1"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Preview */}
                <div className="lg:sticky lg:top-8 lg:h-fit">
                    <div className="bg-gray-100 rounded-lg p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Live Preview</h2>
                        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                            <VCardPreview vcard={form} />
                        </div>
                    </div>
                </div>
            </div>

            {/* QR Modal */}
            {showQR && isEdit && (
                <QRCodeGenerator
                    url={getPublicUrl()}
                    onClose={() => setShowQR(false)}
                />
            )}
        </div>
    );
}
