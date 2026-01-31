import type { Editor } from 'grapesjs';

const myTailwindBlocks = (editor: Editor) => {
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
    // 5. Section Templates (Hero, Features, Testimonial)
    bm.add('hero-section', {
        label: 'Hero',
        category: 'Section',
        content: `
      <section class="relative bg-white dark:bg-slate-900 py-20 overflow-hidden">
        <div class="container mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center gap-12">
            <div class="flex-1 space-y-6">
                <h1 class="text-5xl font-black leading-tight text-slate-900 dark:text-white">
                    Build your online presence with AI.
                </h1>
                <p class="text-lg text-slate-600 dark:text-slate-400">
                    Create stunning landing pages in minutes using our drag-and-drop editor.
                </p>
                <div class="flex gap-4 pt-2">
                    <a href="#" class="inline-block px-8 py-4 bg-indigo-600 text-white font-bold rounded-lg shadow-lg hover:bg-indigo-700 transition-colors">Get Started</a>
                    <a href="#" class="inline-block px-8 py-4 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">Learn More</a>
                </div>
            </div>
            <div class="flex-1 w-full relative">
                <div class="aspect-video bg-slate-200 dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden">
                     <img src="https://placehold.co/600x400/6264f4/ffffff?text=Hero+Image" alt="Hero" class="w-full h-full object-cover" />
                </div>
            </div>
        </div>
      </section>
    `,
        attributes: { class: 'fa fa-window-maximize' }
    });

    bm.add('features-grid', {
        label: 'Features',
        category: 'Section',
        content: `
      <section class="py-20 bg-slate-50 dark:bg-slate-950">
        <div class="container mx-auto px-6">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div class="p-8 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow">
                    <div class="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6">
                        <i class="fa fa-bolt text-2xl"></i>
                    </div>
                    <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-3">Fast Setup</h3>
                    <p class="text-slate-600 dark:text-slate-400">Launch in minutes, not days. Our templates are designed for speed.</p>
                </div>
                <div class="p-8 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow">
                    <div class="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6">
                        <i class="fa fa-paint-brush text-2xl"></i>
                    </div>
                    <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-3">Custom Design</h3>
                    <p class="text-slate-600 dark:text-slate-400">Tailor every pixel to your brand with our advanced style editor.</p>
                </div>
                <div class="p-8 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow">
                    <div class="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6">
                         <i class="fa fa-magic text-2xl"></i>
                    </div>
                    <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-3">AI Powered</h3>
                    <p class="text-slate-600 dark:text-slate-400">Generate copy and images instantly using state-of-the-art AI.</p>
                </div>
            </div>
        </div>
      </section>
    `,
        attributes: { class: 'fa fa-th-large' }
    });

    bm.add('testimonial', {
        label: 'Testimonial',
        category: 'Section',
        content: `
      <section class="py-20 bg-white dark:bg-slate-900">
        <div class="container mx-auto px-6 text-center max-w-4xl">
            <div class="mb-8">
                 <i class="fa fa-quote-left text-4xl text-indigo-200 dark:text-indigo-900"></i>
            </div>
            <p class="text-2xl md:text-3xl font-medium text-slate-900 dark:text-white mb-8 leading-relaxed">
                "This builder has completely transformed how we create landing pages. The AI features are a game changer!"
            </p>
            <div class="flex items-center justify-center gap-4">
                <div class="w-12 h-12 bg-slate-200 rounded-full overflow-hidden">
                    <img src="https://placehold.co/100x100?text=Avatar" alt="User" class="w-full h-full object-cover" />
                </div>
                <div class="text-left">
                    <div class="font-bold text-slate-900 dark:text-white">Sarah Johnson</div>
                    <div class="text-sm text-slate-500">Marketing Director</div>
                </div>
            </div>
        </div>
      </section>
    `,
        attributes: { class: 'fa fa-quote-right' }
    });
};

export default myTailwindBlocks;
