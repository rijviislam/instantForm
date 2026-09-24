import { prisma } from "../db";
import { randomUUID } from "crypto";

export interface FormItem {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED" | string;
  isPublished: boolean;
  style: string | null;
  theme?: any;
  fields: any;
  userId: string;
  responsesCount: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface FormListResult {
  data: FormItem[];
  pagination: PaginationMeta;
}

// In-memory store fallback for offline/development resilience
const inMemoryForms = new Map<string, FormItem>();

export class FormService {
  private static isPrismaAvailable = true;

  static async listUserForms(
    userId: string,
    options: {
      search?: string;
      status?: string;
      page?: number;
      limit?: number;
    } = {}
  ): Promise<FormListResult> {
    const page = Math.max(1, options.page || 1);
    const limit = Math.min(50, Math.max(1, options.limit || 12));
    const skip = (page - 1) * limit;
    const search = options.search?.trim();
    const statusFilter = options.status?.toUpperCase();

    if (this.isPrismaAvailable) {
      try {
        const where: any = { userId };

        if (statusFilter && statusFilter !== "ALL") {
          where.status = statusFilter;
        }

        if (search) {
          where.title = { contains: search, mode: "insensitive" };
        }

        const [total, forms] = await Promise.all([
          prisma.form.count({ where }),
          prisma.form.findMany({
            where,
            include: {
              _count: {
                select: { responses: true },
              },
            },
            orderBy: { updatedAt: "desc" },
            skip,
            take: limit,
          }),
        ]);

        const mapped: FormItem[] = forms.map((f) => ({
          id: f.id,
          slug: f.slug,
          title: f.title,
          description: f.description,
          status: f.status || (f.isPublished ? "PUBLISHED" : "DRAFT"),
          isPublished: f.isPublished,
          style: f.style || "classic",
          fields: f.fields || [],
          userId: f.userId,
          responsesCount: f._count.responses,
          createdAt: f.createdAt,
          updatedAt: f.updatedAt,
        }));

        return {
          data: mapped,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit) || 1,
          },
        };
      } catch (error) {
        console.warn("⚠️ Prisma forms list query failed, falling back to in-memory store.");
        this.isPrismaAvailable = false;
      }
    }

    // In-memory fallback
    let userForms = Array.from(inMemoryForms.values()).filter(
      (f) => f.userId === userId
    );

    if (statusFilter && statusFilter !== "ALL") {
      userForms = userForms.filter(
        (f) => f.status.toUpperCase() === statusFilter
      );
    }

    if (search) {
      const lower = search.toLowerCase();
      userForms = userForms.filter((f) =>
        f.title.toLowerCase().includes(lower)
      );
    }

    // Sort by updatedAt desc
    userForms.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

    const total = userForms.length;
    const paginated = userForms.slice(skip, skip + limit);

