-- init.sql
-- יצירת בסיס נתונים (אם עוד לא קיים)
CREATE DATABASE IF NOT EXISTS matchmybeauty
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE matchmybeauty;

-- טבלת משתמשים
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- טבלת פרופילים (מקושרת ל־users)
CREATE TABLE IF NOT EXISTS profiles (
  user_id INT PRIMARY KEY,
  skin_type  VARCHAR(30),
  skin_tone  VARCHAR(30),
  hair_color VARCHAR(30),
  eye_color  VARCHAR(30),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

ALTER TABLE users CHANGE COLUMN password password_hash VARCHAR(255) NOT NULL;

