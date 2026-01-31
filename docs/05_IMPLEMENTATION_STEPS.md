# Implementation Steps
## Step-by-Step Development Guide

---

## 📋 Overview

Total estimasi: **8-12 minggu** untuk MVP

| Phase | Duration | Focus |
|-------|----------|-------|
| Phase 1 | 2 minggu | Setup & Auth |
| Phase 2 | 2 minggu | Core Backend |
| Phase 3 | 3 minggu | Page Editor |
| Phase 4 | 1 minggu | vCard Builder |
| Phase 5 | 2 minggu | AI & Advanced |
| Phase 6 | 1 minggu | Admin & Deploy |

---

## 🔵 PHASE 1: Setup & Authentication (Week 1-2)

### Step 1.1: Initialize Projects
```bash
# Backend
mkdir backend && cd backend
npm init -y
npm install hono @hono/zod-validator zod bcryptjs jose
npm install -D wrangler typescript @cloudflare/workers-types

# Frontend
cd ..
npm create vite@latest frontend -- --template react-ts
cd frontend
npm install react-router-dom zustand axios lucide-react
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Step 1.2: Setup Cloudflare Resources
Ikuti [01_SETUP_GUIDE.md](./01_SETUP_GUIDE.md)

### Step 1.3: Create Database Schema
```bash
wrangler d1 execute landing-page-db --file=./schema.sql
```
Ikuti [02_DATABASE_SCHEMA.md](./02_DATABASE_SCHEMA.md)

### Step 1.4: Build Auth API
- [ ] `POST /api/auth/register`
- [ ] `POST /api/auth/login`
- [ ] `POST /api/auth/logout`
- [ ] JWT middleware

### Step 1.5: Build Auth UI
- [ ] Login page → `UI/saas_login_screen/`
- [ ] Register page → `UI/user_registration_screen/`
- [ ] Forgot password → `UI/forgot_password_screen/`

**Deliverable**: User dapat register, login, logout

---

## 🔵 PHASE 2: Core Backend (Week 3-4)

### Step 2.1: Websites API
- [ ] `GET /api/websites`
- [ ] `POST /api/websites`
- [ ] `GET /api/websites/:id`
- [ ] `PATCH /api/websites/:id`
- [ ] `DELETE /api/websites/:id`

### Step 2.2: Pages API
- [ ] CRUD endpoints untuk pages
- [ ] Page reordering

### Step 2.3: Sections API
- [ ] CRUD endpoints untuk sections
- [ ] Section reordering
- [ ] Duplicate section

### Step 2.4: Elements API
- [ ] CRUD endpoints untuk elements
- [ ] Nested elements support

### Step 2.5: Media API
- [ ] Upload to R2
- [ ] List media
- [ ] Delete media

**Deliverable**: Full CRUD API untuk semua entities

---

## 🔵 PHASE 3: Page Editor (Week 5-7)

### Step 3.1: Dashboard UI
- [ ] Dashboard layout → `UI/user_dashboard_overview/`
- [ ] Websites list → `UI/websites_list_management/`
- [ ] Create website wizard → `UI/create_website_wizard/`

### Step 3.2: Editor Layout
- [ ] Editor canvas → `UI/website_page_editor/`
- [ ] Elements panel (left)
- [ ] Settings panel (right)
- [ ] Toolbar (top)

### Step 3.3: Drag & Drop System
```bash
npm install @dnd-kit/core @dnd-kit/sortable
```
- [ ] DroppableZone component
- [ ] DraggableElement component
- [ ] Section reordering
- [ ] Element reordering

### Step 3.4: Build Elements (Priority Order)
**Week 5**: Basic Elements
- [ ] Heading
- [ ] Text Editor
- [ ] Image
- [ ] Button
- [ ] Divider / Spacer

**Week 6**: General Elements
- [ ] Icon Box
- [ ] Counter
- [ ] Testimonial
- [ ] Tabs / Accordion

**Week 7**: Pro Elements
- [ ] Slider/Carousel
- [ ] Gallery
- [ ] Price Table
- [ ] Form Builder

### Step 3.5: Element Settings Panel
- [ ] Content tab
- [ ] Style tab (colors, spacing, typography)
- [ ] Animation tab
- [ ] Responsive controls

### Step 3.6: Preview & Publish
- [ ] Responsive preview (Desktop/Tablet/Mobile)
- [ ] Publish to subdomain
- [ ] Public website rendering

**Deliverable**: Functional page editor dengan drag-drop

---

## 🔵 PHASE 4: vCard Builder (Week 8)

### Step 4.1: vCard API
- [ ] CRUD endpoints
- [ ] Public slug access

### Step 4.2: vCard UI
- [ ] Builder interface → `UI/vcard_builder_interface/`
- [ ] Live preview (mobile frame)
- [ ] Public view → `UI/public_vcard_landing_page/`

### Step 4.3: vCard Features
- [ ] Photo upload
- [ ] Social links
- [ ] Template selection
- [ ] QR code generation
- [ ] VCF download

**Deliverable**: Complete vCard builder

---

## 🔵 PHASE 5: AI & Advanced (Week 9-10)

### Step 5.1: AI Integration
- [ ] OpenAI provider
- [ ] Claude provider
- [ ] Ollama provider (self-hosted)

### Step 5.2: AI Features
- [ ] Website wizard → `UI/ai_website_wizard_-_business_info/`
- [ ] Section generator → `UI/ai_section_generator_interface/`
- [ ] Content writer → `UI/ai_content_writer_tool/`
- [ ] Legal generator → `UI/ai_legal_document_generator/`

### Step 5.3: Import/Export
- [ ] Stitch design import
- [ ] Full HTML export (ZIP)

### Step 5.4: Media Library
- [ ] Media grid → `UI/media_library_grid_view/`
- [ ] Upload modal → `UI/file_upload_modal/`
- [ ] Image editor → `UI/built-in_image_editor/`

**Deliverable**: AI features & import/export

---

## 🔵 PHASE 6: Admin & Deploy (Week 11-12)

### Step 6.1: Admin Dashboard
- [ ] Overview → `UI/admin_system_overview/`
- [ ] Users list → `UI/admin_users_management_list/`
- [ ] Transactions → `UI/admin_financial_transactions/`
- [ ] Analytics → `UI/admin_system_analytics/`

### Step 6.2: Billing
- [ ] Plans → `UI/plan_pricing_&_comparison/`
- [ ] Checkout → `UI/secure_subscription_checkout/`
- [ ] Payment integration (Midtrans/Stripe)

### Step 6.3: Settings
- [ ] Profile → `UI/user_profile_settings/`
- [ ] Notifications → `UI/email_notification_preferences/`
- [ ] Integrations → `UI/integrations_&_social_logins/`

### Step 6.4: Deployment
```bash
# Backend
wrangler deploy

# Frontend
npm run build
wrangler pages deploy dist
```

### Step 6.5: Testing
- [ ] E2E tests (Playwright)
- [ ] API tests
- [ ] Performance audit

**Deliverable**: Complete SaaS ready for launch

---

## ✅ Checklist Summary

```
[ ] Phase 1: Auth ─────────────── Week 1-2
[ ] Phase 2: Core Backend ─────── Week 3-4
[ ] Phase 3: Page Editor ──────── Week 5-7
[ ] Phase 4: vCard Builder ────── Week 8
[ ] Phase 5: AI & Advanced ────── Week 9-10
[ ] Phase 6: Admin & Deploy ───── Week 11-12
```

---

## 🚨 Important Notes

1. **Reference UI**: Setiap step ada referensi folder UI yang sesuai
2. **API First**: Build backend API dulu, lalu frontend
3. **Incremental**: Test setiap fitur sebelum lanjut
4. **Git Commits**: Commit frequently dengan pesan descriptive
