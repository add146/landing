import { create } from 'zustand';
import client from '../api/client';

interface Section {
    id: string;
    page_id: string;
    section_type: string;
    layout_variant: number;
    content: any;
    settings: any;
    sort_order: number;
    is_visible: number;
}

interface Element {
    id: string;
    section_id: string;
    element_type: string;
    content: any;
    style_desktop: any;
    style_tablet: any;
    style_mobile: any;
    sort_order: number;
    is_visible: number;
}

interface Page {
    id: string;
    website_id: string;
    title: string;
    slug: string;
    page_type: string;
    is_published: number;
    seo_title?: string;
    seo_description?: string;
    seo_keywords?: string;
    og_image?: string;
    twitter_card?: string;
}

interface EditorState {
    // Current state
    currentPage: Page | null;
    sections: Section[];
    elements: Record<string, Element[]>; // Keyed by section_id
    selectedId: string | null;
    selectedType: 'section' | 'element' | null;
    previewDevice: 'desktop' | 'tablet' | 'mobile';
    isSaving: boolean;

    // Actions
    loadPage: (pageId: string) => Promise<void>;
    updatePage: (data: Partial<Page>) => Promise<void>;
    addSection: (type: string, variant?: number) => Promise<void>;
    updateSection: (id: string, data: Partial<Section>) => Promise<void>;
    deleteSection: (id: string) => Promise<void>;
    reorderSections: (sections: Section[]) => Promise<void>;

    addElement: (sectionId: string, type: string) => Promise<void>;
    updateElement: (id: string, data: Partial<Element>) => Promise<void>;
    deleteElement: (id: string) => Promise<void>;

    selectItem: (id: string | null, type: 'section' | 'element' | null) => void;
    setPreviewDevice: (device: 'desktop' | 'tablet' | 'mobile') => void;
    clearSelection: () => void;
}

