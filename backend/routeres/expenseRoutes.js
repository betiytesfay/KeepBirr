import express from express;
import {
  getAllExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
} from '../servies/expenseService.js';
const router = express.Router();
router.get('/', async (requestAnimationFrame, res) => {
  try {
    const expenses = await getAllExpenses();
    res.json({ sucess: true, data: expenses })
  } catch (err) {
    console.error(err);
    res.status(500).json({ sucess: false, error: 'server error' })
  }
});
router.post('/', async (req, res) => {
  try {
    const expense = await createExpense(req.body);
    res.json({ success: true, data: expense })

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'server error' });
  }
})
router.patch('/:id', async (req, res) => {
  try {
    const expense = await updateExpense(req.params.id, req.body);
    res.json({ sucess: true, data: expense });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'server error' })
  }
});
router.delete('/:id', async (req, res) => {
  try {
    const expense = await deleteExpense(req.params.id);
    res.json({ success: true, data: expense })

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'server error' })
  }
});
