import {
    LayoutDashboard,
    Grid3x3,
    MessageSquare,
    DollarSign,
    Zap,
    Mail,
    Plus,
    Type,
    Image as ImageIcon,
    Square,
    MousePointer,
    Wand2,
    Sparkles
} from 'lucide-react';
import { useEditorStore } from '../../store/editorStore';

const sectionTemplates = [
    { type: 'hero', label: 'Hero', icon: LayoutDashboard, color: 'blue' },
    { type: 'features', label: 'Features', icon: Grid3x3, color: 'green' },
    { type: 'testimonials', label: 'Testimonials', icon: MessageSquare, color: 'purple' },
    { type: 'pricing', label: 'Pricing', icon: DollarSign, color: 'yellow' },
    { type: 'cta', label: 'Call to Action', icon: Zap, color: 'red' },
    { type: 'contact', label: 'Contact', icon: Mail, color: 'indigo' },
];

const elementTypes = [
    { type: 'heading', label: 'Heading', icon: Type },
    { type: 'text', label: 'Text', icon: Type },
    { type: 'button', label: 'Button', icon: MousePointer },
    { type: 'image', label: 'Image', icon: ImageIcon },
    { type: 'spacer', label: 'Spacer', icon: Square },
];

interface LeftToolbarProps {
    onAIClick?: () => void;
}

export default function LeftToolbar({ onAIClick }: LeftToolbarProps) {
    const { addSection, selectedId, selectedType } = useEditorStore();

    return (
        <div className="p-4">
            {/* AI Section Generator - Prominent CTA */}
            {onAIClick && (
                <div className="mb-6">
                    <button
                        onClick={onAIClick}
                        className="w-full flex items-center justify-center px-4 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl group"
                    >
                        <Wand2 className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                        <span className="font-semibold">Generate with AI</span>
                        <Sparkles className="w-4 h-4 ml-2" />
                    </button>
                </div>
            )}

            <div className="mb-6">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Add Sections
                </h3>
                <div className="space-y-2">
                    {sectionTemplates.map((template) => {
                        const Icon = template.icon;
                        return (
                            <button
                                key={template.type}
                                onClick={() => addSection(template.type)}
                                className={`
                  w-full flex items-center px-3 py-2 rounded-lg transition-colors text-left
                  border border-gray-200 hover:border-${template.color}-500 hover:bg-${template.color}-50
                  group
                `}
                            >
                                <div className={`p-1.5 rounded bg-${template.color}-100 text-${template.color}-600 mr-3`}>
                                    <Icon className="w-4 h-4" />
                                </div>
                                <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                                    {template.label}
                                </span>
                                <Plus className="w-4 h-4 ml-auto text-gray-400 group-hover:text-gray-600" />
                            </button>
                        );
                    })}
                </div>
            </div>

            {selectedId && selectedType === 'section' && (
                <div className="mb-6">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                        Add Elements
                    </h3>
                    <p className="text-xs text-gray-600 mb-3">
                        Click an element to add it to the selected section
                    </p>
                    <div className="space-y-2">
                        {elementTypes.map((element) => {
                            const Icon = element.icon;
                            return (
                                <button
                                    key={element.type}
                                    onClick={() => {
                                        if (selectedId) {
                                            const { addElement } = useEditorStore.getState();
                                            addElement(selectedId, element.type);
                                        }
                                    }}
                                    className="w-full flex items-center px-3 py-2 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-colors text-left group"
                                >
                                    <Icon className="w-4 h-4 text-gray-600 group-hover:text-blue-600 mr-3" />
                                    <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                                        {element.label}
                                    </span>
                                    <Plus className="w-4 h-4 ml-auto text-gray-400 group-hover:text-gray-600" />
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {!selectedId && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-xs text-gray-600">
                        💡 <strong>Tip:</strong> Click on a section to add elements to it
                    </p>
                </div>
            )}
        </div>
    );
}
