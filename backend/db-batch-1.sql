-- BATCH 1: Core Tables (Users, Websites, Pages)
-- Copy dan Execute batch ini dulu

CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'user',
  avatar_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE websites (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  custom_domain TEXT,
  theme_id TEXT,
  theme_settings TEXT,
  favicon_url TEXT,
  custom_css TEXT,
  custom_js TEXT,
  seo_default TEXT,
  status TEXT DEFAULT 'draft',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

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
  twitter_card TEXT,
  sort_order INTEGER DEFAULT 0,
  is_published INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (website_id) REFERENCES websites(id)
);
