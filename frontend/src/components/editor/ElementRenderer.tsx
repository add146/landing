import { Trash2 } from 'lucide-react';
import { useEditorStore } from '../../store/editorStore';

interface ElementRendererProps {
    element: any;
}

export default function ElementRenderer({ element }: ElementRendererProps) {
    const { selectedId, selectedType, selectItem, deleteElement, updateElement } = useEditorStore();

    const isSelected = selectedId === element.id && selectedType === 'element';
    const content = typeof element.content === 'string'
        ? JSON.parse(element.content || '{}')
        : element.content || {};

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
                        className="font-bold text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 -mx-2"
                        style={{
                            fontSize: content.level === 'h1' ? '2.5rem' : content.level === 'h3' ? '1.5rem' : '2rem',
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
                        className="text-gray-700 outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 -mx-2"
                    >
                        {content.text || 'Paragraph text'}
                    </p>
                );

            case 'button':
                return (
                    <button
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                        onClick={(e) => e.preventDefault()}
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
                    />
                ) : (
                    <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                        <p className="text-gray-500">Click to upload image</p>
                    </div>
                );

            case 'spacer':
                return (
                    <div
                        style={{ height: content.height || 40 }}
                        className="w-full bg-gray-100 border-2 border-dashed border-gray-300 rounded flex items-center justify-center text-xs text-gray-500"
                    >
                        {content.height || 40}px spacer
                    </div>
                );

            case 'divider':
                return <hr className="border-gray-300" />;

            default:
                return (
                    <div className="p-4 bg-gray-100 rounded border border-gray-300 text-sm text-gray-600">
                        {element.element_type} element (not implemented yet)
                    </div>
                );
        }
    };

    return (
        <div
            onClick={handleClick}
            className={`
        relative group transition-all
        ${isSelected ? 'ring-2 ring-blue-500 rounded' : ''}
      `}
        >
            {/* Element Controls */}
            {isSelected && (
                <div className="absolute -top-8 left-0 z-10 flex items-center space-x-1 bg-blue-600 text-white px-2 py-1 rounded text-xs">
                    <span className="font-medium">{element.element_type}</span>
                    <button
                        onClick={handleDelete}
                        className="ml-2 p-1 hover:bg-blue-700 rounded"
                        title="Delete element"
                    >
                        <Trash2 className="w-3 h-3" />
                    </button>
                </div>
            )}

            {renderElement()}
        </div>
    );
}
