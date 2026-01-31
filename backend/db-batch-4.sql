-- BATCH 4: Indexes
-- Execute ini paling terakhir setelah semua table dibuat

CREATE INDEX idx_websites_user ON websites(user_id);
CREATE INDEX idx_pages_website ON pages(website_id);
CREATE INDEX idx_sections_page ON sections(page_id);
CREATE INDEX idx_elements_section ON elements(section_id);
CREATE INDEX idx_vcards_user ON vcards(user_id);
CREATE INDEX idx_media_user ON media(user_id);
CREATE INDEX idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX idx_ai_generations_user ON ai_generations(user_id);
