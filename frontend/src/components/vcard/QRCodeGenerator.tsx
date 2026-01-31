import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { X, Download } from 'lucide-react';

interface QRCodeGeneratorProps {
    url: string;
    onClose: () => void;
}

export default function QRCodeGenerator({ url, onClose }: QRCodeGeneratorProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        generateQR();
    }, [url]);

    const generateQR = async () => {
        if (!canvasRef.current) return;

        try {
            await QRCode.toCanvas(canvasRef.current, url, {
                width: 300,
                margin: 2,
                color: {
                    dark: '#000000',
                    light: '#FFFFFF',
                },
            });
            setLoading(false);
        } catch (error) {
            console.error('Failed to generate QR code:', error);
        }
    };

    const downloadQR = () => {
        if (!canvasRef.current) return;

        const link = document.createElement('a');
        link.download = 'vcard-qr-code.png';
        link.href = canvasRef.current.toDataURL();
        link.click();
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">QR Code</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {loading && (
                        <div className="flex items-center justify-center h-[300px]">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        </div>
                    )}

                    <div className="flex justify-center mb-4">
                        <canvas ref={canvasRef} className={loading ? 'hidden' : ''} />
                    </div>

                    <p className="text-sm text-gray-600 text-center mb-4">
                        Scan this QR code to view the digital business card
                    </p>

                    <div className="bg-gray-50 rounded-lg p-3 mb-4">
                        <p className="text-xs text-gray-500 mb-1">URL:</p>
                        <p className="text-sm text-gray-900 break-all">{url}</p>
                    </div>

                    <button
                        onClick={downloadQR}
                        disabled={loading}
                        className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Download className="w-5 h-5 mr-2" />
                        Download QR Code
                    </button>
                </div>
            </div>
        </div>
    );
}
