import express from 'express';
import { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { db } from './db';
import bcrypt from 'bcrypt';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Test route
app.get('/', (_req: Request, res: Response) => {
  res.send('Server is running!');
});

// Register route
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password ) {
    res.status(400).json({ error: 'Please provide all required fields' });
    return;
  }

  try {
    const [existingUsers] = await db.query('SELECT * FROM users WHERE username = ?', [username]);

    if ((existingUsers as any).length > 0) {
      res.status(400).json({ error: 'Username already exists' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      'INSERT INTO users (username, password) VALUES (?, ?)',
      [username, hashedPassword]
    );

    res.status(201).json({ message: 'User registered successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// Login route
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ error: 'Please provide both username and password' });
    return;
  }

  try {
    const [results] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    const users = results as any[];

    if (users.length === 0) {
      res.status(401).json({ error: 'User not found' });
      return;
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.status(401).json({ error: 'Incorrect password' });
      return;
    }

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        skinType: user.skinType,
        skinTone: user.skinTone,
        eyeColor: user.eyeColor,
        hairColor: user.hairColor,
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
