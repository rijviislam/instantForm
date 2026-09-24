import { Router, Response } from "express";
import { authenticate, AuthenticatedRequest } from "../middleware/auth.middleware";
import { DashboardService } from "../services/dashboard.service";

const router = Router();

// GET /api/dashboard/overview
router.get("/overview", authenticate, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const overview = await DashboardService.getOverview(userId);

    res.status(200).json({
      success: true,
      data: overview,
    });
  } catch (error) {
    console.error("Dashboard overview error:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
      message: "Failed to fetch dashboard overview data",
    });
  }
});

export default router;
