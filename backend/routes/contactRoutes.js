import express from 'express';
import {
  getContactsHandler,
  createContactHandler,
  deleteContactHandler,
} from '../controllers/contactController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getContactsHandler);
router.post('/', createContactHandler);
router.delete('/:id', deleteContactHandler);

export default router;
