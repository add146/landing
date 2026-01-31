// import type { Editor } from 'grapesjs'; // Unused
import { useState } from 'react';
import GjsEditor from '@grapesjs/react';
import grapesjs, { Editor } from 'grapesjs';
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

export default function GrapesEditor() {
    const { currentPage, updatePage } = useEditorStore();
    const [editorInstance, setEditorInstance] = useState<Editor | null>(null);
    const [activeTab, setActiveTab] = useState<'content' | 'style' | 'advanced'>('style');
    const [blocks, setBlocks] = useState<any[]>([]);

    const onEditor = (editor: Editor) => {
        setEditorInstance(editor);
        console.log('Editor loaded', editor);

        // Load content if available
        if (currentPage?.content_json) {
            try {
                const projectData = JSON.parse(currentPage.content_json);
                editor.loadProjectData(projectData);
            } catch (e) {
                console.error("Failed to parse project data", e);
            }
        }

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
        const blockManager = editor.BlockManager;
        const allBlocks = blockManager.getAll();
        // @ts-ignore
        setBlocks(allBlocks.models || allBlocks);

        // Listen for new blocks
        editor.on('block:add', () => {
            const all = blockManager.getAll();
            // @ts-ignore
            setBlocks([...(all.models || all)]);
        });
    };

    // Helper to group blocks by category
    const groupedBlocks = blocks.reduce((acc: any, block: any) => {
        const category = block.get('category') || 'General';
        const label = typeof category === 'string' ? category : category.label;
        if (!acc[label]) acc[label] = [];
        acc[label].push(block);
        return acc;
    }, {});

    const handleDragStart = (block: any) => {
        if (editorInstance) {
            // @ts-ignore
            editorInstance.BlockManager.dragStart(block);
        }
    };

    const handleDragEnd = () => {
        if (editorInstance) {
            // @ts-ignore
            editorInstance.BlockManager.dragStop(null);
        }
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
        <div className="flex h-screen w-full bg-slate-900 text-white overflow-hidden font-sans">

            {/* Main Layout Area */}
            <div className="flex flex-col flex-1 h-full">

                {/* Header */}
                <header className="flex items-center justify-between px-4 py-2 border-b border-slate-800 bg-[#15152a] shrink-0 h-14 z-50">
                    <div className="flex items-center gap-4">
                        <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400">
                            <span className="material-symbols-outlined">arrow_back</span>
                        </button>
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-white">{currentPage.title}</span>
                            <span className="text-[10px] text-slate-400">Path: /{currentPage.slug}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="flex bg-slate-800 rounded-lg p-1 mr-2 gap-1">
                            <button onClick={() => editorInstance?.setDevice('Desktop')} className="p-2 rounded hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"><span className="material-symbols-outlined text-[20px]">desktop_windows</span></button>
                            <button onClick={() => editorInstance?.setDevice('Tablet')} className="p-2 rounded hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"><span className="material-symbols-outlined text-[20px]">tablet_mac</span></button>
                            <button onClick={() => editorInstance?.setDevice('Mobile Portrait')} className="p-2 rounded hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"><span className="material-symbols-outlined text-[20px]">smartphone</span></button>
                        </div>
                        <div className="h-6 w-px bg-slate-700 mx-1"></div>
                        <button onClick={() => editorInstance?.runCommand('core:undo')} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400">
                            <span className="material-symbols-outlined text-[20px]">undo</span>
                        </button>
                        <button onClick={() => editorInstance?.runCommand('core:redo')} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400">
                            <span className="material-symbols-outlined text-[20px]">redo</span>
                        </button>
                    </div>

                    <div className="flex items-center gap-3">
                        <button onClick={() => editorInstance?.runCommand('preview')} className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-slate-300 hover:bg-slate-800 rounded-lg transition-colors">
                            <span className="material-symbols-outlined text-[18px]">visibility</span>
                            <span className="hidden sm:inline">Preview</span>
                        </button>
                        <button onClick={() => editorInstance?.runCommand('save-db')} className="bg-primary hover:bg-indigo-600 text-white text-sm font-bold px-4 py-1.5 rounded-lg shadow-sm transition-colors flex items-center gap-2">
                            <span>Save</span>
                            <span className="material-symbols-outlined text-[18px]">save</span>
                        </button>
                    </div>
                </header>

                <div className="flex flex-1 overflow-hidden relative">
                    {/* Left Sidebar - Blocks */}
                    <aside className="w-64 bg-[#15152a] border-r border-slate-800 flex flex-col shrink-0 z-20">
                        <div className="p-4 border-b border-slate-800">
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-[20px]">search</span>
                                <input className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-200 placeholder:text-slate-400" placeholder="Find elements..." type="text" />
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-hide">
                            {Object.entries(groupedBlocks).map(([category, items]: [string, any]) => (
                                <div key={category}>
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">{category}</h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        {items.map((block: any) => (
                                            <div
                                                key={block.getId()}
                                                draggable
                                                onDragStart={() => handleDragStart(block)}
                                                onDragEnd={handleDragEnd}
                                                className="group flex flex-col items-center justify-center p-3 rounded-lg border border-slate-700 hover:border-primary/50 hover:bg-slate-800 cursor-grab active:cursor-grabbing transition-all select-none"
                                            >
                                                <div dangerouslySetInnerHTML={{ __html: block.getMedia() || `<span class="material-symbols-outlined text-slate-500 group-hover:text-primary mb-2">${block.get('attributes')?.class?.replace('fa fa-', '') || 'extension'}</span>` }} />
                                                <span className="text-xs font-medium text-slate-300 mt-2 text-center">{block.getLabel()}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </aside>

                    {/* Editor Canvas */}
                    <main className="flex-1 bg-[#0b0b15] relative overflow-hidden flex flex-col">
                        <GjsEditor
                            grapesjs={grapesjs}
                            options={{
                                height: '100%',
                                width: 'auto',
                                storageManager: false,
                                container: '#gjs',
                                fromElement: true,
                                canvas: {
                                    styles: [
                                        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css'
                                    ],
                                    scripts: [
                                        'https://cdn.tailwindcss.com'
                                    ]
                                },
                                panels: { defaults: [] }, // Disable default panels
                                layerManager: {
                                    appendTo: '.gjs-lm-container'
                                },
                                styleManager: {
                                    appendTo: '.gjs-sm-container'
                                },
                                traitManager: {
                                    appendTo: '.gjs-tm-container'
                                },
                                selectorManager: {
                                    appendTo: '.gjs-sm-container'
                                },
                                deviceManager: {
                                    devices: [
                                        { id: 'desktop', name: 'Desktop', width: '' },
                                        { id: 'tablet', name: 'Tablet', width: '768px', widthMedia: '992px' },
                                        { id: 'mobilePortrait', name: 'Mobile Portrait', width: '320px', widthMedia: '575px' },
                                    ],
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
                                    'grapesjs-tabs': { tabsBlock: { category: 'Extra' } },
                                    'grapesjs-typed': { block: { category: 'Extra', label: 'Typed' } },
                                    'gjs-component-countdown': { label: 'Countdown', category: 'Extra' },
                                    'grapesjs-tooltip': { blockTooltip: { category: 'Extra' } }
                                }
                            }}
                            onEditor={onEditor}
                        >
                            {/* GrapesJS mounts here */}
                        </GjsEditor>
                    </main>


                    {/* Right Sidebar - Styles/Settings */}
                    <aside className="w-72 bg-[#15152a] border-l border-slate-800 flex flex-col shrink-0 overflow-hidden z-20">
                        <div className="p-3 border-b border-slate-800">
                            <div className="flex bg-slate-800 p-1 rounded-lg">
                                <button onClick={() => setActiveTab('content')} className={`flex-1 py-1.5 text-xs font-bold uppercase tracking-wide rounded-md transition-colors ${activeTab === 'content' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}>Content</button>
                                <button onClick={() => setActiveTab('style')} className={`flex-1 py-1.5 text-xs font-bold uppercase tracking-wide rounded-md transition-colors ${activeTab === 'style' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}>Style</button>
                                <button onClick={() => setActiveTab('advanced')} className={`flex-1 py-1.5 text-xs font-bold uppercase tracking-wide rounded-md transition-colors ${activeTab === 'advanced' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}>Settings</button>
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            {/* Targeting GrapesJS Managers to these Containers */}
                            <div className={`${activeTab === 'style' ? 'block' : 'hidden'} h-full `}>
                                <div className="gjs-sm-container"></div>  {/* Style Manager mounts here */}
                            </div>
                            <div className={`${activeTab === 'content' ? 'block' : 'hidden'} h-full text-slate-400 p-4 text-sm text-center`}>
                                <div className="gjs-lm-container"></div> {/* Layer Manager mounts here */}
                            </div>
                            <div className={`${activeTab === 'advanced' ? 'block' : 'hidden'} h-full text-slate-400 p-4 text-sm text-center`}>
                                <div className="gjs-tm-container"></div> {/* Trait Manager mounts here */}
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
