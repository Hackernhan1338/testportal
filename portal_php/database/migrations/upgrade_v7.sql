-- V7: run once after V6. MySQL 8+ / MariaDB 10.5+.
-- Back up database before import. It does NOT insert student personal information.
ALTER TABLE users
 ADD COLUMN class_number SMALLINT UNSIGNED NULL,
 ADD COLUMN hometown VARCHAR(255) NULL,
 ADD COLUMN phone VARCHAR(32) NULL,
 ADD COLUMN personal_email VARCHAR(191) NULL,
 ADD COLUMN gender VARCHAR(30) NULL,
 ADD COLUMN ethnic_group VARCHAR(100) NULL,
 ADD COLUMN religion VARCHAR(100) NULL,
 ADD COLUMN party_joined_date DATE NULL,
 ADD COLUMN quote_text VARCHAR(400) NULL,
 ADD COLUMN quote_author VARCHAR(160) NULL,
 ADD COLUMN google_sub VARCHAR(255) NULL UNIQUE,
 ADD COLUMN google_linked_at DATETIME NULL,
 ADD COLUMN admin_level ENUM('NONE','ANALYST','MODERATOR','ADMIN','SUPER_ADMIN') NOT NULL DEFAULT 'NONE',
 ADD COLUMN leaderboard_visible TINYINT(1) NOT NULL DEFAULT 1,
 ADD COLUMN terms_accepted_id INT NULL;
ALTER TABLE tasks ADD COLUMN points INT UNSIGNED NOT NULL DEFAULT 15;
ALTER TABLE events ADD COLUMN points INT UNSIGNED NOT NULL DEFAULT 10;
CREATE TABLE IF NOT EXISTS feedback_tickets(
 id BIGINT AUTO_INCREMENT PRIMARY KEY,user_id INT NOT NULL,subject VARCHAR(190) NOT NULL,body TEXT NOT NULL,
 status ENUM('new','processing','resolved') NOT NULL DEFAULT 'new',admin_reply TEXT NULL,
 replied_by INT NULL,replied_at DATETIME NULL,created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
 INDEX(user_id,status,created_at), FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE TABLE IF NOT EXISTS legal_documents(
 id INT AUTO_INCREMENT PRIMARY KEY,doc_type ENUM('terms','privacy') NOT NULL,version VARCHAR(30) NOT NULL,
 title VARCHAR(200) NOT NULL,body MEDIUMTEXT NOT NULL,is_active TINYINT(1) DEFAULT 1,
 published_by INT NULL,created_at DATETIME DEFAULT CURRENT_TIMESTAMP,INDEX(doc_type,is_active,id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE TABLE IF NOT EXISTS notification_reads(
 announcement_id INT NOT NULL,user_id INT NOT NULL,read_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
 PRIMARY KEY(announcement_id,user_id), FOREIGN KEY(announcement_id) REFERENCES announcements(id) ON DELETE CASCADE,
 FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE TABLE IF NOT EXISTS portal_settings(
 setting_key VARCHAR(100) PRIMARY KEY,setting_value TEXT NULL,updated_by INT NULL,
 updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE TABLE IF NOT EXISTS visit_logs(
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,ip_hash CHAR(64) NOT NULL,device_hash CHAR(64) NULL,
 country CHAR(2) DEFAULT 'XX',page VARCHAR(65) NOT NULL,visitor_user_id INT NULL,
 visited_at DATETIME DEFAULT CURRENT_TIMESTAMP,
 INDEX(visited_at),INDEX(ip_hash,visited_at),INDEX(device_hash,visited_at),INDEX(country,visited_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE TABLE IF NOT EXISTS access_blocks(
 id INT AUTO_INCREMENT PRIMARY KEY,kind ENUM('ip','device') NOT NULL,identity_hash CHAR(64) NOT NULL,
 reason VARCHAR(255) NOT NULL,expires_at DATETIME NULL,created_by INT NULL,created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
 UNIQUE KEY uq_block(kind,identity_hash),INDEX(expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE TABLE IF NOT EXISTS google_email_challenges(
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,user_id INT NOT NULL,token_hash VARCHAR(255) NOT NULL,
 attempts INT NOT NULL DEFAULT 0,expires_at DATETIME NOT NULL,used_at DATETIME NULL,created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
 INDEX(user_id,expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
-- For pre-existing single V6 administrator: grant SUPER_ADMIN ONLY after verifying identity.
-- UPDATE users SET admin_level='SUPER_ADMIN' WHERE student_id='YOUR_VERIFIED_ADMIN_MSSV' AND role='admin';

-- Backfill standardized personal fields from the V6 import details table when present.
-- If imported V6 full profiles, `student_profile_details` exists.
CREATE TABLE IF NOT EXISTS student_profile_details (
 user_id INT PRIMARY KEY,gender VARCHAR(30),hometown VARCHAR(191),ethnicity VARCHAR(120),religion VARCHAR(120),
 youth_book_status VARCHAR(100),party_membership VARCHAR(120),party_joined_date DATE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
UPDATE users u JOIN student_profile_details d ON d.user_id=u.id
SET u.gender=COALESCE(NULLIF(u.gender,''),d.gender),
    u.hometown=COALESCE(NULLIF(u.hometown,''),d.hometown),
    u.ethnic_group=COALESCE(NULLIF(u.ethnic_group,''),d.ethnicity),
    u.religion=COALESCE(NULLIF(u.religion,''),d.religion),
    u.party_joined_date=COALESCE(u.party_joined_date,d.party_joined_date);
