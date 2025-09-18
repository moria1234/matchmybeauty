DROP TABLE IF EXISTS profiles;
DROP TABLE IF EXISTS users;

CREATE DATABASE IF NOT EXISTS matchmybeauty;
USE matchmybeauty;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  skinType VARCHAR(50),
  skinTone VARCHAR(50),
  eyeColor VARCHAR(50),
  hairColor VARCHAR(50)
);

INSERT INTO users (username, password_hash, skinType, skinTone, eyeColor, hairColor)
VALUES ('exampleUser', 'examplePasswordHash', 'Dry', 'Light', 'Blue', 'Blonde');

CREATE TABLE profiles (
  user_id INT PRIMARY KEY,
  skin_type VARCHAR(50),
  skin_tone VARCHAR(50),
  eye_color VARCHAR(50),
  hair_color VARCHAR(50),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

DESCRIBE users;
DESCRIBE profiles;

SELECT * FROM users;
SELECT * FROM profiles;
