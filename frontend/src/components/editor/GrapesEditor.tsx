// import React from 'react'; // Not needed with new JSX transform
import GjsEditor from '@grapesjs/react';
import grapesjs from 'grapesjs';
// @ts-ignore
import webpagePlugin from 'grapesjs-preset-webpage';
import { useEditorStore } from '../../store/editorStore';
import { Loader2 } from 'lucide-react';

export default function GrapesEditor() {
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
                        webpagePlugin
                    ],
                    pluginsOpts: {
                        'gjs-preset-webpage': {
                            // Options for the preset-webpage plugin
                            modalImportTitle: 'Import',
                            modalImportLabel: '<div style="margin-bottom: 10px; font-size: 13px;">Paste here your HTML/CSS and click Import</div>',
                            modalImportContent: (editor: any) => editor.getHtml() + '<style>' + editor.getCss() + '</style>',
                        }
                    }
                }}
                onEditor={onEditor}
            >
            </GjsEditor>
        </div>
    );
}
