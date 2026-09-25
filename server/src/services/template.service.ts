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
  theme?: any;
  createdAt: string;
  updatedAt: string;
}

export const INITIAL_TEMPLATES: TemplateDefinition[] = [
  // 1. FEEDBACK
  {
    id: "tpl_customer_feedback",
    slug: "customer-feedback",
    title: "Customer Feedback",
    description: "Collect actionable insights and measure satisfaction from your customers.",
    category: "Feedback",
    style: "Classic",
    theme: {
      background: { type: "solid", color: "#FAF8F5" },
      typography: { fontFamily: "Plus Jakarta Sans", headingFont: "Plus Jakarta Sans" },
      container: { backgroundColor: "#FFFDF9", borderRadius: "2xl", borderColor: "#EAE3D6", boxShadow: "soft" },
      inputs: { backgroundColor: "#FAF8F5", borderColor: "#EAE3D6", borderRadius: "xl", focusBorderColor: "#FF5A36" },
      buttons: { backgroundColor: "#FF5A36", textColor: "#FFFFFF", borderRadius: "xl" },
      colors: { primary: "#FF5A36", accent: "#FFF0EB", border: "#EAE3D6", surface: "#FFFDF9" },
    },
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
        placeholder: "e.g. Great speed, clean UI, helpful support...",
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
    id: "tpl_nps_pulse",
    slug: "nps-pulse-survey",
    title: "NPS & CSAT Scorecard",
    description: "Clean minimalist net promoter scoring with smart sentiment categorization.",
    category: "Feedback",
    style: "Minimal",
    theme: {
      background: { type: "gradient", gradientDirection: "180deg", gradientFrom: "#F8FAFC", gradientTo: "#F1F5F9" },
      typography: { fontFamily: "Inter", headingFont: "Inter" },
      container: { backgroundColor: "#F8FAFC", borderRadius: "lg", borderColor: "#CBD5E1", borderWidth: "thin", boxShadow: "sm" },
      inputs: { backgroundColor: "#FFFFFF", borderColor: "#CBD5E1", borderRadius: "lg", focusBorderColor: "#475569" },
      buttons: { backgroundColor: "#1E293B", textColor: "#FFFFFF", borderRadius: "lg" },
      colors: { primary: "#334155", accent: "#F1F5F9", border: "#E2E8F0", surface: "#F8FAFC" },
    },
    fields: [
      {
        id: "f1",
        type: "rating",
        label: "How likely are you to recommend us to a colleague?",
        required: true,
      },
      {
        id: "f2",
        type: "multiple_choice",
        label: "Which area needs the most attention?",
        options: ["Feature Set", "Performance & Speed", "Pricing & Plans", "Customer Support"],
        required: true,
      },
      {
        id: "f3",
        type: "long_text",
        label: "What could we do to earn a perfect 5-star score?",
        placeholder: "Share your candid thoughts...",
        required: false,
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "tpl_product_feedback",
    slug: "product-feedback",
    title: "Product Experience & Feature Request",
    description: "Step-by-step evaluation flow to discover user pain points and roadmap ideas.",
    category: "Feedback",
    style: "Conversation",
    theme: {
      background: { type: "gradient", gradientDirection: "135deg", gradientFrom: "#FFF7ED", gradientTo: "#FFEDD5" },
      typography: { fontFamily: "Outfit", headingFont: "Outfit" },
      container: { backgroundColor: "#FFFBF5", borderRadius: "3xl", borderColor: "#FED7AA", boxShadow: "soft" },
      inputs: { backgroundColor: "#FFF7ED", borderColor: "#FDBA74", borderRadius: "2xl", focusBorderColor: "#EA580C" },
      buttons: { backgroundColor: "#EA580C", textColor: "#FFFFFF", borderRadius: "full" },
      colors: { primary: "#EA580C", accent: "#FFEDD5", border: "#FED7AA", surface: "#FFFBF5" },
    },
    fields: [
      {
        id: "f1",
        type: "multiple_choice",
        label: "Which feature did you use most recently?",
        options: ["Form Builder", "Template Library", "Analytics Dashboard", "Style Customizer"],
        required: true,
      },
      {
        id: "f2",
        type: "rating",
        label: "How intuitive was the workflow?",
        required: true,
      },
      {
        id: "f3",
        type: "long_text",
        label: "What feature would make your workflow 10x easier?",
        placeholder: "Describe your dream feature...",
        required: true,
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "tpl_restaurant_review",
    slug: "restaurant-dining-experience",
    title: "Restaurant & Dining Experience",
    description: "Editorial gourmet review with ambiance, food quality, and service ratings.",
    category: "Feedback",
    style: "Editorial",
    theme: {
      background: { type: "gradient", gradientDirection: "180deg", gradientFrom: "#FFFBEB", gradientTo: "#FEF3C7" },
      typography: { fontFamily: "Playfair Display", headingFont: "Playfair Display", bodyFont: "Plus Jakarta Sans" },
      container: { backgroundColor: "#FEFCE8", borderRadius: "2xl", borderColor: "#FDE68A", borderWidth: "thin", boxShadow: "soft" },
      inputs: { backgroundColor: "#FFFDF5", borderColor: "#FCD34D", borderRadius: "xl", focusBorderColor: "#D97706" },
      buttons: { backgroundColor: "#D97706", textColor: "#FFFFFF", borderRadius: "xl" },
      colors: { primary: "#D97706", accent: "#FEF3C7", border: "#FDE68A", surface: "#FEFCE8" },
    },
    fields: [
      {
        id: "f1",
        type: "rating",
        label: "Food Quality & Taste",
        required: true,
      },
      {
        id: "f2",
        type: "rating",
        label: "Ambiance & Atmosphere",
        required: true,
      },
      {
        id: "f3",
        type: "rating",
        label: "Staff Hospitality & Speed",
        required: true,
      },
      {
        id: "f4",
        type: "multiple_choice",
        label: "Dining Occasion",
        options: ["Casual Dinner", "Date Night", "Business Lunch", "Special Celebration"],
        required: false,
      },
      {
        id: "f5",
        type: "long_text",
        label: "Favorite dish or special remarks",
        placeholder: "Tell us about your highlights...",
        required: false,
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // 2. CONTACT
  {
    id: "tpl_contact_us",
    slug: "contact-us",
    title: "Contact Us",
    description: "Clean, reliable general inquiry form for visitors and clients.",
    category: "Contact",
    style: "Classic",
    theme: {
      background: { type: "solid", color: "#FAF8F5" },
      typography: { fontFamily: "Plus Jakarta Sans", headingFont: "Plus Jakarta Sans" },
      container: { backgroundColor: "#FAF8F5", borderRadius: "2xl", borderColor: "#EAE3D6", boxShadow: "soft" },
      inputs: { backgroundColor: "#FFFFFF", borderColor: "#EAE3D6", borderRadius: "xl", focusBorderColor: "#FF5A36" },
      buttons: { backgroundColor: "#FF5A36", textColor: "#FFFFFF", borderRadius: "xl" },
      colors: { primary: "#FF5A36", accent: "#FFF0EB", border: "#EAE3D6", surface: "#FAF8F5" },
    },
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
    id: "tpl_vip_discovery",
    slug: "vip-client-discovery",
    title: "VIP Client Inquiry & Project Scope",
    description: "Refined editorial discovery form capturing budget, timeline, and deliverables.",
    category: "Contact",
    style: "Editorial",
    theme: {
      background: { type: "gradient", gradientDirection: "135deg", gradientFrom: "#FAF5FF", gradientTo: "#F3E8FF" },
      typography: { fontFamily: "Newsreader", headingFont: "Newsreader", bodyFont: "Inter" },
      container: { backgroundColor: "#FAF5FF", borderRadius: "2xl", borderColor: "#E9D5FF", borderWidth: "thin", boxShadow: "soft" },
      inputs: { backgroundColor: "#FFFFFF", borderColor: "#D8B4FE", borderRadius: "xl", focusBorderColor: "#7C3AED" },
      buttons: { backgroundColor: "#7C3AED", textColor: "#FFFFFF", borderRadius: "full" },
      colors: { primary: "#7C3AED", accent: "#F3E8FF", border: "#E9D5FF", surface: "#FAF5FF" },
    },
    fields: [
      {
        id: "f1",
        type: "short_text",
        label: "Full Name & Title",
        placeholder: "Eleanor Vance, Creative Director",
        required: true,
      },
      {
        id: "f2",
        type: "email",
        label: "Business Email",
        placeholder: "eleanor@studio.com",
        required: true,
      },
      {
        id: "f3",
        type: "multiple_choice",
        label: "Target Project Budget",
        options: ["$5,000 - $15,000", "$15,000 - $50,000", "$50,000 - $100,000+", "Retainer Partnership"],
        required: true,
      },
      {
        id: "f4",
        type: "multiple_choice",
        label: "Desired Launch Timeline",
        options: ["Within 1 Month", "1 - 3 Months", "Quarter 3 / 4", "Flexible"],
        required: true,
      },
      {
        id: "f5",
        type: "long_text",
        label: "Project Vision & Deliverables Overview",
        placeholder: "Describe the scope, goals, and key deliverables...",
        required: true,
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "tpl_consultation_booking",
    slug: "consultation-booking",
    title: "Schedule a Strategy Consultation",
    description: "Professional client intake form for scheduling high-value advisory calls.",
    category: "Contact",
    style: "Professional",
    theme: {
      background: { type: "gradient", gradientDirection: "180deg", gradientFrom: "#F0FDFA", gradientTo: "#CCFBF1" },
      typography: { fontFamily: "DM Sans", headingFont: "DM Sans" },
      container: { backgroundColor: "#F0FDFA", borderRadius: "xl", borderColor: "#99F6E4", borderWidth: "thin", boxShadow: "soft" },
      inputs: { backgroundColor: "#FFFFFF", borderColor: "#5EEAD4", borderRadius: "lg", focusBorderColor: "#0D9488" },
      buttons: { backgroundColor: "#0D9488", textColor: "#FFFFFF", borderRadius: "lg" },
      colors: { primary: "#0D9488", accent: "#CCFBF1", border: "#99F6E4", surface: "#F0FDFA" },
    },
    fields: [
      {
        id: "f1",
        type: "short_text",
        label: "Full Name",
        placeholder: "Marcus Aurelius",
        required: true,
      },
      {
        id: "f2",
        type: "email",
        label: "Work Email",
        placeholder: "marcus@rome.inc",
        required: true,
      },
      {
        id: "f3",
        type: "phone",
        label: "Phone Number",
        placeholder: "+1 (555) 234-5678",
        required: false,
      },
      {
        id: "f4",
        type: "multiple_choice",
        label: "Consultation Topic",
        options: ["Architecture Audit", "Product Scaling", "Security & Compliance", "Go-To-Market Strategy"],
        required: true,
      },
      {
        id: "f5",
        type: "long_text",
        label: "Key challenges you want to discuss",
        placeholder: "Briefly outline your top objectives...",
        required: true,
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // 3. EVENT
  {
    id: "tpl_tech_summit",
    slug: "tech-summit-registration",
    title: "Tech Summit & Conference RSVP",
    description: "Interactive conference registration with track selection and badge styling.",
    category: "Event",
    style: "Interactive",
    theme: {
      background: { type: "gradient", gradientDirection: "135deg", gradientFrom: "#EEF2FF", gradientTo: "#E0E7FF" },
      typography: { fontFamily: "Plus Jakarta Sans", headingFont: "Plus Jakarta Sans" },
      container: { backgroundColor: "#EEF2FF", borderRadius: "2xl", borderColor: "#C7D2FE", borderWidth: "thin", boxShadow: "soft" },
      inputs: { backgroundColor: "#FFFFFF", borderColor: "#A5B4FC", borderRadius: "xl", focusBorderColor: "#4F46E5" },
      buttons: { backgroundColor: "#4F46E5", textColor: "#FFFFFF", borderRadius: "xl" },
      colors: { primary: "#4F46E5", accent: "#EEF2FF", border: "#C7D2FE", surface: "#EEF2FF" },
    },
    fields: [
      {
        id: "f1",
        type: "short_text",
        label: "Attendee Full Name",
        placeholder: "Grace Hopper",
        required: true,
      },
      {
        id: "f2",
        type: "email",
        label: "Badge Email Address",
        placeholder: "grace@navy.gov",
        required: true,
      },
      {
        id: "f3",
        type: "short_text",
        label: "Company / Organization",
        placeholder: "Tech Innovations Lab",
        required: true,
      },
      {
        id: "f4",
        type: "multiple_choice",
        label: "Conference Pass Type",
        options: ["General Keynote Pass", "Full Workshop + Keynote", "VIP All-Access + Dinner", "Virtual Stream"],
        required: true,
      },
      {
        id: "f5",
        type: "checkboxes",
        label: "Primary Tracks of Interest",
        options: ["AI & Agentic Systems", "Cloud & Microservices", "Design Systems", "Web Performance"],
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
    theme: {
      background: { type: "gradient", gradientDirection: "180deg", gradientFrom: "#FAF5FF", gradientTo: "#EDE9FE" },
      typography: { fontFamily: "Playfair Display", headingFont: "Playfair Display" },
      container: { backgroundColor: "#F5F3FF", borderRadius: "2xl", borderColor: "#DDD6FE", borderWidth: "thin", boxShadow: "soft" },
      inputs: { backgroundColor: "#FFFFFF", borderColor: "#C4B5FD", borderRadius: "xl", focusBorderColor: "#8B5CF6" },
      buttons: { backgroundColor: "#8B5CF6", textColor: "#FFFFFF", borderRadius: "xl" },
      colors: { primary: "#8B5CF6", accent: "#EDE9FE", border: "#DDD6FE", surface: "#F5F3FF" },
    },
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
    id: "tpl_webinar_pass",
    slug: "exclusive-webinar-pass",
    title: "Exclusive Masterclass Webinar Pass",
    description: "High-conversion 30-second opt-in form for online workshops and live events.",
    category: "Event",
    style: "Conversion",
    theme: {
      background: { type: "gradient", gradientDirection: "135deg", gradientFrom: "#FEF2F2", gradientTo: "#FEE2E2" },
      typography: { fontFamily: "Plus Jakarta Sans", headingFont: "Plus Jakarta Sans" },
      container: { backgroundColor: "#FFF8F7", borderRadius: "2xl", borderColor: "#FECACA", borderWidth: "thin", boxShadow: "soft" },
      inputs: { backgroundColor: "#FFFFFF", borderColor: "#FCA5A5", borderRadius: "xl", focusBorderColor: "#EF4444" },
      buttons: { backgroundColor: "#EF4444", textColor: "#FFFFFF", borderRadius: "xl" },
      colors: { primary: "#EF4444", accent: "#FEE2E2", border: "#FECACA", surface: "#FFF8F7" },
    },
    fields: [
      {
        id: "f1",
        type: "short_text",
        label: "First Name",
        placeholder: "Sophia",
        required: true,
      },
      {
        id: "f2",
        type: "email",
        label: "Where should we send your access link?",
        placeholder: "sophia@venture.co",
        required: true,
      },
      {
        id: "f3",
        type: "multiple_choice",
        label: "Current Role",
        options: ["Founder / Executive", "Product Lead", "Senior Engineer", "Growth Marketer"],
        required: true,
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "tpl_wedding_rsvp",
    slug: "wedding-rsvp",
    title: "Wedding RSVP & Celebration",
    description: "Charming editorial guest response form with dining preferences and song request.",
    category: "Event",
    style: "Editorial",
    theme: {
      background: { type: "gradient", gradientDirection: "180deg", gradientFrom: "#FFF1F2", gradientTo: "#FFE4E6" },
      typography: { fontFamily: "Playfair Display", headingFont: "Playfair Display", bodyFont: "Lora" },
      container: { backgroundColor: "#FFF5F5", borderRadius: "3xl", borderColor: "#FECDD3", borderWidth: "thin", boxShadow: "soft" },
      inputs: { backgroundColor: "#FFFFFF", borderColor: "#FDA4AF", borderRadius: "2xl", focusBorderColor: "#E11D48" },
      buttons: { backgroundColor: "#E11D48", textColor: "#FFFFFF", borderRadius: "full" },
      colors: { primary: "#E11D48", accent: "#FFE4E6", border: "#FECDD3", surface: "#FFF5F5" },
    },
    fields: [
      {
        id: "f1",
        type: "short_text",
        label: "Guest Full Name(s)",
        placeholder: "Clara & Robert Schumann",
        required: true,
      },
      {
        id: "f2",
        type: "multiple_choice",
        label: "Will you be joining us?",
        options: ["Joyfully Accept", "Regretfully Decline"],
        required: true,
      },
      {
        id: "f3",
        type: "multiple_choice",
        label: "Entrée Selection",
        options: ["Pan-Seared Salmon", "Prime Filet Mignon", "Wild Mushroom Risotto (Vegetarian)"],
        required: true,
      },
      {
        id: "f4",
        type: "short_text",
        label: "A song that will get you on the dance floor",
        placeholder: "Artist - Song Title",
        required: false,
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // 4. SURVEY
  {
    id: "tpl_quick_survey",
    slug: "quick-survey",
    title: "Quick Pulse Survey",
    description: "Short, streamlined survey designed for fast completion on any device.",
    category: "Survey",
    style: "Minimal",
    theme: {
      background: { type: "solid", color: "#F8FAFC" },
      typography: { fontFamily: "Inter", headingFont: "Inter" },
      container: { backgroundColor: "#F1F5F9", borderRadius: "xl", borderColor: "#CBD5E1", borderWidth: "thin", boxShadow: "sm" },
      inputs: { backgroundColor: "#FFFFFF", borderColor: "#CBD5E1", borderRadius: "lg", focusBorderColor: "#475569" },
      buttons: { backgroundColor: "#334155", textColor: "#FFFFFF", borderRadius: "lg" },
      colors: { primary: "#334155", accent: "#F1F5F9", border: "#E2E8F0", surface: "#F1F5F9" },
    },
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
    id: "tpl_developer_survey",
    slug: "developer-stack-survey",
    title: "Developer Tools & Tech Stack Survey",
    description: "Interactive ecosystem poll analyzing favorite frameworks, libraries, and tools.",
    category: "Survey",
    style: "Interactive",
    theme: {
      background: { type: "gradient", gradientDirection: "135deg", gradientFrom: "#F0FDF4", gradientTo: "#DCFCE7" },
      typography: { fontFamily: "Space Grotesk", headingFont: "Space Grotesk" },
      container: { backgroundColor: "#F0FDF4", borderRadius: "2xl", borderColor: "#BBF7D0", borderWidth: "thin", boxShadow: "soft" },
      inputs: { backgroundColor: "#FFFFFF", borderColor: "#86EFAC", borderRadius: "xl", focusBorderColor: "#16A34A" },
      buttons: { backgroundColor: "#16A34A", textColor: "#FFFFFF", borderRadius: "xl" },
      colors: { primary: "#16A34A", accent: "#DCFCE7", border: "#BBF7D0", surface: "#F0FDF4" },
    },
    fields: [
      {
        id: "f1",
        type: "multiple_choice",
        label: "Primary Frontend Framework",
        options: ["Next.js / React", "Vue / Nuxt", "Svelte / SvelteKit", "Astro", "Vanilla TS"],
        required: true,
      },
      {
        id: "f2",
        type: "multiple_choice",
        label: "Primary Cloud & Database Solution",
        options: ["Neon Postgres", "Supabase", "AWS RDS", "PlanetScale", "Cloudflare D1"],
        required: true,
      },
      {
        id: "f3",
        type: "checkboxes",
        label: "Daily Developer Tools",
        options: ["Cursor / VSCode", "Claude Code", "GitHub Copilot", "Tailwind CSS", "Docker"],
        required: false,
      },
      {
        id: "f4",
        type: "long_text",
        label: "What is your biggest development bottleneck this year?",
        placeholder: "Build times, state management, deployment complexity...",
        required: false,
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "tpl_team_pulse",
    slug: "employee-engagement-pulse",
    title: "Team Engagement & Culture Pulse",
    description: "Conversational internal feedback flow measuring workplace satisfaction and support.",
    category: "Survey",
    style: "Conversation",
    theme: {
      background: { type: "gradient", gradientDirection: "180deg", gradientFrom: "#F0F9FF", gradientTo: "#E0F2FE" },
      typography: { fontFamily: "Syne", headingFont: "Syne", bodyFont: "Inter" },
      container: { backgroundColor: "#F0F9FF", borderRadius: "3xl", borderColor: "#BAE6FD", borderWidth: "thin", boxShadow: "soft" },
      inputs: { backgroundColor: "#FFFFFF", borderColor: "#7DD3FC", borderRadius: "2xl", focusBorderColor: "#0284C7" },
      buttons: { backgroundColor: "#0284C7", textColor: "#FFFFFF", borderRadius: "full" },
      colors: { primary: "#0284C7", accent: "#E0F2FE", border: "#BAE6FD", surface: "#F0F9FF" },
    },
    fields: [
      {
        id: "f1",
        type: "rating",
        label: "How supported do you feel by your team and leadership?",
        required: true,
      },
      {
        id: "f2",
        type: "multiple_choice",
        label: "Work-Life Balance Assessment",
        options: ["Thriving & Balanced", "Manageable", "Occasionally Overwhelmed", "Burnout Risk"],
        required: true,
      },
      {
        id: "f3",
        type: "long_text",
        label: "What is one thing we could change to improve your daily workflow?",
        placeholder: "Share anonymous thoughts...",
        required: false,
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // 5. LEAD
  {
    id: "tpl_lead_capture",
    slug: "lead-capture",
    title: "B2B SaaS Lead Capture",
    description: "High-converting lead generation form optimized for sales and inquiries.",
    category: "Lead",
    style: "Conversion",
    theme: {
      background: { type: "solid", color: "#FAF8F5" },
      typography: { fontFamily: "Plus Jakarta Sans", headingFont: "Plus Jakarta Sans" },
      container: { backgroundColor: "#FFFDF9", borderRadius: "2xl", borderColor: "#EAE3D6", boxShadow: "soft" },
      inputs: { backgroundColor: "#FAF8F5", borderColor: "#EAE3D6", borderRadius: "xl", focusBorderColor: "#FF5A36" },
      buttons: { backgroundColor: "#FF5A36", textColor: "#FFFFFF", borderRadius: "xl" },
      colors: { primary: "#FF5A36", accent: "#FFF0EB", border: "#EAE3D6", surface: "#FFFDF9" },
    },
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
    id: "tpl_real_estate_valuation",
    slug: "real-estate-valuation",
    title: "Home Valuation & Seller Intake",
    description: "Professional property valuation intake form for real estate agencies and brokers.",
    category: "Lead",
    style: "Professional",
    theme: {
      background: { type: "gradient", gradientDirection: "180deg", gradientFrom: "#F8FAFC", gradientTo: "#F1F5F9" },
      typography: { fontFamily: "Outfit", headingFont: "Outfit" },
      container: { backgroundColor: "#F8FAFC", borderRadius: "xl", borderColor: "#CBD5E1", borderWidth: "thin", boxShadow: "soft" },
      inputs: { backgroundColor: "#FFFFFF", borderColor: "#94A3B8", borderRadius: "lg", focusBorderColor: "#059669" },
      buttons: { backgroundColor: "#059669", textColor: "#FFFFFF", borderRadius: "lg" },
      colors: { primary: "#059669", accent: "#ECFDF5", border: "#CBD5E1", surface: "#F8FAFC" },
    },
    fields: [
      {
        id: "f1",
        type: "short_text",
        label: "Property Address",
        placeholder: "123 Orchard Lane, Austin, TX",
        required: true,
      },
      {
        id: "f2",
        type: "multiple_choice",
        label: "Property Type",
        options: ["Single Family Home", "Condo / Townhouse", "Multi-Family", "Commercial"],
        required: true,
      },
      {
        id: "f3",
        type: "multiple_choice",
        label: "Estimated Bedrooms / Bathrooms",
        options: ["2 Bed / 1-2 Bath", "3 Bed / 2 Bath", "4+ Bed / 3+ Bath", "Luxury Estate"],
        required: true,
      },
      {
        id: "f4",
        type: "multiple_choice",
        label: "Timeline to Sell",
        options: ["Immediately (0-30 days)", "1-3 Months", "3-6 Months", "Just Curious"],
        required: true,
      },
      {
        id: "f5",
        type: "email",
        label: "Email to send valuation report",
        placeholder: "owner@home.com",
        required: true,
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // 6. APPLICATION
  {
    id: "tpl_job_application",
    slug: "job-application",
    title: "Senior Software Engineer Application",
    description: "Professional candidate intake form with portfolio links and role selection.",
    category: "Application",
    style: "Professional",
    theme: {
      background: { type: "gradient", gradientDirection: "135deg", gradientFrom: "#F1F5F9", gradientTo: "#E2E8F0" },
      typography: { fontFamily: "Space Grotesk", headingFont: "Space Grotesk" },
      container: { backgroundColor: "#F8FAFC", borderRadius: "xl", borderColor: "#CBD5E1", borderWidth: "thin", boxShadow: "soft" },
      inputs: { backgroundColor: "#FFFFFF", borderColor: "#94A3B8", borderRadius: "lg", focusBorderColor: "#0284C7" },
      buttons: { backgroundColor: "#0284C7", textColor: "#FFFFFF", borderRadius: "lg" },
      colors: { primary: "#0284C7", accent: "#E0F2FE", border: "#CBD5E1", surface: "#F8FAFC" },
    },
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
        label: "LinkedIn / GitHub / Portfolio URL",
        placeholder: "https://github.com/...",
        required: true,
      },
      {
        id: "f4",
        type: "multiple_choice",
        label: "Years of Professional Experience",
        options: ["1-3 Years", "3-5 Years", "5-8 Years", "8+ Years (Staff / Principal)"],
        required: true,
      },
      {
        id: "f5",
        type: "long_text",
        label: "Tell us about a technical architecture decision you are proud of",
        placeholder: "Highlight the problem, solution, and impact...",
        required: true,
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "tpl_creator_partnership",
    slug: "creator-brand-partnership",
    title: "Creator & Influencer Partnership Application",
    description: "Editorial sponsorship application for creators, podcasters, and content partners.",
    category: "Application",
    style: "Editorial",
    theme: {
      background: { type: "gradient", gradientDirection: "135deg", gradientFrom: "#FAF5FF", gradientTo: "#F3E8FF" },
      typography: { fontFamily: "Syne", headingFont: "Syne", bodyFont: "Inter" },
      container: { backgroundColor: "#FAF5FF", borderRadius: "3xl", borderColor: "#E9D5FF", borderWidth: "thin", boxShadow: "soft" },
      inputs: { backgroundColor: "#FFFFFF", borderColor: "#D8B4FE", borderRadius: "2xl", focusBorderColor: "#9333EA" },
      buttons: { backgroundColor: "#9333EA", textColor: "#FFFFFF", borderRadius: "full" },
      colors: { primary: "#9333EA", accent: "#F3E8FF", border: "#E9D5FF", surface: "#FAF5FF" },
    },
    fields: [
      {
        id: "f1",
        type: "short_text",
        label: "Creator / Channel Name",
        placeholder: "Design with Mia",
        required: true,
      },
      {
        id: "f2",
        type: "url",
        label: "Primary Channel URL (YouTube, TikTok, X, Instagram)",
        placeholder: "https://youtube.com/@...",
        required: true,
      },
      {
        id: "f3",
        type: "multiple_choice",
        label: "Total Audience Reach",
        options: ["10K - 50K", "50K - 200K", "200K - 1M", "1M+"],
        required: true,
      },
      {
        id: "f4",
        type: "multiple_choice",
        label: "Content Niche",
        options: ["Tech & Coding", "Design & Creative", "Business & Startups", "Lifestyle & Productivity"],
        required: true,
      },
      {
        id: "f5",
        type: "email",
        label: "Business Contact Email",
        placeholder: "partnerships@creator.com",
        required: true,
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // 7. QUIZ
  {
    id: "tpl_personality_quiz",
    slug: "brand-personality-style-matcher",
    title: "Brand Personality & Style Matcher",
    description: "Interactive visual quiz determining the perfect design aesthetic for your project.",
    category: "Quiz",
    style: "Interactive",
    theme: {
      background: { type: "gradient", gradientDirection: "135deg", gradientFrom: "#FDF4FF", gradientTo: "#FAE8FF" },
      typography: { fontFamily: "Syne", headingFont: "Syne" },
      container: { backgroundColor: "#FDF4FF", borderRadius: "3xl", borderColor: "#F0ABFC", borderWidth: "thin", boxShadow: "glow" },
      inputs: { backgroundColor: "#FFFFFF", borderColor: "#E879F9", borderRadius: "2xl", focusBorderColor: "#C026D3" },
      buttons: { backgroundColor: "#C026D3", textColor: "#FFFFFF", borderRadius: "full" },
      colors: { primary: "#C026D3", accent: "#FAE8FF", border: "#F0ABFC", surface: "#FDF4FF" },
    },
    fields: [
      {
        id: "f1",
        type: "multiple_choice",
        label: "Which atmosphere best describes your brand tone?",
        options: ["Editorial & Sophisticated", "Minimalist & Clean", "Bold & Energetic", "Modern Technical"],
        required: true,
      },
      {
        id: "f2",
        type: "multiple_choice",
        label: "Select your signature color palette vibe",
        options: ["Warm Terracotta & Sand", "Deep Obsidian & Neon", "Classic Royal Indigo", "Soft Pastel Sage"],
        required: true,
      },
      {
        id: "f3",
        type: "multiple_choice",
        label: "How do you want your visitors to feel?",
        options: ["Empowered & Productive", "Calm & Inspired", "Amazed by Polish", "Safe & Supported"],
        required: true,
      },
      {
        id: "f4",
        type: "short_text",
        label: "Your project or brand name",
        placeholder: "e.g. Acme Studio",
        required: false,
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "tpl_product_finder",
    slug: "product-recommendation-finder",
    title: "Smart Product Recommendation Quiz",
    description: "Conversational guided product finder leading buyers to their personalized match.",
    category: "Quiz",
    style: "Conversation",
    theme: {
      background: { type: "gradient", gradientDirection: "180deg", gradientFrom: "#F0FDF4", gradientTo: "#DCFCE7" },
      typography: { fontFamily: "DM Sans", headingFont: "DM Sans" },
      container: { backgroundColor: "#F0FDF4", borderRadius: "3xl", borderColor: "#BBF7D0", borderWidth: "thin", boxShadow: "soft" },
      inputs: { backgroundColor: "#FFFFFF", borderColor: "#86EFAC", borderRadius: "2xl", focusBorderColor: "#16A34A" },
      buttons: { backgroundColor: "#16A34A", textColor: "#FFFFFF", borderRadius: "full" },
      colors: { primary: "#16A34A", accent: "#DCFCE7", border: "#BBF7D0", surface: "#F0FDF4" },
    },
    fields: [
      {
        id: "f1",
        type: "multiple_choice",
        label: "What is your primary goal today?",
        options: ["Launch a new product", "Improve conversion rates", "Collect customer insights", "Automate workflows"],
        required: true,
      },
      {
        id: "f2",
        type: "multiple_choice",
        label: "How large is your team?",
        options: ["Solo Creator / Freelancer", "Small Team (2-10)", "Growing Company (11-50)", "Enterprise (50+)"],
        required: true,
      },
      {
        id: "f3",
        type: "multiple_choice",
        label: "Preferred deployment style",
        options: ["Hosted Instant Link", "Embedded on Custom Domain", "API & Webhook Integration"],
        required: true,
      },
      {
        id: "f4",
        type: "email",
        label: "Enter your email to receive your custom match report",
        placeholder: "you@company.com",
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

        const dbMap = new Map(dbTemplates.map(t => [t.slug || t.id, t]));
        const mergedList: TemplateDefinition[] = [];

        for (const initTpl of INITIAL_TEMPLATES) {
          if (category && category.toLowerCase() !== "all" && initTpl.category.toLowerCase() !== category.toLowerCase()) {
            continue;
          }
          const dbItem = dbMap.get(initTpl.slug) || dbMap.get(initTpl.id);
          if (dbItem) {
            mergedList.push({
              id: dbItem.id,
              slug: dbItem.slug,
              title: dbItem.title,
              description: dbItem.description || initTpl.description,
              category: dbItem.category as TemplateDefinition["category"],
              style: dbItem.style as TemplateDefinition["style"],
              fields: (Array.isArray(dbItem.fields) && dbItem.fields.length > 0 ? dbItem.fields : initTpl.fields) as unknown as TemplateField[],
              theme: (dbItem as any).theme || initTpl.theme,
              createdAt: dbItem.createdAt.toISOString(),
              updatedAt: dbItem.updatedAt.toISOString(),
            });
            dbMap.delete(initTpl.slug);
            dbMap.delete(initTpl.id);
          } else {
            mergedList.push(initTpl);
          }
        }

        // Include any additional DB templates
        for (const [, extra] of dbMap) {
          const matchingInit = INITIAL_TEMPLATES.find((t) => t.id === extra.id || t.slug === extra.slug);
          mergedList.push({
            id: extra.id,
            slug: extra.slug,
            title: extra.title,
            description: extra.description || "",
            category: extra.category as TemplateDefinition["category"],
            style: extra.style as TemplateDefinition["style"],
            fields: (Array.isArray(extra.fields) ? extra.fields : []) as unknown as TemplateField[],
            theme: (extra as any).theme || matchingInit?.theme,
            createdAt: extra.createdAt.toISOString(),
            updatedAt: extra.updatedAt.toISOString(),
          });
        }

        return mergedList;
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
          const initTpl = INITIAL_TEMPLATES.find((t) => t.id === dbTemplate.id || t.slug === dbTemplate.slug);
          return {
            id: dbTemplate.id,
            slug: dbTemplate.slug,
            title: dbTemplate.title,
            description: dbTemplate.description || initTpl?.description || "",
            category: dbTemplate.category as TemplateDefinition["category"],
            style: dbTemplate.style as TemplateDefinition["style"],
            fields: (Array.isArray(dbTemplate.fields) ? dbTemplate.fields : initTpl?.fields || []) as unknown as TemplateField[],
            theme: (dbTemplate as any).theme || initTpl?.theme,
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
    theme?: any;
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
            theme: template.theme ? (template.theme as any) : undefined,
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
          theme: newForm.theme,
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
      theme: template.theme || null,
      slug: uniqueSlug,
      fields: template.fields,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return newForm;
  }
}
