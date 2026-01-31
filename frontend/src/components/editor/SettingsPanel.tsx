import { Settings, Palette, Smartphone, Wand2, Type, AlignLeft, AlignCenter, AlignRight, AlignJustify, Trash2, ChevronDown, ChevronUp, Box } from 'lucide-react';
import { useState } from 'react';
import { useEditorStore } from '../../store/editorStore';
import ContentImproverModal from './ContentImproverModal';

export default function SettingsPanel() {
    const { selectedId, selectedType, sections, elements, updateElement, deleteElement, deleteSection } = useEditorStore();
    const [activeTab, setActiveTab] = useState<'content' | 'style' | 'advanced'>('content');
    const [showImprover, setShowImprover] = useState(false);
    const [improverField, setImproverField] = useState<string | null>(null);
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({ typography: true, spacing: false });

    if (!selectedId || !selectedType) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-6 bg-slate-50">
                <Settings className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                <h3 className="text-sm font-medium text-slate-900 mb-1">
                    No selection
                </h3>
                <p className="text-xs text-slate-500">
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

    // Helper to get style object safely
    const getStyle = () => {
        return typeof selectedItem.style_desktop === 'string'
            ? JSON.parse(selectedItem.style_desktop || '{}')
            : selectedItem.style_desktop || {};
    };

    const style = getStyle();

    const handleContentUpdate = (key: string, value: any) => {
        if (selectedType === 'element') {
            updateElement(selectedId, {
                content: JSON.stringify({ ...content, [key]: value }),
            });
        }
    };

    const handleStyleUpdate = (key: string, value: any) => {
        if (selectedType === 'element') {
            const newStyle = { ...style, [key]: value };
            updateElement(selectedId, {
                style_desktop: JSON.stringify(newStyle),
            });
        }
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this item?')) {
            if (selectedType === 'element') {
                deleteElement(selectedId);
            } else {
                deleteSection(selectedId);
            }
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

    const toggleSection = (section: string) => {
        setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const tabs = [
        { id: 'content', label: 'Content', icon: Settings },
        { id: 'style', label: 'Style', icon: Palette },
        { id: 'advanced', label: 'Advanced', icon: Smartphone },
    ] as const;

    return (
        <div className="flex flex-col h-full bg-white border-l border-slate-200 shadow-[-5px_0_15px_rgba(0,0,0,0.02)]">
            {/* Header */}
            <div className="p-3 border-b border-slate-100">
                <div className="flex bg-slate-100 p-1 rounded-lg">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`
                                flex-1 py-1.5 text-xs font-bold uppercase tracking-wide rounded-md text-center transition-colors
                                ${activeTab === tab.id
                                    ? 'bg-white shadow-sm text-slate-900'
                                    : 'text-slate-500 hover:text-slate-700'
                                }
                            `}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Selected Element Indicator */}
            <div className="px-4 pt-4">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Selected {selectedType === 'section' ? 'Section' : 'Element'}</span>
                    <span className="text-sm font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20 flex items-center gap-1 capitalize">
                        {selectedItem.element_type || selectedItem.section_type}
                    </span>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {activeTab === 'content' && selectedType === 'element' && (
                    <div className="space-y-4">
                        {/* Common Text Input for elements with text */}
                        {(content.text !== undefined) && (
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <label className="block text-sm font-medium text-slate-700">Text</label>
                                    <button
                                        onClick={() => openImprover('text')}
                                        className="text-xs flex items-center text-primary hover:text-primary-dark font-medium px-2 py-1 bg-primary/5 rounded"
                                    >
                                        <Wand2 className="w-3 h-3 mr-1" />
                                        AI Improve
                                    </button>
                                </div>
                                {selectedItem.element_type === 'text' ? (
                                    <textarea
                                        value={content.text || ''}
                                        onChange={(e) => handleContentUpdate('text', e.target.value)}
                                        rows={6}
                                        className="w-full rounded-lg border-slate-200 bg-slate-50 text-slate-700 text-sm focus:border-primary focus:ring-primary p-3"
                                    />
                                ) : (
                                    <input
                                        type="text"
                                        value={content.text || ''}
                                        onChange={(e) => handleContentUpdate('text', e.target.value)}
                                        className="w-full rounded-lg border-slate-200 bg-slate-50 text-slate-700 text-sm focus:border-primary focus:ring-primary px-3 py-2"
                                    />
                                )}
                            </div>
                        )}

                        {/* Button Specifics */}
                        {selectedItem.element_type === 'button' && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Link URL
                                    </label>
                                    <input
                                        type="url"
                                        value={content.link || ''}
                                        onChange={(e) => handleContentUpdate('link', e.target.value)}
                                        placeholder="https://"
                                        className="w-full rounded-lg border-slate-200 bg-slate-50 text-slate-700 text-sm focus:border-primary focus:ring-primary px-3 py-2"
                                    />
                                </div>
                            </>
                        )}

                        {/* Heading Level */}
                        {selectedItem.element_type === 'heading' && (
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Level
                                </label>
                                <select
                                    value={content.level || 'h2'}
                                    onChange={(e) => handleContentUpdate('level', e.target.value)}
                                    className="w-full rounded-lg border-slate-200 bg-slate-50 text-slate-700 text-sm focus:border-primary focus:ring-primary px-3 py-2"
                                >
                                    {[1, 2, 3, 4, 5, 6].map(l => (
                                        <option key={l} value={`h${l}`}>Heading {l}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Image Src */}
                        {selectedItem.element_type === 'image' && (
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Image URL
                                </label>
                                <input
                                    type="text"
                                    value={content.src || ''}
                                    onChange={(e) => handleContentUpdate('src', e.target.value)}
                                    className="w-full rounded-lg border-slate-200 bg-slate-50 text-slate-700 text-sm focus:border-primary focus:ring-primary px-3 py-2"
                                />
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'style' && selectedType === 'element' && (
                    <div className="space-y-4">
                        {/* Typography Section (Only for text-based elements) */}
                        {['heading', 'text', 'button'].includes(selectedItem.element_type) && (
                            <div className="border border-slate-200 rounded-lg overflow-hidden">
                                <button
                                    onClick={() => toggleSection('typography')}
                                    className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 transition-colors"
                                >
                                    <div className="flex items-center gap-2">
                                        <Type className="w-4 h-4 text-slate-400" />
                                        <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">Typography</span>
                                    </div>
                                    {expandedSections.typography ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                                </button>

                                {expandedSections.typography && (
                                    <div className="p-3 space-y-4 bg-white border-t border-slate-200">
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="text-[10px] text-slate-400 mb-1 block">Font Family</label>
                                                <select
                                                    value={style.fontFamily || 'Inter'}
                                                    onChange={(e) => handleStyleUpdate('fontFamily', e.target.value)}
                                                    className="w-full rounded-md border-slate-200 bg-slate-50 text-xs py-1.5 focus:ring-1 focus:ring-primary"
                                                >
                                                    <option value="Inter">Inter</option>
                                                    <option value="Roboto">Roboto</option>
                                                    <option value="Playfair Display">Playfair Display</option>
                                                    <option value="Montserrat">Montserrat</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="text-[10px] text-slate-400 mb-1 block">Weight</label>
                                                <select
                                                    value={style.fontWeight || '400'}
                                                    onChange={(e) => handleStyleUpdate('fontWeight', e.target.value)}
                                                    className="w-full rounded-md border-slate-200 bg-slate-50 text-xs py-1.5 focus:ring-1 focus:ring-primary"
                                                >
                                                    <option value="300">Light</option>
                                                    <option value="400">Regular</option>
                                                    <option value="500">Medium</option>
                                                    <option value="600">Semi Bold</option>
                                                    <option value="700">Bold</option>
                                                    <option value="900">Black</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div>
                                            <div className="flex justify-between mb-1">
                                                <label className="text-[10px] text-slate-400">Size</label>
                                                <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 rounded">
                                                    {style.fontSize ? parseInt(style.fontSize) : 16}px
                                                </span>
                                            </div>
                                            <input
                                                type="range"
                                                min="10"
                                                max="96"
                                                value={style.fontSize ? parseInt(style.fontSize) : 16}
                                                onChange={(e) => handleStyleUpdate('fontSize', `${e.target.value}px`)}
                                                className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
                                            />
                                        </div>

                                        <div>
                                            <div className="flex justify-between mb-1">
                                                <label className="text-[10px] text-slate-400">Line Height</label>
                                                <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 rounded">
                                                    {style.lineHeight || 1.5}
                                                </span>
                                            </div>
                                            <input
                                                type="range"
                                                min="0.8"
                                                max="2.5"
                                                step="0.1"
                                                value={style.lineHeight || 1.5}
                                                onChange={(e) => handleStyleUpdate('lineHeight', e.target.value)}
                                                className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-[10px] text-slate-400 mb-1 block">Color</label>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="color"
                                                    value={style.color || '#000000'}
                                                    onChange={(e) => handleStyleUpdate('color', e.target.value)}
                                                    className="w-8 h-8 p-0 border-0 rounded cursor-pointer"
                                                />
                                                <input
                                                    type="text"
                                                    value={style.color || '#000000'}
                                                    onChange={(e) => handleStyleUpdate('color', e.target.value)}
                                                    className="flex-1 rounded-md border-slate-200 bg-slate-50 text-xs py-1.5 font-mono uppercase text-slate-500 focus:ring-1 focus:ring-primary"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-[10px] text-slate-400 mb-1 block">Alignment</label>
                                            <div className="flex bg-slate-100 rounded p-1">
                                                {[
                                                    { val: 'left', icon: AlignLeft },
                                                    { val: 'center', icon: AlignCenter },
                                                    { val: 'right', icon: AlignRight },
                                                    { val: 'justify', icon: AlignJustify }
                                                ].map((align) => (
                                                    <button
                                                        key={align.val}
                                                        onClick={() => handleStyleUpdate('textAlign', align.val)}
                                                        className={`
                                                            flex-1 flex justify-center py-1 rounded transition-colors
                                                            ${style.textAlign === align.val ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400 hover:text-slate-600'}
                                                        `}
                                                    >
                                                        <align.icon className="w-4 h-4" />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Layout Section (Margin/Padding) - For all elements */}
                        <div className="border border-slate-200 rounded-lg overflow-hidden">
                            <button
                                onClick={() => toggleSection('layout')}
                                className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 transition-colors"
                            >
                                <div className="flex items-center gap-2">
                                    <Box className="w-4 h-4 text-slate-400" />
                                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">Layout</span>
                                </div>
                                {expandedSections.layout ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                            </button>

                            {expandedSections.layout && (
                                <div className="p-3 space-y-4 bg-white border-t border-slate-200">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-[10px] text-slate-400 mb-1 block">Padding (px)</label>
                                            <input
                                                type="text"
                                                value={style.padding || ''}
                                                onChange={(e) => handleStyleUpdate('padding', e.target.value)}
                                                placeholder="e.g. 10px 20px"
                                                className="w-full rounded-md border-slate-200 bg-slate-50 text-xs py-1.5 focus:ring-1 focus:ring-primary"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] text-slate-400 mb-1 block">Margin (px)</label>
                                            <input
                                                type="text"
                                                value={style.margin || ''}
                                                onChange={(e) => handleStyleUpdate('margin', e.target.value)}
                                                placeholder="e.g. 10px 0"
                                                className="w-full rounded-md border-slate-200 bg-slate-50 text-xs py-1.5 focus:ring-1 focus:ring-primary"
                                            />
                                        </div>
                                    </div>
                                    {selectedItem.element_type === 'container' && (
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="text-[10px] text-slate-400 mb-1 block">Gap (px)</label>
                                                <input
                                                    type="text"
                                                    value={content.gap || '10px'}
                                                    onChange={(e) => handleContentUpdate('gap', e.target.value)}
                                                    className="w-full rounded-md border-slate-200 bg-slate-50 text-xs py-1.5 focus:ring-1 focus:ring-primary"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[10px] text-slate-400 mb-1 block">Direction</label>
                                                <select
                                                    value={content.direction || 'column'}
                                                    onChange={(e) => handleContentUpdate('direction', e.target.value)}
                                                    className="w-full rounded-md border-slate-200 bg-slate-50 text-xs py-1.5 focus:ring-1 focus:ring-primary"
                                                >
                                                    <option value="column">Vertical</option>
                                                    <option value="row">Horizontal</option>
                                                </select>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Background & Border */}
                        <div className="border border-slate-200 rounded-lg overflow-hidden">
                            <button
                                onClick={() => toggleSection('decoration')}
                                className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 transition-colors"
                            >
                                <div className="flex items-center gap-2">
                                    <Palette className="w-4 h-4 text-slate-400" />
                                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">Decoration</span>
                                </div>
                                {expandedSections.decoration ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                            </button>

                            {expandedSections.decoration && (
                                <div className="p-3 space-y-4 bg-white border-t border-slate-200">
                                    <div>
                                        <label className="text-[10px] text-slate-400 mb-1 block">Background Color</label>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="color"
                                                value={style.backgroundColor || '#ffffff'}
                                                onChange={(e) => handleStyleUpdate('backgroundColor', e.target.value)}
                                                className="w-8 h-8 p-0 border-0 rounded cursor-pointer"
                                            />
                                            <input
                                                type="text"
                                                value={style.backgroundColor || ''}
                                                onChange={(e) => handleStyleUpdate('backgroundColor', e.target.value)}
                                                placeholder="transparent"
                                                className="flex-1 rounded-md border-slate-200 bg-slate-50 text-xs py-1.5 font-mono uppercase text-slate-500 focus:ring-1 focus:ring-primary"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-[10px] text-slate-400 mb-1 block">Border Radius (px)</label>
                                        <input
                                            type="text"
                                            value={style.borderRadius || ''}
                                            onChange={(e) => handleStyleUpdate('borderRadius', e.target.value)}
                                            className="w-full rounded-md border-slate-200 bg-slate-50 text-xs py-1.5 focus:ring-1 focus:ring-primary"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'advanced' && (
                    <div className="text-center py-8">
                        <Smartphone className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                        <p className="text-sm text-slate-600">
                            Advanced settings coming soon
                        </p>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="mt-auto p-4 border-t border-slate-100 bg-slate-50/50">
                <button
                    onClick={handleDelete}
                    className="w-full py-2 flex items-center justify-center gap-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
                >
                    <Trash2 className="w-4 h-4" />
                    Delete {selectedType === 'section' ? 'Section' : 'Element'}
                </button>
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
