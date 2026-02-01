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
                name: vcard.name || '',
                job_title: vcard.job_title || '',
                company: vcard.company || '',
                email: vcard.email || '',
                phone: vcard.phone || '',
                whatsapp: vcard.whatsapp || '',
                website: vcard.website || '',
                address: vcard.address || '',
                bio: vcard.bio || '',
                photo_url: vcard.photo_url || '',
                social_links: vcard.social_links ? JSON.parse(vcard.social_links) : [],
                template_id: vcard.template_id || 'modern',
                slug: vcard.slug || '',
                theme_color: vcard.theme_color || '#6366F1',
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

            // Helper to clean empty strings to null
            const cleanValue = (val: string) => (val?.trim() === '' ? null : val);

            const payload = {
                ...form,
                job_title: cleanValue(form.job_title),
                company: cleanValue(form.company),
                email: cleanValue(form.email),
                phone: cleanValue(form.phone),
                whatsapp: cleanValue(form.whatsapp),
                website: cleanValue(form.website),
                address: cleanValue(form.address),
                bio: cleanValue(form.bio),
                photo_url: cleanValue(form.photo_url),
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
            const errorMessage = error.response?.data?.error;

            if (errorMessage) {
                // Formatting Zod errors if array
                if (Array.isArray(errorMessage)) {
                    alert('Validation failed:\n' + errorMessage.map((e: any) => `- ${e.message}`).join('\n'));
                } else {
                    alert(`Failed to save: ${errorMessage}`);
                }
            } else {
                alert('Failed to save vCard. Please check your connection and try again.');
            }
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
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-4">
                            <Link
                                to="/dashboard/vcards"
                                className="p-2 -ml-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </Link>
                            <div className="h-6 w-px bg-slate-200"></div>
                            <div>
                                <h1 className="text-lg font-bold text-slate-900">
                                    {isEdit ? 'Edit vCard' : 'Create vCard'}
                                </h1>
                                <p className="text-xs text-slate-500">
                                    {isEdit ? 'Update details' : 'New digital card'}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            {isEdit && (
                                <div className="flex items-center gap-2 mr-2">
                                    <button
                                        onClick={handleDownloadVCF}
                                        className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                                        title="Download VCF"
                                    >
                                        <Download className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => setShowQR(true)}
                                        className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                                        title="Show QR Code"
                                    >
                                        <QrCode className="w-5 h-5" />
                                    </button>
                                    <a
                                        href={getPublicUrl()}
                                        target="_blank"
                                        rel="noopen noreferrer"
                                        className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                                        title="View Live"
                                    >
                                        <Eye className="w-5 h-5" />
                                    </a>
                                </div>
                            )}
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm shadow-blue-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Save className="w-4 h-4" />
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column: Form (8 cols) */}
                    <div className="lg:col-span-7 space-y-6">

                        {/* 1. Basic Info Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                                <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Basic Information</h2>
                            </div>
                            <div className="p-6 space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                            Full Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={form.name}
                                            onChange={(e) => handleChange('name', e.target.value)}
                                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
                                            placeholder="e.g. John Doe"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                            Job Title
                                        </label>
                                        <input
                                            type="text"
                                            value={form.job_title}
                                            onChange={(e) => handleChange('job_title', e.target.value)}
                                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
                                            placeholder="e.g. Senior Developer"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                            Company
                                        </label>
                                        <input
                                            type="text"
                                            value={form.company}
                                            onChange={(e) => handleChange('company', e.target.value)}
                                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
                                            placeholder="e.g. Acme Inc."
                                        />
                                    </div>

                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                            URL Slug <span className="text-red-500">*</span>
                                        </label>
                                        <div className="flex rounded-lg shadow-sm">
                                            <span className="inline-flex items-center px-4 rounded-l-lg border border-r-0 border-slate-200 bg-slate-100 text-slate-500 text-sm">
                                                /card/
                                            </span>
                                            <input
                                                type="text"
                                                value={form.slug}
                                                onChange={(e) => handleChange('slug', e.target.value)}
                                                disabled={isEdit}
                                                className="flex-1 min-w-0 block w-full px-4 py-2.5 rounded-none rounded-r-lg border border-slate-200 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all disabled:bg-slate-50 disabled:text-slate-500 placeholder:text-slate-400"
                                                placeholder="john-doe"
                                            />
                                        </div>
                                        {isEdit && <p className="mt-1.5 text-xs text-slate-400">Slug cannot be changed once created.</p>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 2. Contact Info Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                                <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Contact Details</h2>
                            </div>
                            <div className="p-6 space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                                        <input
                                            type="email"
                                            value={form.email}
                                            onChange={(e) => handleChange('email', e.target.value)}
                                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone</label>
                                        <input
                                            type="tel"
                                            value={form.phone}
                                            onChange={(e) => handleChange('phone', e.target.value)}
                                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
                                            placeholder="+1 234 567 890"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1.5">WhatsApp</label>
                                        <input
                                            type="tel"
                                            value={form.whatsapp}
                                            onChange={(e) => handleChange('whatsapp', e.target.value)}
                                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
                                            placeholder="+1 234 567 890"
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Website</label>
                                        <input
                                            type="url"
                                            value={form.website}
                                            onChange={(e) => handleChange('website', e.target.value)}
                                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
                                            placeholder="https://example.com"
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Address</label>
                                        <input
                                            type="text"
                                            value={form.address}
                                            onChange={(e) => handleChange('address', e.target.value)}
                                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
                                            placeholder="123 Street, City, Country"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 3. About Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                                <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Profile & Bio</h2>
                            </div>
                            <div className="p-6 space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Bio</label>
                                    <textarea
                                        value={form.bio}
                                        onChange={(e) => handleChange('bio', e.target.value)}
                                        rows={4}
                                        maxLength={500}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 resize-y"
                                        placeholder="Tell us a bit about yourself..."
                                    />
                                    <div className="flex justify-end mt-1">
                                        <span className="text-xs text-slate-400">{form.bio.length}/500</span>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Photo URL</label>
                                    <div className="flex gap-3">
                                        <input
                                            type="url"
                                            value={form.photo_url}
                                            onChange={(e) => handleChange('photo_url', e.target.value)}
                                            className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
                                            placeholder="https://example.com/photo.jpg"
                                        />
                                        <Link to="/dashboard/media" target="_blank" className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-sm font-medium transition-colors">
                                            Library
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 4. Social Links */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                                <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Social Media</h2>
                            </div>
                            <div className="p-6">
                                <SocialLinksEditor
                                    links={form.social_links}
                                    onChange={(links) => handleChange('social_links', links)}
                                />
                            </div>
                        </div>

                        {/* 5. Customization */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                                <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Customization</h2>
                            </div>
                            <div className="p-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Theme Color</label>
                                    <div className="flex items-center gap-4">
                                        <div className="relative">
                                            <input
                                                type="color"
                                                value={form.theme_color}
                                                onChange={(e) => handleChange('theme_color', e.target.value)}
                                                className="w-12 h-12 rounded-lg border-0 p-0 cursor-pointer overflow-hidden shadow-sm"
                                            />
                                            <div className="absolute inset-0 rounded-lg ring-1 ring-inset ring-black/10 pointer-events-none"></div>
                                        </div>
                                        <input
                                            type="text"
                                            value={form.theme_color}
                                            onChange={(e) => handleChange('theme_color', e.target.value)}
                                            className="w-32 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-sm font-mono focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all uppercase"
                                            placeholder="#6366F1"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Right Column: Preview (5 cols) - Sticky */}
                    <div className="lg:col-span-5">
                        <div className="sticky top-24 space-y-4">
                            <div className="bg-white rounded-xl p-1 shadow-md border border-slate-200">
                                <div className="bg-slate-50 rounded-lg p-6 flex flex-col items-center">
                                    <p className="text-slate-500 text-sm font-medium mb-4 flex items-center gap-2">
                                        <Eye className="w-4 h-4" /> Live Mobile Preview
                                    </p>
                                    <div className="relative w-[320px] h-[640px] bg-white rounded-[2.5rem] shadow-xl border-[8px] border-slate-900 overflow-hidden ring-1 ring-slate-900/5">
                                        {/* Status Bar Mockup */}
                                        <div className="absolute top-0 inset-x-0 h-6 bg-black z-20 flex justify-between px-6 items-center">
                                            <div className="text-[10px] text-white font-medium">9:41</div>
                                            <div className="flex gap-1.5">
                                                <div className="w-3 h-3 bg-white rounded-full opacity-20"></div>
                                                <div className="w-3 h-3 bg-white rounded-full opacity-20"></div>
                                            </div>
                                        </div>

                                        {/* Preview Content */}
                                        <div className="h-full overflow-y-auto scrollbar-hide pt-6 bg-slate-50">
                                            <VCardPreview vcard={form} />
                                        </div>
                                    </div>
                                </div>
                            </div>
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
