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
        if (field.type === "email" && typeof val === "string") {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(val)) {
            throw new Error(`Invalid email address provided for "${field.label}".`);
          }
        }
        if (field.type === "number" && isNaN(Number(val))) {
          throw new Error(`Field "${field.label}" must be a valid number.`);
        }
      }
    }

    // 3. Save Response & ResponseAnswers
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

        return {
          id: result.id,
          submittedAt: result.submittedAt,
        };
      } catch (error) {
        console.warn("⚠️ Prisma transaction in submitResponse failed, using in-memory store.");
        this.isPrismaAvailable = false;
      }
    }

    // In-memory fallback
    const id = `resp_${randomUUID()}`;
    const newResp: FormResponseItem = {
      id,
      formId: form.id,
      data: answers,
      submittedAt: new Date(),
      createdAt: new Date(),
      answers: Object.entries(answers).map(([fieldId, value]) => ({ fieldId, value })),
    };

    const existing = inMemoryResponses.get(form.id) || [];
    inMemoryResponses.set(form.id, [newResp, ...existing]);

    return {
      id,
      submittedAt: newResp.submittedAt,
    };
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
