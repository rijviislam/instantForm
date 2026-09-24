const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  error?: string;
  errors?: Array<{ field: string; message: string }>;
  user?: {
    id: string;
    name: string | null;
    email: string;
    image?: string | null;
    createdAt?: string | Date;
  };
  token?: string;
  data?: T;
}

let cachedClientToken: string | null = null;
let sessionFetchPromise: Promise<string | null> | null = null;

export function setClientAuthToken(token: string | null) {
  cachedClientToken = token;
}

export async function getClientAuthToken(): Promise<string | null> {
  if (cachedClientToken) return cachedClientToken;
  if (typeof window !== "undefined") {
    if (!sessionFetchPromise) {
      sessionFetchPromise = (async () => {
        try {
          const res = await fetch("/api/auth/session");
          if (res.ok) {
            const session = await res.json();
            const token = session?.apiToken || (session?.user as { token?: string })?.token;
            if (token) {
              cachedClientToken = token;
              return token;
            }
          }
        } catch (e) {
          console.warn("Could not retrieve client auth session:", e);
        } finally {
          sessionFetchPromise = null;
        }
        return null;
      })();
    }
    return sessionFetchPromise;
  }
  return null;
}

async function getAuthHeaders(explicitToken?: string): Promise<Record<string, string>> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  const token = explicitToken || (await getClientAuthToken());
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

export async function registerApi(data: {
  name: string;
  email: string;
  password: string;
}): Promise<ApiResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    if (result.token) {
      setClientAuthToken(result.token);
    }
    return result;
  } catch (error) {
    console.error("API register network error:", error);
    return {
      success: false,
      error: "Network Error",
      message: "Unable to connect to the backend server. Please make sure the server is running.",
    };
  }
}

export async function loginApi(data: {
  email: string;
  password: string;
}): Promise<ApiResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    if (result.token) {
      setClientAuthToken(result.token);
    }
    return result;
  } catch (error) {
    console.error("API login network error:", error);
    return {
      success: false,
      error: "Network Error",
      message: "Unable to connect to the backend server. Please make sure the server is running.",
    };
  }
}

export async function getDashboardOverviewApi(
  token?: string
): Promise<ApiResponse<{
  metrics: {
    totalForms: number;
    publishedForms: number;
    draftForms: number;
    totalResponses: number;
  };
  responsesOverTime: Array<{ date: string; count: number }>;
  recentForms: Array<{
    id: string;
    title: string;
    description: string | null;
    isPublished: boolean;
    style: string | null;
    responsesCount: number;
    createdAt: string;
    updatedAt: string;
  }>;
  recentActivity: Array<{
    id: string;
    formId: string;
    formTitle: string;
    createdAt: string;
  }>;
}>> {
  try {
    const headers = await getAuthHeaders(token);

    const res = await fetch(`${API_BASE_URL}/api/dashboard/overview`, {
      method: "GET",
      headers,
    });

    const result = await res.json();
    return result;
  } catch (error) {
    console.error("API getDashboardOverview network error:", error);
    return {
      success: false,
      error: "Network Error",
      message: "Unable to load dashboard data.",
    };
  }
}

// ---------------------------------------------------------------------------
// Forms Management & Builder Types & APIs
// ---------------------------------------------------------------------------

export type FormStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED" | string;

export type FormStyle =
  | "classic"
  | "conversation"
  | "chat"
  | "editorial"
  | "minimal"
  | string;

export type FormFieldType =
  // Standard & Text
  | "short_text"
  | "long_text"
  | "email"
  | "phone"
  | "number"
  | "url"
  | "password"
  // Choice & Select
  | "single_choice"
  | "multiple_choice"
  | "dropdown"
  | "yes_no"
  | "multiple_choice_grid"
  | "checkbox_grid"
  // Rating & Scales
  | "rating"
  | "linear_scale"
  | "nps"
  // Date, Time & Duration
  | "date"
  | "time"
  | "date_range"
  | "duration"
  // Media & Recording
  | "file_upload"
  | "image_upload"
  | "video_upload"
  | "audio_upload"
  | "camera_capture"
  | "voice_recording"
  | "signature"
  // Location & Address
  | "address"
  | "country"
  | "state"
  | "city"
  | "postal_code"
  | "gps_location"
  // Numbers & Currency
  | "currency"
  | "percentage"
  | "decimal"
  | "quantity"
  // Special & Visual
  | "color_picker"
  | "section_heading"
  | "divider"
  // Custom & Dynamic Fields
  | "custom_input"
  // Hidden & System Metadata
  | "hidden_input"
  | "auto_id"
  | "utm_source"
  | "utm_medium"
  | "utm_campaign"
  | "referrer"
  | "timestamp"
  | "user_id";

