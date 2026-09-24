import { Router, Response } from "express";
import { authenticate, AuthenticatedRequest } from "../middleware/auth.middleware";
import { ResponseService } from "../services/response.service";

const router = Router();

// All response routes require authentication
router.use(authenticate);

// GET /api/responses - Global user responses across all their forms
router.get("/", async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const allResponses = await ResponseService.getUserAllResponses(userId);

    res.status(200).json({
      success: true,
      data: allResponses,
    });
  } catch (error: any) {
    console.error("Error in GET /api/responses:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
      message: "Failed to fetch user responses",
    });
  }
});

// GET /api/forms/:id/responses - Responses & analytics for a specific owned form
router.get("/:id/responses", async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const rawFormId = req.params.id;
    const formId = Array.isArray(rawFormId) ? rawFormId[0] : rawFormId;

    const search = req.query.search as string | undefined;
    const startDate = req.query.startDate as string | undefined;
    const endDate = req.query.endDate as string | undefined;
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;

    const result = await ResponseService.getFormResponses(formId, userId, {
      search,
      startDate,
      endDate,
      page,
      limit,
    });

    res.status(200).json({
      success: true,
      data: result.responses,
      analytics: result.analytics,
      pagination: result.pagination,
    });
  } catch (error: any) {
    console.error("Error in GET /api/forms/:id/responses:", error);
    res.status(404).json({
      success: false,
      error: "Responses error",
      message: error.message || "Failed to fetch form responses",
    });
  }
});

// GET /api/forms/:id/responses/:responseId - Single response detail
router.get("/:id/responses/:responseId", async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const rawFormId = req.params.id;
    const formId = Array.isArray(rawFormId) ? rawFormId[0] : rawFormId;
    const rawRespId = req.params.responseId;
    const responseId = Array.isArray(rawRespId) ? rawRespId[0] : rawRespId;

    const detail = await ResponseService.getResponseDetail(formId, responseId, userId);

    res.status(200).json({
      success: true,
      data: detail,
    });
  } catch (error: any) {
    console.error("Error in GET /api/forms/:id/responses/:responseId:", error);
    res.status(404).json({
      success: false,
      error: "Not Found",
      message: error.message || "Failed to fetch response detail",
    });
  }
});

export default router;
