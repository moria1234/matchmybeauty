import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { db } from './db';
import bcrypt from 'bcrypt';
import { PythonShell } from 'python-shell';
import { MongoClient } from 'mongodb';

dotenv.config();

const app = express();
const PORT = 5000;

app.use(cors({ origin: 'http://localhost:4200' }));
app.use(express.json());

// ----------------------
// 🟢 Test route
// ----------------------
app.get('/', (_req: Request, res: Response) => {
  res.send('Server is running!');
});

// ----------------------
// 🟢 Register route
// ----------------------
app.post('/api/register', async (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Please provide all required fields' });

  try {
    const [existingUsers] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    if ((existingUsers as any).length > 0) return res.status(400).json({ error: 'Username already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query('INSERT INTO users (username, password_hash) VALUES (?, ?)', [username, hashedPassword]);

    res.status(201).json({ message: 'User registered successfully!' });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// ----------------------
// 🟢 Login route
// ----------------------
app.post('/api/login', async (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Please provide both username and password' });

  try {
    const [results] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    const users = results as any[];
    if (users.length === 0) return res.status(401).json({ error: 'User not found' });

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(401).json({ error: 'Incorrect password' });

    res.status(200).json({ message: 'Login successful', user: { id: user.id, username: user.username } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ----------------------
// 🟢 Profile update route
// ----------------------
app.post('/api/profile', async (req: Request, res: Response) => {
  const { username, skinType, skinTone, eyeColor, hairColor } = req.body;
  if (!username || !skinType || !skinTone || !eyeColor || !hairColor)
    return res.status(400).json({ error: 'Please provide all required fields' });

  try {
    const [users] = await db.query('SELECT id FROM users WHERE username = ?', [username]);
    const userRows = users as any[];
    if (userRows.length === 0) return res.status(404).json({ error: 'User not found' });

    const userId = userRows[0].id;
    await db.query(
      `INSERT INTO profiles (user_id, skin_type, skin_tone, eye_color, hair_color)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         skin_type = VALUES(skin_type),
         skin_tone = VALUES(skin_tone),
         eye_color = VALUES(eye_color),
         hair_color = VALUES(hair_color)`,
      [userId, skinType, skinTone, eyeColor, hairColor]
    );

    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (err) {
    console.error('Profile error:', err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// ----------------------
// 🟢 Get profile route
// ----------------------
app.get('/api/profile/:username', async (req: Request, res: Response) => {
  const { username } = req.params;
  try {
    const [rows] = await db.query(
      `SELECT u.username, p.skin_type, p.skin_tone, p.eye_color, p.hair_color
       FROM users u
       LEFT JOIN profiles p ON u.id = p.user_id
       WHERE u.username = ?`,
      [username]
    );

    const result = (rows as any[])[0];
    if (!result) return res.status(404).json({ error: 'Profile not found' });

    res.status(200).json(result);
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ error: 'Failed to get profile' });
  }
});

// ----------------------
// 🟢 Helper function to run Python script using PythonShell
// ----------------------
async function runPythonScript(args: any): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const pyshell = new PythonShell('./ml/matchmybeautydb.py', {
      mode: 'json',
      pythonOptions: ['-u'],
      args: [JSON.stringify(args)]
    });

    const results: any[] = [];

    pyshell.on('message', (message) => {
      results.push(message);
    });

    pyshell.end((err) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
}

// ----------------------
// 🟢 MongoDB connection
// ----------------------
const mongoClient = new MongoClient(process.env.MONGO_URI || 'mongodb://localhost:27017');
let mongoDB: any;

mongoClient.connect().then(() => {
  mongoDB = mongoClient.db('matchmybeauty');
  console.log('Connected to MongoDB');

  // ----------------------
  // 🟢 Start Express server AFTER MongoDB connection
  // ----------------------
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}).catch(err => console.error('MongoDB connection error:', err));

// ----------------------
// 🟢 ML products route
// ----------------------
app.post('/api/ml-products', async (req: Request, res: Response) => {
  try {
    console.log('Running Python script with args:', req.body);
    const results = await runPythonScript(req.body);
    console.log('Python script returned:', results);

    if (!results || results.length === 0)
      return res.status(404).json({ message: 'No products found' });

    const products = results[0]; // הפייתון מחזיר array של מוצרים

    // שמירת הבחירות + המוצרים ב־MongoDB
    if (mongoDB) {
      const collection = mongoDB.collection('user_choices');
      await collection.insertOne({
        ...req.body,
        products,
        createdAt: new Date()
      });
    }

    res.status(200).json(products);
  } catch (err) {
    console.error('PythonShell error:', err);
    res.status(500).json({ error: 'Failed to run ML script' });
  }
});
