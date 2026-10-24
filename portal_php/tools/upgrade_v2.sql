-- Chỉ chạy nếu nâng cấp từ bản MVP; bản cài mới xem schema.sql
ALTER TABLE tasks ADD COLUMN category ENUM('general','competition','card') NOT NULL DEFAULT 'general';
ALTER TABLE users ADD COLUMN card_verified_at DATETIME NULL;
ALTER TABLE users ADD COLUMN card_verified_by INT NULL;
ALTER TABLE users ADD COLUMN is_officer TINYINT(1) NOT NULL DEFAULT 0;
CREATE INDEX idx_tasks_category ON tasks(category);
