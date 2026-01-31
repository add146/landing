import {
    Type,
    Image as ImageIcon,
    MousePointerClick,
    Box,
    Maximize2,
    Minus,
    Smile,
    LayoutDashboard,
    Grid3x3,
    MessageSquare,
    Wand2,
    Search
} from 'lucide-react';
import { useEditorStore } from '../../store/editorStore';
import { useState } from 'react';

interface LeftToolbarProps {
    onAIClick?: () => void;
}

interface ToolbarItem {
    type: string;
    label: string;
    icon: any;
    action?: () => void;
    isSpecial?: boolean;
}

interface ToolbarCategory {
    title: string;
    items: ToolbarItem[];
}

export default function LeftToolbar({ onAIClick }: LeftToolbarProps) {
    const { addSection, addElement, selectedId, selectedType } = useEditorStore();
    const [searchTerm, setSearchTerm] = useState('');

    const handleAddSection = (type: string) => {
        addSection(type);
    };

    const handleAddElement = (type: string) => {
        if (selectedId && selectedType === 'section') {
            addElement(selectedId, type);
        } else {
            alert('Please select a section first to add an element.');
        }
    };

    const categories: ToolbarCategory[] = [
        {
            title: 'Basic',
            items: [
                { type: 'heading', label: 'Heading', icon: Type, action: () => handleAddElement('heading') },
                { type: 'text', label: 'Text', icon: Type, action: () => handleAddElement('text') },
                { type: 'image', label: 'Image', icon: ImageIcon, action: () => handleAddElement('image') },
                { type: 'button', label: 'Button', icon: MousePointerClick, action: () => handleAddElement('button') },
            ]
        },
        {
            title: 'General',
            items: [
                { type: 'container', label: 'Container', icon: Box, action: () => handleAddElement('container') },
                { type: 'spacer', label: 'Spacer', icon: Maximize2, action: () => handleAddElement('spacer') },
                { type: 'divider', label: 'Divider', icon: Minus, action: () => handleAddElement('divider') },
                { type: 'icon', label: 'Icon', icon: Smile, action: () => handleAddElement('icon') },
            ]
        },
        {
            title: 'Section',
            items: [
                { type: 'hero', label: 'Hero', icon: LayoutDashboard, action: () => handleAddSection('hero') },
                { type: 'features', label: 'Features', icon: Grid3x3, action: () => handleAddSection('features') },
                { type: 'testimonials', label: 'Testimonial', icon: MessageSquare, action: () => handleAddSection('testimonials') },
            ]
        },
        {
            title: 'AI Tools',
            items: [
                { type: 'ai-gen', label: 'AI Section Gen', icon: Wand2, action: onAIClick, isSpecial: true }
            ]
        }
    ];

    const filteredCategories = categories.map(cat => ({
        ...cat,
        items: cat.items.filter(item => item.label.toLowerCase().includes(searchTerm.toLowerCase()))
    })).filter(cat => cat.items.length > 0);

    return (
        <div className="flex flex-col h-full bg-white border-r border-slate-200">
            {/* Search */}
            <div className="p-4 border-b border-slate-100">
                <div className="relative">
                    <Search className="absolute left-3 top-2.5 text-slate-400 w-5 h-5" />
                    <input
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-700 placeholder:text-slate-400"
                        placeholder="Find elements..."
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {filteredCategories.map((category, idx) => (
                    <div key={idx}>
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                            {category.title}
                        </h3>
                        <div className={`grid ${category.title === 'AI Tools' ? 'grid-cols-1' : 'grid-cols-2'} gap-2`}>
                            {category.items.map((item, itemIdx) => {
                                const Icon = item.icon;
                                return (
                                    <div
                                        key={itemIdx}
                                        onClick={item.action}
                                        className={`
                                            group flex ${category.title === 'AI Tools' ? 'flex-row items-center gap-3' : 'flex-col items-center justify-center'} 
                                            p-3 rounded-lg border border-slate-200 hover:border-primary/50 hover:bg-slate-50 cursor-pointer transition-all
                                        `}
                                    >
                                        <Icon className={`${item.isSpecial ? 'text-primary' : 'text-slate-500 group-hover:text-primary'} ${category.title === 'AI Tools' ? 'mb-0' : 'mb-2 h-6 w-6'}`} />
                                        <span className="text-xs font-medium text-slate-600">
                                            {item.label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
