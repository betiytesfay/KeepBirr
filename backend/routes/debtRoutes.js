import express from 'express';
import {
  getDebtsHandler,
  getDebtByIdHandler,
  createDebtHandler,
  recordPaymentHandler,
  deleteDebtHandler,
} from '../controllers/debtController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getDebtsHandler);
router.get('/:id', getDebtByIdHandler);
router.post('/', createDebtHandler);
router.post('/:id/payments', recordPaymentHandler);
router.delete('/:id', deleteDebtHandler);

export default router;
