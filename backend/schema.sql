-- Landing Page Builder Database Schema
-- Cloudflare D1 (SQLite)

-- Users
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'user', -- 'admin' | 'user'
  avatar_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Websites
CREATE TABLE websites (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  custom_domain TEXT,
  theme_id TEXT,
  theme_settings TEXT, -- JSON
  favicon_url TEXT,
  custom_css TEXT,
  custom_js TEXT,
  seo_default TEXT, -- JSON
  status TEXT DEFAULT 'draft', -- 'draft' | 'published'
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Pages
CREATE TABLE pages (
  id TEXT PRIMARY KEY,
  website_id TEXT NOT NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  page_type TEXT DEFAULT 'landing',
  seo_title TEXT,
  seo_description TEXT,
  seo_keywords TEXT,
  og_image TEXT,
  twitter_card TEXT, -- JSON
  content_json TEXT, -- GrapesJS JSON
  content_html TEXT, -- GrapesJS HTML
  sort_order INTEGER DEFAULT 0,
  is_published INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (website_id) REFERENCES websites(id)
);

-- Sections
CREATE TABLE sections (
  id TEXT PRIMARY KEY,
  page_id TEXT NOT NULL,
  section_type TEXT NOT NULL,
  layout_variant INTEGER DEFAULT 1,
  content TEXT, -- JSON
  settings TEXT, -- JSON
  sort_order INTEGER DEFAULT 0,
  is_visible INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (page_id) REFERENCES pages(id)
);

-- Elements
CREATE TABLE elements (
  id TEXT PRIMARY KEY,
  section_id TEXT NOT NULL,
  parent_id TEXT,
  element_type TEXT NOT NULL,
  content TEXT, -- JSON
  style_desktop TEXT, -- JSON
  style_tablet TEXT, -- JSON
  style_mobile TEXT, -- JSON
  animation TEXT, -- JSON
  sort_order INTEGER DEFAULT 0,
  is_visible INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (section_id) REFERENCES sections(id)
);

-- vCards
CREATE TABLE vcards (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  job_title TEXT,
  company TEXT,
  email TEXT,
  phone TEXT,
  whatsapp TEXT,
  website TEXT,
  address TEXT,
  bio TEXT,
  photo_url TEXT,
  social_links TEXT, -- JSON
  template_id TEXT,
  slug TEXT UNIQUE NOT NULL,
  theme_color TEXT DEFAULT '#6366F1',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Media
CREATE TABLE media (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  website_id TEXT,
  filename TEXT NOT NULL,
  r2_key TEXT NOT NULL,
  mime_type TEXT,
  size INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Plans
CREATE TABLE plans (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price_monthly INTEGER DEFAULT 0,
  price_yearly INTEGER DEFAULT 0,
  features TEXT, -- JSON
  limits TEXT, -- JSON
  is_active INTEGER DEFAULT 1
);

-- Subscriptions
CREATE TABLE subscriptions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  plan_id TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  current_period_start DATETIME,
  current_period_end DATETIME,
  payment_method TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (plan_id) REFERENCES plans(id)
);

-- AI Generations
CREATE TABLE ai_generations (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  provider TEXT NOT NULL,
  type TEXT NOT NULL,
  prompt TEXT,
  result TEXT, -- JSON
  tokens_used INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Indexes for performance
CREATE INDEX idx_websites_user ON websites(user_id);
CREATE INDEX idx_pages_website ON pages(website_id);
CREATE INDEX idx_sections_page ON sections(page_id);
CREATE INDEX idx_elements_section ON elements(section_id);
CREATE INDEX idx_vcards_user ON vcards(user_id);
CREATE INDEX idx_media_user ON media(user_id);
CREATE INDEX idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX idx_ai_generations_user ON ai_generations(user_id);
