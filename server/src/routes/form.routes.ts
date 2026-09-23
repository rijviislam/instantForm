import { Router, Response } from "express";
import { authenticate, AuthenticatedRequest } from "../middleware/auth.middleware";
import { FormService } from "../services/form.service";

const router = Router();

// All form routes require verified authenticated user
router.use(authenticate);

// GET /api/forms - List forms belonging exclusively to authenticated user
router.get("/", async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const search = req.query.search as string | undefined;
    const status = req.query.status as string | undefined;
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 12;

    const result = await FormService.listUserForms(userId, {
      search,
      status,
      page,
      limit,
    });

    res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error: any) {
    console.error("Error in GET /api/forms:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
      message: "Failed to fetch forms",
    });
  }
});

// POST /api/forms - Create a new draft form with optional style and initial fields
router.post("/", async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const title = req.body.title || "Untitled Form";
    const description = req.body.description || null;
    const style = req.body.style || "classic";
    const fields = req.body.fields || [];
    const theme = req.body.theme || null;

    const newForm = await FormService.createBlankForm(userId, title, {
      description,
      style,
      fields,
      theme,
    });

    res.status(201).json({
      success: true,
      message: "Form created successfully",
      data: newForm,
    });
  } catch (error: any) {
    console.error("Error in POST /api/forms:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
      message: "Failed to create form",
    });
  }
});

// GET /api/forms/:id - Get specific form with ownership authorization check
router.get("/:id", async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const rawId = req.params.id;
    const formId = Array.isArray(rawId) ? rawId[0] : rawId;

    const form = await FormService.getFormById(formId, userId);
    if (!form) {
      res.status(404).json({
        success: false,
        error: "Not Found",
        message: "Form not found or you do not have permission to view it",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: form,
    });
  } catch (error: any) {
    console.error("Error in GET /api/forms/:id:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
      message: "Failed to fetch form details",
    });
  }
});

// PATCH /api/forms/:id - Update form attributes
router.patch("/:id", async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const rawId = req.params.id;
    const formId = Array.isArray(rawId) ? rawId[0] : rawId;
    const { title, description, status, isPublished, style, fields } = req.body;

    const updated = await FormService.updateForm(formId, userId, {
      title,
      description,
      status,
      isPublished,
      style,
      fields,
    });

    res.status(200).json({
      success: true,
      message: "Form updated successfully",
      data: updated,
    });
  } catch (error: any) {
    console.error("Error in PATCH /api/forms/:id:", error);
    res.status(400).json({
      success: false,
      error: "Update error",
      message: error.message || "Failed to update form",
    });
  }
});

// POST /api/forms/:id/duplicate - Duplicate form with independent slug & ID
router.post("/:id/duplicate", async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const rawId = req.params.id;
    const formId = Array.isArray(rawId) ? rawId[0] : rawId;

    const duplicated = await FormService.duplicateForm(formId, userId);

    res.status(201).json({
      success: true,
      message: "Form duplicated successfully",
      data: duplicated,
    });
  } catch (error: any) {
    console.error("Error in POST /api/forms/:id/duplicate:", error);
    res.status(400).json({
      success: false,
      error: "Duplicate error",
      message: error.message || "Failed to duplicate form",
    });
  }
});

// POST /api/forms/:id/publish - Publish form
router.post("/:id/publish", async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const rawId = req.params.id;
    const formId = Array.isArray(rawId) ? rawId[0] : rawId;

    const published = await FormService.publishForm(formId, userId);

    res.status(200).json({
      success: true,
      message: "Form published successfully",
      data: published,
    });
  } catch (error: any) {
    console.error("Error in POST /api/forms/:id/publish:", error);
    res.status(400).json({
      success: false,
      error: "Publish error",
      message: error.message || "Failed to publish form",
    });
  }
});

// POST /api/forms/:id/unpublish - Unpublish form
router.post("/:id/unpublish", async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const rawId = req.params.id;
    const formId = Array.isArray(rawId) ? rawId[0] : rawId;

    const unpublished = await FormService.unpublishForm(formId, userId);

    res.status(200).json({
      success: true,
      message: "Form unpublished successfully",
      data: unpublished,
    });
  } catch (error: any) {
    console.error("Error in POST /api/forms/:id/unpublish:", error);
    res.status(400).json({
      success: false,
      error: "Unpublish error",
      message: error.message || "Failed to unpublish form",
    });
  }
});

// DELETE /api/forms/:id - Delete form
router.delete("/:id", async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const rawId = req.params.id;
    const formId = Array.isArray(rawId) ? rawId[0] : rawId;

    await FormService.deleteForm(formId, userId);

    res.status(200).json({
      success: true,
      message: "Form deleted successfully",
    });
  } catch (error: any) {
    console.error("Error in DELETE /api/forms/:id:", error);
    res.status(400).json({
      success: false,
      error: "Delete error",
      message: error.message || "Failed to delete form",
    });
  }
});

export default router;
