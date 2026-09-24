import { Router, Request, Response } from "express";
import { authenticate, AuthenticatedRequest } from "../middleware/auth.middleware";
import { TemplateService } from "../services/template.service";

const router = Router();

// GET /api/templates - List all templates with optional category filtering
router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const category = req.query.category as string | undefined;
    const templates = await TemplateService.getAllTemplates(category);

    res.status(200).json({
      success: true,
      data: templates,
    });
  } catch (error: any) {
    console.error("Error in GET /api/templates:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
      message: "Failed to fetch templates",
    });
  }
});

// GET /api/templates/:id - Get template by ID or slug
router.get("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const rawId = req.params.id;
    const templateId = Array.isArray(rawId) ? rawId[0] : rawId;
    const template = await TemplateService.getTemplateById(templateId);

    if (!template) {
      res.status(404).json({
        success: false,
        error: "Not Found",
        message: "Template not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: template,
    });
  } catch (error: any) {
    console.error("Error in GET /api/templates/:id:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
      message: "Failed to fetch template",
    });
  }
});

// POST /api/templates/:id/use - Create a NEW Form from the selected template for the authenticated user
router.post("/:id/use", authenticate, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const rawId = req.params.id;
    const templateId = Array.isArray(rawId) ? rawId[0] : rawId;

    const newForm = await TemplateService.useTemplate(templateId, userId);

    res.status(201).json({
      success: true,
      message: "Form created from template successfully",
      data: newForm,
    });
  } catch (error: any) {
    console.error("Error in POST /api/templates/:id/use:", error);
    res.status(400).json({
      success: false,
      error: "Template error",
      message: error.message || "Failed to create form from template",
    });
  }
});

export default router;
