import {
  getBudgets,
  getCurrentBudget,
  upsertBudget,
  deleteBudget,
} from '../services/budgetService.js';

export const getBudgetsHandler = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { year } = req.query;
    const data = await getBudgets(userId, year);
    res.json({ success: true, data });
  } catch (error) {
    console.error("getBudgetsHandler error:", error);
    res.status(500).json({ success: false, error: error.message || "Failed to fetch budgets" });
  }
};

export const getCurrentBudgetHandler = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { month, year } = req.query;
    const data = await getCurrentBudget(userId, month, year);
    res.json({ success: true, data });
  } catch (error) {
    console.error("getCurrentBudgetHandler error:", error);
    res.status(500).json({ success: false, error: error.message || "Failed to fetch current budget" });
  }
};

export const upsertBudgetHandler = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { month, year, totalBudget } = req.body;

    if (!month || !year || totalBudget === undefined) {
      return res.status(400).json({
        success: false,
        error: "Month, year, and totalBudget are required",
      });
    }

    const budget = await upsertBudget(userId, { month, year, totalBudget });
    res.status(200).json({ success: true, data: budget });
  } catch (error) {
    console.error("upsertBudgetHandler error:", error);
    res.status(500).json({ success: false, error: error.message || "Failed to save budget" });
  }
};

export const deleteBudgetHandler = async (req, res) => {
  try {
    const userId = req.user.userId;
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, error: "Invalid budget ID" });
    }

    const deleted = await deleteBudget(userId, id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: "Budget not found or unauthorized" });
    }

    res.json({ success: true, message: "Budget deleted successfully", data: deleted });
  } catch (error) {
    console.error("deleteBudgetHandler error:", error);
    res.status(500).json({ success: false, error: error.message || "Failed to delete budget" });
  }
};
