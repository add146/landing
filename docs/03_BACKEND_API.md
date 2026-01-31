# Backend API
## Cloudflare Workers + Hono.js

---

## 🔗 Base URL

```
Production: https://api.yourapp.com
Development: http://localhost:8787
```

---

## 🔐 Authentication

### POST /api/auth/register
```json
// Request
{ "email": "user@example.com", "password": "password123", "name": "John Doe" }

// Response 201
{ "user": { "id": "...", "email": "...", "name": "..." }, "token": "jwt..." }
```

### POST /api/auth/login
```json
// Request
{ "email": "user@example.com", "password": "password123" }

// Response 200
{ "user": {...}, "token": "jwt..." }
```

### POST /api/auth/logout
```
Authorization: Bearer <token>
// Response 200
{ "message": "Logged out" }
```

---

## 🌐 Websites

### GET /api/websites
List user's websites.
```json
// Response 200
{ "websites": [{ "id": "...", "name": "...", "slug": "...", "status": "..." }] }
```

### POST /api/websites
```json
// Request
{ "name": "My Website", "slug": "my-website" }
// Response 201
{ "website": {...} }
```

### GET /api/websites/:id
### PATCH /api/websites/:id
### DELETE /api/websites/:id
### POST /api/websites/:id/publish

---

## 📄 Pages

### GET /api/pages?website_id=xxx
### POST /api/pages
```json
{ "website_id": "...", "title": "Home", "slug": "home" }
```
### GET /api/pages/:id
### PATCH /api/pages/:id
### DELETE /api/pages/:id

---

## 🧩 Sections

### GET /api/sections?page_id=xxx
### POST /api/sections
```json
{ "page_id": "...", "section_type": "hero", "layout_variant": 1, "content": {...} }
```
### PATCH /api/sections/:id
### DELETE /api/sections/:id
### PATCH /api/sections/reorder
```json
{ "sections": [{ "id": "...", "sort_order": 0 }, ...] }
```

---

## 🔲 Elements

### GET /api/elements?section_id=xxx
### POST /api/elements
```json
{ "section_id": "...", "element_type": "heading", "content": { "text": "Hello" } }
```
### PATCH /api/elements/:id
### DELETE /api/elements/:id

---

## 📇 vCards

### GET /api/vcards
### POST /api/vcards
### GET /api/vcards/:id
### PATCH /api/vcards/:id
### DELETE /api/vcards/:id
### GET /api/vcards/public/:slug (Public, no auth)

---

## 📁 Media

### POST /api/media/upload
Multipart form-data with file.
```json
// Response 201
{ "media": { "id": "...", "url": "...", "filename": "..." } }
```

### GET /api/media
### DELETE /api/media/:id

---

## ✨ AI

### POST /api/ai/generate-website
```json
{ "business_name": "...", "industry": "...", "description": "...", "provider": "openai" }
```

### POST /api/ai/generate-section
```json
{ "section_type": "hero", "context": "...", "provider": "claude" }
```

### POST /api/ai/generate-content
### POST /api/ai/generate-legal

---

## 📥 Import/Export

### POST /api/import/stitch
### POST /api/export/:websiteId/html

---

## 🛡️ Admin (Admin only)

### GET /api/admin/users
### PATCH /api/admin/users/:id
### GET /api/admin/stats
### GET /api/admin/transactions

---

## 🔗 Next

- [04_FRONTEND_COMPONENTS.md](./04_FRONTEND_COMPONENTS.md)
