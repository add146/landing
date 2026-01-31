# Landing Page Builder - Setup Instructions

## ✅ Phase 1: Authentication System - DEPLOYED & LIVE

**Live URLs:**
- 🌐 **Primary:** https://landing-bzy.pages.dev
- 🌐 **Custom Domain:** https://build.khibroh.com

### What's Been Built

**Backend (Cloudflare Workers + Hono.js)**
- ✅ JWT authentication API (register, login, logout)
- ✅ Password hashing with bcryptjs
- ✅ Database schema for D1 (SQLite)
- ✅ TypeScript types and middleware

**Frontend (React + Vite + Tailwind CSS)**
- ✅ Login page with form validation
- ✅ Registration page with password strength indicator
- ✅ Forgot password page
- ✅ Protected dashboard
- ✅ Zustand state management
- ✅ Axios API client with interceptors

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- Cloudflare account (free tier is fine)
- Wrangler CLI installed globally

### Step 1: Install Wrangler (if not already)
```bash
npm install -g wrangler
wrangler login
```

### Step 2: Create Cloudflare Resources

```bash
cd backend

# Create D1 Database
wrangler d1 create landing-page-db
# Copy the database_id and update wrangler.toml

# Create R2 Bucket
wrangler r2 bucket create landing-page-assets

# Create KV Namespace
wrangler kv:namespace create SESSIONS
# Copy the id and update wrangler.toml
```

### Step 3: Update Backend Configuration

Edit `backend/wrangler.toml` and replace:
- `<YOUR_DB_ID_HERE>` with your D1 database ID
- `<YOUR_KV_ID_HERE>` with your KV namespace ID

### Step 4: Initialize Database

```bash
cd backend
wrangler d1 execute landing-page-db --file=./schema.sql
```

### Step 5: Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### Step 6: Run Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# API will run on http://localhost:8787
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# Frontend will run on http://localhost:5173
```

---

## 🧪 Testing the Authentication Flow

1. **Navigate to** `http://localhost:5173`
2. **Click "Sign up"** to create an account
3. **Fill in the registration form** (name, email, password)
4. **You'll be redirected to the dashboard** upon successful registration
5. **Try logging out** and logging back in

### Test API Endpoints Directly

```bash
# Register a user
curl -X POST http://localhost:8787/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"Test1234"}'

# Login
curl -X POST http://localhost:8787/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test1234"}'
```

---

## 📋 Next Steps (Phase 2 & Beyond)

Phase 1 is complete! Next phases will add:
- **Phase 2**: Core Backend APIs (Websites, Pages, Sections CRUD)
- **Phase 3**: Page Editor with Drag & Drop
- **Phase 4**: vCard Builder
- **Phase 5**: AI Integration
- **Phase 6**: Admin Dashboard & Deployment

---

## 🔧 Troubleshooting

### Backend won't start
- Ensure you've run `npm install` in the backend directory
- Check that `wrangler.toml` has valid database_id and KV id
- Run `wrangler d1 execute landing-page-db --file=./schema.sql` to initialize DB

### Frontend shows API errors
- Make sure backend is running on port 8787
- Check browser console for CORS errors
- Verify API_BASE_URL in `frontend/src/api/client.ts`

### Registration fails
- Check backend terminal for error messages
- Ensure database was initialized with schema.sql
- Try clearing localStorage and cookies