export interface FormFieldValidation {
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: string;
  errorMessage?: string;
  minDate?: string;
  maxDate?: string;
}

export interface FormField {
  id: string;
  type: FormFieldType;
  label: string;
  description?: string;
  placeholder?: string;
  required?: boolean;
  options?: string[];
  rows?: string[];
  columns?: string[];
  scale?: number;
  min?: number;
  max?: number;
  step?: number;
  minLabel?: string;
  maxLabel?: string;
  currencySymbol?: string;
  defaultValue?: string;
  hiddenValue?: string;
  customInputType?: "text" | "number" | "email" | "password" | "tel" | "url" | "color" | "range" | "date" | "time" | string;
  customFieldName?: string;
  customPattern?: string;
  customErrorMessage?: string;
  helpText?: string;
  customClass?: string;
  useGlobalStyle?: boolean;
  customStyle?: any;
  useGlobalFieldCardStyle?: boolean;
  customFieldCardStyle?: any;
  validation?: FormFieldValidation;
}

export interface FormItem {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  status: FormStatus;
  isPublished: boolean;
  style: FormStyle;
  theme?: any;
  fields: FormField[];
  userId: string;
  responsesCount: number;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export async function getFormsApi(
  params: {
    search?: string;
    status?: string;
    page?: number;
    limit?: number;
  } = {},
  token?: string
): Promise<ApiResponse<FormItem[]> & { pagination?: PaginationMeta }> {
  try {
    const query = new URLSearchParams();
    if (params.search) query.set("search", params.search);
    if (params.status && params.status !== "ALL") query.set("status", params.status);
    if (params.page) query.set("page", params.page.toString());
    if (params.limit) query.set("limit", params.limit.toString());

    const headers = await getAuthHeaders(token);

    const res = await fetch(`${API_BASE_URL}/api/forms?${query.toString()}`, {
      method: "GET",
      headers,
    });

    const result = await res.json();
    return result;
  } catch (error) {
    console.error("API getForms network error:", error);
    return {
      success: false,
      error: "Network Error",
      message: "Unable to load forms.",
      data: [],
    };
  }
}

export async function getFormByIdApi(
  id: string,
  token?: string
): Promise<ApiResponse<FormItem>> {
  try {
    const headers = await getAuthHeaders(token);

    const res = await fetch(`${API_BASE_URL}/api/forms/${id}`, {
      method: "GET",
      headers,
    });

    const result = await res.json();
    return result;
  } catch (error) {
    console.error("API getFormById network error:", error);
    return {
      success: false,
      error: "Network Error",
      message: "Unable to load form details.",
    };
  }
}

export async function createFormApi(
  data: {
    title?: string;
    description?: string | null;
    style?: string;
    fields?: FormField[];
    theme?: any;
  } = {},
  token?: string
): Promise<ApiResponse<FormItem>> {
  try {
    const headers = await getAuthHeaders(token);

    const res = await fetch(`${API_BASE_URL}/api/forms`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });

    const result = await res.json();
    return result;
  } catch (error) {
    console.error("API createForm network error:", error);
    return {
      success: false,
      error: "Network Error",
      message: "Unable to create form.",
    };
  }
}

