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
    const { title, description, status, isPublished, style, theme, fields, slug } = req.body;

    const updated = await FormService.updateForm(formId, userId, {
      title,
      description,
      status,
      isPublished,
      style,
      theme,
      fields,
      slug,
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

// POST /api/forms/:id/test-integration - Test Google Sheets or Webhook connection
router.post("/:id/test-integration", async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const rawId = req.params.id;
    const formId = Array.isArray(rawId) ? rawId[0] : rawId;
    const { url, type, formTitle } = req.body;

    if (!url || typeof url !== "string") {
      res.status(400).json({ success: false, error: "A valid URL is required." });
      return;
    }

    const { ResponseService } = await import("../services/response.service");
    const result = await ResponseService.testIntegration(
      url,
      formTitle || "InstantForm",
      type || "webhook"
    );

    res.status(result.success ? 200 : 400).json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || "Test failed" });
  }
});

// Helper to obtain a valid Google access token
async function getGoogleToken(account: any): Promise<string | null> {
  if (account.access_token && account.expires_at && account.expires_at * 1000 > Date.now() + 60000) {
    return account.access_token;
  }
  if (account.refresh_token) {
    const clientId = process.env.AUTH_GOOGLE_ID || process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.AUTH_GOOGLE_SECRET || process.env.GOOGLE_CLIENT_SECRET;
    if (clientId && clientSecret) {
      try {
        const res = await fetch("https://oauth2.googleapis.com/token", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            client_id: clientId,
            client_secret: clientSecret,
            refresh_token: account.refresh_token,
            grant_type: "refresh_token",
          }),
        });
        const tokenData = await res.json();
        if (tokenData.access_token) {
          try {
            const { prisma } = await import("../db");
            await prisma.account.update({
              where: { id: account.id },
              data: {
                access_token: tokenData.access_token,
                expires_at: Math.floor(Date.now() / 1000) + (tokenData.expires_in || 3600),
              },
            });
          } catch {
            // fallback
          }
          return tokenData.access_token;
        }
      } catch (err) {
        console.warn("Failed to refresh Google token:", err);
      }
    }
  }
  return account.access_token || null;
}

// POST /api/forms/:id/google-sheets/connect - 1-Click Google Sheets Auto-Sync Connect
router.post("/:id/google-sheets/connect", async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const rawId = req.params.id;
    const formId = Array.isArray(rawId) ? rawId[0] : rawId;

    const form = await FormService.getFormById(formId, userId);
    if (!form) {
      res.status(404).json({ success: false, error: "Form not found" });
      return;
    }

    const { prisma } = await import("../db");
    const googleAccount = await prisma.account.findFirst({
      where: { userId, provider: "google" },
    });

    if (!googleAccount || (!googleAccount.access_token && !googleAccount.refresh_token)) {
      res.status(200).json({
        success: false,
        requiresGoogleAuth: true,
        message: "Connect your Google Account to enable 1-click Google Sheets auto-sync.",
      });
      return;
    }

    const token = await getGoogleToken(googleAccount);
    if (!token) {
      res.status(200).json({
        success: false,
        requiresGoogleAuth: true,
        message: "Google authorization expired. Please re-authorize your Google Account.",
      });
      return;
    }

    // 1. Create Spreadsheet via Google Sheets API v4
    const spreadsheetTitle = `${form.title} — InstantForm Responses`;
    const createRes = await fetch("https://sheets.googleapis.com/v4/spreadsheets", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        properties: { title: spreadsheetTitle },
      }),
    });

    if (!createRes.ok) {
      const errData = await createRes.json().catch(() => ({}));
      res.status(400).json({
        success: false,
        requiresGoogleAuth: true,
        error: "Google Sheets permission required. Please ensure spreadsheets permission is granted.",
        details: errData,
      });
      return;
    }

    const sheetData = await createRes.json();
    const spreadsheetId = sheetData.spreadsheetId;
    const spreadsheetUrl =
      sheetData.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;

    // 2. Set up Question Headers in Row 1
    const fields: any[] = Array.isArray(form.fields) ? form.fields : [];
    const headers = ["Submitted At", "Response ID", ...fields.map((f) => f.label || f.id)];

    await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1!A1:append?valueInputOption=USER_ENTERED`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          range: "Sheet1!A1",
          majorDimension: "ROWS",
          values: [headers],
        }),
      }
    );

    // 3. Backfill any existing responses
    const { ResponseService } = await import("../services/response.service");
    const existingResult = await ResponseService.getFormResponses(formId, userId, { limit: 5000 });
    const existingResponses = existingResult.responses || [];

    if (existingResponses.length > 0) {
      const rows = existingResponses.map((r) => [
        new Date(r.submittedAt).toISOString(),
        r.id,
        ...fields.map((f) => {
          const val = r.data[f.id];
          if (val === undefined || val === null) return "";
          if (typeof val === "object") return JSON.stringify(val);
          return String(val);
        }),
      ]);

      await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1!A1:append?valueInputOption=USER_ENTERED`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            range: "Sheet1!A1",
            majorDimension: "ROWS",
            values: rows,
          }),
        }
      );
    }

    // 4. Update Form Integrations theme settings
    const currentTheme = form.theme || {};
    const updatedIntegrations = {
      ...(currentTheme.integrations || {}),
      googleSheetsEnabled: true,
      spreadsheetId,
      spreadsheetUrl,
      spreadsheetTitle,
      lastSyncedAt: new Date().toISOString(),
    };

    await FormService.updateForm(formId, userId, {
      theme: {
        ...currentTheme,
        integrations: updatedIntegrations,
      },
    });

    res.status(200).json({
      success: true,
      message: "Google Sheet created and live auto-sync activated!",
      spreadsheetId,
      spreadsheetUrl,
      spreadsheetTitle,
    });
  } catch (error: any) {
    console.error("Error connecting Google Sheets:", error);
    res.status(500).json({ success: false, error: error.message || "Failed to connect Google Sheets" });
  }
});

