import type { Editor } from 'grapesjs';

export const addCustomBlocks = (editor: Editor) => {
    const bm = editor.BlockManager;

    // 1. Basic Section / Container
    bm.add('section', {
        label: 'Section',
        category: 'Layout',
        content: `
      <section class="py-12 px-4 md:px-6 bg-white">
        <div class="container mx-auto">
            <h2 class="text-3xl font-bold text-center mb-8 text-slate-800">New Section</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div class="p-6 bg-slate-50 rounded-lg border border-slate-100">Column 1</div>
                <div class="p-6 bg-slate-50 rounded-lg border border-slate-100">Column 2</div>
                <div class="p-6 bg-slate-50 rounded-lg border border-slate-100">Column 3</div>
            </div>
        </div>
      </section>
    `,
        attributes: { class: 'fa fa-columns' }
    });

    bm.add('container', {
        label: 'Container',
        category: 'Layout',
        content: '<div class="container mx-auto p-4 border border-dashed border-slate-300 min-h-[100px]"></div>',
        attributes: { class: 'fa fa-square-o' }
    });

    // 2. Typography
    bm.add('heading-1', {
        label: 'Heading 1',
        category: 'Typography',
        content: '<h1 class="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Heading 1</h1>',
        attributes: { class: 'fa fa-header' }
    });

    bm.add('heading-2', {
        label: 'Heading 2',
        category: 'Typography',
        content: '<h2 class="text-3xl md:text-4xl font-bold text-slate-800 mb-3">Heading 2</h2>',
        attributes: { class: 'fa fa-header' }
    });

    bm.add('paragraph', {
        label: 'Paragraph',
        category: 'Typography',
        content: '<p class="text-base text-slate-600 leading-relaxed mb-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>',
        attributes: { class: 'fa fa-paragraph' }
    });

    // 3. Components
    bm.add('button', {
        label: 'Button',
        category: 'Components',
        content: '<a href="#" class="inline-block px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">Click Me</a>',
        attributes: { class: 'fa fa-hand-pointer-o' }
    });

    bm.add('button-outline', {
        label: 'Button (Outline)',
        category: 'Components',
        content: '<a href="#" class="inline-block px-6 py-3 border-2 border-indigo-600 text-indigo-600 font-semibold rounded-lg hover:bg-indigo-50 transition-colors">Click Me</a>',
        attributes: { class: 'fa fa-hand-pointer-o' }
    });

    bm.add('image', {
        label: 'Image',
        category: 'Media',
        content: { type: 'image', style: { color: 'black' }, activeOnRender: 1 },
        attributes: { class: 'fa fa-picture-o' }
    });

    bm.add('video', {
        label: 'Video',
        category: 'Media',
        content: { type: 'video', src: 'img/video2.webm', style: { height: '350px', width: '100%' } },
        attributes: { class: 'fa fa-youtube-play' }
    });

    bm.add('card', {
        label: 'Card',
        category: 'Components',
        content: `
      <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div class="h-48 bg-slate-200 w-full object-cover"></div>
        <div class="p-6">
          <h3 class="text-xl font-bold text-slate-900 mb-2">Card Title</h3>
          <p class="text-slate-600 mb-4">This is a simple card component built with Tailwind CSS.</p>
          <a href="#" class="text-indigo-600 font-medium hover:text-indigo-700">Read more &rarr;</a>
        </div>
      </div>
    `,
        attributes: { class: 'fa fa-id-card-o' }
    });

    // 4. Forms
    bm.add('input', {
        label: 'Input',
        category: 'Forms',
        content: '<input type="text" class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" placeholder="Enter text here..." />',
        attributes: { class: 'fa fa-pencil' }
    });

    bm.add('icon', {
        label: 'Icon',
        category: 'Basic',
        content: '<i class="fa fa-star text-2xl text-yellow-400"></i>',
        attributes: { class: 'fa fa-star' }
    });
};
