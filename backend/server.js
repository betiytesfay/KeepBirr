import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { db } from './db/index.js';
import { users } from './db/schema.js';
import authRoutes from "./routeres/authRouter.js"
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
// Test route
app.get('/api/users', async (req, res) => {
  try {
    const allUsers = await db.select().from(users);
    res.json({ success: true, data: allUsers });
  } catch (error) {
    console.error('Detailed error:', error);  // ← add this
    res.status(500).json({ success: false, error: error.message }); // ← send message
  }
});

app.get('/', (req, res) => {
  res.send('Expense Tracker API is running');
});
process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
});
process.on('unhandledRejection', (err) => {
  console.error('Unhandled rejection:', err);
});
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});