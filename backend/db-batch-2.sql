-- BATCH 2: Section & Element Tables
-- Execute ini setelah Batch 1 berhasil

CREATE TABLE sections (
  id TEXT PRIMARY KEY,
  page_id TEXT NOT NULL,
  section_type TEXT NOT NULL,
  layout_variant INTEGER DEFAULT 1,
  content TEXT,
  settings TEXT,
  sort_order INTEGER DEFAULT 0,
  is_visible INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (page_id) REFERENCES pages(id)
);

CREATE TABLE elements (
  id TEXT PRIMARY KEY,
  section_id TEXT NOT NULL,
  parent_id TEXT,
  element_type TEXT NOT NULL,
  content TEXT,
  style_desktop TEXT,
  style_tablet TEXT,
  style_mobile TEXT,
  animation TEXT,
  sort_order INTEGER DEFAULT 0,
  is_visible INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (section_id) REFERENCES sections(id)
);
