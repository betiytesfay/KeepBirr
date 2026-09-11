import express from 'express';
import cors from 'cors';
import 'dotenv/config';

import authRoutes from './routes/authRouter.js';
import expenseRoutes from './routes/expenseRoutes.js';
import budgetRoutes from './routes/budgetRoutes.js';
import debtRoutes from './routes/debtRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware & CORS Configuration
const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

// Explicit header middleware to guarantee cross-origin access on all routes & preflights
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/debts', debtRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Root healthcheck
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    service: 'KeepBirr Financial API',
    version: '1.0.0',
    port: PORT,
    timestamp: new Date().toISOString(),
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.originalUrl} not found`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error',
  });
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled rejection:', err);
});

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`KeepBirr Backend Server running on port ${PORT}`);
  });
}

export default app;