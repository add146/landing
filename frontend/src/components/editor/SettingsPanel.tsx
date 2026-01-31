import { Settings, Palette, Smartphone, Wand2 } from 'lucide-react';
import { useState } from 'react';
import { useEditorStore } from '../../store/editorStore';
import ContentImproverModal from './ContentImproverModal';

export default function SettingsPanel() {
    const { selectedId, selectedType, sections, elements, updateElement } = useEditorStore();
    const [activeTab, setActiveTab] = useState<'content' | 'style' | 'responsive'>('content');
    const [showImprover, setShowImprover] = useState(false);
    const [improverField, setImproverField] = useState<string | null>(null);

    if (!selectedId || !selectedType) {
        return (
            <div className="p-6 text-center">
                <Settings className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                <h3 className="text-sm font-medium text-gray-900 mb-1">
                    No selection
                </h3>
                <p className="text-xs text-gray-600">
                    Click on a section or element to edit its settings
                </p>
            </div>
        );
    }

    // Get selected item
    let selectedItem: any = null;
    if (selectedType === 'section') {
        selectedItem = sections.find((s) => s.id === selectedId);
    } else if (selectedType === 'element') {
        for (const sectionElements of Object.values(elements)) {
            const el = sectionElements.find((e: any) => e.id === selectedId);
            if (el) {
                selectedItem = el;
                break;
            }
        }
    }

    if (!selectedItem) {
        return null;
    }

    const content = typeof selectedItem.content === 'string'
        ? JSON.parse(selectedItem.content || '{}')
        : selectedItem.content || {};

    const handleContentUpdate = (key: string, value: any) => {
        if (selectedType === 'element') {
            updateElement(selectedId, {
                content: JSON.stringify({ ...content, [key]: value }),
            });
        }
    };

    const openImprover = (field: string) => {
        setImproverField(field);
        setShowImprover(true);
    };

    const handleImproveSave = (improvedText: string) => {
        if (improverField) {
            handleContentUpdate(improverField, improvedText);
            setShowImprover(false);
            setImproverField(null);
        }
    };

    const tabs = [
        { id: 'content', label: 'Content', icon: Settings },
        { id: 'style', label: 'Style', icon: Palette },
        { id: 'responsive', label: 'Responsive', icon: Smartphone },
    ] as const;

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
                <h2 className="text-sm font-semibold text-gray-900">
                    {selectedType === 'section' ? 'Section' : 'Element'} Settings
                </h2>
                <p className="text-xs text-gray-600 mt-1">
                    {selectedType === 'section'
                        ? selectedItem.section_type
                        : selectedItem.element_type}
                </p>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`
                flex-1 flex items-center justify-center px-4 py-3 text-sm font-medium border-b-2 transition-colors
                ${activeTab === tab.id
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                                }
              `}
                        >
                            <Icon className="w-4 h-4 mr-2" />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
                {activeTab === 'content' && selectedType === 'element' && (
                    <div className="space-y-4">
                        {/* Heading Settings */}
                        {selectedItem.element_type === 'heading' && (
                            <>
                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Text
                                        </label>
                                        <button
                                            onClick={() => openImprover('text')}
                                            className="text-xs flex items-center text-purple-600 hover:text-purple-700 font-medium"
                                        >
                                            <Wand2 className="w-3 h-3 mr-1" />
                                            AI Improve
                                        </button>
                                    </div>
                                    <input
                                        type="text"
                                        value={content.text || ''}
                                        onChange={(e) => handleContentUpdate('text', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Level
                                    </label>
                                    <select
                                        value={content.level || 'h2'}
                                        onChange={(e) => handleContentUpdate('level', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="h1">H1 - Largest</option>
                                        <option value="h2">H2 - Large</option>
                                        <option value="h3">H3 - Medium</option>
                                        <option value="h4">H4 - Small</option>
                                        <option value="h5">H5 - Smaller</option>
                                        <option value="h6">H6 - Smallest</option>
                                    </select>
                                </div>
                            </>
                        )}

                        {/* Text Settings */}
                        {selectedItem.element_type === 'text' && (
                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Text
                                    </label>
                                    <button
                                        onClick={() => openImprover('text')}
                                        className="text-xs flex items-center text-purple-600 hover:text-purple-700 font-medium"
                                    >
                                        <Wand2 className="w-3 h-3 mr-1" />
                                        AI Improve
                                    </button>
                                </div>
                                <textarea
                                    value={content.text || ''}
                                    onChange={(e) => handleContentUpdate('text', e.target.value)}
                                    rows={6}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        )}

                        {/* Button Settings */}
                        {selectedItem.element_type === 'button' && (
                            <>
                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Button Text
                                        </label>
                                        <button
                                            onClick={() => openImprover('text')}
                                            className="text-xs flex items-center text-purple-600 hover:text-purple-700 font-medium"
                                        >
                                            <Wand2 className="w-3 h-3 mr-1" />
                                            AI Improve
                                        </button>
                                    </div>
                                    <input
                                        type="text"
                                        value={content.text || ''}
                                        onChange={(e) => handleContentUpdate('text', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Link URL
                                    </label>
                                    <input
                                        type="url"
                                        value={content.link || ''}
                                        onChange={(e) => handleContentUpdate('link', e.target.value)}
                                        placeholder="https://example.com"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Open in
                                    </label>
                                    <select
                                        value={content.target || '_self'}
                                        onChange={(e) => handleContentUpdate('target', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="_self">Same Tab</option>
                                        <option value="_blank">New Tab</option>
                                    </select>
                                </div>
                            </>
                        )}

                        {/* Spacer Settings */}
                        {selectedItem.element_type === 'spacer' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Height (px)
                                </label>
                                <input
                                    type="number"
                                    value={content.height || 40}
                                    onChange={(e) => handleContentUpdate('height', parseInt(e.target.value))}
                                    min="10"
                                    max="500"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'style' && (
                    <div className="text-center py-8">
                        <Palette className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                        <p className="text-sm text-gray-600">
                            Style settings coming soon
                        </p>
                    </div>
                )}

                {activeTab === 'responsive' && (
                    <div className="text-center py-8">
                        <Smartphone className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                        <p className="text-sm text-gray-600">
                            Responsive settings coming soon
                        </p>
                    </div>
                )}
            </div>

            {/* AI Improver Modal */}
            {showImprover && improverField && (
                <ContentImproverModal
                    initialContent={content[improverField] || ''}
                    onClose={() => setShowImprover(false)}
                    onSave={handleImproveSave}
                />
            )}
        </div>
    );
}
