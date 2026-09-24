import { prisma } from "../db";
import { randomUUID } from "crypto";

export interface TemplateField {
  id: string;
  type:
    | "short_text"
    | "long_text"
    | "email"
    | "url"
    | "phone"
    | "rating"
    | "multiple_choice"
    | "checkboxes"
    | "dropdown"
    | "file_upload"
    | "image_upload"
    | "video_upload"
    | "audio_upload"
    | "number"
    | string;
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: string[];
}

export interface TemplateDefinition {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: "Feedback" | "Contact" | "Event" | "Survey" | "Lead" | "Application" | "Quiz";
  style: "Classic" | "Minimal" | "Editorial" | "Professional" | "Conversion" | "Conversation" | "Interactive" | "Chat";
  fields: TemplateField[];
  createdAt: string;
  updatedAt: string;
}

export const INITIAL_TEMPLATES: TemplateDefinition[] = [
  {
    id: "tpl_customer_feedback",
    slug: "customer-feedback",
    title: "Customer Feedback",
    description: "Collect actionable insights and measure satisfaction from your customers.",
    category: "Feedback",
    style: "Classic",
    fields: [
      {
        id: "f1",
        type: "rating",
        label: "How satisfied are you with our product?",
        required: true,
      },
      {
        id: "f2",
        type: "short_text",
        label: "What is the primary reason for your score?",
        placeholder: "e.g. Great speed, clean UI...",
        required: false,
      },
      {
        id: "f3",
        type: "long_text",
        label: "Any suggestions on how we can improve?",
        placeholder: "Tell us what we could do better...",
        required: false,
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "tpl_quick_survey",
    slug: "quick-survey",
    title: "Quick Survey",
    description: "Short, streamlined survey designed for fast completion on any device.",
    category: "Survey",
    style: "Minimal",
    fields: [
      {
        id: "f1",
        type: "multiple_choice",
        label: "How often do you use our service?",
        options: ["Daily", "Weekly", "Monthly", "Rarely"],
        required: true,
      },
      {
        id: "f2",
        type: "rating",
        label: "Overall experience rating",
        required: true,
      },
      {
        id: "f3",
        type: "short_text",
        label: "One thing you love most about InstantForm",
        placeholder: "Your favorite feature...",
        required: false,
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "tpl_event_registration",
    slug: "event-registration",
    title: "Event Registration",
    description: "Elegant registration form for summits, webinars, and special gatherings.",
    category: "Event",
    style: "Editorial",
    fields: [
      {
        id: "f1",
        type: "short_text",
        label: "Full Name",
        placeholder: "Jane Doe",
        required: true,
      },
      {
        id: "f2",
        type: "email",
        label: "Email Address",
        placeholder: "jane@company.com",
        required: true,
      },
      {
        id: "f3",
        type: "multiple_choice",
        label: "Ticket Type",
        options: ["General Admission", "VIP All-Access", "Speaker & Press"],
        required: true,
      },
      {
        id: "f4",
        type: "short_text",
        label: "Dietary restrictions / notes",
        placeholder: "Vegetarian, vegan, etc.",
        required: false,
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "tpl_job_application",
    slug: "job-application",
    title: "Job Application",
    description: "Professional candidate intake form with portfolio links and role selection.",
    category: "Application",
    style: "Professional",
    fields: [
      {
        id: "f1",
        type: "short_text",
        label: "Full Name",
        placeholder: "Alex Smith",
        required: true,
      },
      {
        id: "f2",
        type: "email",
        label: "Email Address",
        placeholder: "alex@example.com",
        required: true,
      },
      {
        id: "f3",
        type: "url",
        label: "LinkedIn / Portfolio URL",
        placeholder: "https://linkedin.com/in/...",
        required: true,
      },
      {
        id: "f4",
        type: "multiple_choice",
        label: "Position Applied For",
        options: ["Frontend Engineer", "Product Designer", "Fullstack Engineer", "Product Manager"],
        required: true,
      },
      {
        id: "f5",
        type: "long_text",
        label: "Why are you interested in joining our team?",
        placeholder: "Share your motivation and key highlights...",
        required: true,
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "tpl_lead_capture",
    slug: "lead-capture",
    title: "Lead Capture",
    description: "High-converting lead generation form optimized for sales and inquiries.",
    category: "Lead",
    style: "Conversion",
    fields: [
      {
        id: "f1",
        type: "short_text",
        label: "Your Name",
        placeholder: "Sarah Connor",
        required: true,
      },
      {
        id: "f2",
        type: "email",
        label: "Work Email",
        placeholder: "sarah@acme.corp",
        required: true,
      },
      {
        id: "f3",
        type: "short_text",
        label: "Company Name",
        placeholder: "Acme Corporation",
        required: true,
      },
      {
        id: "f4",
        type: "multiple_choice",
        label: "Company Size",
        options: ["1-10 employees", "11-50 employees", "51-200 employees", "200+ employees"],
        required: true,
      },
      {
        id: "f5",
        type: "long_text",
        label: "How can our team help you grow?",
        placeholder: "Describe your upcoming project...",
        required: false,
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "tpl_product_feedback",
    slug: "product-feedback",
    title: "Product Feedback",
    description: "Conversational feedback flow to evaluate specific product features and releases.",
    category: "Feedback",
    style: "Conversation",
    fields: [
      {
        id: "f1",
        type: "multiple_choice",
        label: "Which feature did you use most recently?",
        options: ["Form Creation", "Dashboard Analytics", "Template Gallery", "Command Palette"],
        required: true,
      },
      {
        id: "f2",
        type: "rating",
        label: "How intuitive was the experience?",
        required: true,
      },
      {
        id: "f3",
        type: "long_text",
        label: "What stopped you or felt confusing?",
        placeholder: "Be as honest as you like...",
        required: false,
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "tpl_contact_us",
    slug: "contact-us",
    title: "Contact Us",
    description: "Clean, reliable general inquiry form for visitors and clients.",
    category: "Contact",
    style: "Classic",
    fields: [
      {
        id: "f1",
        type: "short_text",
        label: "Your Name",
        placeholder: "John Appleseed",
        required: true,
      },
      {
        id: "f2",
        type: "email",
        label: "Email Address",
        placeholder: "john@apple.com",
        required: true,
      },
      {
        id: "f3",
        type: "short_text",
        label: "Subject",
        placeholder: "How can we assist you?",
        required: true,
      },
      {
        id: "f4",
        type: "long_text",
        label: "Message",
        placeholder: "Type your message here...",
        required: true,
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "tpl_quiz",
    slug: "quiz",
    title: "Quiz",
    description: "Engaging interactive questionnaire with multiple choice assessment.",
    category: "Quiz",
    style: "Interactive",
    fields: [
      {
        id: "f1",
        type: "multiple_choice",
        label: "What is the primary design philosophy of InstantForm?",
        options: ["Speed & Aesthetics", "Maximum Complexity", "Raw Unformatted Data"],
        required: true,
      },
      {
        id: "f2",
        type: "multiple_choice",
        label: "Which theme is active right now?",
        options: ["Light Theme", "Dark Theme", "System Theme"],
        required: true,
      },
      {
        id: "f3",
        type: "short_text",
        label: "Your secret coder alias",
        placeholder: "Neo, Trinity, CyberSamurai...",
        required: false,
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "tpl_customer_support",
    slug: "customer-support",
    title: "Customer Support",
    description: "Interactive support intake to quickly diagnose and triage user requests.",
    category: "Feedback",
    style: "Chat",
    fields: [
      {
        id: "f1",
        type: "short_text",
        label: "Your Name",
        placeholder: "David Miller",
        required: true,
      },
      {
        id: "f2",
        type: "email",
        label: "Account Email",
        placeholder: "david@domain.com",
        required: true,
      },
      {
        id: "f3",
        type: "multiple_choice",
        label: "Issue Category",
        options: ["Billing & Subscriptions", "Bug Report", "Feature Request", "Account Access"],
        required: true,
      },
      {
        id: "f4",
        type: "long_text",
        label: "Please describe the issue in detail",
        placeholder: "What happened, what did you expect, steps to reproduce...",
        required: true,
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export class TemplateService {
  private static isPrismaAvailable = true;

  static async getAllTemplates(category?: string): Promise<TemplateDefinition[]> {
    if (this.isPrismaAvailable) {
      try {
        const whereClause = category && category.toLowerCase() !== "all"
          ? { category: { equals: category, mode: "insensitive" as const } }
          : {};

        const dbTemplates = await prisma.template.findMany({
          where: whereClause,
          orderBy: { createdAt: "asc" },
        });

        if (dbTemplates.length > 0) {
          return dbTemplates.map((t) => ({
            id: t.id,
            slug: t.slug,
            title: t.title,
            description: t.description || "",
            category: t.category as TemplateDefinition["category"],
            style: t.style as TemplateDefinition["style"],
            fields: (Array.isArray(t.fields) ? t.fields : []) as unknown as TemplateField[],
            createdAt: t.createdAt.toISOString(),
            updatedAt: t.updatedAt.toISOString(),
          }));
        }
      } catch (error) {
        console.warn("⚠️ Database query for templates failed, using initial templates library.");
        this.isPrismaAvailable = false;
      }
    }

    // Fallback to in-memory initial templates
    if (category && category.toLowerCase() !== "all") {
      return INITIAL_TEMPLATES.filter(
        (t) => t.category.toLowerCase() === category.toLowerCase()
      );
    }
    return INITIAL_TEMPLATES;
  }

  static async getTemplateById(id: string): Promise<TemplateDefinition | null> {
    if (this.isPrismaAvailable) {
      try {
        const dbTemplate = await prisma.template.findFirst({
          where: { OR: [{ id }, { slug: id }] },
        });
        if (dbTemplate) {
          return {
            id: dbTemplate.id,
            slug: dbTemplate.slug,
            title: dbTemplate.title,
            description: dbTemplate.description || "",
            category: dbTemplate.category as TemplateDefinition["category"],
            style: dbTemplate.style as TemplateDefinition["style"],
            fields: (Array.isArray(dbTemplate.fields) ? dbTemplate.fields : []) as unknown as TemplateField[],
            createdAt: dbTemplate.createdAt.toISOString(),
            updatedAt: dbTemplate.updatedAt.toISOString(),
          };
        }
      } catch (error) {
        this.isPrismaAvailable = false;
      }
    }

    return (
      INITIAL_TEMPLATES.find((t) => t.id === id || t.slug === id) || null
    );
  }

  /**
   * Template -> New Form Flow:
   * Copies the template structure and style into a brand-new user-owned Form in DRAFT status.
   * Original template remains completely untouched.
   */
  static async useTemplate(
    templateId: string,
    userId: string
  ): Promise<{
    id: string;
    title: string;
    description: string | null;
    status: string;
    isPublished: boolean;
    style: string;
    slug: string;
    fields: TemplateField[];
    userId: string;
    createdAt: Date | string;
    updatedAt: Date | string;
  }> {
    const template = await this.getTemplateById(templateId);
    if (!template) {
      throw new Error("Template not found");
    }
    const { FormService } = await import("./form.service");
    const uniqueSlug = await FormService.generateCleanSlug(template.slug || template.title);

    if (this.isPrismaAvailable) {
      try {
        const newForm = await prisma.form.create({
          data: {
            title: template.title,
            description: template.description,
            status: "DRAFT",
            isPublished: false,
            style: template.style.toLowerCase(),
            slug: uniqueSlug,
            fields: template.fields as any,
            userId,
          },
        });

        return {
          id: newForm.id,
          title: newForm.title,
          description: newForm.description,
          status: newForm.status,
          isPublished: newForm.isPublished,
          style: newForm.style || "classic",
          slug: newForm.slug,
          fields: (Array.isArray(newForm.fields) ? newForm.fields : template.fields) as unknown as TemplateField[],
          userId: newForm.userId,
          createdAt: newForm.createdAt,
          updatedAt: newForm.updatedAt,
        };
      } catch (error) {
        console.warn("⚠️ Prisma form creation failed, using fallback creation.");
        this.isPrismaAvailable = false;
      }
    }

    // In-memory fallback
    const newFormId = `form_${randomUUID()}`;
    const newForm = {
      id: newFormId,
      title: template.title,
      description: template.description,
      status: "DRAFT",
      isPublished: false,
      style: template.style.toLowerCase(),
      slug: uniqueSlug,
      fields: template.fields,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return newForm;
  }
}
