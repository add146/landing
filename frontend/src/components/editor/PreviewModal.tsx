import { X, Monitor, Tablet, Smartphone } from 'lucide-react';
import { useState } from 'react';
import { useEditorStore } from '../../store/editorStore';
import SectionRenderer from './SectionRenderer';

interface PreviewModalProps {
    onClose: () => void;
}

export default function PreviewModal({ onClose }: PreviewModalProps) {
    const { sections, previewDevice } = useEditorStore();
    const [localDevice, setLocalDevice] = useState<'desktop' | 'tablet' | 'mobile'>(previewDevice);

    const deviceIcons = {
        desktop: Monitor,
        tablet: Tablet,
        mobile: Smartphone,
    };

    const deviceWidths = {
        desktop: '100%',
        tablet: '768px',
        mobile: '375px',
    };

    const deviceLabels = {
        desktop: 'Desktop',
        tablet: 'Tablet',
        mobile: 'Mobile',
    };

    return (
        <div className="fixed inset-0 bg-black/90 z-50 flex flex-col">
            {/* Header */}
            <div className="bg-gray-900 border-b border-gray-700 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <h2 className="text-lg font-semibold text-white">Preview</h2>

                    {/* Device Switcher */}
                    <div className="flex items-center space-x-2 bg-gray-800 rounded-lg p-1">
                        {(Object.entries(deviceIcons) as [typeof localDevice, typeof Monitor][]).map(([device, Icon]) => (
                            <button
                                key={device}
                                onClick={() => setLocalDevice(device)}
                                className={`
                  flex items-center px-3 py-2 rounded transition-colors text-sm
                  ${localDevice === device
                                        ? 'bg-blue-600 text-white'
                                        : 'text-gray-300 hover:text-white hover:bg-gray-700'
                                    }
                `}
                            >
                                <Icon className="w-4 h-4 mr-2" />
                                {deviceLabels[device]}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                    <X className="w-4 h-4 mr-2" />
                    Close Preview
                </button>
            </div>

            {/* Preview Content */}
            <div className="flex-1 overflow-y-auto bg-gray-800 p-8">
                <div
                    className="mx-auto bg-white shadow-2xl rounded-lg overflow-hidden transition-all duration-300"
                    style={{
                        width: deviceWidths[localDevice],
                        maxWidth: '100%',
                        minHeight: '600px',
                    }}
                >
                    {sections.length === 0 ? (
                        <div className="py-32 text-center">
                            <p className="text-gray-600 text-lg">
                                No content to preview
                            </p>
                            <p className="text-gray-500 text-sm mt-2">
                                Add sections to your page to see them here
                            </p>
                        </div>
                    ) : (
                        <div>
                            {sections.map((section) => (
                                <div key={section.id} className="pointer-events-none">
                                    <SectionRenderer section={section} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Footer Info */}
            <div className="bg-gray-900 border-t border-gray-700 px-6 py-3 text-center">
                <p className="text-xs text-gray-400">
                    This is a preview of how your page will look. Some interactive features may not work in preview mode.
                </p>
            </div>
        </div>
    );
}
