# Frontend Components
## React + TypeScript

---

## 📁 Structure

```
frontend/src/
├── components/
│   ├── ui/           # Base UI components
│   ├── layout/       # Layout components
│   ├── editor/       # Page editor components
│   ├── elements/     # Drag-drop elements
│   └── sections/     # Pre-built sections
├── pages/            # Route pages
├── hooks/            # Custom hooks
├── stores/           # Zustand stores
├── lib/              # Utilities
└── types/            # TypeScript types
```

---

## 🧱 UI Components

| Component | File | Description |
|-----------|------|-------------|
| Button | `ui/Button.tsx` | Primary, secondary, ghost variants |
| Input | `ui/Input.tsx` | Text input with validation |
| Select | `ui/Select.tsx` | Dropdown select |
| Modal | `ui/Modal.tsx` | Dialog modal |
| Toast | `ui/Toast.tsx` | Notifications |
| Card | `ui/Card.tsx` | Content card |
| Avatar | `ui/Avatar.tsx` | User avatar |
| Badge | `ui/Badge.tsx` | Status badge |

---

## 📐 Layout Components

| Component | File | Description |
|-----------|------|-------------|
| Sidebar | `layout/Sidebar.tsx` | Navigation sidebar |
| Header | `layout/Header.tsx` | Top navbar |
| DashboardLayout | `layout/DashboardLayout.tsx` | Dashboard wrapper |
| EditorLayout | `layout/EditorLayout.tsx` | Editor wrapper |

---

## ✏️ Editor Components

| Component | File | Description |
|-----------|------|-------------|
| Canvas | `editor/Canvas.tsx` | Live preview area |
| ElementsPanel | `editor/ElementsPanel.tsx` | Left panel elements |
| SettingsPanel | `editor/SettingsPanel.tsx` | Right panel settings |
| Toolbar | `editor/Toolbar.tsx` | Top toolbar |
| Navigator | `editor/Navigator.tsx` | Layer navigator |
| DroppableZone | `editor/DroppableZone.tsx` | Drop target |
| DraggableElement | `editor/DraggableElement.tsx` | Draggable item |

---

## 🔲 Element Components (60+)

### Basic
- `elements/Heading.tsx`
- `elements/TextEditor.tsx`
- `elements/Image.tsx`
- `elements/Video.tsx`
- `elements/Button.tsx`
- `elements/Divider.tsx`
- `elements/Spacer.tsx`
- `elements/Icon.tsx`

### General
- `elements/IconBox.tsx`
- `elements/ImageBox.tsx`
- `elements/Counter.tsx`
- `elements/ProgressBar.tsx`
- `elements/Testimonial.tsx`
- `elements/Tabs.tsx`
- `elements/Accordion.tsx`

### Pro
- `elements/Slider.tsx`
- `elements/Gallery.tsx`
- `elements/PriceTable.tsx`
- `elements/Countdown.tsx`
- `elements/AnimatedHeadline.tsx`

---

## 🗂️ Zustand Stores

```typescript
// stores/authStore.ts
interface AuthState {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

// stores/editorStore.ts
interface EditorState {
  website: Website | null;
  page: Page | null;
  sections: Section[];
  selectedElement: Element | null;
  addSection: (section: Section) => void;
  updateElement: (id: string, data: Partial<Element>) => void;
  deleteElement: (id: string) => void;
}

// stores/uiStore.ts
interface UIState {
  sidebarOpen: boolean;
  previewMode: 'desktop' | 'tablet' | 'mobile';
  toggleSidebar: () => void;
}
```

---

## 🔗 Next

- [05_IMPLEMENTATION_STEPS.md](./05_IMPLEMENTATION_STEPS.md)
