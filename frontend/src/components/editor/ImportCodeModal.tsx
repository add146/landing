import { useState } from 'react';
import { X, Code, Check, AlertCircle } from 'lucide-react';

interface ImportCodeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onImport: (html: string, css: string) => void;
}

export default function ImportCodeModal({ isOpen, onClose, onImport }: ImportCodeModalProps) {
    const [code, setCode] = useState('');
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleImport = () => {
        try {
            if (!code.trim()) {
                setError('Code content is required');
                return;
            }
            setError(null);

            let finalHtml = code;
            let finalCss = '';

            // Auto-extract styles if present in HTML
            const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
            const matches = [...finalHtml.matchAll(styleRegex)];

            if (matches.length > 0) {
                // Remove style tags from HTML
                finalHtml = finalHtml.replace(styleRegex, '');

                // Append extracted styles to CSS
                finalCss = matches.map(match => match[1]).join('\n');
            }

            onImport(finalHtml, finalCss);
            setCode(''); // Clear input after successful import
            onClose();
        } catch (err) {
            setError('Failed to process code. Please check your input.');
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                            <Code className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">Import Design Code</h2>
                            <p className="text-sm text-gray-500">Paste your Stitch/AI exported HTML (include &lt;style&gt; tags)</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-auto p-6 bg-gray-50/50">
                    {error && (
                        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 text-red-700">
                            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                            <div className="text-sm">{error}</div>
                        </div>
                    )}

                    <div className="flex flex-col h-full min-h-[300px]">
                        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                            Paste HTML & CSS Here
                        </label>
                        <textarea
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="flex-1 w-full p-4 bg-white border border-gray-200 rounded-lg font-mono text-sm text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none shadow-sm"
                            placeholder="Example: 
<style>.hero { color: red; }</style>
<div class='hero'>Hello World</div>"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-100 bg-white flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleImport}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm shadow-blue-200 transition-all flex items-center gap-2"
                    >
                        <Check className="w-4 h-4" />
                        Import Code
                    </button>
                </div>
            </div>
        </div>
    );
}
