import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import { useEditorStore } from '../../store/editorStore';
import SectionRenderer from './SectionRenderer';

export default function Canvas() {
    const { sections, elements, reorderSections, reorderElements, previewDevice, clearSelection } = useEditorStore();

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8, // 8px movement required to start drag
            },
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over || active.id === over.id) return;

        // Check if it's a section reorder
        const isSection = sections.some(s => s.id === active.id);

        if (isSection) {
            const oldIndex = sections.findIndex((s) => s.id === active.id);
            const newIndex = sections.findIndex((s) => s.id === over.id);

            if (oldIndex !== -1 && newIndex !== -1) {
                const newSections = arrayMove(sections, oldIndex, newIndex);
                reorderSections(newSections);
            }
        } else {
            // It's likely an element reorder
            // Find which section belongs to this element
            // We can iterate over elements keys
            let foundSectionId = null;
            for (const sectionId in elements) {
                if (elements[sectionId].some(e => e.id === active.id)) {
                    foundSectionId = sectionId;
                    break;
                }
            }

            if (foundSectionId) {
                const sectionElements = elements[foundSectionId];
                const oldIndex = sectionElements.findIndex((e) => e.id === active.id);
                const newIndex = sectionElements.findIndex((e) => e.id === over.id);

                if (oldIndex !== -1 && newIndex !== -1) {
                    const newElements = arrayMove(sectionElements, oldIndex, newIndex);
                    reorderElements(foundSectionId, newElements);
                }
            }
        }
    };

    // Device-specific widths
    const deviceWidths = {
        desktop: '100%',
        tablet: '768px',
        mobile: '375px',
    };

    return (
        <div
            className="min-h-full bg-gray-100 p-8"
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    clearSelection();
                }
            }}
        >
            <div
                className="mx-auto bg-white shadow-lg rounded-lg overflow-hidden transition-all duration-300"
                style={{
                    width: deviceWidths[previewDevice],
                    maxWidth: '100%',
                }}
            >
                {sections.length === 0 ? (
                    <div className="py-32 text-center">
                        <Plus className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            No sections yet
                        </h3>
                        <p className="text-gray-600">
                            Add sections from the left toolbar to get started
                        </p>
                    </div>
                ) : (
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={sections.map((s) => s.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            {sections.map((section) => (
                                <SectionRenderer
                                    key={section.id}
                                    section={section}
                                />
                            ))}
                        </SortableContext>
                    </DndContext>
                )}
            </div>
        </div>
    );
}
