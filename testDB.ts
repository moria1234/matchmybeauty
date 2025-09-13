import { db } from './db';

(async () => {
  try {
    const [rows] = await db.query('SELECT 1');
    console.log('DB connection OK', rows);
  } catch (err) {
    console.error('DB connection failed', err);
  }
})();
