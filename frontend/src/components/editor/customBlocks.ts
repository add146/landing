import type { Editor } from 'grapesjs';

const myTailwindBlocks = (editor: Editor) => {
    const bm = editor.BlockManager;

    // 1. Basic Section / Container
    bm.add('section', {
        label: 'Section',
        category: 'Layout',
        media: '<i class="fa fa-columns"></i>',
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
    `
    });

    bm.add('container', {
        label: 'Container',
        category: 'Layout',
        media: '<i class="fa fa-square-o"></i>',
        content: '<div class="container mx-auto p-4 border border-dashed border-slate-300 min-h-[100px]"></div>'
    });

    // 2. Typography
    bm.add('heading-1', {
        label: 'Heading 1',
        category: 'Typography',
        media: '<i class="fa fa-header"></i>',
        content: '<h1 class="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Heading 1</h1>'
    });

    bm.add('heading-2', {
        label: 'Heading 2',
        category: 'Typography',
        media: '<i class="fa fa-header"></i>',
        content: '<h2 class="text-3xl md:text-4xl font-bold text-slate-800 mb-3">Heading 2</h2>'
    });

    bm.add('paragraph', {
        label: 'Paragraph',
        category: 'Typography',
        media: '<i class="fa fa-paragraph"></i>',
        content: '<p class="text-base text-slate-600 leading-relaxed mb-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>'
    });

    // 3. Components
    bm.add('button', {
        label: 'Button',
        category: 'Components',
        media: '<i class="fa fa-hand-pointer-o"></i>',
        content: '<a href="#" class="inline-block px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">Click Me</a>'
    });

    bm.add('button-outline', {
        label: 'Button (Outline)',
        category: 'Components',
        media: '<i class="fa fa-hand-pointer-o"></i>',
        content: '<a href="#" class="inline-block px-6 py-3 border-2 border-indigo-600 text-indigo-600 font-semibold rounded-lg hover:bg-indigo-50 transition-colors">Click Me</a>'
    });

    bm.add('image', {
        label: 'Image',
        category: 'Media',
        media: '<i class="fa fa-picture-o"></i>',
        content: { type: 'image', style: { color: 'black' }, activeOnRender: 1 }
    });

    bm.add('video', {
        label: 'Video',
        category: 'Media',
        media: '<i class="fa fa-youtube-play"></i>',
        content: { type: 'video', src: 'img/video2.webm', style: { height: '350px', width: '100%' } }
    });

    bm.add('custom-image-carousel', {
        label: 'My Carousel',
        category: 'Components',
        media: '<i class="fa fa-images"></i>',
        content: `
      <div class="relative w-full overflow-hidden group" data-carousel="true" data-autoplay="true" data-interval="3000">
        <!-- Slides Container -->
        <div class="flex transition-transform duration-500 ease-out h-64" data-carousel-track>
          <!-- Slide 1 -->
          <div class="w-full flex-shrink-0 bg-slate-100 flex items-center justify-center overflow-hidden relative">
             <img src="https://placehold.co/800x400?text=Slide+1" class="w-full h-full object-cover" alt="Slide 1" />
             <div class="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-4 text-center opacity-0 group-hover:opacity-100 transition-opacity">Caption 1</div>
          </div>
          <!-- Slide 2 -->
          <div class="w-full flex-shrink-0 bg-slate-100 flex items-center justify-center overflow-hidden relative">
             <img src="https://placehold.co/800x400?text=Slide+2" class="w-full h-full object-cover" alt="Slide 2" />
             <div class="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-4 text-center opacity-0 group-hover:opacity-100 transition-opacity">Caption 2</div>
          </div>
          <!-- Slide 3 -->
          <div class="w-full flex-shrink-0 bg-slate-100 flex items-center justify-center overflow-hidden relative">
             <img src="https://placehold.co/800x400?text=Slide+3" class="w-full h-full object-cover" alt="Slide 3" />
             <div class="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-4 text-center opacity-0 group-hover:opacity-100 transition-opacity">Caption 3</div>
          </div>
        </div>
        
        <!-- Controls -->
        <button class="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-slate-800 p-2 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100" data-carousel-prev>
          <i class="fa fa-chevron-left"></i>
        </button>
        <button class="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-slate-800 p-2 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100" data-carousel-next>
          <i class="fa fa-chevron-right"></i>
        </button>
      </div>
    `
    });

    bm.add('card', {
        label: 'Card',
        category: 'Components',
        media: '<i class="fa fa-id-card-o"></i>',
        content: `
      <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div class="h-48 bg-slate-200 w-full object-cover"></div>
        <div class="p-6">
          <h3 class="text-xl font-bold text-slate-900 mb-2">Card Title</h3>
          <p class="text-slate-600 mb-4">This is a simple card component built with Tailwind CSS.</p>
          <a href="#" class="text-indigo-600 font-medium hover:text-indigo-700">Read more &rarr;</a>
        </div>
      </div>
    `
    });

    // 4. Forms
    bm.add('input', {
        label: 'Input',
        category: 'Forms',
        media: '<i class="fa fa-pencil"></i>',
        content: '<input type="text" class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" placeholder="Enter text here..." />'
    });

    bm.add('icon', {
        label: 'Icon',
        category: 'Basic',
        media: '<i class="fa fa-star"></i>',
        content: '<i class="fa fa-star text-2xl text-yellow-400"></i>'
    });
    // 5. Section Templates (Hero, Features, Testimonial)
    bm.add('hero-section', {
        label: 'Hero',
        category: 'Section',
        media: '<i class="fa fa-window-maximize"></i>',
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
    `
    });

    bm.add('features-grid', {
        label: 'Features',
        category: 'Section',
        media: '<i class="fa fa-th-large"></i>',
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
    `
    });

    bm.add('testimonial', {
        label: 'Testimonial',
        category: 'Section',
        media: '<i class="fa fa-quote-right"></i>',
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
    `
    });

    // 6. Social / Bio Link Widgets (Elementor Style)
    bm.add('bio-link', {
        label: 'Link in Bio',
        category: 'Basic',
        media: '<i class="fa fa-id-badge"></i>',
        content: `
      <div class="max-w-md mx-auto p-8 bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 text-center font-sans">
        <!-- Profile Image -->
        <div class="mb-6 relative inline-block group">
            <div class="w-32 h-32 mx-auto rounded-full p-1 border-4 border-indigo-100 dark:border-indigo-900 overflow-hidden">
                <img src="https://placehold.co/400x400?text=Profile" alt="Profile" class="w-full h-full object-cover rounded-full" />
            </div>
        </div>

        <!-- Identity -->
        <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-2">Your Name</h2>
        <p class="text-slate-500 dark:text-slate-400 mb-8 px-4 leading-relaxed">
            Digital Creator & Designer. Sharing my journey and tips for building better products.
        </p>

        <!-- Links Stack -->
        <div class="space-y-4 mb-10">
            <a href="#" class="block w-full py-4 px-6 bg-slate-50 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 border border-slate-200 dark:border-slate-700 rounded-xl transition-all hover:scale-[1.02] hover:border-indigo-300 dark:hover:border-indigo-500 group">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                        <i class="fa fa-globe text-xl text-indigo-500"></i>
                         <span class="font-semibold text-slate-700 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">Visit Website</span>
                    </div>
                    <i class="fa fa-chevron-right text-slate-400 text-sm"></i>
                </div>
            </a>
            
            <a href="#" class="block w-full py-4 px-6 bg-slate-50 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 border border-slate-200 dark:border-slate-700 rounded-xl transition-all hover:scale-[1.02] hover:border-indigo-300 dark:hover:border-indigo-500 group">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                        <i class="fa fa-shopping-bag text-xl text-pink-500"></i>
                         <span class="font-semibold text-slate-700 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">My Shop</span>
                    </div>
                     <i class="fa fa-chevron-right text-slate-400 text-sm"></i>
                </div>
            </a>

            <a href="#" class="block w-full py-4 px-6 bg-slate-50 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 border border-slate-200 dark:border-slate-700 rounded-xl transition-all hover:scale-[1.02] hover:border-indigo-300 dark:hover:border-indigo-500 group">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                        <i class="fa fa-youtube-play text-xl text-red-500"></i>
                         <span class="font-semibold text-slate-700 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">Latest Video</span>
                    </div>
                     <i class="fa fa-chevron-right text-slate-400 text-sm"></i>
                </div>
            </a>
        </div>

        <!-- Social Icons -->
        <div class="flex justify-center gap-6">
            <a href="#" class="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-indigo-600 hover:text-white transition-all hover:-translate-y-1">
                <i class="fa fa-instagram text-lg"></i>
            </a>
            <a href="#" class="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-blue-500 hover:text-white transition-all hover:-translate-y-1">
                <i class="fa fa-twitter text-lg"></i>
            </a>
             <a href="#" class="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-blue-600 hover:text-white transition-all hover:-translate-y-1">
                <i class="fa fa-linkedin text-lg"></i>
            </a>
             <a href="#" class="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-black hover:text-white transition-all hover:-translate-y-1">
                <i class="fa fa-tiktok text-lg"></i>
            </a>
        </div>
      </div>
    `
    });

};

export default myTailwindBlocks;
