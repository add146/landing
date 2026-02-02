import { useState, useRef, useEffect } from 'react';

interface FloatingLayersPanelProps {
    onClose?: () => void;
}

export default function FloatingLayersPanel({ onClose }: FloatingLayersPanelProps) {
    const [position, setPosition] = useState({ x: 100, y: 100 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const panelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (isDragging) {
                setPosition({
                    x: e.clientX - dragOffset.x,
                    y: e.clientY - dragOffset.y
                });
            }
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, dragOffset]);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (panelRef.current) {
            const rect = panelRef.current.getBoundingClientRect();
            setDragOffset({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            });
            setIsDragging(true);
        }
    };

    return (
        <div
            ref={panelRef}
            className="fixed bg-white rounded-lg shadow-2xl border border-slate-200 z-50"
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
                width: '280px',
                maxHeight: '500px'
            }}
        >
            {/* Header - Draggable */}
            <div
                className="px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-t-lg cursor-move flex items-center justify-between"
                onMouseDown={handleMouseDown}
            >
                <div className="flex items-center gap-2 text-white">
                    <span className="material-symbols-outlined text-[18px]">layers</span>
                    <h3 className="text-sm font-semibold">Layers</h3>
                </div>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="text-white hover:bg-white/20 rounded p-1 transition-colors"
                        title="Close"
                    >
                        <span className="material-symbols-outlined text-[18px]">close</span>
                    </button>
                )}
            </div>

            {/* Content */}
            <div className="p-3 overflow-y-auto" style={{ maxHeight: '440px' }}>
                <div className="gjs-lm-container-floating"></div>
            </div>
        </div>
    );
}
