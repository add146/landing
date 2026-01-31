import { Plus, Trash2 } from 'lucide-react';

interface SocialLink {
    platform: string;
    url: string;
}

interface SocialLinksEditorProps {
    links: SocialLink[];
    onChange: (links: SocialLink[]) => void;
}

const platforms = [
    { value: '', label: 'Select Platform' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'twitter', label: 'Twitter / X' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'facebook', label: 'Facebook' },
    { value: 'github', label: 'GitHub' },
    { value: 'youtube', label: 'YouTube' },
    { value: 'tiktok', label: 'TikTok' },
    { value: 'custom', label: 'Custom URL' },
];

export default function SocialLinksEditor({ links, onChange }: SocialLinksEditorProps) {
    const addLink = () => {
        onChange([...links, { platform: '', url: '' }]);
    };

    const updateLink = (index: number, field: keyof SocialLink, value: string) => {
        const newLinks = [...links];
        newLinks[index] = { ...newLinks[index], [field]: value };
        onChange(newLinks);
    };

    const removeLink = (index: number) => {
        onChange(links.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-3">
            {links.map((link, index) => (
                <div key={index} className="flex items-start space-x-2">
                    <div className="flex-1 space-y-2">
                        <select
                            value={link.platform}
                            onChange={(e) => updateLink(index, 'platform', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            {platforms.map((p) => (
                                <option key={p.value} value={p.value}>
                                    {p.label}
                                </option>
                            ))}
                        </select>
                        <input
                            type="url"
                            value={link.url}
                            onChange={(e) => updateLink(index, 'url', e.target.value)}
                            placeholder="https://..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <button
                        onClick={() => removeLink(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors mt-1"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>
            ))}

            <button
                onClick={addLink}
                className="w-full flex items-center justify-center px-4 py-2 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-blue-500 hover:text-blue-600 transition-colors"
            >
                <Plus className="w-5 h-5 mr-2" />
                Add Social Link
            </button>

            {links.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-2">
                    No social links added yet
                </p>
            )}
        </div>
    );
}
