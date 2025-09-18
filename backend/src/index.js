require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./config/db'); // We will create this next

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors()); // Allows our frontend to talk to our backend
app.use(express.json()); // Allows us to read JSON from request bodies

// Health Check Endpoint (as required by the project)
app.get('/health', async (req, res) => {
  try {
    await db.query('SELECT 1');
    res.status(200).json({
      status: 'ok',
      database: 'connected',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(503).json({
      status: 'error',
      database: 'disconnected',
      error: error.message,
    });
  }
});

// Simple Welcome Route
app.get('/', (req, res) => {
  res.send('Welcome to the Grip Invest Mini Platform API!');
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});