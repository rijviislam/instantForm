import { prisma } from "../db";

export interface DashboardMetrics {
  totalForms: number;
  publishedForms: number;
  draftForms: number;
  totalResponses: number;
}

export interface ResponseDataPoint {
  date: string;
  count: number;
}

export interface RecentFormSummary {
  id: string;
  title: string;
  description: string | null;
  isPublished: boolean;
  style: string | null;
  responsesCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface RecentActivityItem {
  id: string;
  formId: string;
  formTitle: string;
  createdAt: Date;
}

export interface DashboardOverview {
  metrics: DashboardMetrics;
  responsesOverTime: ResponseDataPoint[];
  recentForms: RecentFormSummary[];
  recentActivity: RecentActivityItem[];
}

export class DashboardService {
  private static isPrismaAvailable = true;

  static async getOverview(userId: string): Promise<DashboardOverview> {
    if (this.isPrismaAvailable) {
      try {
        // 1. Fetch user's forms with responses count
        const forms = await prisma.form.findMany({
          where: { userId },
          include: {
            _count: {
              select: { responses: true },
            },
            responses: {
              select: { id: true, createdAt: true },
              orderBy: { createdAt: "desc" },
            },
          },
          orderBy: { updatedAt: "desc" },
        });

        const totalForms = forms.length;
        const publishedForms = forms.filter((f) => f.isPublished).length;
        const draftForms = totalForms - publishedForms;
        const totalResponses = forms.reduce((acc, f) => acc + f._count.responses, 0);

        // 2. Recent forms summary
        const recentForms: RecentFormSummary[] = forms.slice(0, 5).map((f) => ({
          id: f.id,
          title: f.title,
          description: f.description,
          isPublished: f.isPublished,
          style: f.style || "minimal",
          responsesCount: f._count.responses,
          createdAt: f.createdAt,
          updatedAt: f.updatedAt,
        }));

        // 3. Aggregate responses over time (last 7 days)
        const allResponses = forms.flatMap((f) =>
          f.responses.map((r) => ({
            id: r.id,
            formId: f.id,
            formTitle: f.title,
            createdAt: r.createdAt,
          }))
        );

        // Sort all responses chronologically for activity feed
        allResponses.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        const recentActivity = allResponses.slice(0, 5);

        // Generate response trend for chart (only if responses exist)
        const responsesOverTime: ResponseDataPoint[] = [];
        if (totalResponses > 0) {
          const daysMap = new Map<string, number>();
          const now = new Date();
          for (let i = 6; i >= 0; i--) {
            const d = new Date(now);
            d.setDate(d.getDate() - i);
            const dateKey = d.toLocaleDateString("en-US", { weekday: "short", month: "numeric", day: "numeric" });
            daysMap.set(dateKey, 0);
          }

          allResponses.forEach((r) => {
            const dateKey = r.createdAt.toLocaleDateString("en-US", { weekday: "short", month: "numeric", day: "numeric" });
            if (daysMap.has(dateKey)) {
              daysMap.set(dateKey, (daysMap.get(dateKey) || 0) + 1);
            }
          });

          daysMap.forEach((count, date) => {
            responsesOverTime.push({ date, count });
          });
        }

        return {
          metrics: {
            totalForms,
            publishedForms,
            draftForms,
            totalResponses,
          },
          responsesOverTime,
          recentForms,
          recentActivity,
        };
      } catch (error) {
        console.warn("⚠️ Neon PostgreSQL unreachable; returning clean zero overview for development.");
        this.isPrismaAvailable = false;
      }
    }

    // Default clean empty state for new user / offline dev mode
    return {
      metrics: {
        totalForms: 0,
        publishedForms: 0,
        draftForms: 0,
        totalResponses: 0,
      },
      responsesOverTime: [],
      recentForms: [],
      recentActivity: [],
    };
  }
}
