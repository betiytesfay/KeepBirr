import { getDashboardOverview } from '../services/dashboardService.js';

export const getDashboardOverviewHandler = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { month, year } = req.query;

    const data = await getDashboardOverview(userId, month, year);
    res.json({ success: true, data });
  } catch (error) {
    console.error("getDashboardOverviewHandler error:", error);
    res.status(500).json({ success: false, error: error.message || "Failed to fetch dashboard overview" });
  }
};
