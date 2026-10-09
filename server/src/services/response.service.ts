import { prisma } from "../db";
import { randomUUID } from "crypto";

export interface ResponseSubmissionAnswer {
  fieldId: string;
  value: any;
}

export interface FormResponseItem {
  id: string;
  formId: string;
  data: Record<string, any>;
  submittedAt: Date | string;
  createdAt: Date | string;
  answers?: Array<{
    fieldId: string;
    value: any;
  }>;
}

export interface ChoiceDistribution {
  option: string;
  count: number;
  percentage: number;
}

export interface QuestionAnalytics {
  fieldId: string;
  label: string;
  type: string;
  totalAnswered: number;
  averageRating?: number;
  ratingDistribution?: Record<number, number>;
  choiceDistribution?: ChoiceDistribution[];
}

export interface FormAnalyticsSummary {
  totalResponses: number;
  completionRate: number;
  responsesOverTime: Array<{ date: string; count: number }>;
  questions: QuestionAnalytics[];
}

// In-memory responses store fallback for offline/development resilience
const inMemoryResponses = new Map<string, FormResponseItem[]>();

export class ResponseService {
  private static isPrismaAvailable = true;

  /**
   * Submit a public response to a PUBLISHED form.
   * Transactionally saves Response and validates against form fields.
   */
  static async submitResponse(
    slug: string,
    answers: Record<string, any>,
    metadata?: any
  ): Promise<{ id: string; submittedAt: Date | string }> {
    // 1. Find published form
    let form: any = null;

    if (this.isPrismaAvailable) {
      try {
        form = await prisma.form.findFirst({
          where: { slug, status: "PUBLISHED" },
        });
      } catch (error) {
        console.warn("⚠️ Prisma query in submitResponse failed, using fallback.");
        this.isPrismaAvailable = false;
      }
    }

    if (!form) {
      // In-memory fallback lookup
      // Note: FormService fallback forms can be matched by slug
      const { FormService } = await import("./form.service");
      const fallbackForm = await FormService.getFormBySlug(slug);
      if (fallbackForm && (fallbackForm.status === "PUBLISHED" || fallbackForm.isPublished)) {
        form = fallbackForm;
      }
    }

    if (!form) {
      throw new Error("Form not found or is not currently published.");
    }

    const fields: any[] = Array.isArray(form.fields) ? form.fields : [];

    // 2. Server-side validation of answers against field definitions
    for (const field of fields) {
      const val = answers[field.id];
      if (field.required && (val === undefined || val === null || val === "" || (Array.isArray(val) && val.length === 0))) {
        throw new Error(`Field "${field.label || "Required field"}" is required.`);
      }

      if (val !== undefined && val !== null && val !== "") {
        // Email validation
        if (field.type === "email" && typeof val === "string") {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(val.trim())) {
            throw new Error(`Invalid email address provided for "${field.label}".`);
          }
        }

        // Phone validation
        if (field.type === "phone" && typeof val === "string") {
          const digitsOnly = val.replace(/\D/g, "");
          const phoneRegex = /^(\+?\d{1,4}[-.\s]?)?(\(?\d{2,4}\)?[-.\s]?)?\d{3,4}[-.\s]?\d{3,4}$/;
          if (digitsOnly.length < 7 || digitsOnly.length > 16 || !phoneRegex.test(val.trim())) {
            throw new Error(`Invalid phone number provided for "${field.label}".`);
          }
        }

        // URL / Link validation
        const isUrlField =
          field.type === "url" ||
          ((field.type === "short_text" || field.type === "text" || !field.type) &&
            /(url|website|portfolio|linkedin|github|link\b)/i.test(
              `${field.label || ""} ${field.placeholder || ""}`
            ));

        if (isUrlField && typeof val === "string" && val.trim().length > 0) {
          const trimmed = val.trim();
          const urlPattern =
            /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$/i;
          if (!urlPattern.test(trimmed)) {
            throw new Error(
              `Please provide a valid website or profile URL for "${field.label}".`
            );
          }
          try {
            const formatted =
              trimmed.startsWith("http://") || trimmed.startsWith("https://")
                ? trimmed
                : `https://${trimmed}`;
            const parsed = new URL(formatted);
            if (!parsed.hostname || !parsed.hostname.includes(".") || parsed.hostname.endsWith(".")) {
              throw new Error(
                `Please provide a valid website or profile URL for "${field.label}".`
              );
            }
          } catch {
            throw new Error(
              `Please provide a valid website or profile URL for "${field.label}".`
            );
          }
        }

        // Number validation
        if (
          (field.type === "number" || field.type === "decimal" || field.type === "currency" || field.type === "percentage") &&
          isNaN(Number(val))
        ) {
          throw new Error(`Field "${field.label}" must be a valid number.`);
        }
      }
    }

