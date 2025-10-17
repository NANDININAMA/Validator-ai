require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const ideaRoutes = require('./routes/ideaRoutes');
const adminRoutes = require('./routes/adminRoutes');
const expertRoutes = require('./routes/expertRoutes');

const app = express();
connectDB();

// CORS middleware: allow common local dev origins
app.use(cors({
  origin: true, // Allow all origins in development
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
})); 
app.use(express.json());

// routes
app.use('/api/auth', authRoutes);
app.use('/api/ideas', ideaRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/expert', expertRoutes);

// basic health
app.get('/', (req, res) => res.send({ ok: true, message: 'Startup Validator API' }));

const PORT = process.env.PORT || 5002;
// Avoid binding a real port during tests to prevent EADDRINUSE
if (!process.env.JEST_WORKER_ID && process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
