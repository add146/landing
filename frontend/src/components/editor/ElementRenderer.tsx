import { Trash2, Box, GripVertical } from 'lucide-react';
import { useEditorStore } from '../../store/editorStore';
import * as Icons from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface ElementRendererProps {
    element: any;
}

export default function ElementRenderer({ element }: ElementRendererProps) {
    const { selectedId, selectedType, selectItem, deleteElement, updateElement } = useEditorStore();

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: element.id });

    const styleDnd = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const isSelected = selectedId === element.id && selectedType === 'element';
    const content = typeof element.content === 'string'
        ? JSON.parse(element.content || '{}')
        : element.content || {};

    // Parse style
    const style = typeof element.style_desktop === 'string'
        ? JSON.parse(element.style_desktop || '{}')
        : element.style_desktop || {};

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        selectItem(element.id, 'element');
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm('Delete this element?')) {
            deleteElement(element.id);
        }
    };

    const handleContentChange = (newContent: any) => {
        updateElement(element.id, {
            content: JSON.stringify({ ...content, ...newContent }),
        });
    };

    const renderElement = () => {
        switch (element.element_type) {
            case 'heading':
                const HeadingTag = (content.level || 'h2') as keyof JSX.IntrinsicElements;
                return (
                    <HeadingTag
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => handleContentChange({ text: e.currentTarget.textContent })}
                        className="font-bold text-slate-900 outline-none focus:ring-2 focus:ring-primary rounded px-2 -mx-2 hover:bg-slate-50/50"
                        style={{
                            ...style,
                            fontSize: style.fontSize || (content.level === 'h1' ? '2.5rem' : content.level === 'h3' ? '1.5rem' : '2rem'),
                        }}
                    >
                        {content.text || 'Heading'}
                    </HeadingTag>
                );

            case 'text':
                return (
                    <p
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => handleContentChange({ text: e.currentTarget.textContent })}
                        className="text-slate-700 outline-none focus:ring-2 focus:ring-primary rounded px-2 -mx-2 hover:bg-slate-50/50"
                        style={style}
                    >
                        {content.text || 'Paragraph text'}
                    </p>
                );

            case 'button':
                return (
                    <button
                        className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors"
                        onClick={(e) => e.preventDefault()}
                        style={style}
                    >
                        {content.text || 'Button Text'}
                    </button>
                );

            case 'image':
                return content.src ? (
                    <img
                        src={content.src}
                        alt={content.alt || 'Image'}
                        className="max-w-full h-auto rounded-lg"
                        style={style}
                    />
                ) : (
                    <div className="w-full h-64 bg-slate-100 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center" style={style}>
                        <div className="text-center">
                            <p className="text-slate-500 text-sm">Click to set image URL in settings</p>
                        </div>
                    </div>
                );

            case 'container':
                return (
                    <div
                        className="min-h-[100px] border border-dashed border-slate-200 rounded p-4 bg-slate-50/30"
                        style={{
                            display: 'flex',
                            flexDirection: content.direction || 'column',
                            gap: content.gap || '10px',
                            padding: content.padding || '20px',
                            ...style,
                        }}
                    >
                        <div className="flex items-center justify-center h-full text-slate-400 text-sm">
                            <Box className="w-4 h-4 mr-2" />
                            Container (Nested elements not supported in flat mode yet)
                        </div>
                    </div>
                );

            case 'spacer':
                return (
                    <div
                        style={{ height: content.height || 40, ...style }}
                        className="w-full flex items-center justify-center"
                    >
                        <div className="w-full h-full border border-transparent hover:border-slate-200 hover:bg-slate-50/50 transition-colors" />
                    </div>
                );

            case 'divider':
                return (
                    <div className="py-2" style={style}>
                        <hr
                            className="border-slate-300"
                            style={{
                                borderStyle: content.style || 'solid',
                                borderColor: content.color,
                                borderWidth: content.thickness ? `${content.thickness}px` : undefined
                            }}
                        />
                    </div>
                );

            case 'icon':
                const IconComponent = (Icons as any)[content.name || 'Star'] || Icons.Star;
                return (
                    <div style={style} className="inline-block">
                        <IconComponent
                            size={content.size || 24}
                            color={content.color || 'currentColor'}
                        />
                    </div>
                );

            default:
                return (
                    <div className="p-4 bg-red-50 rounded border border-red-200 text-sm text-red-600">
                        Unknown element: {element.element_type}
                    </div>
                );
        }
    };

    return (
        <div
            ref={setNodeRef}
            style={styleDnd}
            onClick={handleClick}
            className={`
                relative group transition-all my-1
                ${isSelected ? 'ring-2 ring-primary ring-offset-2 rounded z-10' : 'hover:ring-1 hover:ring-primary/30'}
            `}
        >
            {/* Element Controls */}
            <div className={`
                absolute -top-7 right-0 z-20 flex items-center space-x-1 bg-primary text-white px-2 py-0.5 rounded-t text-xs shadow-sm
                opacity-0 group-hover:opacity-100 transition-opacity
                ${isSelected ? 'opacity-100 transition-none' : ''}
            `}>
                <span className="cursor-grab active:cursor-grabbing mr-1" {...attributes} {...listeners}>
                    <GripVertical className="w-3 h-3 text-white/70 hover:text-white" />
                </span>
                <span className="font-medium mr-2 uppercase text-[10px] tracking-wider border-l border-white/20 pl-2">{element.element_type}</span>
                <button
                    onClick={handleDelete}
                    className="p-1 hover:bg-primary-dark rounded transition-colors"
                    title="Delete element"
                >
                    <Trash2 className="w-3 h-3" />
                </button>
            </div>

            {renderElement()}
        </div>
    );
}