    // 3. One-Submission-Per-User Check (Enforce single submission per respondent email)
    let respondentEmail: string | null = null;
    for (const field of fields) {
      if (field.type === "email" && typeof answers[field.id] === "string" && answers[field.id].trim()) {
        respondentEmail = answers[field.id].trim().toLowerCase();
        break;
      }
    }
    if (!respondentEmail && metadata?.respondentEmail) {
      respondentEmail = String(metadata.respondentEmail).trim().toLowerCase();
    }

    if (respondentEmail) {
      if (this.isPrismaAvailable) {
        try {
          // Fast single-indexed lookup on responseAnswer
          const existing = await prisma.responseAnswer.findFirst({
            where: {
              response: { formId: form.id },
              valueText: respondentEmail,
            },
            select: { id: true },
          });

          if (existing) {
            throw new Error(
              `You have already submitted this application. Each user can only submit once.`
            );
          }
        } catch (err: any) {
          if (err.message?.includes("already submitted")) {
            throw err;
          }
          console.warn("⚠️ Prisma duplicate check query error:", err);
        }
      }

      // In-memory duplicate check
      const existing = inMemoryResponses.get(form.id) || [];
      const hasDuplicate = existing.some((r) => {
        const d = r.data;
        if (!d) return false;
        return Object.values(d).some(
          (v) => typeof v === "string" && v.trim().toLowerCase() === respondentEmail
        );
      });
      if (hasDuplicate) {
        throw new Error(
          `You have already submitted this application. Each user can only submit once.`
        );
      }
    }

    // 4. Integrations & Storage Configuration
    const themeObj = typeof form.theme === "object" && form.theme !== null ? form.theme : {};
    const integrations = themeObj.integrations || {};
    const storeLocally = integrations.storeLocalResponses !== false;

    let responseId: string = `resp_${randomUUID()}`;
    let submittedAt: Date = new Date();

    if (storeLocally) {
      if (this.isPrismaAvailable) {
        try {
          const result = await prisma.$transaction(async (tx) => {
            const newResponse = await tx.response.create({
              data: {
                formId: form.id,
                data: answers,
              },
            });

            // Create individual answers records
            const answerEntries = Object.entries(answers);
            if (answerEntries.length > 0) {
              await tx.responseAnswer.createMany({
                data: answerEntries.map(([fieldId, value]) => ({
                  responseId: newResponse.id,
                  fieldId,
                  valueJson: value,
                  valueText: typeof value === "string" ? value : JSON.stringify(value),
                })),
              });
            }

            return newResponse;
          });

          responseId = result.id;
          submittedAt = result.submittedAt;
        } catch (error) {
          console.warn("⚠️ Prisma transaction in submitResponse failed, using in-memory store.");
          this.isPrismaAvailable = false;
        }
      }

      if (!this.isPrismaAvailable) {
        // In-memory fallback
        const newResp: FormResponseItem = {
          id: responseId,
          formId: form.id,
          data: answers,
          submittedAt,
          createdAt: submittedAt,
          answers: Object.entries(answers).map(([fieldId, value]) => ({ fieldId, value })),
        };

        const existing = inMemoryResponses.get(form.id) || [];
        inMemoryResponses.set(form.id, [newResp, ...existing]);
      }
    }

    // 5. Asynchronous dispatch to external integrations (Google Sheets / Webhook)
    ResponseService.dispatchIntegrations(form, responseId, answers, submittedAt).catch((err) => {
      console.warn("External integration dispatch encountered an error:", err?.message || err);
    });

