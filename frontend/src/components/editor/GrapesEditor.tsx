import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GjsEditor from '@grapesjs/react';
import grapesjs from 'grapesjs';
import type { Editor } from 'grapesjs';
// @ts-ignore
import webpagePlugin from 'grapesjs-preset-webpage';
// @ts-ignore
import basicBlocksPlugin from 'grapesjs-blocks-basic';
// @ts-ignore
import formsPlugin from 'grapesjs-plugin-forms';
// @ts-ignore
import countdownPlugin from 'grapesjs-component-countdown';
// @ts-ignore
import tabsPlugin from 'grapesjs-tabs';
// @ts-ignore
import customCodePlugin from 'grapesjs-custom-code';
// @ts-ignore
import tooltipPlugin from 'grapesjs-tooltip';
// @ts-ignore
import typedPlugin from 'grapesjs-typed';

import 'grapesjs/dist/css/grapes.min.css';
import { useEditorStore } from '../../store/editorStore';
import myTailwindBlocks from './customBlocks';
import { Loader2 } from 'lucide-react';
import AISectionModal from './AISectionModal';
import SEOOptimizerModal from './SEOOptimizerModal';
import ImportCodeModal from './ImportCodeModal';
import FloatingLayersPanel from './FloatingLayersPanel';

export default function GrapesEditor() {
    const navigate = useNavigate();
    const { currentPage, updatePage } = useEditorStore();
    const [editorInstance, setEditorInstance] = useState<Editor | null>(null);
    const [activeTab, setActiveTab] = useState<'content' | 'style' | 'advanced'>('style');
    const [pageSettingsOpen, setPageSettingsOpen] = useState(false);
    const [aiModalOpen, setAiModalOpen] = useState(false);
    const [importModalOpen, setImportModalOpen] = useState(false);
    const [floatingLayersOpen, setFloatingLayersOpen] = useState(false);
    const [, setUpdateCounter] = useState(0); // Force re-render for sidebar updates
    const [selectedComponent, setSelectedComponent] = useState<any>(null);
    const [componentProps, setComponentProps] = useState<{
        content: string;
        marginTop: string;
        marginRight: string;
        marginBottom: string;
        marginLeft: string;
        paddingTop: string;
        paddingRight: string;
        paddingBottom: string;
        paddingLeft: string;
        width: string;
        height: string;
        position: string;
        zIndex: string;
        order: string;
        // Image props
        imageSrc: string;
        imageAlign: string;
        imageWidth: string;
        imageHeight: string;
    }>({
        content: '',
        marginTop: '',
        marginRight: '',
        marginBottom: '',
        marginLeft: '',
        paddingTop: '',
        paddingRight: '',
        paddingBottom: '',
        paddingLeft: '',
        width: '',
        height: '',
        position: 'static',
        zIndex: '',
        order: '',
        imageSrc: '',
        imageAlign: 'left',
        imageWidth: '',
        imageHeight: ''
    });

    // Helper function to update styles and local state
    const handleStyleChange = (property: string, value: string) => {
        const component = editorInstance?.getSelected();
        if (component) {
            component.setStyle({ [property]: value });
            // Update local state immediately
            const propMap: Record<string, keyof typeof componentProps> = {
                'margin-top': 'marginTop',
                'margin-right': 'marginRight',
                'margin-bottom': 'marginBottom',
                'margin-left': 'marginLeft',
                'padding-top': 'paddingTop',
                'padding-right': 'paddingRight',
                'padding-bottom': 'paddingBottom',
                'padding-left': 'paddingLeft',
                'width': 'width',
                'height': 'height',
                'position': 'position',
                'z-index': 'zIndex',
                'order': 'order'
            };
            const stateKey = propMap[property];
            if (stateKey) {
                setComponentProps(prev => ({ ...prev, [stateKey]: value }));
            }
        }
    };

    // Helper for image property changes
    const handleImageChange = (prop: string, value: string) => {
        const component = editorInstance?.getSelected();
        if (!component) return;

        if (prop === 'src') {
            component.addAttributes({ src: value });
            setComponentProps(prev => ({ ...prev, imageSrc: value }));
        } else if (prop === 'width') {
            component.setStyle({ width: value });
            setComponentProps(prev => ({ ...prev, imageWidth: value }));
        } else if (prop === 'height') {
            component.setStyle({ height: value });
            setComponentProps(prev => ({ ...prev, imageHeight: value }));
        } else if (prop === 'align') {
            // Handle alignment logic
            const style: any = { display: 'block' }; // Ensure block for margin auto to work
            if (value === 'left') {
                style['margin-left'] = '0';
                style['margin-right'] = 'auto';
            } else if (value === 'center') {
                style['margin-left'] = 'auto';
                style['margin-right'] = 'auto';
            } else if (value === 'right') {
                style['margin-left'] = 'auto';
                style['margin-right'] = '0';
            }
            component.setStyle(style);
            setComponentProps(prev => ({ ...prev, imageAlign: value }));
        } else if (prop === 'resolution') {
            // Preset resolutions
            let w = 'auto', h = 'auto';
            if (value === 'thumbnail') { w = '150px'; h = '150px'; }
            else if (value === 'medium') { w = '300px'; h = '300px'; }
            else if (value === 'large') { w = '1024px'; h = 'auto'; }

            component.setStyle({ width: w, height: h });
            setComponentProps(prev => ({ ...prev, imageWidth: w, imageHeight: h }));
        }
    };

    // Helper for text content changes
    const handleContentChange = (value: string) => {
        const component = editorInstance?.getSelected();
        if (component) {
            // Check if it's a text component
            if (component.is('text')) {
                // Clear existing components (children like spans) to ensure content is treated as text/html
                component.components([]);
                component.set('content', value);
            } else {
                component.set('content', value);
            }
            setComponentProps(prev => ({ ...prev, content: value }));
        }
    };

    // Sync component properties to local state when selection changes
    useEffect(() => {
        if (selectedComponent) {
            const styles = selectedComponent.getStyle();
            const attribs = selectedComponent.getAttributes();

            // Extract text content - try multiple methods
            let content = '';
            if (selectedComponent.components().length === 0) {
                // For text elements without children
                content = selectedComponent.get('content') || '';
            } else if (selectedComponent.is('text')) {
                // For text type with inner content
                const textContent = selectedComponent.getInnerHTML() || selectedComponent.toHTML() || '';
                content = textContent.replace(/<[^>]*>/g, ''); // Strip HTML tags
            }

            setComponentProps({
                content: String(content || ''),
                marginTop: String(styles['margin-top'] || ''),
                marginRight: String(styles['margin-right'] || ''),
                marginBottom: String(styles['margin-bottom'] || ''),
                marginLeft: String(styles['margin-left'] || ''),
                paddingTop: String(styles['padding-top'] || ''),
                paddingRight: String(styles['padding-right'] || ''),
                paddingBottom: String(styles['padding-bottom'] || ''),
                paddingLeft: String(styles['padding-left'] || ''),
                width: String(styles['width'] || ''),
                height: String(styles['height'] || ''),
                position: String(styles['position'] || 'static'),
                zIndex: String(styles['z-index'] || ''),
                order: String(styles['order'] || ''),
                imageSrc: String(attribs.src || ''),
                imageAlign: String(styles['text-align'] || 'left'), // Assuming text-align on wrapper or float on img
                // For direct image width/height in style or attributes
                imageWidth: String(styles['width'] || attribs.width || ''),
                imageHeight: String(styles['height'] || attribs.height || '')
            });
        }
    }, [selectedComponent]);

    // Update layer manager container when floating panel toggles
    useEffect(() => {
        if (editorInstance && floatingLayersOpen) {
            const layerManager = editorInstance.LayerManager;

            // Wait for DOM to render
            setTimeout(() => {
                const container = document.querySelector('.gjs-lm-container-floating');
                if (container) {
                    // Force layer manager to re-render in new container
                    const lmEl = layerManager.render() as any;
                    container.innerHTML = '';
                    if (lmEl?.el) {
                        container.appendChild(lmEl.el);
                    } else if (lmEl) {
                        container.appendChild(lmEl);
                    }
                }
            }, 100);
        }
    }, [floatingLayersOpen, editorInstance]);

    const onEditor = (editor: Editor) => {
        setEditorInstance(editor);
        console.log('Editor loaded', editor);

        // ... (rest of onEditor)


        // Load content if available
        if (currentPage?.content_json) {
            try {
                const projectData = JSON.parse(currentPage.content_json);
                editor.loadProjectData(projectData);
            } catch (e) {
                console.error("Failed to parse project data", e);
            }
        }

        // Load Assets from Backend
        const loadAssets = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('https://landing-page-api.khibroh.workers.dev/api/media?format=grapesjs', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    const assets = await response.json();
                    editor.AssetManager.add(assets);
                }
            } catch (e) {
                console.error('Failed to load assets', e);
            }
        };
        loadAssets();

        // Add Save Command
        editor.Commands.add('save-db', {
            run: async (editor: any) => {
                const json = editor.getProjectData();
                const html = editor.getHtml();
                const css = editor.getCss();

                // Combine HTML and CSS for preview/production
                const fullHtml = `
                    <style>${css}</style>
                    ${html}
                `;

                try {
                    await updatePage({
                        content_json: JSON.stringify(json),
                        content_html: fullHtml
                    });
                    // Show success message
                    console.log('Saved successfully');
                    alert('Page saved successfully');
                    editor.Modal.close();
                } catch (error) {
                    console.error('Failed to save', error);
                    alert('Failed to save page');
                }
            }
        });

        // Hide default panels
        editor.Panels.getPanels().reset();

        // Get blocks for custom UI

    };

    if (!currentPage) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
                <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
                <p className="text-gray-500">Loading editor...</p>
            </div>
        );
    }

    return (
        <div className="flex h-screen w-full bg-slate-50 text-slate-900 overflow-hidden font-sans">

            {/* Left Sidebar - Blocks */}
            <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 z-20">
                <div className="p-4 border-b border-slate-200">
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-[20px]">search</span>
                        <input className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-700 placeholder:text-slate-400" placeholder="Find elements..." type="text" />
                    </div>
                </div>
                {/* Custom "AI Tools" Category Header for quick access */}
                <div className="px-4 pt-4 pb-0">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1">
                        AI Tools
                        <span className="material-symbols-outlined text-primary text-[14px]">auto_awesome</span>
                    </h3>
                    <div className="grid grid-cols-1 gap-2 mb-6">
                        <div onClick={() => setAiModalOpen(true)} className="group flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-primary/50 hover:bg-slate-50 cursor-pointer transition-all">
                            <span className="material-symbols-outlined text-primary mb-0">magic_button</span>
                            <span className="text-xs font-medium text-slate-600">AI Section Gen</span>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-6 scrollbar-hide">
                    <div id="blocks-custom-container"></div>
                </div>
            </aside>

            {/* Main Layout Area */}
            <div className="flex flex-col flex-1 h-full min-w-0">

                /* Header */
                <header className="flex items-center justify-between px-4 py-2 border-b border-slate-200 bg-white shrink-0 h-14 z-50">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500">
                            <span className="material-symbols-outlined">arrow_back</span>
                        </button>

                        {/* Undo / Redo Buttons */}
                        <div className="flex items-center gap-1 border-r border-slate-200 pr-4 mr-2">
                            <button onClick={() => editorInstance?.runCommand('core:undo')} className="p-1.5 hover:bg-slate-100 rounded-md text-slate-500 transition-colors" title="Undo (Ctrl+Z)">
                                <span className="material-symbols-outlined text-[20px]">undo</span>
                            </button>
                            <button onClick={() => editorInstance?.runCommand('core:redo')} className="p-1.5 hover:bg-slate-100 rounded-md text-slate-500 transition-colors" title="Redo (Ctrl+Y)">
                                <span className="material-symbols-outlined text-[20px]">redo</span>
                            </button>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-slate-900">{currentPage.title}</span>
                                <span className="text-[10px] text-slate-500">Path: /{currentPage.slug}</span>
                            </div>
                            <button onClick={() => setPageSettingsOpen(!pageSettingsOpen)} className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-medium text-slate-600 transition-colors" title="Page SEO & Metadata">
                                <span className="material-symbols-outlined text-[16px]">settings</span>
                                <span>Page Settings</span>
                            </button>
                            <button onClick={() => setImportModalOpen(true)} className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-xs font-medium text-indigo-600 transition-colors" title="Import Code">
                                <span className="material-symbols-outlined text-[16px]">code</span>
                                <span>Import Code</span>
                            </button>
                            <div className="flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded-full text-[10px] font-bold border border-green-200">
                                <span className="material-symbols-outlined text-[12px]">analytics</span>
                                <span>SEO: {currentPage.seo_keywords ? 'Good' : 'Needs Work'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => {
                                const activeDevice = editorInstance?.getDevice();
                                const nextDevice = activeDevice === 'Mobile' ? 'Desktop' : activeDevice === 'Tablet' ? 'Mobile' : 'Tablet';
                                editorInstance?.setDevice(nextDevice);
                            }}
                            className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors hidden sm:block"
                            title="Toggle Device"
                        >
                            <span className="material-symbols-outlined">devices</span>
                        </button>
                        <button
                            onClick={() => setAiModalOpen(true)}
                            className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:shadow-lg hover:shadow-indigo-500/20 transition-all text-sm font-medium"
                        >
                            <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                            <span className="hidden sm:inline">AI Wizard</span>
                        </button>
                        <button
                            onClick={() => setFloatingLayersOpen(!floatingLayersOpen)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all text-sm font-medium ${floatingLayersOpen
                                ? 'bg-indigo-100 text-indigo-700 border border-indigo-300'
                                : 'bg-white text-slate-700 border border-slate-300 hover:border-indigo-400'
                                }`}
                            title="Toggle Floating Layers Panel"
                        >
                            <span className="material-symbols-outlined text-[18px]">layers</span>
                            <span className="hidden sm:inline">Layers</span>
                        </button>
                        <button
                            onClick={() => editorInstance?.runCommand('save-db')}
                            className="flex items-center gap-2 px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-colors text-sm font-medium"
                        >
                            <span className="material-symbols-outlined text-[18px]">save</span>
                            <span className="hidden sm:inline">Save</span>
                        </button>
                    </div>
                </header>

                {/* Editor Canvas */}
                <div className="flex-1 relative bg-[#f1f5f9] overflow-hidden">
                    <div className="absolute inset-0 p-4 overflow-hidden">
                        <div className="h-full w-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden relative">
                            <GjsEditor
                                grapesjs={grapesjs}
                                options={{
                                    height: '100%',
                                    storageManager: false,
                                    undoManager: { trackSelection: true }, // Enable Selection tracking for better UX
                                    selectorManager: {
                                        componentFirst: true,
                                        appendTo: '.gjs-clm-container'
                                    },
                                    projectData: undefined, // Loaded manually
                                    assetManager: {
                                        upload: 'https://landing-page-api.khibroh.workers.dev/api/media/upload',
                                        uploadName: 'file',
                                        headers: {
                                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                                        },
                                        autoAdd: true,
                                        openAssetsOnDrop: true, // Open when dropping image
                                        dropzone: true, // Enable dropzone
                                    },
                                    blockManager: {
                                        appendTo: '#blocks-custom-container',
                                    },
                                    layerManager: {
                                        appendTo: '.gjs-lm-container'
                                    },
                                    styleManager: {
                                        appendTo: '.gjs-sm-container',
                                        sectors: [
                                            {
                                                name: 'Typography',
                                                open: false,
                                                buildProps: ['font-family', 'font-size', 'font-weight', 'letter-spacing', 'color', 'line-height', 'text-align', 'text-decoration', 'text-shadow']
                                            },
                                            {
                                                name: 'Decorations',
                                                open: false,
                                                buildProps: ['background-color', 'border-radius', 'border', 'box-shadow', 'background']
                                            },
                                            {
                                                name: 'Flex',
                                                open: false,
                                                buildProps: ['flex-direction', 'justify-content', 'align-items', 'flex-wrap', 'align-content', 'gap']
                                            }
                                        ]
                                    },
                                    traitManager: {
                                        appendTo: '.gjs-tm-container'
                                    },
                                    deviceManager: {
                                        devices: [
                                            { name: 'Desktop', width: '' },
                                            { name: 'Tablet', width: '768px' },
                                            { name: 'Mobile', width: '320px' },
                                        ]
                                    },
                                    plugins: [
                                        webpagePlugin,
                                        basicBlocksPlugin,
                                        formsPlugin,
                                        countdownPlugin,
                                        tabsPlugin,
                                        customCodePlugin,
                                        tooltipPlugin,
                                        typedPlugin,
                                        myTailwindBlocks
                                    ],
                                    pluginsOpts: {
                                        'gjs-preset-webpage': {
                                            blocksBasicOpts: false,
                                            formsOpts: false,
                                            countdownOpts: false,
                                            modalImportTitle: 'Import',
                                        },
                                    },
                                    canvas: {
                                        scripts: [
                                            'https://cdn.tailwindcss.com'
                                        ],
                                        styles: [
                                            'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
                                            // Material Symbols
                                            'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200',
                                            'https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200',
                                            'https://fonts.googleapis.com/css2?family=Material+Symbols+Sharp:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200',
                                            // Material Icons (Legacy Variants)
                                            'https://fonts.googleapis.com/icon?family=Material+Icons',
                                            'https://fonts.googleapis.com/icon?family=Material+Icons+Outlined',
                                            'https://fonts.googleapis.com/icon?family=Material+Icons+Round',
                                            'https://fonts.googleapis.com/icon?family=Material+Icons+Sharp',
                                            'https://fonts.googleapis.com/icon?family=Material+Icons+Two+Tone',
                                            // Font Awesome
                                            'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
                                        ]
                                    }
                                }}
                                onEditor={(editor) => {
                                    onEditor(editor);

                                    // Auto-switch tabs based on component type (Elementor-style)
                                    editor.on('component:selected', (model) => {
                                        // Update selected component state (triggers useEffect to load properties)
                                        setSelectedComponent(model);

                                        const type = model.get('type');
                                        const isText = model.is('text') || type === 'text';

                                        // Show Content tab for image and text elements
                                        if (type === 'image' || isText) {
                                            setActiveTab('content');
                                        } else {
                                            // Show Style tab for other elements (containers, etc)
                                            setActiveTab('style');
                                        }
                                    });

                                    // Force update on component change (text edit, etc)
                                    editor.on('component:update', () => setUpdateCounter((c: number) => c + 1));

                                    // Refresh assets on open
                                    editor.on('run:open-assets', () => {
                                        // Optional: Reload assets from backend if needed
                                    });

                                    // Double-click to change image
                                    editor.on('component:dblclick', (model) => {
                                        if (model.get('type') === 'image') {
                                            editor.runCommand('open-assets', {
                                                target: model
                                            });
                                        }
                                    });
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Sidebar */}
            <aside className="w-72 bg-white border-l border-slate-200 flex flex-col shrink-0 overflow-hidden z-20">
                <div className="p-3 border-b border-slate-200">
                    <div className="flex bg-white p-1 rounded-lg border border-slate-200">
                        <button onClick={() => setActiveTab('content')} className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-1 ${activeTab === 'content' ? 'bg-primary text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}>
                            <span className="material-symbols-outlined text-[16px]">edit_note</span>
                            Content
                        </button>
                        <button onClick={() => setActiveTab('style')} className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-1 ${activeTab === 'style' ? 'bg-primary text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}>
                            <span className="material-symbols-outlined text-[16px]">palette</span>
                            Style
                        </button>
                        <button onClick={() => setActiveTab('advanced')} className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-1 ${activeTab === 'advanced' ? 'bg-primary text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}>
                            <span className="material-symbols-outlined text-[16px]">tune</span>
                            Advanced
                        </button>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {/* Targeting GrapesJS Managers to these Containers */}
                    <div className={`${activeTab === 'style' ? 'block' : 'hidden'} h-full `}>
                        <div className="p-4 border-b border-slate-200">
                            <div className="gjs-clm-container mb-2"></div>  {/* Selector Manager (Classes) */}
                        </div>
                        <div className="gjs-sm-container"></div>  {/* Style Manager mounts here */}
                    </div>
                    {/* CONTENT TAB - Element Content Editor (like Elementor) */}
                    <div className={`${activeTab === 'content' ? 'block' : 'hidden'} h-full`}>
                        <div className="p-4 space-y-4">
                            {/* Image Content Editor */}
                            {editorInstance?.getSelected() && editorInstance.getSelected()?.get('type') === 'image' && (
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-xs font-bold uppercase mb-3 text-slate-700 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-[16px]">image</span>
                                            Image
                                        </h4>
                                        <div className="space-y-4">
                                            {/* Preview & Choose */}
                                            <div className="bg-slate-50 border rounded-lg p-3">
                                                <div className="flex justify-between items-center mb-2">
                                                    <label className="text-xs font-medium text-slate-600">Choose Image</label>
                                                    <button
                                                        onClick={() => editorInstance.runCommand('open-assets', { target: editorInstance.getSelected() })}
                                                        className="text-primary hover:text-primary/80"
                                                    >
                                                        <span className="material-symbols-outlined text-[18px]">collections</span>
                                                    </button>
                                                </div>
                                                <div
                                                    className="group relative w-full h-32 bg-white border border-dashed rounded flex items-center justify-center cursor-pointer overflow-hidden"
                                                    onClick={() => editorInstance.runCommand('open-assets', { target: editorInstance.getSelected() })}
                                                >
                                                    {componentProps.imageSrc ? (
                                                        <img
                                                            src={componentProps.imageSrc}
                                                            alt="Preview"
                                                            className="w-full h-full object-contain"
                                                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                                        />
                                                    ) : (
                                                        <span className="material-symbols-outlined text-3xl text-slate-300">image</span>
                                                    )}
                                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <span className="text-xs text-white font-medium">Change Image</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Resolution */}
                                            <div>
                                                <label className="text-xs font-medium block mb-2 text-slate-600">Image Resolution</label>
                                                <select
                                                    className="w-full text-xs p-2 border rounded bg-white focus:ring-2 focus:ring-primary/20"
                                                    onChange={(e) => handleImageChange('resolution', e.target.value)}
                                                >
                                                    <option value="full">Full</option>
                                                    <option value="thumbnail">Thumbnail - 150 x 150</option>
                                                    <option value="medium">Medium - 300 x 300</option>
                                                    <option value="large">Large - 1024 x 1024</option>
                                                </select>
                                            </div>

                                            {/* Alignment */}
                                            <div>
                                                <label className="text-xs font-medium block mb-2 text-slate-600">Alignment</label>
                                                <div className="flex border rounded overflow-hidden">
                                                    <button
                                                        onClick={() => handleImageChange('align', 'left')}
                                                        className={`flex-1 p-2 flex items-center justify-center hover:bg-slate-50 transition-colors ${componentProps.imageAlign === 'left' ? 'bg-indigo-50 text-primary' : 'bg-white text-slate-500'}`}
                                                    >
                                                        <span className="material-symbols-outlined text-[18px]">format_align_left</span>
                                                    </button>
                                                    <button
                                                        onClick={() => handleImageChange('align', 'center')}
                                                        className={`flex-1 p-2 border-l border-r flex items-center justify-center hover:bg-slate-50 transition-colors ${componentProps.imageAlign === 'center' ? 'bg-indigo-50 text-primary' : 'bg-white text-slate-500'}`}
                                                    >
                                                        <span className="material-symbols-outlined text-[18px]">format_align_center</span>
                                                    </button>
                                                    <button
                                                        onClick={() => handleImageChange('align', 'right')}
                                                        className={`flex-1 p-2 flex items-center justify-center hover:bg-slate-50 transition-colors ${componentProps.imageAlign === 'right' ? 'bg-indigo-50 text-primary' : 'bg-white text-slate-500'}`}
                                                    >
                                                        <span className="material-symbols-outlined text-[18px]">format_align_right</span>
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Caption */}
                                            <div>
                                                <label className="text-xs font-medium block mb-2 text-slate-600">Caption</label>
                                                <input
                                                    type="text"
                                                    className="w-full text-xs p-2 border rounded focus:ring-2 focus:ring-primary/20"
                                                    placeholder="Enter caption..."
                                                    onChange={(e) => editorInstance?.getSelected()?.addAttributes({ alt: e.target.value, title: e.target.value })}
                                                />
                                            </div>

                                            {/* Direct URL */}
                                            <div>
                                                <label className="text-xs font-medium block mb-2 text-slate-600">Image URL</label>
                                                <input
                                                    type="text"
                                                    className="w-full text-xs p-2 border rounded focus:ring-2 focus:ring-primary/20"
                                                    value={componentProps.imageSrc}
                                                    onChange={(e) => handleImageChange('src', e.target.value)}
                                                    placeholder="https://example.com/image.jpg"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Text Content Editor */}
                            {editorInstance?.getSelected() && (editorInstance.getSelected()?.is('text') || editorInstance.getSelected()?.get('type') === 'text') && (
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-xs font-bold uppercase mb-3 text-slate-700 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-[16px]">text_fields</span>
                                            Text Editor
                                        </h4>
                                        <div className="space-y-3">
                                            <div>
                                                <label className="text-xs font-medium block mb-2 text-slate-600">Text Content</label>
                                                <textarea
                                                    className="w-full text-sm p-3 border rounded focus:ring-2 focus:ring-primary/20 font-sans"
                                                    value={componentProps.content}
                                                    onChange={(e) => handleContentChange(e.target.value)}
                                                    placeholder="Enter your text here..."
                                                    rows={6}
                                                />
                                                <p className="text-[10px] text-slate-400 mt-1">You can also double-click the text on canvas to edit.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Default State */}
                            {!editorInstance?.getSelected() && (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <span className="material-symbols-outlined text-5xl text-slate-300 mb-3">touch_app</span>
                                    <p className="text-sm font-medium text-slate-600">Select an element</p>
                                    <p className="text-xs text-slate-400 mt-1">Click any element on the canvas to edit its content</p>
                                </div>
                            )}

                            {/* Show message for container elements */}
                            {editorInstance?.getSelected() && !['image', 'text'].includes(editorInstance.getSelected()?.get('type') || '') && !(editorInstance.getSelected()?.is('text')) && (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <span className="material-symbols-outlined text-5xl text-slate-300 mb-3">widgets</span>
                                    <p className="text-sm font-medium text-slate-600">Container Element</p>
                                    <p className="text-xs text-slate-400 mt-1">This element contains other elements. Use Style and Advanced tabs to customize.</p>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className={`${activeTab === 'advanced' ? 'block' : 'hidden'} h-full text-slate-600`}>
                        {/* Layout Section - Advanced Properties */}
                        <div className="border-b border-slate-200">
                            <div className="p-4">
                                <h4 className="text-xs font-bold uppercase mb-3 text-slate-700 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[16px]">dashboard_customize</span>
                                    Layout
                                </h4>

                                {editorInstance?.getSelected() ? (
                                    <div className="space-y-4 text-xs">
                                        {/* Margin */}
                                        <div>
                                            <label className="block text-slate-600 font-medium mb-2">Margin</label>
                                            <div className="grid grid-cols-4 gap-1">
                                                <input type="text" placeholder="Top" className="p-1.5 border rounded text-center text-[11px]"
                                                    value={componentProps.marginTop}
                                                    onChange={(e) => handleStyleChange('margin-top', e.target.value)} />
                                                <input type="text" placeholder="Right" className="p-1.5 border rounded text-center text-[11px]"
                                                    value={componentProps.marginRight}
                                                    onChange={(e) => handleStyleChange('margin-right', e.target.value)} />
                                                <input type="text" placeholder="Bottom" className="p-1.5 border rounded text-center text-[11px]"
                                                    value={componentProps.marginBottom}
                                                    onChange={(e) => handleStyleChange('margin-bottom', e.target.value)} />
                                                <input type="text" placeholder="Left" className="p-1.5 border rounded text-center text-[11px]"
                                                    value={componentProps.marginLeft}
                                                    onChange={(e) => handleStyleChange('margin-left', e.target.value)} />
                                            </div>
                                        </div>

                                        {/* Padding */}
                                        <div>
                                            <label className="block text-slate-600 font-medium mb-2">Padding</label>
                                            <div className="grid grid-cols-4 gap-1">
                                                <input type="text" placeholder="Top" className="p-1.5 border rounded text-center text-[11px]"
                                                    value={componentProps.paddingTop}
                                                    onChange={(e) => handleStyleChange('padding-top', e.target.value)} />
                                                <input type="text" placeholder="Right" className="p-1.5 border rounded text-center text-[11px]"
                                                    value={componentProps.paddingRight}
                                                    onChange={(e) => handleStyleChange('padding-right', e.target.value)} />
                                                <input type="text" placeholder="Bottom" className="p-1.5 border rounded text-center text-[11px]"
                                                    value={componentProps.paddingBottom}
                                                    onChange={(e) => handleStyleChange('padding-bottom', e.target.value)} />
                                                <input type="text" placeholder="Left" className="p-1.5 border rounded text-center text-[11px]"
                                                    value={componentProps.paddingLeft}
                                                    onChange={(e) => handleStyleChange('padding-left', e.target.value)} />
                                            </div>
                                        </div>

                                        {/* Width & Height */}
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-slate-600 font-medium mb-2">Width</label>
                                                <input type="text" placeholder="auto" className="w-full p-1.5 border rounded text-[11px]"
                                                    value={componentProps.width}
                                                    onChange={(e) => handleStyleChange('width', e.target.value)} />
                                            </div>
                                            <div>
                                                <label className="block text-slate-600 font-medium mb-2">Height</label>
                                                <input type="text" placeholder="auto" className="w-full p-1.5 border rounded text-[11px]"
                                                    value={componentProps.height}
                                                    onChange={(e) => handleStyleChange('height', e.target.value)} />
                                            </div>
                                        </div>

                                        {/* Position & Z-Index */}
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-slate-600 font-medium mb-2">Position</label>
                                                <select className="w-full p-1.5 border rounded text-[11px]"
                                                    value={componentProps.position}
                                                    onChange={(e) => handleStyleChange('position', e.target.value)}>
                                                    <option value="static">Static</option>
                                                    <option value="relative">Relative</option>
                                                    <option value="absolute">Absolute</option>
                                                    <option value="fixed">Fixed</option>
                                                    <option value="sticky">Sticky</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-slate-600 font-medium mb-2">Z-Index</label>
                                                <input type="text" placeholder="0" className="w-full p-1.5 border rounded text-[11px]"
                                                    value={componentProps.zIndex}
                                                    onChange={(e) => handleStyleChange('z-index', e.target.value)} />
                                            </div>
                                        </div>

                                        {/* Order (Flexbox) */}
                                        <div>
                                            <label className="block text-slate-600 font-medium mb-2">Order</label>
                                            <input type="text" placeholder="0" className="w-full p-1.5 border rounded text-[11px]"
                                                value={componentProps.order}
                                                onChange={(e) => handleStyleChange('order', e.target.value)} />
                                            <p className="text-[10px] text-slate-400 mt-1">Controls flex item order</p>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-xs text-slate-400 text-center py-4">Select an element to edit layout properties</p>
                                )}
                            </div>
                        </div>

                        <div className="p-4 border-t border-slate-200">
                            <h4 className="text-xs font-bold uppercase mb-3 text-slate-700">Attributes</h4>
                            <div className="gjs-tm-container"></div> {/* Trait Manager */}
                        </div>
                    </div>
                </div>
            </aside>

            {/* Modals */}
            {pageSettingsOpen && (
                <SEOOptimizerModal
                    pageTitle={currentPage.title}
                    pageContent={''} // Todo: get actual content
                    currentSEO={{
                        title: currentPage.title,
                        description: currentPage.seo_description || '',
                        keywords: currentPage.seo_keywords || ''
                    }}
                    onClose={() => setPageSettingsOpen(false)}
                    onSave={async (seoData: any) => {
                        await updatePage({
                            title: seoData.title,
                            seo_description: seoData.description,
                            seo_keywords: seoData.keywords
                        });
                        setPageSettingsOpen(false);
                    }}
                />
            )}

            {aiModalOpen && (
                <AISectionModal
                    onClose={() => setAiModalOpen(false)}
                    onInsert={(section: any) => {
                        console.log('Insert AI section:', section);
                        // TODO: Handle section insertion logic
                        setAiModalOpen(false);
                    }}
                />
            )}

            <ImportCodeModal
                isOpen={importModalOpen}
                onClose={() => setImportModalOpen(false)}
                onImport={(html, css) => {
                    if (editorInstance) {
                        try {
                            // Inject CSS first
                            if (css) editorInstance.addStyle(css);
                            // Then inject HTML (append to end)
                            if (html) editorInstance.addComponents(html);

                            // Optional: Flash success message
                            console.log('Imported successfully');
                        } catch (e) {
                            console.error('Import failed', e);
                            alert('Failed to import code');
                        }
                    }
                }}
            />

            {/* Floating Layers Panel */}
            {floatingLayersOpen && (
                <FloatingLayersPanel onClose={() => setFloatingLayersOpen(false)} />
            )}
        </div>
    );
}
