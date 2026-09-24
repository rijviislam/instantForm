import { Router, Request, Response } from "express";
import { FormService } from "../services/form.service";
import { ResponseService } from "../services/response.service";

const router = Router();

// GET /api/public/forms/:slug - Public endpoint to retrieve published form definition
router.get("/forms/:slug", async (req: Request, res: Response): Promise<void> => {
  try {
    const rawSlug = req.params.slug;
    const slug = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug;

    const form = await FormService.getFormBySlug(slug);

    if (!form || (form.status !== "PUBLISHED" && !form.isPublished)) {
      res.status(404).json({
        success: false,
        error: "Not Found",
        message: "This form is not found or is not currently published.",
      });
      return;
    }

    // Return public-safe form payload (never expose userId or internal secrets)
    res.status(200).json({
      success: true,
      data: {
        id: form.id,
        slug: form.slug,
        title: form.title,
        description: form.description,
        style: form.style || "classic",
        theme: form.theme || null,
        fields: form.fields || [],
        createdAt: form.createdAt,
      },
    });
  } catch (error: any) {
    console.error("Error in GET /api/public/forms/:slug:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
      message: "Failed to load public form.",
    });
  }
});

// POST /api/public/forms/:slug/responses - Public endpoint to submit respondent answers
router.post("/forms/:slug/responses", async (req: Request, res: Response): Promise<void> => {
  try {
    const rawSlug = req.params.slug;
    const slug = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug;
    const { answers, metadata } = req.body;

    if (!answers || typeof answers !== "object") {
      res.status(400).json({
        success: false,
        error: "Bad Request",
        message: "Submission answers payload is required.",
      });
      return;
    }

    const result = await ResponseService.submitResponse(slug, answers, metadata);

    res.status(201).json({
      success: true,
      message: "Response submitted successfully!",
      data: result,
    });
  } catch (error: any) {
    console.error("Error in POST /api/public/forms/:slug/responses:", error);
    res.status(400).json({
      success: false,
      error: "Submission Error",
      message: error.message || "Failed to submit form response.",
    });
  }
});

export default router;
