import { useState } from 'react';
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

export default function GrapesEditor() {
    const navigate = useNavigate();
    const { currentPage, updatePage } = useEditorStore();
    const [editorInstance, setEditorInstance] = useState<Editor | null>(null);
    const [activeTab, setActiveTab] = useState<'content' | 'style' | 'advanced'>('style');
    const [pageSettingsOpen, setPageSettingsOpen] = useState(false);
    const [aiModalOpen, setAiModalOpen] = useState(false);
    const [importModalOpen, setImportModalOpen] = useState(false);

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

            {/* Main Layout Area */}
            <div className="flex flex-col flex-1 h-full min-w-0">

                {/* Header */}
                <header className="flex items-center justify-between px-4 py-2 border-b border-slate-200 bg-white shrink-0 h-14 z-50">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500">
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
                                    undoManager: { trackSelection: false },
                                    selectorManager: { componentFirst: true },
                                    projectData: undefined, // Loaded manually
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
                                        /*
                                            [webpagePlugin]: {
                                                modalImportTitle: 'Import Template',
                                                modalImportLabel: '<div style="margin-bottom: 10px; font-size: 13px;">Paste your HTML/CSS here</div>',
                                                modalImportContent: function(editor: any) {
                                                    return editor.getHtml() + '<style>' + editor.getCss() + '</style>';
                                                },
                                            },
                                        */
                                    },
                                }}
                                onEditor={onEditor}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Sidebar */}
            <div className="w-80 border-l border-slate-200 bg-white flex flex-col shrink-0 overflow-hidden z-20">
                {/* Tabs */}
                <div className="flex border-b border-slate-200">
                    <button
                        onClick={() => setActiveTab('style')}
                        className={`flex-1 py-3 text-xs font-medium border-b-2 transition-colors flex items-center justify-center gap-2 ${activeTab === 'style' ? 'border-blue-600 text-blue-600 bg-blue-50/50' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
                    >
                        <span className="material-symbols-outlined text-[18px]">brush</span>
                        Style
                    </button>
                    <button
                        onClick={() => setActiveTab('content')}
                        className={`flex-1 py-3 text-xs font-medium border-b-2 transition-colors flex items-center justify-center gap-2 ${activeTab === 'content' ? 'border-blue-600 text-blue-600 bg-blue-50/50' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
                    >
                        <span className="material-symbols-outlined text-[18px]">add_box</span>
                        Blocks
                    </button>
                    <button
                        onClick={() => setActiveTab('advanced')}
                        className={`flex-1 py-3 text-xs font-medium border-b-2 transition-colors flex items-center justify-center gap-2 ${activeTab === 'advanced' ? 'border-blue-600 text-blue-600 bg-blue-50/50' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
                    >
                        <span className="material-symbols-outlined text-[18px]">layers</span>
                        Layers
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto custom-scrollbar bg-white">
                    <div id="styles-container" className={activeTab === 'style' ? 'block' : 'hidden'}></div>
                    <div id="blocks-container" className={`p-4 grid grid-cols-2 gap-3 ${activeTab === 'content' ? 'block' : 'hidden'}`}></div>
                    <div id="layers-container" className={activeTab === 'advanced' ? 'block' : 'hidden'}></div>
                    <div id="trait-container" className={activeTab === 'advanced' ? 'block' : 'hidden'}></div>
                </div>
            </div>

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
        </div>
    );
}