// POST /api/forms/:id/google-sheets/link-sheet - Link existing Google Sheet URL or ID
router.post("/:id/google-sheets/link-sheet", async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const rawId = req.params.id;
    const formId = Array.isArray(rawId) ? rawId[0] : rawId;
    const { sheetUrlOrId } = req.body;

    if (!sheetUrlOrId || typeof sheetUrlOrId !== "string") {
      res.status(400).json({ success: false, error: "A valid Google Sheet URL or ID is required." });
      return;
    }

    const form = await FormService.getFormById(formId, userId);
    if (!form) {
      res.status(404).json({ success: false, error: "Form not found" });
      return;
    }

    // Extract spreadsheet ID
    let spreadsheetId = sheetUrlOrId.trim();
    const match = sheetUrlOrId.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (match && match[1]) {
      spreadsheetId = match[1];
    }

    const spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;
    const spreadsheetTitle = `${form.title} (Linked Google Sheet)`;

    const currentTheme = form.theme || {};
    const updatedIntegrations = {
      ...(currentTheme.integrations || {}),
      googleSheetsEnabled: true,
      spreadsheetId,
      spreadsheetUrl,
      spreadsheetTitle,
      lastSyncedAt: new Date().toISOString(),
    };

    await FormService.updateForm(formId, userId, {
      theme: {
        ...currentTheme,
        integrations: updatedIntegrations,
      },
    });

    res.status(200).json({
      success: true,
      spreadsheetId,
      spreadsheetUrl,
      spreadsheetTitle,
      message: "Google Sheet successfully linked!",
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || "Failed to link Google Sheet" });
  }
});

// POST /api/forms/:id/google-sheets/sync-all - Force Sync All Responses to Google Sheet
router.post("/:id/google-sheets/sync-all", async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const rawId = req.params.id;
    const formId = Array.isArray(rawId) ? rawId[0] : rawId;

    const form = await FormService.getFormById(formId, userId);
    if (!form) {
      res.status(404).json({ success: false, error: "Form not found" });
      return;
    }

    const integrations = form.theme?.integrations || {};
    const spreadsheetId = integrations.spreadsheetId;

    if (!spreadsheetId) {
      res.status(400).json({ success: false, error: "No Google Sheet is currently connected." });
      return;
    }

    const { prisma } = await import("../db");
    const googleAccount = await prisma.account.findFirst({
      where: { userId, provider: "google" },
    });

    const token = googleAccount ? await getGoogleToken(googleAccount) : null;
    if (!token) {
      res.status(400).json({
        success: false,
        error: "Google authorization required. Please reconnect Google Account.",
      });
      return;
    }

    const { ResponseService } = await import("../services/response.service");
    const result = await ResponseService.getFormResponses(formId, userId, { limit: 10000 });
    const responses = result.responses || [];

    const fields: any[] = Array.isArray(form.fields) ? form.fields : [];
    const headers = ["Submitted At", "Response ID", ...fields.map((f) => f.label || f.id)];

    const rows = [
      headers,
      ...responses.map((r) => [
        new Date(r.submittedAt).toISOString(),
        r.id,
        ...fields.map((f) => {
          const val = r.data[f.id];
          if (val === undefined || val === null) return "";
          if (typeof val === "object") return JSON.stringify(val);
          return String(val);
        }),
      ]),
    ];

    // Overwrite Sheet1 values cleanly
    const updateRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1!A1?valueInputOption=USER_ENTERED`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          range: "Sheet1!A1",
          majorDimension: "ROWS",
          values: rows,
        }),
      }
    );

    if (!updateRes.ok) {
      res.status(400).json({ success: false, error: "Google Sheets update failed." });
      return;
    }

    // Update lastSyncedAt
    const currentTheme = form.theme || {};
    await FormService.updateForm(formId, userId, {
      theme: {
        ...currentTheme,
        integrations: {
          ...integrations,
          lastSyncedAt: new Date().toISOString(),
        },
      },
    });

    res.status(200).json({
      success: true,
      syncedCount: responses.length,
      message: `Successfully synchronized ${responses.length} responses to Google Sheet!`,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || "Failed to sync responses" });
  }
});

// POST /api/forms/:id/google-sheets/disconnect - Disconnect Google Sheet
router.post("/:id/google-sheets/disconnect", async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const rawId = req.params.id;
    const formId = Array.isArray(rawId) ? rawId[0] : rawId;

    const form = await FormService.getFormById(formId, userId);
    if (!form) {
      res.status(404).json({ success: false, error: "Form not found" });
      return;
    }

    const currentTheme = form.theme || {};
    const updatedIntegrations = {
      ...(currentTheme.integrations || {}),
      googleSheetsEnabled: false,
      spreadsheetId: undefined,
      spreadsheetUrl: undefined,
      spreadsheetTitle: undefined,
    };

    await FormService.updateForm(formId, userId, {
      theme: {
        ...currentTheme,
        integrations: updatedIntegrations,
      },
    });

    res.status(200).json({ success: true, message: "Google Sheet disconnected." });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || "Failed to disconnect" });
  }
});

export default router;
