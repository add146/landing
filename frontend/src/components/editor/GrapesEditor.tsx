// import type { Editor } from 'grapesjs'; // Unused
import GjsEditor from '@grapesjs/react';
import grapesjs from 'grapesjs';
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
    // ... code ...

    // Skipping to the options part to avoid context mismatch issues if possible
    // actually I should replace the whole top part carefully.

    const { currentPage, updatePage } = useEditorStore();

    const onEditor = (editor: any) => {
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

        // Override the default save button from preset-webpage if present
        editor.Panels.addButton('options', {
            id: 'save-db',
            className: 'fa fa-floppy-o',
            command: 'save-db',
            attributes: { title: 'Save Page' }
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
        <div className="h-screen w-full bg-slate-900 text-white">
            <GjsEditor
                grapesjs={grapesjs}
                options={{
                    height: '100vh',
                    storageManager: false, // We handle saving manually

                    // Inject Tailwind CSS into the canvas
                    canvas: {
                        styles: [
                            'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css'
                        ],
                        scripts: [
                            'https://cdn.tailwindcss.com'
                        ]
                    },

                    deviceManager: {
                        devices: [
                            {
                                id: 'desktop',
                                name: 'Desktop',
                                width: '',
                            },
                            {
                                id: 'tablet',
                                name: 'Tablet',
                                width: '768px',
                                widthMedia: '992px',
                            },
                            {
                                id: 'mobilePortrait',
                                name: 'Mobile Portrait',
                                width: '320px',
                                widthMedia: '575px',
                            },
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
                            // Options for the preset-webpage plugin
                            modalImportTitle: 'Import',
                            modalImportLabel: '<div style="margin-bottom: 10px; font-size: 13px;">Paste here your HTML/CSS and click Import</div>',
                            modalImportContent: (editor: any) => editor.getHtml() + '<style>' + editor.getCss() + '</style>',
                        },
                        'grapesjs-tabs': {
                            tabsBlock: { category: 'Extra' }
                        },
                        'grapesjs-typed': {
                            block: { category: 'Extra', label: 'Typed' }
                        },
                        'gjs-component-countdown': {
                            label: 'Countdown',
                            category: 'Extra'
                        },
                        'grapesjs-tooltip': {
                            blockTooltip: { category: 'Extra' }
                        }
                    }
                }}
                onEditor={onEditor}
            >
            </GjsEditor>
        </div>
    );
}
