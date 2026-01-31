# Landing Page Builder
## Complete SaaS Application

**Tech Stack**: Cloudflare Workers + Pages + D1 + R2

---

## 🔗 Repository

```
https://github.com/add146/landing.git
```

> ⚠️ **IMPORTANT RULE**: Setiap ada perubahan atau penambahan file, WAJIB push ke GitHub!
> 
> ```bash
> git add .
> git commit -m "feat: description"
> git push origin main
> ```

---

## 🌐 Live Deployment

**Phase 1 - Authentication System:**
- 🚀 **Primary URL:** https://landing-bzy.pages.dev
- 🚀 **Custom Domain:** https://build.khibroh.com

**Status:** ✅ Deployed & Live on Cloudflare Pages

**Features Available:**
- User registration with password strength validation
- Login/logout functionality
- Protected dashboard
- JWT-based authentication
- Dark mode UI design

---

## 📚 Documentation

| File | Description |
|------|-------------|
| [00_PROJECT_OVERVIEW.md](./docs/00_PROJECT_OVERVIEW.md) | Ringkasan proyek |
| [01_SETUP_GUIDE.md](./docs/01_SETUP_GUIDE.md) | Setup development environment |
| [02_DATABASE_SCHEMA.md](./docs/02_DATABASE_SCHEMA.md) | D1 database schema |
| [03_BACKEND_API.md](./docs/03_BACKEND_API.md) | API endpoints documentation |
| [04_FRONTEND_COMPONENTS.md](./docs/04_FRONTEND_COMPONENTS.md) | React components |
| [05_IMPLEMENTATION_STEPS.md](./docs/05_IMPLEMENTATION_STEPS.md) | Step-by-step guide |
| [UI/README.md](./UI/README.md) | UI screens documentation |

---

## 🗂️ Project Structure

```
Landing Page/
├── docs/                    # Documentation
│   ├── 00_PROJECT_OVERVIEW.md
│   ├── 01_SETUP_GUIDE.md
│   ├── 02_DATABASE_SCHEMA.md
│   ├── 03_BACKEND_API.md
│   ├── 04_FRONTEND_COMPONENTS.md
│   └── 05_IMPLEMENTATION_STEPS.md
├── UI/                      # UI Designs (39 screens)
│   └── README.md
├── backend/                 # Cloudflare Workers API
│   ├── src/
│   ├── wrangler.toml
│   └── package.json
├── frontend/                # React + Vite
│   ├── src/
│   ├── vite.config.ts
│   └── package.json
└── README.md               # This file
```

---

## 🚀 Quick Start

```bash
# 1. Clone & Install
cd "c:\Aplikasi\Landing Page"

# 2. Setup Backend
cd backend
npm install
npx wrangler d1 create landing-page-db
npx wrangler r2 bucket create landing-page-assets

# 3. Setup Frontend
cd ../frontend
npm install
npm run dev
```

---

## 📋 Features

- ✅ Drag & Drop Page Builder (Elementor-style)
- ✅ 60+ UI Elements
- ✅ AI Website Wizard
- ✅ vCard Builder
- ✅ Theme Customization
- ✅ SEO Optimization
- ✅ Multi-tenant SaaS
- ✅ Admin Dashboard
