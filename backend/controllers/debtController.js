import {
  getDebts,
  getDebtById,
  createDebt,
  recordDebtPayment,
  deleteDebt,
} from '../services/debtService.js';

export const getDebtsHandler = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { type } = req.query; // 'receivable' | 'debt'

    let isOwedToYou;
    if (type === 'receivable') isOwedToYou = true;
    if (type === 'debt') isOwedToYou = false;

    const data = await getDebts(userId, { isOwedToYou });
    res.json({ success: true, data });
  } catch (error) {
    console.error("getDebtsHandler error:", error);
    res.status(500).json({ success: false, error: error.message || "Failed to fetch debts" });
  }
};

export const getDebtByIdHandler = async (req, res) => {
  try {
    const userId = req.user.userId;
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, error: "Invalid debt ID" });
    }

    const debt = await getDebtById(userId, id);
    if (!debt) {
      return res.status(404).json({ success: false, error: "Debt not found" });
    }

    res.json({ success: true, data: debt });
  } catch (error) {
    console.error("getDebtByIdHandler error:", error);
    res.status(500).json({ success: false, error: error.message || "Server error" });
  }
};

export const createDebtHandler = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { originalAmount, isOwedToYou } = req.body;

    if (originalAmount === undefined || isOwedToYou === undefined) {
      return res.status(400).json({
        success: false,
        error: "originalAmount and isOwedToYou are required",
      });
    }

    const newDebt = await createDebt(userId, req.body);
    res.status(201).json({ success: true, data: newDebt });
  } catch (error) {
    console.error("createDebtHandler error:", error);
    res.status(500).json({ success: false, error: error.message || "Failed to create debt record" });
  }
};

export const recordPaymentHandler = async (req, res) => {
  try {
    const userId = req.user.userId;
    const debtId = parseInt(req.params.id, 10);
    if (isNaN(debtId)) {
      return res.status(400).json({ success: false, error: "Invalid debt ID" });
    }

    const { amount, note, paymentDate } = req.body;
    if (!amount) {
      return res.status(400).json({ success: false, error: "Payment amount is required" });
    }

    const result = await recordDebtPayment(userId, debtId, { amount, note, paymentDate });
    if (!result) {
      return res.status(404).json({ success: false, error: "Debt not found or unauthorized" });
    }

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error("recordPaymentHandler error:", error);
    res.status(500).json({ success: false, error: error.message || "Failed to record payment" });
  }
};

export const deleteDebtHandler = async (req, res) => {
  try {
    const userId = req.user.userId;
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, error: "Invalid debt ID" });
    }

    const deleted = await deleteDebt(userId, id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: "Debt not found or unauthorized" });
    }

    res.json({ success: true, message: "Debt deleted successfully", data: deleted });
  } catch (error) {
    console.error("deleteDebtHandler error:", error);
    res.status(500).json({ success: false, error: error.message || "Failed to delete debt" });
  }
};
