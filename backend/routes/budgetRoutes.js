import express from 'express';
import {
  getBudgetsHandler,
  getCurrentBudgetHandler,
  upsertBudgetHandler,
  deleteBudgetHandler,
} from '../controllers/budgetController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getBudgetsHandler);
router.get('/current', getCurrentBudgetHandler);
router.post('/', upsertBudgetHandler);
router.delete('/:id', deleteBudgetHandler);

export default router;
