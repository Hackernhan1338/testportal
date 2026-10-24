-- V6 OCR queue: import after schema.sql (or upgrade an existing V5 database).
CREATE TABLE IF NOT EXISTS ocr_jobs (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 submission_id BIGINT NOT NULL,
 status ENUM('queued','processing','done','failed','skipped') NOT NULL DEFAULT 'queued',
 attempts TINYINT UNSIGNED NOT NULL DEFAULT 0,
 lease_token CHAR(32) DEFAULT NULL,
 last_error VARCHAR(500) NULL,
 claimed_at DATETIME NULL,
 next_attempt_at DATETIME NULL,
 processed_at DATETIME NULL,
 created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
 UNIQUE KEY uq_ocr_submission (submission_id),
 UNIQUE KEY uq_ocr_lease (lease_token),
 KEY idx_ocr_status_next (status,next_attempt_at,id),
 CONSTRAINT fk_ocr_submission FOREIGN KEY (submission_id) REFERENCES submissions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