    return {
      id: responseId,
      submittedAt,
    };
  }

  /**
   * Dispatch submission payload to connected Google Sheets and Webhooks.
   */
  static async dispatchIntegrations(
    form: any,
    responseId: string,
    answers: Record<string, any>,
    submittedAt: Date | string
  ): Promise<void> {
    const themeObj = typeof form.theme === "object" && form.theme !== null ? form.theme : {};
    const integrations = themeObj.integrations;
    if (!integrations) return;

    const fields: any[] = Array.isArray(form.fields) ? form.fields : [];
    const fieldMap = new Map<string, string>();
    for (const f of fields) {
      if (f && f.id) {
        fieldMap.set(f.id, f.label || f.id);
      }
    }

    const namedAnswers: Record<string, any> = {};
    for (const [key, val] of Object.entries(answers)) {
      const label = fieldMap.get(key) || key;
      namedAnswers[label] = val;
    }

    const formattedSubmittedAt =
      typeof submittedAt === "string" ? submittedAt : submittedAt.toISOString();

    const payload = {
      event: "form_submission",
      formId: form.id,
      formTitle: form.title,
      formSlug: form.slug,
      responseId,
      submittedAt: formattedSubmittedAt,
      data: answers,
      namedAnswers,
    };

    const dispatches: Promise<any>[] = [];

    // 1. Google Sheets Direct API Append (1-Click Auto-Sync)
    if (integrations.googleSheetsEnabled && integrations.spreadsheetId) {
      dispatches.push(
        (async () => {
          try {
            const googleAccount = await prisma.account.findFirst({
              where: { userId: form.userId, provider: "google" },
            });
            if (googleAccount) {
              let token = googleAccount.access_token;
              if (
                googleAccount.refresh_token &&
                (!token || (googleAccount.expires_at && googleAccount.expires_at * 1000 <= Date.now() + 60000))
              ) {
                const clientId = process.env.AUTH_GOOGLE_ID || process.env.GOOGLE_CLIENT_ID;
                const clientSecret = process.env.AUTH_GOOGLE_SECRET || process.env.GOOGLE_CLIENT_SECRET;
                if (clientId && clientSecret) {
                  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
                    method: "POST",
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    body: new URLSearchParams({
                      client_id: clientId,
                      client_secret: clientSecret,
                      refresh_token: googleAccount.refresh_token,
                      grant_type: "refresh_token",
                    }),
                  });
                  const tData = await tokenRes.json();
                  if (tData.access_token) {
                    token = tData.access_token;
                  }
                }
              }

              if (token) {
                const rowValues = [
                  formattedSubmittedAt,
                  responseId,
                  ...fields.map((f) => {
                    const val = answers[f.id];
                    if (val === undefined || val === null) return "";
                    if (typeof val === "object") return JSON.stringify(val);
                    return String(val);
                  }),
                ];

                await fetch(
                  `https://sheets.googleapis.com/v4/spreadsheets/${integrations.spreadsheetId}/values/Sheet1!A1:append?valueInputOption=USER_ENTERED`,
                  {
                    method: "POST",
                    headers: {
                      Authorization: `Bearer ${token}`,
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      range: "Sheet1!A1",
                      majorDimension: "ROWS",
                      values: [rowValues],
                    }),
                    signal: AbortSignal.timeout(8000),
                  }
                );
              }
            }
          } catch (err: any) {
            console.warn(`[Integrations] Direct Google Sheets API append error:`, err?.message || err);
          }
        })()
      );
    }

    // 2. Google Sheets Webhook / Web App
    if (integrations.googleSheetsEnabled && integrations.googleSheetsWebhookUrl?.trim()) {
      const url = integrations.googleSheetsWebhookUrl.trim();
      dispatches.push(
        fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          signal: AbortSignal.timeout(8000),
        }).catch((err) => {
          console.warn(`[Integrations] Google Sheets webhook failed for form ${form.id}:`, err?.message || err);
        })
      );
    }

    // 2. Custom Webhook
    if (integrations.webhookEnabled && integrations.webhookUrl?.trim()) {
      const url = integrations.webhookUrl.trim();
      dispatches.push(
        fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          signal: AbortSignal.timeout(8000),
        }).catch((err) => {
          console.warn(`[Integrations] Custom webhook failed for form ${form.id}:`, err?.message || err);
        })
      );
    }

    await Promise.allSettled(dispatches);
  }

  /**
   * Test an external webhook or Google Sheets Web App connection.
   */
  static async testIntegration(
    url: string,
    formTitle: string,
    type: "googleSheets" | "webhook"
  ): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const samplePayload = {
        event: "test_connection",
        source: "InstantForm",
        type,
        formTitle,
        responseId: "resp_test_" + Date.now().toString(36),
        submittedAt: new Date().toISOString(),
        data: {
          test_field_1: "Alex Sample",
          test_field_2: "alex@example.com",
          test_field_3: "This is a test submission from InstantForm integration test.",
        },
        namedAnswers: {
          "Full Name": "Alex Sample",
          "Email Address": "alex@example.com",
          "Test Message": "This is a test submission from InstantForm integration test.",
        },
      };

      const res = await fetch(url.trim(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(samplePayload),
        signal: AbortSignal.timeout(8000),
      });

      if (!res.ok) {
        return {
          success: false,
          error: `Endpoint returned HTTP status ${res.status} (${res.statusText})`,
        };
      }

      return {
        success: true,
        message: "Test connection successful! Data was sent to your endpoint.",
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || "Failed to reach endpoint. Check the URL and network permissions.",
      };
    }
  }

  /**
   * Get all responses and analytics for a form owned by user.
   */
  static async getFormResponses(
    formId: string,
    userId: string,
    options: {
      search?: string;
      startDate?: string;
      endDate?: string;
      page?: number;
      limit?: number;
    } = {}
  ): Promise<{
    responses: FormResponseItem[];
    analytics: FormAnalyticsSummary;
    pagination: { page: number; limit: number; total: number; totalPages: number };
  }> {
    const page = Math.max(1, options.page || 1);
    const limit = Math.min(100, Math.max(1, options.limit || 20));
    const skip = (page - 1) * limit;

    let form: any = null;
    let rawResponses: FormResponseItem[] = [];

    if (this.isPrismaAvailable) {
      try {
        form = await prisma.form.findFirst({
          where: { id: formId, userId },
          include: {
            responses: {
              orderBy: { createdAt: "desc" },
            },
          },
        });

        if (form) {
          rawResponses = form.responses.map((r: any) => ({
            id: r.id,
            formId: r.formId,
            data: (r.data || {}) as Record<string, any>,
            submittedAt: r.submittedAt || r.createdAt,
            createdAt: r.createdAt,
          }));
        }
      } catch (error) {
        this.isPrismaAvailable = false;
      }
    }

    if (!form) {
      const { FormService } = await import("./form.service");
      form = await FormService.getFormById(formId, userId);
      rawResponses = inMemoryResponses.get(formId) || [];
    }

    if (!form) {
      throw new Error("Form not found or unauthorized");
    }

    // Filter by search query across response text
    let filtered = [...rawResponses];
    if (options.search) {
      const q = options.search.toLowerCase();
      filtered = filtered.filter((r) =>
        JSON.stringify(r.data).toLowerCase().includes(q)
      );
    }

    // Filter by date range
    if (options.startDate) {
      const s = new Date(options.startDate).getTime();
      filtered = filtered.filter((r) => new Date(r.submittedAt).getTime() >= s);
    }
    if (options.endDate) {
      const e = new Date(options.endDate).getTime();
      filtered = filtered.filter((r) => new Date(r.submittedAt).getTime() <= e);
    }

    const total = filtered.length;
    const paginated = filtered.slice(skip, skip + limit);

    // Compute basic analytics
    const fields: any[] = Array.isArray(form.fields) ? form.fields : [];
    const questionAnalytics: QuestionAnalytics[] = fields.map((field) => {
      const fieldAnswers = rawResponses
        .map((r) => r.data[field.id])
        .filter((val) => val !== undefined && val !== null && val !== "");

      const totalAnswered = fieldAnswers.length;

      // Rating analytics
      let averageRating: number | undefined;
      let ratingDistribution: Record<number, number> | undefined;

      if (field.type === "rating") {
        ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        let sum = 0;
        fieldAnswers.forEach((val) => {
          const num = Number(val);
          if (num >= 1 && num <= 5) {
            ratingDistribution![num] = (ratingDistribution![num] || 0) + 1;
            sum += num;
          }
        });
        averageRating = totalAnswered > 0 ? Number((sum / totalAnswered).toFixed(1)) : 0;
      }

      // Choice / Dropdown / Yes-No analytics
      let choiceDistribution: ChoiceDistribution[] | undefined;
      if (
        field.type === "single_choice" ||
        field.type === "multiple_choice" ||
        field.type === "dropdown" ||
        field.type === "yes_no"
      ) {
        const optionsList =
          field.type === "yes_no"
            ? ["Yes", "No"]
            : field.options || [];

        const countsMap = new Map<string, number>();
        optionsList.forEach((opt: string) => countsMap.set(opt, 0));

        fieldAnswers.forEach((val) => {
          if (Array.isArray(val)) {
            val.forEach((item) => {
              countsMap.set(item, (countsMap.get(item) || 0) + 1);
            });
          } else if (typeof val === "string") {
            countsMap.set(val, (countsMap.get(val) || 0) + 1);
          }
        });

        choiceDistribution = optionsList.map((option: string) => {
          const count = countsMap.get(option) || 0;
          const percentage = totalAnswered > 0 ? Math.round((count / totalAnswered) * 100) : 0;
          return { option, count, percentage };
        });
      }

      return {
        fieldId: field.id,
        label: field.label || "Untitled Question",
        type: field.type,
        totalAnswered,
        averageRating,
        ratingDistribution,
        choiceDistribution,
      };
    });

    // Responses timeline (last 7 days)
    const daysMap = new Map<string, number>();
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = d.toLocaleDateString("en-US", { weekday: "short", month: "numeric", day: "numeric" });
      daysMap.set(key, 0);
    }

    rawResponses.forEach((r) => {
      const key = new Date(r.submittedAt).toLocaleDateString("en-US", { weekday: "short", month: "numeric", day: "numeric" });
      if (daysMap.has(key)) {
        daysMap.set(key, (daysMap.get(key) || 0) + 1);
      }
    });

    const responsesOverTime = Array.from(daysMap.entries()).map(([date, count]) => ({ date, count }));

    return {
      responses: paginated,
      analytics: {
        totalResponses: rawResponses.length,
        completionRate: rawResponses.length > 0 ? 100 : 0,
        responsesOverTime,
        questions: questionAnalytics,
      },
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  /**
   * Get single response detail with mapped field labels.
   */
  static async getResponseDetail(
    formId: string,
    responseId: string,
    userId: string
  ): Promise<{
    response: FormResponseItem;
    formTitle: string;
    fields: Array<{ id: string; label: string; type: string; answer: any }>;
  }> {
    const { FormService } = await import("./form.service");
    const form = await FormService.getFormById(formId, userId);
    if (!form) {
      throw new Error("Form not found or unauthorized");
    }

    let responseItem: FormResponseItem | null = null;

    if (this.isPrismaAvailable) {
      try {
        const dbResp = await prisma.response.findFirst({
          where: { id: responseId, formId },
        });
        if (dbResp) {
          responseItem = {
            id: dbResp.id,
            formId: dbResp.formId,
            data: (dbResp.data || {}) as Record<string, any>,
            submittedAt: dbResp.submittedAt || dbResp.createdAt,
            createdAt: dbResp.createdAt,
          };
        }
      } catch (error) {
        this.isPrismaAvailable = false;
      }
    }

    if (!responseItem) {
      const stored = inMemoryResponses.get(formId) || [];
      responseItem = stored.find((r) => r.id === responseId) || null;
    }

    if (!responseItem) {
      throw new Error("Response not found");
    }

    const fieldsList = (Array.isArray(form.fields) ? form.fields : []).map((f: any) => ({
      id: f.id,
      label: f.label || "Untitled Question",
      type: f.type || "short_text",
      answer: responseItem!.data[f.id] ?? null,
    }));

    return {
      response: responseItem,
      formTitle: form.title,
      fields: fieldsList,
    };
  }

  /**
   * Get all responses across all user-owned forms for `/responses`.
   */
  static async getUserAllResponses(userId: string): Promise<Array<{
    id: string;
    formId: string;
    formTitle: string;
    submittedAt: Date | string;
    answersSummary: string;
  }>> {
    const { FormService } = await import("./form.service");
    const formsResult = await FormService.listUserForms(userId, { limit: 50 });
    const userForms = formsResult.data;

    const allItems: Array<{
      id: string;
      formId: string;
      formTitle: string;
      submittedAt: Date | string;
      answersSummary: string;
    }> = [];

    for (const form of userForms) {
      let responses: FormResponseItem[] = [];
      if (this.isPrismaAvailable) {
        try {
          const dbResps = await prisma.response.findMany({
            where: { formId: form.id },
            orderBy: { createdAt: "desc" },
            take: 20,
          });
          responses = dbResps.map((r) => ({
            id: r.id,
            formId: r.formId,
            data: (r.data || {}) as Record<string, any>,
            submittedAt: r.submittedAt || r.createdAt,
            createdAt: r.createdAt,
          }));
        } catch (error) {
          this.isPrismaAvailable = false;
        }
      }

      if (responses.length === 0) {
        responses = inMemoryResponses.get(form.id) || [];
      }

      for (const r of responses) {
        const firstFewValues = Object.values(r.data)
          .filter((v) => typeof v === "string" || typeof v === "number")
          .slice(0, 2)
          .join(" • ");

        allItems.push({
          id: r.id,
          formId: form.id,
          formTitle: form.title,
          submittedAt: r.submittedAt,
          answersSummary: firstFewValues || "Response submitted",
        });
      }
    }

    allItems.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
    return allItems;
  }
}
