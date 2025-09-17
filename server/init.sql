-- Drop tables if they exist (drop profiles first to avoid foreign key issues)
DROP TABLE IF EXISTS profiles;
DROP TABLE IF EXISTS users;

-- Create database
CREATE DATABASE IF NOT EXISTS matchmybeauty;
USE matchmybeauty;

-- Create users table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  skinType VARCHAR(50),
  skinTone VARCHAR(50),
  eyeColor VARCHAR(50),
  hairColor VARCHAR(50)
);

-- Optional: insert example user
INSERT INTO users (username, password_hash, skinType, skinTone, eyeColor, hairColor)
VALUES ('exampleUser', 'examplePasswordHash', 'Dry', 'Light', 'Blue', 'Blonde');

-- Create profiles table
CREATE TABLE profiles (
  user_id INT PRIMARY KEY,
  skin_type VARCHAR(50),
  skin_tone VARCHAR(50),
  eye_color VARCHAR(50),
  hair_color VARCHAR(50),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Check table structure
DESCRIBE users;
DESCRIBE profiles;

-- Check existing data
SELECT * FROM users;
SELECT * FROM profiles;
