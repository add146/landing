-- BATCH 3: vCard, Media, and Subscription Tables
-- Execute ini setelah Batch 2 berhasil

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
  social_links TEXT,
  template_id TEXT,
  slug TEXT UNIQUE NOT NULL,
  theme_color TEXT DEFAULT '#6366F1',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

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

CREATE TABLE plans (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price_monthly INTEGER DEFAULT 0,
  price_yearly INTEGER DEFAULT 0,
  features TEXT,
  limits TEXT,
  is_active INTEGER DEFAULT 1
);

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

CREATE TABLE ai_generations (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  provider TEXT NOT NULL,
  type TEXT NOT NULL,
  prompt TEXT,
  result TEXT,
  tokens_used INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
