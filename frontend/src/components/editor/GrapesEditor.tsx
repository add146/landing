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
    const [pageSettingsOpen, setPageSettingsOpen] = useState(false);
    const [aiModalOpen, setAiModalOpen] = useState(false);

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
                        <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500">
                            <span className="material-symbols-outlined">arrow_back</span>
                        </button>
                        <div className="flex items-center gap-3">
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-slate-900">{currentPage.title}</span>
                                <span className="text-[10px] text-slate-500">Path: /{currentPage.slug}</span>
                            </div>
                            <button onClick={() => setPageSettingsOpen(!pageSettingsOpen)} className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-medium text-slate-600 transition-colors" title="Page SEO & Metadata">
                                <span className="material-symbols-outlined text-[16px]">settings</span>
                                <span>Page Settings</span>
                            </button>
                            <div className="flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded-full text-[10px] font-bold border border-green-200">
                                <span className="material-symbols-outlined text-[12px]">analytics</span>
                                SEO: 92/100
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Devices */}
                        <div className="flex bg-slate-100 rounded-lg p-1 mr-2 gap-1">
                            <button onClick={() => editorInstance?.setDevice('Desktop')} className="p-2 rounded hover:bg-white hover:text-primary hover:shadow-sm text-slate-500 transition-all"><span className="material-symbols-outlined text-[20px]">desktop_windows</span></button>
                            <button onClick={() => editorInstance?.setDevice('Tablet')} className="p-2 rounded hover:bg-white hover:text-primary hover:shadow-sm text-slate-500 transition-all"><span className="material-symbols-outlined text-[20px]">tablet_mac</span></button>
                            <button onClick={() => editorInstance?.setDevice('Mobile Portrait')} className="p-2 rounded hover:bg-white hover:text-primary hover:shadow-sm text-slate-500 transition-all"><span className="material-symbols-outlined text-[20px]">smartphone</span></button>
                        </div>
                        <div className="h-6 w-px bg-slate-200 mx-1"></div>
                        <button onClick={() => editorInstance?.runCommand('core:undo')} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500">
                            <span className="material-symbols-outlined text-[20px]">undo</span>
                        </button>
                        <button onClick={() => editorInstance?.runCommand('core:redo')} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500">
                            <span className="material-symbols-outlined text-[20px]">redo</span>
                        </button>
                    </div>

                    <div className="flex items-center gap-3">
                        <button onClick={() => editorInstance?.runCommand('preview')} className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
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

                    {/* Editor Canvas */}
                    {/* Editor Canvas */}
                    <main className="flex-1 bg-slate-50 relative overflow-hidden flex flex-col">
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
                                blockManager: {
                                    appendTo: '#blocks-custom-container',
                                },
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

                        {/* AI Assistant Modal (Centered) */}
                        {aiModalOpen && (
                            <div className="absolute top-[30%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] bg-[#15152a] rounded-2xl shadow-2xl border border-primary/20 ring-4 ring-primary/5 z-50 overflow-hidden transform transition-all animate-fade-in-scale">
                                <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                                <span className="material-symbols-outlined text-primary filled">auto_awesome</span>
                                                AI Assistant
                                            </h3>
                                            <p className="text-slate-400 text-sm mt-1">Generate a new section or modify existing content.</p>
                                        </div>
                                        <button onClick={() => setAiModalOpen(false)} className="text-slate-400 hover:text-slate-200"><span className="material-symbols-outlined">close</span></button>
                                    </div>
                                    <div className="mb-3">
                                        <label className="text-[10px] uppercase font-bold text-slate-400 mb-1.5 block tracking-wider">Model Provider</label>
                                        <div className="relative">
                                            <select className="w-full appearance-none bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-lg px-3 py-2 focus:ring-1 focus:ring-primary focus:border-primary">
                                                <option>OpenAI GPT-4o (Best Quality)</option>
                                                <option>Anthropic Claude 3.5 Sonnet (Fastest)</option>
                                                <option>Gemini Pro (Google)</option>
                                            </select>
                                            <span className="material-symbols-outlined absolute right-3 top-2.5 text-slate-400 pointer-events-none text-[18px]">expand_more</span>
                                        </div>
                                    </div>
                                    <div className="relative mb-4">
                                        <textarea className="w-full rounded-xl border-slate-700 bg-slate-900 text-white text-sm p-4 focus:border-primary focus:ring-primary h-28 resize-none shadow-inner" placeholder="E.g., Create a pricing section with 3 distinct tiers, highlighting the 'Pro' plan in the middle..."></textarea>
                                        <div className="absolute bottom-3 right-3 flex gap-2">
                                            <button className="p-1.5 rounded-md hover:bg-slate-800 text-slate-500" title="Voice Input"><span className="material-symbols-outlined text-[18px]">mic</span></button>
                                            <button className="p-1.5 rounded-md hover:bg-slate-800 text-slate-500" title="Upload Reference"><span className="material-symbols-outlined text-[18px]">image</span></button>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div className="flex gap-2 text-xs">
                                            <button className="px-2 py-1 bg-slate-800 rounded-full text-slate-400 cursor-pointer hover:bg-slate-700 transition-colors">Testimonials</button>
                                            <button className="px-2 py-1 bg-slate-800 rounded-full text-slate-400 cursor-pointer hover:bg-slate-700 transition-colors">FAQ</button>
                                        </div>
                                        <button className="bg-primary hover:bg-indigo-600 text-white text-sm font-bold px-5 py-2 rounded-lg shadow-md shadow-primary/20 transition-all flex items-center gap-2">
                                            <span className="material-symbols-outlined text-[18px]">magic_button</span>
                                            Generate
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Page Settings Modal (Centered Overlay) */}
                        {pageSettingsOpen && (
                            <div className="absolute inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center">
                                <div className="bg-[#15152a] w-[500px] rounded-xl shadow-2xl border border-slate-800 overflow-hidden">
                                    <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center">
                                        <h3 className="font-bold text-lg text-white">Page Settings</h3>
                                        <button className="text-slate-400 hover:text-slate-200" onClick={() => setPageSettingsOpen(false)}><span className="material-symbols-outlined">close</span></button>
                                    </div>
                                    <div className="p-6 space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-300 mb-1">Page Title</label>
                                            <input className="w-full rounded-lg border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:ring-primary focus:border-primary" type="text" defaultValue={currentPage.title} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-300 mb-1">URL Slug</label>
                                            <div className="flex items-center">
                                                <span className="bg-slate-800 border border-r-0 border-slate-700 px-3 py-2 text-sm text-slate-400 rounded-l-lg">website.com/</span>
                                                <input className="flex-1 rounded-r-lg border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:ring-primary focus:border-primary" type="text" defaultValue={currentPage.slug} />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-300 mb-1">SEO Description</label>
                                            <textarea className="w-full rounded-lg border-slate-700 bg-slate-900 px-3 py-2 text-sm h-24 text-white focus:ring-primary focus:border-primary"></textarea>
                                        </div>
                                    </div>
                                    <div className="px-6 py-4 bg-slate-900/50 flex justify-end gap-2">
                                        <button className="px-4 py-2 text-sm font-medium text-slate-400 hover:bg-slate-800 rounded-lg" onClick={() => setPageSettingsOpen(false)}>Cancel</button>
                                        <button className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-lg">Save Changes</button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </main>


                    {/* Right Sidebar - Styles/Settings */}
                    <aside className="w-72 bg-white border-l border-slate-200 flex flex-col shrink-0 overflow-hidden z-20">
                        <div className="p-3 border-b border-slate-200">
                            <div className="flex bg-slate-100 p-1 rounded-lg">
                                <button onClick={() => setActiveTab('content')} className={`flex-1 py-1.5 text-xs font-bold uppercase tracking-wide rounded-md transition-colors ${activeTab === 'content' ? 'bg-white text-primary shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700'}`}>Layer</button>
                                <button onClick={() => setActiveTab('style')} className={`flex-1 py-1.5 text-xs font-bold uppercase tracking-wide rounded-md transition-colors ${activeTab === 'style' ? 'bg-white text-primary shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700'}`}>Style</button>
                                <button onClick={() => setActiveTab('advanced')} className={`flex-1 py-1.5 text-xs font-bold uppercase tracking-wide rounded-md transition-colors ${activeTab === 'advanced' ? 'bg-white text-primary shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700'}`}>Settings</button>
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            {/* Targeting GrapesJS Managers to these Containers */}
                            <div className={`${activeTab === 'style' ? 'block' : 'hidden'} h-full `}>
                                <div className="gjs-sm-container"></div>  {/* Style Manager mounts here */}
                            </div>
                            <div className={`${activeTab === 'content' ? 'block' : 'hidden'} h-full text-slate-600 p-4 text-sm text-center`}>
                                <div className="gjs-lm-container"></div> {/* Layer Manager mounts here */}
                            </div>
                            <div className={`${activeTab === 'advanced' ? 'block' : 'hidden'} h-full text-slate-600 p-4 text-sm text-center`}>
                                <div className="gjs-tm-container"></div> {/* Trait Manager mounts here */}
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
