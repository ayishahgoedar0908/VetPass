const mysql = require('mysql2/promise');
const path = require('node:path');

require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

function readEnv(name, fallback) {
  const value = process.env[name];

  if (typeof value !== 'string') {
    return fallback;
  }

  return value.trim();
}

const pool = mysql.createPool({
  host: readEnv('DB_HOST', '127.0.0.1'),
  user: readEnv('DB_USER', 'root'),
  password: readEnv('DB_PASSWORD', ''),
  database: readEnv('DB_NAME', 'vetpass'),
  port: Number(readEnv('DB_PORT', '3306')),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool;