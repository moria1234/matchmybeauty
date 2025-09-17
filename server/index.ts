import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { db } from './db';
import bcrypt from 'bcrypt';
import { PythonShell } from 'python-shell';
import { MongoClient, Db, Collection } from 'mongodb';

dotenv.config();

const app = express();
const PORT: number = Number(process.env.PORT) || 5000;

app.use(cors({ origin: 'http://localhost:4200' }));
app.use(express.json());


app.get('/', (_req: Request, res: Response) => {
  res.send('Server is running!');
});


app.post('/api/register', async (req: Request, res: Response) => {
  const { username, password } = (req.body ?? {}) as { username?: string; password?: string };
  if (!username || !password) {
    return res.status(400).json({ error: 'Please provide all required fields' });
  }

  try {
    const [existingUsers] = await db.query('SELECT id FROM users WHERE username = ?', [username]);
    if ((existingUsers as any[]).length > 0) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query('INSERT INTO users (username, password_hash) VALUES (?, ?)', [username, hashedPassword]);

    res.status(201).json({ message: 'User registered successfully!' });
  } catch (err: unknown) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Failed to register user' });
  }
});


app.post('/api/login', async (req: Request, res: Response) => {
  const { username, password } = (req.body ?? {}) as { username?: string; password?: string };
  if (!username || !password) {
    return res.status(400).json({ error: 'Please provide both username and password' });
  }

  try {
    const [results] = await db.query(
      'SELECT id, username, password_hash FROM users WHERE username = ?',
      [username]
    );
    const users = results as Array<{ id: number; username: string; password_hash: string }>;
    if (users.length === 0) return res.status(401).json({ error: 'User not found' });

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(401).json({ error: 'Incorrect password' });

    res.status(200).json({ message: 'Login successful', user: { id: user.id, username: user.username } });
  } catch (err: unknown) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});


app.post('/api/profile', async (req: Request, res: Response) => {
  const {
    username,
    skinType = null,
    skinTone = null,
    eyeColor = null,
    hairColor = null,
  } = (req.body ?? {}) as {
    username?: string;
    skinType?: string | null;
    skinTone?: string | null;
    eyeColor?: string | null;
    hairColor?: string | null;
  };

  if (!username) {
    return res.status(400).json({ error: 'username is required' });
  }

  try {
    const [users] = await db.query('SELECT id FROM users WHERE username = ?', [username]);
    const userRows = users as Array<{ id: number }>;
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

    res.status(200).json({
      username,
      skinType,
      skinTone,
      eyeColor,
      hairColor,
      message: 'Profile saved',
    });
  } catch (err: unknown) {
    console.error('Profile upsert error:', err);
    res.status(500).json({ error: 'Failed to save profile' });
  }
});

app.get('/api/profile/:username', async (req: Request, res: Response) => {
  const { username } = req.params;

  try {
    const [rows] = await db.query(
      `SELECT
         u.username                                   AS username,
         p.skin_type                                  AS skinType,
         p.skin_tone                                  AS skinTone,
         p.eye_color                                  AS eyeColor,
         p.hair_color                                 AS hairColor
       FROM users u
       LEFT JOIN profiles p ON u.id = p.user_id
       WHERE u.username = ?
       LIMIT 1`,
      [username]
    );

    const row = (rows as Array<{
      username: string;
      skinType: string | null;
      skinTone: string | null;
      eyeColor: string | null;
      hairColor: string | null;
    }>)[0];

    if (!row) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.status(200).json({
      username: row.username,
      skinType: row.skinType ?? '',
      skinTone: row.skinTone ?? '',
      eyeColor: row.eyeColor ?? '',
      hairColor: row.hairColor ?? '',
    });
  } catch (err: unknown) {
    console.error('Get profile error:', err);
    res.status(500).json({ error: 'Failed to get profile' });
  }
});

async function runPythonScript(args: unknown): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const pyshell = new PythonShell('./ml/matchmybeautydb.py', {
      mode: 'json',
      pythonOptions: ['-u'],
      args: [JSON.stringify(args)],
    });

    const results: any[] = [];

    pyshell.on('message', (message: any) => {
      results.push(message);
    });

    pyshell.end((err: Error | null) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
}

const MONGO_URI: string = process.env.MONGO_URI || 'mongodb://localhost:27017';
const mongoClient: MongoClient = new MongoClient(MONGO_URI);
let mongoDB: Db | null = null;

mongoClient
  .connect()
  .then(() => {
    mongoDB = mongoClient.db('matchmybeauty');
    console.log('Connected to MongoDB');

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err: unknown) => {
    console.error('MongoDB connection error:', err);
    // מפעיל שרת גם בלי MongoDB כדי לא לחסום פיתוח
    app.listen(PORT, () => {
      console.log(`Server (without Mongo) is running on http://localhost:${PORT}`);
    });
  });

app.post('/api/ml-products', async (req: Request, res: Response) => {
  try {
    console.log('Running Python script with args:', req.body);
    const results = await runPythonScript(req.body);
    console.log('Python script returned:', results);

    if (!results || results.length === 0) {
      return res.status(404).json({ message: 'No products found' });
    }

    const products: any[] = results[0]; 

    if (mongoDB) {
      const collection: Collection = mongoDB.collection('user_choices');
      await collection.insertOne({
        ...req.body,
        products,
        createdAt: new Date(),
      });
    }

    res.status(200).json(products);
  } catch (err: unknown) {
    console.error('PythonShell error:', err);
    res.status(500).json({ error: 'Failed to run ML script' });
  }
});

export default app;