    return {
      data: paginated,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  static async getFormById(id: string, userId: string): Promise<FormItem | null> {
    if (this.isPrismaAvailable) {
      try {
        const form = await prisma.form.findFirst({
          where: { id, userId },
          include: {
            _count: {
              select: { responses: true },
            },
          },
        });

        if (form) {
          return {
            id: form.id,
            slug: form.slug,
            title: form.title,
            description: form.description,
            status: form.status || (form.isPublished ? "PUBLISHED" : "DRAFT"),
            isPublished: form.isPublished,
            style: form.style || "classic",
            theme: form.theme || null,
            fields: form.fields || [],
            userId: form.userId,
            responsesCount: form._count.responses,
            createdAt: form.createdAt,
            updatedAt: form.updatedAt,
          };
        }
        return null;
      } catch (error) {
        this.isPrismaAvailable = false;
      }
    }

    const item = inMemoryForms.get(id);
    if (item && item.userId === userId) {
      return item;
    }
    return null;
  }

  static async getFormBySlug(slug: string): Promise<FormItem | null> {
    if (this.isPrismaAvailable) {
      try {
        const form = await prisma.form.findFirst({
          where: { slug },
          include: {
            _count: {
              select: { responses: true },
            },
          },
        });

        if (form) {
          return {
            id: form.id,
            slug: form.slug,
            title: form.title,
            description: form.description,
            status: form.status || (form.isPublished ? "PUBLISHED" : "DRAFT"),
            isPublished: form.isPublished,
            style: form.style || "classic",
            theme: form.theme || null,
            fields: form.fields || [],
            userId: form.userId,
            responsesCount: form._count.responses,
            createdAt: form.createdAt,
            updatedAt: form.updatedAt,
          };
        }
      } catch (error) {
        this.isPrismaAvailable = false;
      }
    }

    for (const item of inMemoryForms.values()) {
      if (item.slug === slug) {
        return item;
      }
    }
    return null;
  }

  static async createBlankForm(
    userId: string,
    title = "Untitled Form",
    options: {
      description?: string | null;
      style?: string;
      fields?: any[];
      theme?: any;
    } = {}
  ): Promise<FormItem> {
    const slug = `form-${Math.random().toString(36).substring(2, 8)}`;
    const style = options.style || "classic";
    const fields = options.fields || [];
    const description = options.description || null;
    const theme = options.theme || null;

    if (this.isPrismaAvailable) {
      try {
        const form = await prisma.form.create({
          data: {
            title,
            description,
            status: "DRAFT",
            isPublished: false,
            style,
            theme: theme as any,
            slug,
            fields: fields as any,
            userId,
          },
          include: {
            _count: { select: { responses: true } },
          },
        });

        return {
          id: form.id,
          slug: form.slug,
          title: form.title,
          description: form.description,
          status: form.status,
          isPublished: form.isPublished,
          style: form.style,
          theme: form.theme || null,
          fields: form.fields || [],
          userId: form.userId,
          responsesCount: form._count.responses,
          createdAt: form.createdAt,
          updatedAt: form.updatedAt,
        };
      } catch (error) {
        this.isPrismaAvailable = false;
      }
    }

    const id = `form_${randomUUID()}`;
    const newForm: FormItem = {
      id,
      slug,
      title,
      description,
      status: "DRAFT",
      isPublished: false,
      style,
      theme,
      fields,
      userId,
      responsesCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    inMemoryForms.set(id, newForm);
    return newForm;
  }

  static async updateForm(
    id: string,
    userId: string,
    data: {
      title?: string;
      description?: string | null;
      status?: string;
      isPublished?: boolean;
      style?: string;
      theme?: any;
      fields?: any;
    }
  ): Promise<FormItem> {
    if (this.isPrismaAvailable) {
      try {
        const form = await prisma.form.update({
          where: { id },
          data: {
            ...data,
            updatedAt: new Date(),
          },
          include: {
            _count: { select: { responses: true } },
          },
        });

        return {
          id: form.id,
          slug: form.slug,
          title: form.title,
          description: form.description,
          status: form.status,
          isPublished: form.isPublished,
          style: form.style,
          theme: form.theme || null,
          fields: form.fields || [],
          userId: form.userId,
          responsesCount: form._count.responses,
          createdAt: form.createdAt,
          updatedAt: form.updatedAt,
        };
      } catch (error) {
        this.isPrismaAvailable = false;
      }
    }

    const existing = inMemoryForms.get(id);
    if (!existing || existing.userId !== userId) {
      throw new Error("Form not found or unauthorized");
    }

    const updated: FormItem = {
      ...existing,
      ...data,
      updatedAt: new Date(),
    };
    inMemoryForms.set(id, updated);
    return updated;
  }

  static async duplicateForm(id: string, userId: string): Promise<FormItem> {
    const original = await this.getFormById(id, userId);
    if (!original) {
      throw new Error("Form not found or unauthorized");
    }

    const newTitle = `${original.title} (Copy)`;
    const newSlug = `form-${Math.random().toString(36).substring(2, 8)}`;

    if (this.isPrismaAvailable) {
      try {
        const duplicated = await prisma.form.create({
          data: {
            title: newTitle,
            description: original.description,
            status: "DRAFT",
            isPublished: false,
            style: original.style,
            theme: original.theme as any,
            fields: original.fields as any,
            slug: newSlug,
            userId,
          },
          include: {
            _count: { select: { responses: true } },
          },
        });

        return {
          id: duplicated.id,
          slug: duplicated.slug,
          title: duplicated.title,
          description: duplicated.description,
          status: duplicated.status,
          isPublished: duplicated.isPublished,
          style: duplicated.style,
          theme: duplicated.theme || null,
          fields: duplicated.fields || [],
          userId: duplicated.userId,
          responsesCount: 0,
          createdAt: duplicated.createdAt,
          updatedAt: duplicated.updatedAt,
        };
      } catch (error) {
        this.isPrismaAvailable = false;
      }
    }

    const newId = `form_${randomUUID()}`;
    const duplicated: FormItem = {
      id: newId,
      slug: newSlug,
      title: newTitle,
      description: original.description,
      status: "DRAFT",
      isPublished: false,
      style: original.style,
      theme: original.theme || null,
      fields: original.fields,
      userId,
      responsesCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    inMemoryForms.set(newId, duplicated);
    return duplicated;
  }

  static async publishForm(id: string, userId: string): Promise<FormItem> {
    return this.updateForm(id, userId, {
      status: "PUBLISHED",
      isPublished: true,
    });
  }

  static async unpublishForm(id: string, userId: string): Promise<FormItem> {
    return this.updateForm(id, userId, {
      status: "DRAFT",
      isPublished: false,
    });
  }

  static async deleteForm(id: string, userId: string): Promise<boolean> {
    const existing = await this.getFormById(id, userId);
    if (!existing) {
      throw new Error("Form not found or unauthorized");
    }

    if (this.isPrismaAvailable) {
      try {
        await prisma.form.delete({
          where: { id },
        });
        return true;
      } catch (error) {
        this.isPrismaAvailable = false;
      }
    }

    inMemoryForms.delete(id);
    return true;
  }
}
