# Project Overview
## Landing Page Builder SaaS

---

## 🎯 Tujuan Proyek

Membangun platform SaaS untuk membuat landing page profesional dengan:
- Drag-and-drop builder seperti Elementor
- AI-powered content generation
- vCard digital builder
- Multi-tenant (Admin & User)

---

## 🏗️ Arsitektur

```
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND                                │
│                  React + Vite + TypeScript                   │
│              Cloudflare Pages (Static Hosting)               │
├─────────────────────────────────────────────────────────────┤
│                      BACKEND API                             │
│                   Cloudflare Workers                         │
│                      Hono.js                                 │
├─────────────────────────────────────────────────────────────┤
│    D1 Database    │    R2 Storage    │    KV Cache          │
│     (SQLite)      │    (Media/Assets)│   (Sessions)         │
└─────────────────────────────────────────────────────────────┘
```

---

## 👥 User Roles

| Role | Akses |
|------|-------|
| **Super Admin** | Full access, manage users, plans, settings |
| **User** | Create websites, vcards, manage own content |

---

## 🔑 Core Features

### 1. Page Builder
- 60+ drag-drop elements
- 17 pre-built sections
- Live preview (WYSIWYG)
- Responsive editing (Desktop/Tablet/Mobile)

### 2. AI Integration
- Website wizard (one-click generation)
- Section content generator
- Legal page generator
- Multi-provider (OpenAI, Claude, Perplexity, Ollama)

### 3. vCard Builder
- Digital business card
- Mobile-optimized view
- QR code sharing
- Multiple templates

### 4. Theme & SEO
- Color customization
- Custom CSS/JS
- Meta tags & OG tags
- Twitter cards

---

## 📁 UI Screens Available

Total: **39 screens** di folder `UI/`

Lihat: [UI/README.md](../UI/README.md)

---

## 🔗 Related Documents

- [01_SETUP_GUIDE.md](./01_SETUP_GUIDE.md) - Next
