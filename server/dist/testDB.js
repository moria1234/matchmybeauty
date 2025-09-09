"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("./db");
(async () => {
    try {
        const [rows] = await db_1.db.query('SELECT 1');
        console.log('✅ DB connection OK', rows);
    }
    catch (err) {
        console.error('❌ DB connection failed', err);
    }
})();