export const useEditorStore = create<EditorState>((set, get) => ({
    currentPage: null,
    sections: [],
    elements: {},
    selectedId: null,
    selectedType: null,
    previewDevice: 'desktop',
    isSaving: false,

    loadPage: async (pageId: string) => {
        try {
            // Load page details
            const pageResponse = await client.get(`/api/pages/${pageId}`);
            const page = pageResponse.data.page;
            const sections = pageResponse.data.sections || [];

            // Load elements for each section
            const elementsMap: Record<string, Element[]> = {};
            for (const section of sections) {
                const elementsResponse = await client.get(`/api/elements?section_id=${section.id}`);
                elementsMap[section.id] = elementsResponse.data.elements || [];
            }

            set({
                currentPage: page,
                sections: sections,
                elements: elementsMap,
                selectedId: null,
                selectedType: null,
            });
        } catch (error) {
            console.error('Failed to load page:', error);
            throw error;
        }
    },

    updatePage: async (data: Partial<Page>) => {
        const { currentPage } = get();
        if (!currentPage) return;

        try {
            set({ isSaving: true });
            const response = await client.patch(`/api/pages/${currentPage.id}`, data);

            set((state) => ({
                currentPage: { ...state.currentPage!, ...response.data.page },
                isSaving: false,
            }));
        } catch (error) {
            console.error('Failed to update page:', error);
            set({ isSaving: false });
            throw error;
        }
    },

    addSection: async (type: string, variant: number = 1) => {
        const { currentPage, sections } = get();
        if (!currentPage) return;

        try {
            set({ isSaving: true });
            const response = await client.post('/api/sections', {
                page_id: currentPage.id,
                section_type: type,
                layout_variant: variant,
                content: JSON.stringify({}),
                settings: JSON.stringify({}),
                sort_order: sections.length,
                is_visible: 1,
            });

            const newSection = response.data.section;
            set((state) => ({
                sections: [...state.sections, newSection],
                elements: { ...state.elements, [newSection.id]: [] },
                isSaving: false,
            }));
        } catch (error) {
            console.error('Failed to add section:', error);
            set({ isSaving: false });
        }
    },

    updateSection: async (id: string, data: Partial<Section>) => {
        try {
            set({ isSaving: true });
            await client.patch(`/api/sections/${id}`, data);

            set((state) => ({
                sections: state.sections.map((s) =>
                    s.id === id ? { ...s, ...data } : s
                ),
                isSaving: false,
            }));
        } catch (error) {
            console.error('Failed to update section:', error);
            set({ isSaving: false });
        }
    },

    deleteSection: async (id: string) => {
        try {
            set({ isSaving: true });
            await client.delete(`/api/sections/${id}`);

            set((state) => ({
                sections: state.sections.filter((s) => s.id !== id),
                elements: Object.fromEntries(
                    Object.entries(state.elements).filter(([key]) => key !== id)
                ),
                selectedId: state.selectedId === id ? null : state.selectedId,
                selectedType: state.selectedId === id ? null : state.selectedType,
                isSaving: false,
            }));
        } catch (error) {
            console.error('Failed to delete section:', error);
            set({ isSaving: false });
        }
    },

    reorderSections: async (sections: Section[]) => {
        const reorderData = sections.map((s, index) => ({
            id: s.id,
            sort_order: index,
        }));

        try {
            set({ isSaving: true });
            await client.patch('/api/sections/reorder', { sections: reorderData });
            set({ sections, isSaving: false });
        } catch (error) {
            console.error('Failed to reorder sections:', error);
            set({ isSaving: false });
        }
    },

    addElement: async (sectionId: string, type: string) => {
        const { elements } = get();
        const sectionElements = elements[sectionId] || [];

        try {
            set({ isSaving: true });
            const response = await client.post('/api/elements', {
                section_id: sectionId,
                element_type: type,
                content: JSON.stringify(getDefaultContent(type)),
                style_desktop: JSON.stringify({}),
                style_tablet: JSON.stringify({}),
                style_mobile: JSON.stringify({}),
                sort_order: sectionElements.length,
                is_visible: 1,
            });

            const newElement = response.data.element;
            set((state) => ({
                elements: {
                    ...state.elements,
                    [sectionId]: [...(state.elements[sectionId] || []), newElement],
                },
                isSaving: false,
            }));
        } catch (error) {
            console.error('Failed to add element:', error);
            set({ isSaving: false });
        }
    },

    updateElement: async (id: string, data: Partial<Element>) => {
        try {
            set({ isSaving: true });
            await client.patch(`/api/elements/${id}`, data);

            set((state) => ({
                elements: Object.fromEntries(
                    Object.entries(state.elements).map(([sectionId, els]) => [
                        sectionId,
                        els.map((el) => (el.id === id ? { ...el, ...data } : el)),
                    ])
                ),
                isSaving: false,
            }));
        } catch (error) {
            console.error('Failed to update element:', error);
            set({ isSaving: false });
        }
    },

    deleteElement: async (id: string) => {
        try {
            set({ isSaving: true });
            await client.delete(`/api/elements/${id}`);

            set((state) => ({
                elements: Object.fromEntries(
                    Object.entries(state.elements).map(([sectionId, els]) => [
                        sectionId,
                        els.filter((el) => el.id !== id),
                    ])
                ),
                selectedId: state.selectedId === id ? null : state.selectedId,
                selectedType: state.selectedId === id ? null : state.selectedType,
                isSaving: false,
            }));
        } catch (error) {
            console.error('Failed to delete element:', error);
            set({ isSaving: false });
        }
    },

    selectItem: (id: string | null, type: 'section' | 'element' | null) => {
        set({ selectedId: id, selectedType: type });
    },

    setPreviewDevice: (device: 'desktop' | 'tablet' | 'mobile') => {
        set({ previewDevice: device });
    },

    clearSelection: () => {
        set({ selectedId: null, selectedType: null });
    },
}));

// Helper function to get default content for element types
function getDefaultContent(type: string): any {
    switch (type) {
        case 'heading':
            return { text: 'Heading Text', level: 'h2' };
        case 'text':
            return { text: 'This is a paragraph of text.' };
        case 'button':
            return { text: 'Click Here', link: '#', target: '_self' };
        case 'image':
            return { src: '', alt: 'Image' };
        case 'video':
            return { url: '' };
        case 'icon':
            return { name: 'star' };
        case 'spacer':
            return { height: 40 };
        case 'divider':
            return { style: 'solid' };
        default:
            return {};
    }
}
