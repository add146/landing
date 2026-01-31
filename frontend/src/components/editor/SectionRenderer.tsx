import { useSortable, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2 } from 'lucide-react';
import { useEditorStore } from '../../store/editorStore';
import ElementRenderer from './ElementRenderer';

interface SectionRendererProps {
    section: any;
}

export default function SectionRenderer({ section }: SectionRendererProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: section.id });

    const {
        elements,
        selectedId,
        selectedType,
        selectItem,
        deleteSection,
    } = useEditorStore();

    const sectionElements = elements[section.id] || [];
    const isSelected = selectedId === section.id && selectedType === 'section';

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        selectItem(section.id, 'section');
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm('Delete this section and all its elements?')) {
            deleteSection(section.id);
        }
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            onClick={handleClick}
            className={`
        relative group border-2 transition-all
        ${isSelected
                    ? 'border-blue-500 bg-blue-50/50'
                    : 'border-transparent hover:border-gray-300'
                }
      `}
        >
            {/* Section Controls */}
            <div className={`
        absolute top-2 right-2 z-10 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity
        ${isSelected ? 'opacity-100' : ''}
      `}>
                <button
                    {...attributes}
                    {...listeners}
                    className="p-1.5 bg-white rounded border border-gray-300 hover:bg-gray-50 cursor-grab active:cursor-grabbing"
                    title="Drag to reorder"
                >
                    <GripVertical className="w-4 h-4 text-gray-600" />
                </button>
                <button
                    onClick={handleDelete}
                    className="p-1.5 bg-white rounded border border-gray-300 hover:bg-red-50 hover:border-red-300 hover:text-red-600"
                    title="Delete section"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>

            {/* Section Label */}
            {isSelected && (
                <div className="absolute top-2 left-2 z-10 px-2 py-1 bg-blue-600 text-white text-xs font-medium rounded">
                    {section.section_type.charAt(0).toUpperCase() + section.section_type.slice(1)} Section
                </div>
            )}

            {/* Section Content */}
            <div className="p-8">
                {sectionElements.length === 0 ? (
                    <div className="py-12 text-center border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                        <p className="text-sm text-gray-600">
                            Click "+ Add Elements" in the left sidebar to add content
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <SortableContext items={sectionElements.map(e => e.id)} strategy={verticalListSortingStrategy}>
                            {sectionElements.map((element) => (
                                <ElementRenderer
                                    key={element.id}
                                    element={element}
                                />
                            ))}
                        </SortableContext>
                    </div>
                )}
            </div>
        </div>
    );
}
