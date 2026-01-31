# Setup Guide
## Development Environment

---

## 📋 Prerequisites

- Node.js 18+
- npm atau pnpm
- Cloudflare account
- Wrangler CLI

---

## 🛠️ Step 1: Install Wrangler

```bash
npm install -g wrangler
wrangler login
```

---

## 🗄️ Step 2: Create Cloudflare Resources

```bash
# Create D1 Database
wrangler d1 create landing-page-db

# Create R2 Bucket
wrangler r2 bucket create landing-page-assets

# Create KV Namespace
wrangler kv:namespace create SESSIONS
```

Simpan ID yang dihasilkan untuk `wrangler.toml`

---

## 📁 Step 3: Project Structure

```bash
mkdir backend frontend
```

### Backend Setup
```bash
cd backend
npm init -y
npm install hono @hono/zod-validator zod
npm install -D wrangler typescript @cloudflare/workers-types
```

### Frontend Setup
```bash
cd ../frontend
npm create vite@latest . -- --template react-ts
npm install
npm install zustand @dnd-kit/core @dnd-kit/sortable lucide-react
npm install react-router-dom axios
```

---

## ⚙️ Step 4: Configure Wrangler

`backend/wrangler.toml`:
```toml
name = "landing-page-api"
main = "src/index.ts"
compatibility_date = "2024-01-01"

[[d1_databases]]
binding = "DB"
database_name = "landing-page-db"
database_id = "<YOUR_DB_ID>"

[[r2_buckets]]
binding = "STORAGE"
bucket_name = "landing-page-assets"

[[kv_namespaces]]
binding = "SESSIONS"
id = "<YOUR_KV_ID>"

[vars]
JWT_SECRET = "your-secret-key"
```

---

## 🗃️ Step 5: Initialize Database

```bash
cd backend
wrangler d1 execute landing-page-db --file=./schema.sql
```

Lihat: [02_DATABASE_SCHEMA.md](./02_DATABASE_SCHEMA.md)

---

## 🚀 Step 6: Run Development

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend  
cd frontend
npm run dev
```

---

## 📤 Step 7: Deploy

```bash
# Deploy Backend
cd backend
wrangler deploy

# Deploy Frontend
cd frontend
npm run build
wrangler pages deploy dist
```

---

## 🔗 Next

- [02_DATABASE_SCHEMA.md](./02_DATABASE_SCHEMA.md)
