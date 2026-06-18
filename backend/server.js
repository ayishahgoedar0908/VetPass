const path = require('node:path');
const express = require('express');
const cors = require('cors');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const db = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const petRoutes = require('./routes/petRoutes');
const vaccinationRoutes = require('./routes/vaccinationRoutes');
const medicalRoutes = require('./routes/medicalRoutes');

const PORT = process.env.PORT || 3000;
const frontendRoot = path.join(__dirname, '..', 'frontend');
const app = express();
let databaseConnected = false;

app.use(cors());
app.use(express.json());
app.use(express.static(frontendRoot));

app.get('/', (req, res) => {
  res.sendFile(path.join(frontendRoot, 'login.html'));
});

app.get('/pets', (req, res) => {
  res.sendFile(path.join(frontendRoot, 'pets.html'));
});

app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    service: 'vetpass-backend',
    databaseConnected,
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/vaccinations', vaccinationRoutes);
app.use('/api/medical', medicalRoutes);

app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
  });
});

async function startServer() {
  try {
    const connection = await db.getConnection();
    await connection.ping();
    connection.release();
    databaseConnected = true;
  } catch (error) {
    databaseConnected = false;
    console.warn('Database connection unavailable:', error.message);
  }

  app.listen(PORT, () => {
    console.log(`VetPass backend listening on http://localhost:${PORT}`);
    console.log(`Database connection: ${databaseConnected ? 'ok' : 'unavailable'}`);
  });
}

startServer();