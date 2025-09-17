"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./db");
const bcrypt_1 = __importDefault(require("bcrypt"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());

app.get('/', (_req, res) => {
    res.send('Server is running!');
});

app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Please provide all required fields' });
    }
    try {
        const [existingUsers] = await db_1.db.query('SELECT * FROM users WHERE username = ?', [username]);
        if (existingUsers.length > 0) {
            return res.status(400).json({ error: 'Username already exists' });
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        await db_1.db.query('INSERT INTO users (username, password_hash) VALUES (?, ?)', [username, hashedPassword]);
        res.status(201).json({ message: 'User registered successfully!' });
    }
    catch (err) {
        console.error('Register error:', err);
        res.status(500).json({ error: 'Failed to register user' });
    }
});

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Please provide both username and password' });
    }
    try {
        const [results] = await db_1.db.query('SELECT * FROM users WHERE username = ?', [username]);
        const users = results;
        if (users.length === 0) {
            return res.status(401).json({ error: 'User not found' });
        }
        const user = users[0];
        const isMatch = await bcrypt_1.default.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ error: 'Incorrect password' });
        }
        res.status(200).json({
            message: 'Login successful',
            user: {
                id: user.id,
                username: user.username
            }
        });
    }
    catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/profile', async (req, res) => {
    const { username, skinType, skinTone, eyeColor, hairColor } = req.body;
    if (!username || !skinType || !skinTone || !eyeColor || !hairColor) {
        return res.status(400).json({ error: 'Please provide all required fields' });
    }
    try {
    
        const [users] = await db_1.db.query('SELECT id FROM users WHERE username = ?', [username]);
        const userRows = users;
        if (userRows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        const userId = userRows[0].id;
        
        await db_1.db.query(`INSERT INTO profiles (user_id, skin_type, skin_tone, eye_color, hair_color)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         skin_type = VALUES(skin_type),
         skin_tone = VALUES(skin_tone),
         eye_color = VALUES(eye_color),
         hair_color = VALUES(hair_color)`, [userId, skinType, skinTone, eyeColor, hairColor]);
        res.status(200).json({ message: 'Profile updated successfully' });
    }
    catch (err) {
        console.error('Profile error:', err);
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

app.get('/api/profile/:username', async (req, res) => {
    const { username } = req.params;
    try {
        const [rows] = await db_1.db.query(`SELECT u.username, p.skin_type, p.skin_tone, p.eye_color, p.hair_color
       FROM users u
       LEFT JOIN profiles p ON u.id = p.user_id
       WHERE u.username = ?`, [username]);
        const result = rows[0];
        if (!result) {
            return res.status(404).json({ error: 'Profile not found' });
        }
        res.status(200).json(result);
    }
    catch (err) {
        console.error('Get profile error:', err);
        res.status(500).json({ error: 'Failed to get profile' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});