export async function updateFormApi(
  id: string,
  data: Partial<FormItem>,
  token?: string
): Promise<ApiResponse<FormItem>> {
  try {
    const headers = await getAuthHeaders(token);

    const res = await fetch(`${API_BASE_URL}/api/forms/${id}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(data),
    });

    const result = await res.json();
    return result;
  } catch (error) {
    console.error("API updateForm network error:", error);
    return {
      success: false,
      error: "Network Error",
      message: "Unable to update form.",
    };
  }
}

export async function duplicateFormApi(
  id: string,
  token?: string
): Promise<ApiResponse<FormItem>> {
  try {
    const headers = await getAuthHeaders(token);

    const res = await fetch(`${API_BASE_URL}/api/forms/${id}/duplicate`, {
      method: "POST",
      headers,
    });

    const result = await res.json();
    return result;
  } catch (error) {
    console.error("API duplicateForm network error:", error);
    return {
      success: false,
      error: "Network Error",
      message: "Unable to duplicate form.",
    };
  }
}

export async function publishFormApi(
  id: string,
  token?: string
): Promise<ApiResponse<FormItem>> {
  try {
    const headers = await getAuthHeaders(token);

    const res = await fetch(`${API_BASE_URL}/api/forms/${id}/publish`, {
      method: "POST",
      headers,
    });

    const result = await res.json();
    return result;
  } catch (error) {
    console.error("API publishForm network error:", error);
    return {
      success: false,
      error: "Network Error",
      message: "Unable to publish form.",
    };
  }
}

export async function unpublishFormApi(
  id: string,
  token?: string
): Promise<ApiResponse<FormItem>> {
  try {
    const headers = await getAuthHeaders(token);

    const res = await fetch(`${API_BASE_URL}/api/forms/${id}/unpublish`, {
      method: "POST",
      headers,
    });

    const result = await res.json();
    return result;
  } catch (error) {
    console.error("API unpublishForm network error:", error);
    return {
      success: false,
      error: "Network Error",
      message: "Unable to unpublish form.",
    };
  }
}

export async function deleteFormApi(
  id: string,
  token?: string
): Promise<ApiResponse<null>> {
  try {
    const headers = await getAuthHeaders(token);

    const res = await fetch(`${API_BASE_URL}/api/forms/${id}`, {
      method: "DELETE",
      headers,
    });

    const result = await res.json();
    return result;
  } catch (error) {
    console.error("API deleteForm network error:", error);
    return {
      success: false,
      error: "Network Error",
      message: "Unable to delete form.",
    };
  }
}

// ---------------------------------------------------------------------------
// Templates Management Types & APIs
// ---------------------------------------------------------------------------

export type TemplateCategory =
  | "Feedback"
  | "Contact"
  | "Event"
  | "Survey"
  | "Lead"
  | "Application"
  | "Quiz"
  | string;

export type TemplateStyle =
  | "Classic"
  | "Minimal"
  | "Editorial"
  | "Professional"
  | "Conversion"
  | "Conversation"
  | "Interactive"
  | "Chat"
  | string;

export interface TemplateItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: TemplateCategory;
  style: TemplateStyle;
  fields: Array<{
    id: string;
    type: string;
    label: string;
    placeholder?: string;
    required?: boolean;
    options?: string[];
  }>;
  createdAt?: string;
  updatedAt?: string;
}

export async function getTemplatesApi(
  category?: string,
  token?: string
): Promise<ApiResponse<TemplateItem[]>> {
  try {
    const query = new URLSearchParams();
    if (category && category !== "All") {
      query.set("category", category);
    }

    const headers = await getAuthHeaders(token);

    const res = await fetch(`${API_BASE_URL}/api/templates?${query.toString()}`, {
      method: "GET",
      headers,
    });

    const result = await res.json();
    return result;
  } catch (error) {
    console.error("API getTemplates network error:", error);
    return {
      success: false,
      error: "Network Error",
      message: "Unable to load templates.",
      data: [],
    };
  }
}

export async function getTemplateByIdApi(
  id: string,
  token?: string
): Promise<ApiResponse<TemplateItem>> {
  try {
    const headers = await getAuthHeaders(token);

    const res = await fetch(`${API_BASE_URL}/api/templates/${id}`, {
      method: "GET",
      headers,
    });

    const result = await res.json();
    return result;
  } catch (error) {
    console.error("API getTemplateById network error:", error);
    return {
      success: false,
      error: "Network Error",
      message: "Unable to load template.",
    };
  }
}

export async function useTemplateApi(
  templateId: string,
  token?: string
): Promise<ApiResponse<FormItem>> {
  try {
    const headers = await getAuthHeaders(token);

    const res = await fetch(`${API_BASE_URL}/api/templates/${templateId}/use`, {
      method: "POST",
      headers,
    });

    const result = await res.json();
    return result;
  } catch (error) {
    console.error("API useTemplate network error:", error);
    return {
      success: false,
      error: "Network Error",
      message: "Unable to create form from template.",
    };
  }
}

// ---------------------------------------------------------------------------
// Public Forms & Response APIs
// ---------------------------------------------------------------------------

export interface PublicFormItem {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  style: FormStyle;
  theme?: any;
  fields: FormField[];
  createdAt: string;
}

export async function getPublicFormApi(
  slug: string
): Promise<ApiResponse<PublicFormItem>> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/public/forms/${slug}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    const result = await res.json();
    return result;
  } catch (error) {
    console.error("API getPublicForm network error:", error);
    return {
      success: false,
      error: "Network Error",
      message: "Unable to load public form.",
    };
  }
}

export async function submitPublicResponseApi(
  slug: string,
  answers: Record<string, any>,
  metadata?: any
): Promise<ApiResponse<{ id: string; submittedAt: string }>> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/public/forms/${slug}/responses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ answers, metadata }),
    });

    const result = await res.json();
    return result;
  } catch (error) {
    console.error("API submitPublicResponse network error:", error);
    return {
      success: false,
      error: "Network Error",
      message: "Unable to submit response. Please check your connection and try again.",
    };
  }
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

export interface FormResponseItem {
  id: string;
  formId: string;
  data: Record<string, any>;
  submittedAt: string;
  createdAt: string;
}

export async function getFormResponsesApi(
  formId: string,
  options: {
    search?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  } = {},
  token?: string
): Promise<
  ApiResponse<FormResponseItem[]> & {
    analytics?: FormAnalyticsSummary;
    pagination?: PaginationMeta;
  }
> {
  try {
    const query = new URLSearchParams();
    if (options.search) query.set("search", options.search);
    if (options.startDate) query.set("startDate", options.startDate);
    if (options.endDate) query.set("endDate", options.endDate);
    if (options.page) query.set("page", options.page.toString());
    if (options.limit) query.set("limit", options.limit.toString());

    const headers = await getAuthHeaders(token);

    const res = await fetch(
      `${API_BASE_URL}/api/forms/${formId}/responses?${query.toString()}`,
      {
        method: "GET",
        headers,
      }
    );

    const result = await res.json();
    return result;
  } catch (error) {
    console.error("API getFormResponses network error:", error);
    return {
      success: false,
      error: "Network Error",
      message: "Unable to load responses.",
      data: [],
    };
  }
}

export async function getResponseDetailApi(
  formId: string,
  responseId: string,
  token?: string
): Promise<
  ApiResponse<{
    response: FormResponseItem;
    formTitle: string;
    fields: Array<{ id: string; label: string; type: string; answer: any }>;
  }>
> {
  try {
    const headers = await getAuthHeaders(token);

    const res = await fetch(
      `${API_BASE_URL}/api/forms/${formId}/responses/${responseId}`,
      {
        method: "GET",
        headers,
      }
    );

    const result = await res.json();
    return result;
  } catch (error) {
    console.error("API getResponseDetail network error:", error);
    return {
      success: false,
      error: "Network Error",
      message: "Unable to load response detail.",
    };
  }
}

export async function getUserAllResponsesApi(
  token?: string
): Promise<
  ApiResponse<
    Array<{
      id: string;
      formId: string;
      formTitle: string;
      submittedAt: string;
      answersSummary: string;
    }>
  >
> {
  try {
    const headers = await getAuthHeaders(token);

    const res = await fetch(`${API_BASE_URL}/api/responses`, {
      method: "GET",
      headers,
    });

    const result = await res.json();
    return result;
  } catch (error) {
    console.error("API getUserAllResponses network error:", error);
    return {
      success: false,
      error: "Network Error",
      message: "Unable to load responses.",
      data: [],
    };
  }
}
