import {
  getAllExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
} from '../services/expenseServices.js';

export const getExpensesHandler = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { category, startDate, endDate, limit, offset } = req.query;

    const expenses = await getAllExpenses(userId, {
      category,
      startDate,
      endDate,
      limit: limit ? parseInt(limit, 10) : 50,
      offset: offset ? parseInt(offset, 10) : 0,
    });

    res.json({ success: true, data: expenses });
  } catch (error) {
    console.error("getExpensesHandler error:", error);
    res.status(500).json({ success: false, error: error.message || "Failed to fetch expenses" });
  }
};

export const getExpenseByIdHandler = async (req, res) => {
  try {
    const userId = req.user.userId;
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, error: "Invalid expense ID" });
    }

    const item = await getExpenseById(userId, id);
    if (!item) {
      return res.status(404).json({ success: false, error: "Expense not found" });
    }

    res.json({ success: true, data: item });
  } catch (error) {
    console.error("getExpenseByIdHandler error:", error);
    res.status(500).json({ success: false, error: error.message || "Server error" });
  }
};

export const createExpenseHandler = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { amount, category, description, date, recurring, frequency } = req.body;

    if (!amount || !category) {
      return res.status(400).json({
        success: false,
        error: "Amount and category are required",
      });
    }

    const newExpense = await createExpense(userId, {
      amount,
      category,
      description,
      date,
      recurring,
      frequency,
    });

    res.status(201).json({ success: true, data: newExpense });
  } catch (error) {
    console.error("createExpenseHandler error:", error);
    res.status(500).json({ success: false, error: error.message || "Failed to create expense" });
  }
};

export const updateExpenseHandler = async (req, res) => {
  try {
    const userId = req.user.userId;
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, error: "Invalid expense ID" });
    }

    const updated = await updateExpense(userId, id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, error: "Expense not found or unauthorized" });
    }

    res.json({ success: true, data: updated });
  } catch (error) {
    console.error("updateExpenseHandler error:", error);
    res.status(500).json({ success: false, error: error.message || "Failed to update expense" });
  }
};

export const deleteExpenseHandler = async (req, res) => {
  try {
    const userId = req.user.userId;
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, error: "Invalid expense ID" });
    }

    const deleted = await deleteExpense(userId, id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: "Expense not found or unauthorized" });
    }

    res.json({ success: true, message: "Expense deleted successfully", data: deleted });
  } catch (error) {
    console.error("deleteExpenseHandler error:", error);
    res.status(500).json({ success: false, error: error.message || "Failed to delete expense" });
  }
};
