import express from 'express';
import {
  getExpensesHandler,
  getExpenseByIdHandler,
  createExpenseHandler,
  updateExpenseHandler,
  deleteExpenseHandler,
} from '../controllers/expenseController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getExpensesHandler);
router.get('/:id', getExpenseByIdHandler);
router.post('/', createExpenseHandler);
router.patch('/:id', updateExpenseHandler);
router.delete('/:id', deleteExpenseHandler);

export default router;
