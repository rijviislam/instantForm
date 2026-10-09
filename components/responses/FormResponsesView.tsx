"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Download,
  Search,
  Clock,
  MessageSquare,
  BarChart3,
  X,
  Star,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  FileSpreadsheet,
  FileText,
  FileCode,
  Cloud,
  Database,
  Check,
  Copy,
  ChevronDown,
  Sparkles,
  RefreshCw,
  Sliders,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Link2,
  Send,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { signIn } from "next-auth/react";
import {
  FormResponseItem,
  FormAnalyticsSummary,
  FormItem,
  FormIntegrations,
  getFormResponsesApi,
  getResponseDetailApi,
  getFormByIdApi,
  updateFormApi,
  testIntegrationApi,
  connectGoogleSheetsApi,
  linkGoogleSheetApi,
  syncAllGoogleSheetsApi,
  disconnectGoogleSheetsApi,
} from "@/lib/api-client";
import { formatRelativeTime } from "@/lib/date-utils";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

const GOOGLE_APPS_SCRIPT_CODE = `// InstantForm -> Google Sheets Auto-Sync Web App
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var payload = JSON.parse(e.postData.contents);
    var answers = payload.namedAnswers || payload.data || {};
    
    // Read existing column headers
    var lastCol = Math.max(sheet.getLastColumn(), 1);
    var headerRange = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
    var headers = headerRange.filter(function(h) { return h !== ""; });
    var answerKeys = Object.keys(answers);
    
    // Auto-create headers if sheet is empty
    if (sheet.getLastRow() === 0 || headers.length === 0) {
      headers = ["Submitted At", "Response ID"].concat(answerKeys);
      sheet.appendRow(headers);
    } else {
      // Append any new questions that don't have a column yet
      for (var i = 0; i < answerKeys.length; i++) {
        var key = answerKeys[i];
        if (headers.indexOf(key) === -1) {
          headers.push(key);
          sheet.getRange(1, headers.length).setValue(key);
        }
      }
    }
    
    // Create new row matching header order
    var row = [payload.submittedAt || new Date().toISOString(), payload.responseId || ""];
    for (var j = 2; j < headers.length; j++) {
      var headerName = headers[j];
      var val = answers[headerName];
      if (val === undefined || val === null) val = "";
      if (typeof val === "object") val = JSON.stringify(val);
      row.push(val);
    }
    
    sheet.appendRow(row);
    return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}`;

interface FormResponsesViewProps {
  formId: string;
  formTitle: string;
  formSlug: string;
  initialForm?: FormItem | null;
}

export function FormResponsesView({
  formId,
  formTitle,
  formSlug,
  initialForm,
}: FormResponsesViewProps) {
  const [activeTab, setActiveTab] = useState<"responses" | "analytics">(
    "responses"
  );
  const [responses, setResponses] = useState<FormResponseItem[]>([]);
  const [analytics, setAnalytics] = useState<FormAnalyticsSummary | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Form details & Integrations
  const [form, setForm] = useState<FormItem | null>(initialForm || null);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const [isIntegrationsModalOpen, setIsIntegrationsModalOpen] = useState(false);
  const [showAppsScriptHelp, setShowAppsScriptHelp] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);

  // Integrations state
  const [integrations, setIntegrations] = useState<FormIntegrations>(() => {
    const existing = initialForm?.theme?.integrations;
    return {
      storeLocalResponses: existing?.storeLocalResponses ?? true,
      googleSheetsEnabled: existing?.googleSheetsEnabled ?? false,
      googleSheetsWebhookUrl: existing?.googleSheetsWebhookUrl ?? "",
      spreadsheetId: existing?.spreadsheetId,
      spreadsheetUrl: existing?.spreadsheetUrl,
      spreadsheetTitle: existing?.spreadsheetTitle,
      lastSyncedAt: existing?.lastSyncedAt,
      webhookEnabled: existing?.webhookEnabled ?? false,
      webhookUrl: existing?.webhookUrl ?? "",
    };
  });
  const [isSavingIntegrations, setIsSavingIntegrations] = useState(false);
  const [integrationsSaveSuccess, setIntegrationsSaveSuccess] = useState(false);

  // 1-Click Google Sheets Auto-Sync States
  const [isConnectingGoogleSheets, setIsConnectingGoogleSheets] = useState(false);
  const [isSyncingAllGoogleSheets, setIsSyncingAllGoogleSheets] = useState(false);
  const [googleSyncMessage, setGoogleSyncMessage] = useState<string | null>(null);
  const [googleSyncError, setGoogleSyncError] = useState<string | null>(null);
  const [manualSheetUrl, setManualSheetUrl] = useState("");
  const [dataCopied, setDataCopied] = useState(false);
  const [showAdvancedGoogleOptions, setShowAdvancedGoogleOptions] = useState(false);

  // Test connection state
  const [isTestingGoogleSheets, setIsTestingGoogleSheets] = useState(false);
  const [googleSheetsTestResult, setGoogleSheetsTestResult] = useState<{
    success?: boolean;
    message?: string;
  } | null>(null);

  const [isTestingWebhook, setIsTestingWebhook] = useState(false);
  const [webhookTestResult, setWebhookTestResult] = useState<{
    success?: boolean;
    message?: string;
  } | null>(null);

  const exportMenuRef = useRef<HTMLDivElement>(null);

  // Selected response for detail modal
  const [selectedResponseId, setSelectedResponseId] = useState<string | null>(
    null
  );
  const [responseDetail, setResponseDetail] = useState<{
    response: FormResponseItem;
    formTitle: string;
    fields: Array<{ id: string; label: string; type: string; answer: any }>;
  } | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  // Fetch form details if not provided
  useEffect(() => {
    if (!form) {
      getFormByIdApi(formId).then((res) => {
        if (res.success && res.data) {
          setForm(res.data);
          const existing = res.data.theme?.integrations;
          if (existing) {
            setIntegrations({
              storeLocalResponses: existing.storeLocalResponses ?? true,
              googleSheetsEnabled: existing.googleSheetsEnabled ?? false,
              googleSheetsWebhookUrl: existing.googleSheetsWebhookUrl ?? "",
              spreadsheetId: existing.spreadsheetId,
              spreadsheetUrl: existing.spreadsheetUrl,
              spreadsheetTitle: existing.spreadsheetTitle,
              lastSyncedAt: existing.lastSyncedAt,
              webhookEnabled: existing.webhookEnabled ?? false,
              webhookUrl: existing.webhookUrl ?? "",
            });
          }
        }
      });
    }
  }, [formId, form]);

  // Handle returning from 1-click Google OAuth flow
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("connected_google") === "true") {
        setIsConnectingGoogleSheets(true);
        setIsIntegrationsModalOpen(true);
        connectGoogleSheetsApi(formId).then((res) => {
          if (res.success && res.data?.spreadsheetUrl) {
            const sheetUrl = res.data.spreadsheetUrl;
            setIntegrations((prev) => ({
              ...prev,
              googleSheetsEnabled: true,
              spreadsheetId: res.data?.spreadsheetId,
              spreadsheetUrl: sheetUrl,
              spreadsheetTitle: res.data?.spreadsheetTitle || `${formTitle} (Responses)`,
              lastSyncedAt: new Date().toISOString(),
            }));
            setGoogleSyncMessage("Connected! Google Sheet created with all responses and live auto-sync activated.");
            window.open(sheetUrl, "_blank");
          } else {
            setGoogleSyncError(res.error || "Could not auto-create Google Sheet. Please check permissions.");
          }
          setIsConnectingGoogleSheets(false);
          window.history.replaceState({}, document.title, window.location.pathname);
        });
      }
    }
  }, [formId, formTitle]);

  const fetchResponses = useCallback(async () => {
    setIsLoading(true);
    const res = await getFormResponsesApi(formId, {
      search: searchQuery || undefined,
    });

    if (res.success && res.data) {
      setResponses(res.data);
      if (res.analytics) {
        setAnalytics(res.analytics);
      }
    }
    setIsLoading(false);
  }, [formId, searchQuery]);

  useEffect(() => {
    fetchResponses();
  }, [fetchResponses]);

  // Load single response detail
  const handleOpenDetail = async (respId: string) => {
    setSelectedResponseId(respId);
    setIsLoadingDetail(true);
    const res = await getResponseDetailApi(formId, respId);
    if (res.success && res.data) {
      setResponseDetail(res.data);
    }
    setIsLoadingDetail(false);
  };

  // Close modals & export menu on outside click or Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedResponseId(null);
        setIsExportMenuOpen(false);
        setIsIntegrationsModalOpen(false);
      }
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (
        exportMenuRef.current &&
        !exportMenuRef.current.contains(e.target as Node)
      ) {
        setIsExportMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Save integrations
  const handleSaveIntegrations = async () => {
    setIsSavingIntegrations(true);
    setIntegrationsSaveSuccess(false);

    const existingTheme = form?.theme || {};
    const updatedTheme = {
      ...existingTheme,
      integrations,
    };

    const res = await updateFormApi(formId, { theme: updatedTheme });
    if (res.success && res.data) {
      setForm(res.data);
      setIntegrationsSaveSuccess(true);
      setTimeout(() => {
        setIntegrationsSaveSuccess(false);
        setIsIntegrationsModalOpen(false);
      }, 1200);
    } else {
      alert("Failed to save integration settings. Please try again.");
    }
    setIsSavingIntegrations(false);
  };

  // 1-Click Google Sheets Auto-Sync Connect
  const handleOneClickGoogleSheetsSync = async () => {
    setIsConnectingGoogleSheets(true);
    setGoogleSyncError(null);
    setGoogleSyncMessage(null);

    const res = await connectGoogleSheetsApi(formId);

    if (res.success && res.data?.spreadsheetUrl) {
      const sheetUrl = res.data.spreadsheetUrl;
      setIntegrations((prev) => ({
        ...prev,
        googleSheetsEnabled: true,
        spreadsheetId: res.data?.spreadsheetId,
        spreadsheetUrl: sheetUrl,
        spreadsheetTitle: res.data?.spreadsheetTitle || `${formTitle} (Responses)`,
        lastSyncedAt: new Date().toISOString(),
      }));
      setGoogleSyncMessage("Connected! Your Google Sheet is created with all responses and live auto-sync is active.");
      setIsConnectingGoogleSheets(false);
      window.open(sheetUrl, "_blank");
      return;
    }

    if (
      res.requiresGoogleAuth ||
      res.data?.requiresGoogleAuth ||
      res.error?.includes("Google authorization") ||
      res.error?.includes("permission")
    ) {
      // 1-Click OAuth Redirect
      setGoogleSyncMessage("Redirecting to Google Account authorization...");
      try {
        const callbackUrl = window.location.href.split("?")[0] + "?connected_google=true";
        await signIn("google", { callbackUrl });
      } catch (err: any) {
        setGoogleSyncError("Google sign-in could not be initiated.");
        setIsConnectingGoogleSheets(false);
      }
      return;
    }

    setGoogleSyncError(
      res.error || "Could not auto-connect Google Sheet. You can link your sheet below in 1 click."
    );
    setIsConnectingGoogleSheets(false);
  };

  // 1-Click Instant Data Fill (No Google Login Needed)
  const handleQuickDataPaste = async () => {
    const allKeys = Array.from(
      new Set(responses.flatMap((r) => Object.keys(r.data)))
    );
    const fieldMap = new Map<string, string>();
    (form?.fields || []).forEach((f) => {
      fieldMap.set(f.id, f.label || f.id);
    });

    const headers = ["Response ID", "Submitted At", ...allKeys.map((k) => fieldMap.get(k) || k)];
    const rows = responses.map((r) => [
      r.id,
      new Date(r.submittedAt).toISOString(),
      ...allKeys.map((k) => {
        const val = r.data[k];
        if (val === undefined || val === null) return "";
        if (typeof val === "object") return JSON.stringify(val);
        return String(val);
      }),
    ]);

    const tsvContent = [
      headers.join("\t"),
      ...rows.map((row) => row.join("\t")),
    ].join("\n");

    try {
      await navigator.clipboard.writeText(tsvContent);
      setDataCopied(true);
      setTimeout(() => setDataCopied(false), 5000);
    } catch {
      // clipboard fallback
    }

    // Automatically trigger CSV download as well
    handleExportCSV();

    // Open fresh Google Sheet
    window.open("https://docs.google.com/spreadsheets/u/0/create", "_blank");

    setGoogleSyncMessage(
      `All ${responses.length} responses copied to clipboard & downloaded as CSV! In your new Google Sheet: Click cell A1 and press Ctrl+V (or Cmd+V) to populate all rows instantly!`
    );
  };

  // 1-Click Link Existing Google Sheet URL or ID
  const handleLinkGoogleSheet = async () => {
    if (!manualSheetUrl.trim()) return;
    setIsConnectingGoogleSheets(true);
    setGoogleSyncError(null);
    setGoogleSyncMessage(null);

    const res = await linkGoogleSheetApi(formId, manualSheetUrl.trim());
    if (res.success && res.data) {
      setIntegrations((prev) => ({
        ...prev,
        googleSheetsEnabled: true,
        spreadsheetId: res.data?.spreadsheetId,
        spreadsheetUrl: res.data?.spreadsheetUrl,
        spreadsheetTitle: res.data?.spreadsheetTitle || "Linked Google Sheet",
        lastSyncedAt: new Date().toISOString(),
      }));
      setGoogleSyncMessage("Google Sheet linked successfully!");
      setManualSheetUrl("");
    } else {
      setGoogleSyncError(res.error || "Failed to link Google Sheet. Check the URL.");
    }
    setIsConnectingGoogleSheets(false);
  };

  // 1-Click Force Sync All Responses to Google Sheet
  const handleSyncAllNow = async () => {
    setIsSyncingAllGoogleSheets(true);
    setGoogleSyncError(null);
    setGoogleSyncMessage(null);

    const res = await syncAllGoogleSheetsApi(formId);
    if (res.success) {
      setGoogleSyncMessage(
        `Successfully synced ${res.data?.syncedCount ?? responses.length} responses to Google Sheet!`
      );
      setIntegrations((prev) => ({ ...prev, lastSyncedAt: new Date().toISOString() }));
    } else {
      setGoogleSyncError(res.error || "Failed to re-sync responses.");
    }
    setIsSyncingAllGoogleSheets(false);
  };

  // 1-Click Disconnect Google Sheet
  const handleDisconnectGoogleSheets = async () => {
    if (!confirm("Are you sure you want to disconnect Google Sheets auto-sync?")) return;
    const res = await disconnectGoogleSheetsApi(formId);
    if (res.success) {
      setIntegrations((prev) => ({
        ...prev,
        googleSheetsEnabled: false,
        spreadsheetId: undefined,
        spreadsheetUrl: undefined,
        spreadsheetTitle: undefined,
      }));
      setGoogleSyncMessage("Google Sheet disconnected.");
    }
  };

  // Test Google Sheets connection
  const handleTestGoogleSheets = async () => {
    if (!integrations.googleSheetsWebhookUrl?.trim()) return;
    setIsTestingGoogleSheets(true);
    setGoogleSheetsTestResult(null);

    const res = await testIntegrationApi(formId, {
      url: integrations.googleSheetsWebhookUrl.trim(),
      type: "googleSheets",
      formTitle,
    });

    if (res.success) {
      setGoogleSheetsTestResult({
        success: true,
        message: "Connection verified! A test submission row was sent to your Google Sheet.",
      });
    } else {
      setGoogleSheetsTestResult({
        success: false,
        message: res.error || "Connection failed. Please ensure the Web App URL is deployed with 'Who has access: Anyone'.",
      });
    }
    setIsTestingGoogleSheets(false);
  };

  // Test Webhook connection
  const handleTestWebhook = async () => {
    if (!integrations.webhookUrl?.trim()) return;
    setIsTestingWebhook(true);
    setWebhookTestResult(null);

    const res = await testIntegrationApi(formId, {
      url: integrations.webhookUrl.trim(),
      type: "webhook",
      formTitle,
    });

    if (res.success) {
      setWebhookTestResult({
        success: true,
        message: "Test webhook verified! Endpoint received sample submission.",
      });
    } else {
      setWebhookTestResult({
        success: false,
        message: res.error || "Failed to reach webhook URL.",
      });
    }
    setIsTestingWebhook(false);
  };

  // Copy Google Apps Script snippet
  const handleCopyScript = async () => {
    try {
      await navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_CODE);
      setCopiedScript(true);
      setTimeout(() => setCopiedScript(false), 2000);
    } catch (err) {
      console.error("Failed to copy code", err);
    }
  };

  // 1. Export CSV
  const handleExportCSV = () => {
    if (responses.length === 0) return;
    setIsExportMenuOpen(false);

    const allKeys = Array.from(
      new Set(responses.flatMap((r) => Object.keys(r.data)))
    );
    const fieldMap = new Map<string, string>();
    (form?.fields || []).forEach((f) => {
      fieldMap.set(f.id, f.label || f.id);
    });

    const headers = ["Response ID", "Submitted At", ...allKeys.map((k) => fieldMap.get(k) || k)];
    const rows = responses.map((r) => [
      r.id,
      new Date(r.submittedAt).toISOString(),
      ...allKeys.map((k) => {
        const val = r.data[k];
        if (val === undefined || val === null) return "";
        if (typeof val === "object") return JSON.stringify(val).replace(/"/g, '""');
        return String(val).replace(/"/g, '""');
      }),
    ]);

    const csvContent =
      "\uFEFF" +
      [headers.map((h) => `"${h.replace(/"/g, '""')}"`).join(","), ...rows.map((row) => `"${row.join('","')}"`)].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${formTitle.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_responses.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // 2. Export Excel (.xls SpreadsheetML)
  const handleExportExcel = () => {
    if (responses.length === 0) return;
    setIsExportMenuOpen(false);

    const allKeys = Array.from(
      new Set(responses.flatMap((r) => Object.keys(r.data)))
    );
    const fieldMap = new Map<string, string>();
    (form?.fields || []).forEach((f) => {
      fieldMap.set(f.id, f.label || f.id);
    });

    const headers = ["Response ID", "Submitted At", ...allKeys.map((k) => fieldMap.get(k) || k)];

    const headerCells = headers
      .map(
        (h) => `<Cell ss:StyleID="Header"><Data ss:Type="String">${escapeXml(h)}</Data></Cell>`
      )
      .join("");

    const rowsXml = responses
      .map((r) => {
        const cells = [
          `<Cell><Data ss:Type="String">${escapeXml(r.id)}</Data></Cell>`,
          `<Cell><Data ss:Type="String">${escapeXml(new Date(r.submittedAt).toISOString())}</Data></Cell>`,
          ...allKeys.map((k) => {
            const val = r.data[k];
            let displayVal = "";
            let cellType = "String";
            if (val === undefined || val === null) {
              displayVal = "";
            } else if (typeof val === "number") {
              displayVal = String(val);
              cellType = "Number";
            } else if (typeof val === "object") {
              displayVal = JSON.stringify(val);
            } else {
              displayVal = String(val);
            }
            return `<Cell><Data ss:Type="${cellType}">${escapeXml(displayVal)}</Data></Cell>`;
          }),
        ].join("");
        return `<Row>${cells}</Row>`;
      })
      .join("\n");

    const xml = `<?xml version="1.0" encoding="utf-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <Styles>
  <Style ss:ID="Default" ss:Name="Normal">
   <Alignment ss:Vertical="Center"/>
   <Borders/>
   <Font ss:FontName="Calibri" x:Family="Swiss" ss:Size="11" ss:Color="#000000"/>
  </Style>
  <Style ss:ID="Header">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#D1D5DB"/>
   </Borders>
   <Font ss:FontName="Calibri" ss:Bold="1" ss:Color="#FFFFFF"/>
   <Interior ss:Color="#FF5A36" ss:Pattern="Solid"/>
  </Style>
 </Styles>
 <Worksheet ss:Name="Form Responses">
  <Table>
   <Row ss:Height="24">
    ${headerCells}
   </Row>
   ${rowsXml}
  </Table>
 </Worksheet>
</Workbook>`;

    const blob = new Blob([xml], { type: "application/vnd.ms-excel;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${formTitle.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_responses.xls`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // 3. Export PDF Report
  const handleExportPDF = () => {
    if (responses.length === 0) return;
    setIsExportMenuOpen(false);

    const allKeys = Array.from(
      new Set(responses.flatMap((r) => Object.keys(r.data)))
    );
    const fieldMap = new Map<string, string>();
    (form?.fields || []).forEach((f) => {
      fieldMap.set(f.id, f.label || f.id);
    });

    const headers = ["#", "Submitted At", ...allKeys.map((k) => fieldMap.get(k) || k)];

    const rowsHtml = responses
      .map((r, idx) => {
        const rowCells = [
          `<td>${idx + 1}</td>`,
          `<td>${new Date(r.submittedAt).toLocaleString()}</td>`,
          ...allKeys.map((k) => {
            const val = r.data[k];
            let displayVal = "";
            if (val === undefined || val === null) displayVal = "-";
            else if (typeof val === "object") displayVal = JSON.stringify(val);
            else displayVal = String(val);
            return `<td>${escapeHtml(displayVal)}</td>`;
          }),
        ].join("");
        return `<tr>${rowCells}</tr>`;
      })
      .join("");

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Please allow popups to export PDF");
      return;
    }

    const html = `<!DOCTYPE html>
<html>
<head>
  <title>${escapeHtml(formTitle)} — Responses Report</title>
  <style>
    @page { size: landscape; margin: 12mm; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #1C1917; margin: 0; padding: 24px; }
    .header { border-bottom: 2px solid #FF5A36; padding-bottom: 16px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-end; }
    .title { font-size: 22px; font-weight: 700; margin: 0 0 4px 0; }
    .meta { font-size: 12px; color: #78716C; margin: 0; }
    .badge { background: #FFF0EB; color: #FF5A36; font-size: 12px; font-weight: 600; padding: 4px 10px; border-radius: 999px; }
    table { width: 100%; border-collapse: collapse; font-size: 11px; margin-top: 16px; }
    th { background: #FAF8F5; border: 1px solid #EAE3D6; padding: 8px; text-align: left; font-weight: 600; color: #44403C; }
    td { border: 1px solid #EAE3D6; padding: 8px; text-align: left; color: #1C1917; vertical-align: top; word-break: break-word; }
    tr:nth-child(even) td { background: #FCFBF9; }
    .footer { margin-top: 28px; font-size: 11px; color: #A8A29E; text-align: right; border-top: 1px solid #EAE3D6; padding-top: 10px; }
    @media print {
      body { padding: 0; }
      th { background: #f3f4f6 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .badge { background: #f3f4f6 !important; color: #111827 !important; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <h1 class="title">${escapeHtml(formTitle)}</h1>
      <p class="meta">Exported on ${new Date().toLocaleDateString(undefined, { dateStyle: "full" })} at ${new Date().toLocaleTimeString()}</p>
    </div>
    <span class="badge">${responses.length} Total ${responses.length === 1 ? "Response" : "Responses"}</span>
  </div>
  <table>
    <thead>
      <tr>
        ${headers.map((h) => `<th>${escapeHtml(h)}</th>`).join("")}
      </tr>
    </thead>
    <tbody>
      ${rowsHtml}
    </tbody>
  </table>
  <div class="footer">
    Generated by InstantForm • Form ID: ${escapeHtml(formId)}
  </div>
  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 300);
    };
  </script>
</body>
</html>`;

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
  };

  // 4. Export JSON
  const handleExportJSON = () => {
    if (responses.length === 0) return;
    setIsExportMenuOpen(false);

    const exportData = {
      formId,
      formTitle,
      formSlug,
      totalResponses: responses.length,
      exportedAt: new Date().toISOString(),
      responses: responses.map((r) => ({
        id: r.id,
        submittedAt: r.submittedAt,
        data: r.data,
      })),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${formTitle.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_responses.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // 5. Open in Google Sheets
  const handleOpenGoogleSheets = () => {
    setIsExportMenuOpen(false);
    handleQuickDataPaste();
  };

  const isGoogleSheetsActive = Boolean(
    integrations.googleSheetsEnabled && integrations.googleSheetsWebhookUrl
  );
  const isWebhookActive = Boolean(
    integrations.webhookEnabled && integrations.webhookUrl
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#EAE3D6] dark:border-[#1F2937]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link
              href="/forms"
              className="inline-flex items-center gap-1 text-xs text-[#78716C] dark:text-[#94A3B8] hover:text-[#1C1917] dark:hover:text-[#F8FAFC] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Forms</span>
            </Link>
            <span className="text-xs text-[#D6D3D1] dark:text-[#374151]">/</span>
            <span className="text-xs font-medium text-[#78716C] dark:text-[#94A3B8]">
              Responses
            </span>
          </div>

          <h1 className="font-serif-editorial text-2xl sm:text-3xl font-normal text-[#1C1917] dark:text-[#F8FAFC] tracking-tight">
            {formTitle}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link href={`/forms/${formId}/edit`}>
            <Button variant="outline" size="sm">
              Edit in Builder
            </Button>
          </Link>

          {/* Storage & Integrations Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsIntegrationsModalOpen(true)}
            className="relative cursor-pointer"
            iconLeft={<Cloud className="w-3.5 h-3.5 text-[#FF5A36]" />}
          >
            <span>Storage & Integrations</span>
            {(isGoogleSheetsActive || isWebhookActive) && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse ml-1" />
            )}
          </Button>

          {/* Multi-Option Export Dropdown */}
          <div className="relative" ref={exportMenuRef}>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsExportMenuOpen((prev) => !prev)}
              disabled={responses.length === 0}
              iconLeft={<Download className="w-3.5 h-3.5" />}
              iconRight={<ChevronDown className="w-3.5 h-3.5" />}
            >
              Export Data
            </Button>

            {isExportMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#111827] border border-[#EAE3D6] dark:border-[#1F2937] rounded-2xl shadow-xl z-30 p-1.5 animate-in fade-in-0 zoom-in-95 duration-150">
                <div className="px-3 py-2 border-b border-[#EAE3D6] dark:border-[#1F2937] mb-1">
                  <span className="text-[11px] font-semibold text-[#78716C] dark:text-[#94A3B8] uppercase tracking-wider">
                    Select Export Format
                  </span>
                </div>

                {/* CSV */}
                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="w-full flex items-start gap-2.5 px-3 py-2 rounded-xl text-left hover:bg-[#FAF8F5] dark:hover:bg-[#1E293B] transition-colors cursor-pointer group"
                >
                  <FileText className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs font-semibold text-[#1C1917] dark:text-[#F8FAFC] group-hover:text-[#FF5A36] transition-colors">
                      Export CSV (.csv)
                    </div>
                    <div className="text-[11px] text-[#78716C] dark:text-[#94A3B8]">
                      Universal spreadsheet format (UTF-8)
                    </div>
                  </div>
                </button>

                {/* Excel */}
                <button
                  type="button"
                  onClick={handleExportExcel}
                  className="w-full flex items-start gap-2.5 px-3 py-2 rounded-xl text-left hover:bg-[#FAF8F5] dark:hover:bg-[#1E293B] transition-colors cursor-pointer group"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs font-semibold text-[#1C1917] dark:text-[#F8FAFC] group-hover:text-[#FF5A36] transition-colors">
                      Export Excel (.xls)
                    </div>
                    <div className="text-[11px] text-[#78716C] dark:text-[#94A3B8]">
                      Styled workbook for Excel & Numbers
                    </div>
                  </div>
                </button>

                {/* PDF */}
                <button
                  type="button"
                  onClick={handleExportPDF}
                  className="w-full flex items-start gap-2.5 px-3 py-2 rounded-xl text-left hover:bg-[#FAF8F5] dark:hover:bg-[#1E293B] transition-colors cursor-pointer group"
                >
                  <Download className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs font-semibold text-[#1C1917] dark:text-[#F8FAFC] group-hover:text-[#FF5A36] transition-colors">
                      Export PDF Report
                    </div>
                    <div className="text-[11px] text-[#78716C] dark:text-[#94A3B8]">
                      Clean, printable formatted report
                    </div>
                  </div>
                </button>

                {/* Open in Google Sheets */}
                <button
                  type="button"
                  onClick={handleOpenGoogleSheets}
                  className="w-full flex items-start gap-2.5 px-3 py-2 rounded-xl text-left hover:bg-[#FAF8F5] dark:hover:bg-[#1E293B] transition-colors cursor-pointer group border-t border-[#EAE3D6] dark:border-[#1F2937] mt-1 pt-2"
                >
                  <Cloud className="w-4 h-4 text-[#3B82F6] mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs font-semibold text-[#1C1917] dark:text-[#F8FAFC] group-hover:text-[#FF5A36] transition-colors">
                      Open in Google Sheets
                    </div>
                    <div className="text-[11px] text-[#78716C] dark:text-[#94A3B8]">
                      Download CSV & open Sheets in 1-click
                    </div>
                  </div>
                </button>

                {/* JSON */}
                <button
                  type="button"
                  onClick={handleExportJSON}
                  className="w-full flex items-start gap-2.5 px-3 py-2 rounded-xl text-left hover:bg-[#FAF8F5] dark:hover:bg-[#1E293B] transition-colors cursor-pointer group"
                >
                  <FileCode className="w-4 h-4 text-purple-500 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs font-semibold text-[#1C1917] dark:text-[#F8FAFC] group-hover:text-[#FF5A36] transition-colors">
                      Export JSON (.json)
                    </div>
                    <div className="text-[11px] text-[#78716C] dark:text-[#94A3B8]">
                      Structured data for developers & APIs
                    </div>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center justify-between gap-4">
        <div className="inline-flex p-1 bg-[#FAF8F5] dark:bg-[#111827] rounded-xl border border-[#EAE3D6] dark:border-[#1F2937]">
          <button
            type="button"
            onClick={() => setActiveTab("responses")}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === "responses"
                ? "bg-[#FF5A36] text-white shadow-xs shadow-[#FF5A36]/20"
                : "text-[#78716C] dark:text-[#94A3B8] hover:text-[#1C1917] dark:hover:text-[#F8FAFC] hover:bg-white/60 dark:hover:bg-[#1E293B]"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Responses ({responses.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("analytics")}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === "analytics"
                ? "bg-[#FF5A36] text-white shadow-xs shadow-[#FF5A36]/20"
                : "text-[#78716C] dark:text-[#94A3B8] hover:text-[#1C1917] dark:hover:text-[#F8FAFC] hover:bg-white/60 dark:hover:bg-[#1E293B]"
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Analytics Summary</span>
          </button>
        </div>

        {activeTab === "responses" && (
          <div className="relative w-64 hidden sm:block">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#78716C] dark:text-[#94A3B8]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search responses..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-[#111827] border border-[#EAE3D6] dark:border-[#1F2937] rounded-xl text-[#1C1917] dark:text-[#F8FAFC] placeholder-[#A8A29E] dark:placeholder-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#FF5A36]/20 focus:border-[#FF5A36] transition-all"
            />
          </div>
        )}
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <div className="rounded-3xl bg-white dark:bg-[#111827] border border-[#EAE3D6] dark:border-[#1F2937] p-12 text-center card-shadow animate-pulse space-y-3">
          <div className="h-6 w-32 bg-[#FAF8F5] dark:bg-[#1F2937] rounded mx-auto" />
          <div className="h-4 w-48 bg-[#FAF8F5] dark:bg-[#1F2937] rounded mx-auto" />
        </div>
      ) : activeTab === "responses" ? (
        /* Submissions Table */
        responses.length === 0 ? (
          <div className="rounded-3xl bg-white dark:bg-[#111827] border border-[#EAE3D6] dark:border-[#1F2937] p-12 sm:p-16 text-center card-shadow flex flex-col items-center justify-center">
            <div className="w-14 h-14 rounded-2xl bg-[#FFF0EB] dark:bg-[#FF5A36]/15 border border-[#FFD8CC] dark:border-[#FF5A36]/30 text-[#FF5A36] dark:text-[#FF6B4A] flex items-center justify-center mb-4">
              <MessageSquare className="w-7 h-7" />
            </div>
            <h3 className="font-serif-editorial text-2xl font-normal text-[#1C1917] dark:text-[#F8FAFC]">
              No responses yet
            </h3>
            <p className="text-xs sm:text-sm text-[#57534E] dark:text-[#94A3B8] max-w-sm mt-1.5 mb-6">
              Share your public form URL to begin collecting responses.
            </p>
            <a
              href={`/f/${formSlug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FF5A36] text-white text-xs font-semibold shadow-md shadow-[#FF5A36]/20 hover:bg-[#E04826] transition-colors"
            >
              <span>Open Public Form</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        ) : (
          <div className="rounded-3xl bg-white dark:bg-[#111827] border border-[#EAE3D6] dark:border-[#1F2937] card-shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#EAE3D6] dark:border-[#1F2937] bg-[#FAF8F5] dark:bg-[#0D131F] text-[11px] font-semibold text-[#78716C] dark:text-[#94A3B8] uppercase tracking-wider">
                    <th className="py-3.5 px-4">#</th>
                    <th className="py-3.5 px-4">Submitted</th>
                    <th className="py-3.5 px-4">Answers Preview</th>
                    <th className="py-3.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAE3D6] dark:divide-[#1F2937] text-xs text-[#1C1917] dark:text-[#F8FAFC]">
                  {responses.map((resp, idx) => {
                    const previewText = Object.values(resp.data)
                      .filter((v) => typeof v === "string" || typeof v === "number")
                      .slice(0, 3)
                      .join(" • ");

                    return (
                      <tr
                        key={resp.id}
                        onClick={() => handleOpenDetail(resp.id)}
                        className="hover:bg-[#FAF8F5] dark:hover:bg-[#1E293B]/70 transition-colors cursor-pointer group"
                      >
                        <td className="py-3.5 px-4 font-mono text-[11px] text-[#A8A29E] dark:text-[#64748B]">
                          {idx + 1}
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap text-[#78716C] dark:text-[#94A3B8]">
                          {formatRelativeTime(resp.submittedAt)}
                        </td>
                        <td className="py-3.5 px-4 max-w-md truncate font-medium">
                          {previewText || "Submitted answer"}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#FF5A36] dark:text-[#FF6B4A] group-hover:translate-x-0.5 transition-transform">
                            View detail <ChevronRight className="w-3.5 h-3.5" />
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )
      ) : (
        /* Analytics Summary */
        <div className="space-y-6">
          {/* Top Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="rounded-3xl bg-white dark:bg-[#111827] border border-[#EAE3D6] dark:border-[#1F2937] p-6 card-shadow">
              <div className="flex items-center justify-between text-[#78716C] dark:text-[#94A3B8]">
                <span className="text-xs font-semibold">Total Responses</span>
                <MessageSquare className="w-4 h-4 text-[#FF5A36]" />
              </div>
              <div className="text-2xl font-bold text-[#1C1917] dark:text-[#F8FAFC] mt-2">
                {analytics?.totalResponses || 0}
              </div>
            </div>

            <div className="rounded-3xl bg-white dark:bg-[#111827] border border-[#EAE3D6] dark:border-[#1F2937] p-6 card-shadow">
              <div className="flex items-center justify-between text-[#78716C] dark:text-[#94A3B8]">
                <span className="text-xs font-semibold">Completion Rate</span>
                <TrendingUp className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-2xl font-bold text-[#1C1917] dark:text-[#F8FAFC] mt-2">
                {analytics?.totalResponses ? "100%" : "0%"}
              </div>
            </div>

            <div className="rounded-3xl bg-white dark:bg-[#111827] border border-[#EAE3D6] dark:border-[#1F2937] p-6 card-shadow">
              <div className="flex items-center justify-between text-[#78716C] dark:text-[#94A3B8]">
                <span className="text-xs font-semibold">Questions Tracked</span>
                <BarChart3 className="w-4 h-4 text-[#3B82F6]" />
              </div>
              <div className="text-2xl font-bold text-[#1C1917] dark:text-[#F8FAFC] mt-2">
                {analytics?.questions.length || 0}
              </div>
            </div>
          </div>

          {/* Question-by-Question Breakdown Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {analytics?.questions.map((q) => (
              <div
                key={q.fieldId}
                className="rounded-3xl bg-white dark:bg-[#111827] border border-[#EAE3D6] dark:border-[#1F2937] p-6 card-shadow space-y-4"
              >
                <div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#FAF8F5] dark:bg-[#161F30] text-[#57534E] dark:text-[#94A3B8] border border-[#EAE3D6] dark:border-[#293548]">
                    {q.type.replace("_", " ")}
                  </span>
                  <h3 className="font-semibold text-sm text-[#1C1917] dark:text-[#F8FAFC] mt-2">
                    {q.label}
                  </h3>
                  <p className="text-[11px] text-[#78716C] dark:text-[#94A3B8]">
                    {q.totalAnswered} answered
                  </p>
                </div>

                {/* Rating Distribution */}
                {q.type === "rating" && (
                  <div className="space-y-2 pt-2 border-t border-[#EAE3D6] dark:border-[#1F2937]">
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                      <span className="text-xl font-bold text-[#1C1917] dark:text-[#F8FAFC]">
                        {q.averageRating || 0}
                      </span>
                      <span className="text-xs text-[#78716C] dark:text-[#94A3B8]">/ 5 average</span>
                    </div>

                    <div className="space-y-1.5 pt-2">
                      {[5, 4, 3, 2, 1].map((stars) => {
                        const count = q.ratingDistribution?.[stars] || 0;
                        const pct =
                          q.totalAnswered > 0
                            ? Math.round((count / q.totalAnswered) * 100)
                            : 0;
                        return (
                          <div key={stars} className="flex items-center gap-2 text-xs">
                            <span className="w-10 text-[11px] text-[#78716C] dark:text-[#94A3B8]">
                              {stars} ★
                            </span>
                            <div className="flex-1 h-2 bg-[#FAF8F5] dark:bg-[#161F30] border border-[#EAE3D6] dark:border-[#293548] rounded-full overflow-hidden">
                              <div
                                className="h-full bg-amber-400 rounded-full"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <span className="w-10 text-right text-[11px] text-[#78716C] dark:text-[#94A3B8]">
                              {count}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Choice Breakdown */}
                {q.choiceDistribution && q.choiceDistribution.length > 0 && (
                  <div className="space-y-2.5 pt-2 border-t border-[#EAE3D6] dark:border-[#1F2937]">
                    {q.choiceDistribution.map((choice) => (
                      <div key={choice.option} className="space-y-1">
                        <div className="flex justify-between text-xs font-medium">
                          <span className="text-[#1C1917] dark:text-[#F8FAFC]">{choice.option}</span>
                          <span className="text-[#78716C] dark:text-[#94A3B8]">
                            {choice.count} ({choice.percentage}%)
                          </span>
                        </div>
                        <div className="w-full h-2 bg-[#FAF8F5] dark:bg-[#161F30] border border-[#EAE3D6] dark:border-[#293548] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#FF5A36] rounded-full"
                            style={{ width: `${choice.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Response Detail Centered Modal */}
      {selectedResponseId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop with blur */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setSelectedResponseId(null)}
          />

          {/* Centered Modal Card */}
          <div className="relative w-full max-w-2xl bg-white dark:bg-[#111827] rounded-3xl shadow-2xl z-10 flex flex-col max-h-[88vh] overflow-hidden animate-in zoom-in-95 fade-in-0 duration-200 border border-[#EAE3D6] dark:border-[#1F2937]">
            {/* Header */}
            <div className="px-6 py-5 border-b border-[#EAE3D6] dark:border-[#1F2937] flex items-center justify-between bg-white dark:bg-[#111827] sticky top-0 z-10">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h3 className="font-serif-editorial text-xl font-medium text-[#1C1917] dark:text-[#F8FAFC]">
                    Response Detail
                  </h3>
                  {responseDetail && (
                    <span className="px-2 py-0.5 text-[11px] font-mono font-medium rounded-full bg-[#FAF8F5] dark:bg-[#1E293B] text-[#78716C] dark:text-[#94A3B8] border border-[#EAE3D6] dark:border-[#334155]">
                      #{responseDetail.response.id.slice(-6).toUpperCase()}
                    </span>
                  )}
                </div>
                {responseDetail && (
                  <p className="text-xs text-[#78716C] dark:text-[#94A3B8]">
                    Submitted {new Date(responseDetail.response.submittedAt).toLocaleDateString(undefined, { dateStyle: "medium" })} at {new Date(responseDetail.response.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({formatRelativeTime(responseDetail.response.submittedAt)})
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => setSelectedResponseId(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#57534E] dark:text-[#94A3B8] hover:text-[#1C1917] dark:hover:text-[#F8FAFC] bg-[#FAF8F5] dark:bg-[#1E293B] border border-[#EAE3D6] dark:border-[#334155] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Answers List */}
            <div className="p-6 flex-1 overflow-y-auto space-y-3.5 bg-[#FAF8F5] dark:bg-[#0B0F17]">
              {isLoadingDetail ? (
                <div className="space-y-4 animate-pulse">
                  {[1, 2, 3, 4].map((n) => (
                    <div key={n} className="h-16 bg-white dark:bg-[#111827] border border-[#EAE3D6] dark:border-[#1F2937] rounded-2xl" />
                  ))}
                </div>
              ) : responseDetail ? (
                responseDetail.fields.map((field, idx) => (
                  <div
                    key={field.id}
                    className="p-4 rounded-2xl bg-white dark:bg-[#111827] border border-[#EAE3D6] dark:border-[#1F2937] space-y-1.5 shadow-2xs hover:border-[#D6CEC0] dark:hover:border-[#334155] transition-colors"
                  >
                    <div className="flex items-center justify-between text-xs font-semibold text-[#78716C] dark:text-[#94A3B8]">
                      <span>{idx + 1}. {field.label}</span>
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#FAF8F5] dark:bg-[#1E293B] border border-[#EAE3D6] dark:border-[#293548]">
                        {field.type.replace(/_/g, " ")}
                      </span>
                    </div>
                    <div className="text-sm font-medium text-[#1C1917] dark:text-[#F8FAFC] pt-0.5 whitespace-pre-wrap break-words">
                      {field.answer !== null && field.answer !== undefined
                        ? Array.isArray(field.answer)
                          ? field.answer.join(", ")
                          : typeof field.answer === "object"
                          ? JSON.stringify(field.answer, null, 2)
                          : String(field.answer)
                        : "(No answer provided)"}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-[#78716C] dark:text-[#94A3B8] text-center py-8">Failed to load details.</p>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-[#EAE3D6] dark:border-[#1F2937] bg-white dark:bg-[#111827] flex items-center justify-between sticky bottom-0 z-10">
              <span className="text-xs text-[#78716C] dark:text-[#94A3B8]">
                {responseDetail?.fields?.length || 0} questions answered
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedResponseId(null)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Storage & Integrations Modal */}
      {isIntegrationsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop with blur */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsIntegrationsModalOpen(false)}
          />

          {/* Modal Container */}
          <div className="relative w-full max-w-2xl bg-white dark:bg-[#111827] rounded-3xl shadow-2xl z-10 flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 fade-in-0 duration-200 border border-[#EAE3D6] dark:border-[#1F2937]">
            {/* Header */}
            <div className="px-6 py-5 border-b border-[#EAE3D6] dark:border-[#1F2937] flex items-center justify-between bg-white dark:bg-[#111827] sticky top-0 z-10">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#FFF0EB] dark:bg-[#FF5A36]/15 border border-[#FFD8CC] dark:border-[#FF5A36]/30 text-[#FF5A36] dark:text-[#FF6B4A] flex items-center justify-center">
                    <Cloud className="w-4 h-4" />
                  </div>
                  <h3 className="font-serif-editorial text-xl font-medium text-[#1C1917] dark:text-[#F8FAFC]">
                    Storage & Integrations
                  </h3>
                </div>
                <p className="text-xs text-[#78716C] dark:text-[#94A3B8]">
                  Control where form submissions are saved, backed up, and synced in real-time.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsIntegrationsModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#57534E] dark:text-[#94A3B8] hover:text-[#1C1917] dark:hover:text-[#F8FAFC] bg-[#FAF8F5] dark:bg-[#1E293B] border border-[#EAE3D6] dark:border-[#334155] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-6 flex-1 overflow-y-auto space-y-5 bg-[#FAF8F5] dark:bg-[#0B0F17]">
              {/* 1. Internal InstantForm Storage */}
              <div className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-[#EAE3D6] dark:border-[#1F2937] shadow-2xs space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#FAF8F5] dark:bg-[#1E293B] border border-[#EAE3D6] dark:border-[#334155] text-[#1C1917] dark:text-[#F8FAFC] flex items-center justify-center shrink-0">
                      <Database className="w-4 h-4 text-[#FF5A36]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold text-[#1C1917] dark:text-[#F8FAFC]">
                          Store Responses on InstantForm
                        </h4>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                          Recommended
                        </span>
                      </div>
                      <p className="text-xs text-[#78716C] dark:text-[#94A3B8] mt-1 leading-relaxed">
                        Retain submissions on InstantForm so you can browse, filter, inspect, and export them directly from this dashboard.
                      </p>
                    </div>
                  </div>

                  {/* Toggle Switch */}
                  <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                    <input
                      type="checkbox"
                      checked={integrations.storeLocalResponses !== false}
                      onChange={(e) =>
                        setIntegrations((prev) => ({
                          ...prev,
                          storeLocalResponses: e.target.checked,
                        }))
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-[#E5E7EB] dark:bg-[#374151] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF5A36]"></div>
                  </label>
                </div>

                {integrations.storeLocalResponses === false && (
                  <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 flex items-start gap-2.5 text-xs text-amber-800 dark:text-amber-300">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>
                      <strong>Strict Privacy Mode:</strong> Responses will NOT be saved to InstantForm database. Submissions will only be routed to your connected Google Sheet or Webhook below.
                    </span>
                  </div>
                )}
              </div>

              {/* 2. Google Sheets Direct 1-Click Auto-Sync */}
              <div className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-[#EAE3D6] dark:border-[#1F2937] shadow-2xs space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <FileSpreadsheet className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold text-[#1C1917] dark:text-[#F8FAFC]">
                          Google Sheets Auto-Sync
                        </h4>
                        {integrations.googleSheetsEnabled && (integrations.spreadsheetUrl || integrations.spreadsheetId) ? (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Live Synced
                          </span>
                        ) : (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                            1-Click Setup
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#78716C] dark:text-[#94A3B8] mt-1 leading-relaxed">
                        Stream form responses in real-time straight to your personal Google Sheet. Columns and headers are formatted automatically.
                      </p>
                    </div>
                  </div>

                  {/* Toggle Switch */}
                  <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                    <input
                      type="checkbox"
                      checked={Boolean(integrations.googleSheetsEnabled)}
                      onChange={(e) =>
                        setIntegrations((prev) => ({
                          ...prev,
                          googleSheetsEnabled: e.target.checked,
                        }))
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-[#E5E7EB] dark:bg-[#374151] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF5A36]"></div>
                  </label>
                </div>

                {/* Google Sheets Content */}
                {integrations.googleSheetsEnabled && (
                  <div className="space-y-4 pt-3 border-t border-[#EAE3D6] dark:border-[#1F2937]">
                    {/* Status feedback */}
                    {googleSyncMessage && (
                      <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40 text-xs flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{googleSyncMessage}</span>
                      </div>
                    )}
                    {googleSyncError && (
                      <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800/40 text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                        <span>{googleSyncError}</span>
                      </div>
                    )}

                    {/* CASE 1: ALREADY CONNECTED SPREADSHEET */}
                    {integrations.spreadsheetUrl || integrations.spreadsheetId ? (
                      <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/40 space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                              <h5 className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                                {integrations.spreadsheetTitle || `${formTitle} (Responses)`}
                              </h5>
                            </div>
                            <p className="text-[11px] text-[#57534E] dark:text-[#94A3B8]">
                              Submissions append automatically. Last synced:{" "}
                              {integrations.lastSyncedAt
                                ? formatRelativeTime(integrations.lastSyncedAt)
                                : "Just now"}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={handleDisconnectGoogleSheets}
                            className="text-[11px] text-[#78716C] dark:text-[#94A3B8] hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
                          >
                            Disconnect
                          </button>
                        </div>

                        {/* Connected Action Buttons */}
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          <a
                            href={
                              integrations.spreadsheetUrl ||
                              `https://docs.google.com/spreadsheets/d/${integrations.spreadsheetId}/edit`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#0F9D58] hover:bg-[#0B8043] text-white shadow-xs shadow-[#0F9D58]/20 transition-all"
                          >
                            <span>Open in Google Sheets</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>

                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={handleSyncAllNow}
                            disabled={isSyncingAllGoogleSheets}
                            className="text-xs cursor-pointer"
                          >
                            {isSyncingAllGoogleSheets ? (
                              <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />
                                <span>Syncing...</span>
                              </>
                            ) : (
                              <>
                                <RefreshCw className="w-3.5 h-3.5 mr-1" />
                                <span>Sync All ({responses.length}) Responses Now</span>
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      /* CASE 2: NOT YET CONNECTED - 1-CLICK ACTIONS */
                      <div className="space-y-3.5">
                        {/* 1-Click Auto-Sync Connect (Primary) */}
                        <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/30 space-y-2.5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-[#1C1917] dark:text-[#F8FAFC]">
                              ⚡ 1-Click Google Sheets Auto-Sync
                            </span>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#0F9D58]/10 text-[#0F9D58] border border-[#0F9D58]/30">
                              Live Auto-Sync
                            </span>
                          </div>
                          <p className="text-xs text-[#57534E] dark:text-[#94A3B8] leading-relaxed">
                            Creates a connected spreadsheet in your Google account with all question columns and {responses.length} responses already filled in. Every future submission auto-appends in real-time.
                          </p>
                          <button
                            type="button"
                            onClick={handleOneClickGoogleSheetsSync}
                            disabled={isConnectingGoogleSheets}
                            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-semibold text-xs bg-[#0F9D58] hover:bg-[#0B8043] text-white shadow-sm shadow-[#0F9D58]/25 transition-all cursor-pointer"
                          >
                            {isConnectingGoogleSheets ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Creating &amp; Populating Google Sheet...</span>
                              </>
                            ) : (
                              <>
                                <FileSpreadsheet className="w-4 h-4" />
                                <span>⚡ Connect &amp; Open Pre-Populated Google Sheet</span>
                              </>
                            )}
                          </button>
                        </div>

                        {/* 1-Click Instant Data Fill (No Login Needed) */}
                        <div className="p-4 rounded-2xl bg-[#FAF8F5] dark:bg-[#1E293B] border border-[#EAE3D6] dark:border-[#334155] space-y-2.5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-[#1C1917] dark:text-[#F8FAFC]">
                              📋 1-Click Instant Data Fill (No Login Needed)
                            </span>
                            <span className="text-[10px] text-[#78716C] dark:text-[#94A3B8]">
                              Zero Setup
                            </span>
                          </div>
                          <p className="text-xs text-[#57534E] dark:text-[#94A3B8] leading-relaxed">
                            Copies all {responses.length} responses &amp; question headers to your clipboard, downloads your CSV backup, and opens Google Sheets. In your new sheet, simply press <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-[#111827] text-[10px] font-mono border border-[#EAE3D6] dark:border-[#334155]">Cmd+V</kbd> (or <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-[#111827] text-[10px] font-mono border border-[#EAE3D6] dark:border-[#334155]">Ctrl+V</kbd>) in cell <strong>A1</strong> to fill all data instantly!
                          </p>
                          <button
                            type="button"
                            onClick={handleQuickDataPaste}
                            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-medium text-xs bg-white dark:bg-[#111827] hover:bg-[#FAF8F5] dark:hover:bg-[#161F30] border border-[#EAE3D6] dark:border-[#334155] text-[#1C1917] dark:text-[#F8FAFC] transition-colors cursor-pointer"
                          >
                            {dataCopied ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-500" />
                                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                                  Data Copied &amp; Downloaded! Opening Sheet...
                                </span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5 text-[#78716C]" />
                                <span>Copy All Data &amp; Open Google Sheets</span>
                              </>
                            )}
                          </button>
                        </div>

                        {/* Collapsible Advanced Link Existing Sheet & Webhook */}
                        <div className="pt-1">
                          <button
                            type="button"
                            onClick={() => setShowAdvancedGoogleOptions((prev) => !prev)}
                            className="text-xs text-[#78716C] dark:text-[#94A3B8] hover:text-[#1C1917] dark:hover:text-[#F8FAFC] underline cursor-pointer"
                          >
                            {showAdvancedGoogleOptions
                              ? "Hide alternative connection methods"
                              : "Or link an existing spreadsheet URL / Webhook"}
                          </button>

                          {showAdvancedGoogleOptions && (
                            <div className="mt-3 p-4 rounded-xl bg-[#FAF8F5] dark:bg-[#1E293B] border border-[#EAE3D6] dark:border-[#334155] space-y-4 animate-in fade-in-0 duration-150">
                              {/* Link Existing Sheet */}
                              <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-[#44403C] dark:text-[#CBD5E1]">
                                  Link Existing Google Sheet URL or ID
                                </label>
                                <div className="flex gap-2">
                                  <input
                                    type="url"
                                    value={manualSheetUrl}
                                    onChange={(e) => setManualSheetUrl(e.target.value)}
                                    placeholder="https://docs.google.com/spreadsheets/d/.../edit"
                                    className="flex-1 px-3 py-1.5 text-xs bg-white dark:bg-[#111827] border border-[#EAE3D6] dark:border-[#334155] rounded-xl text-[#1C1917] dark:text-[#F8FAFC] placeholder-[#A8A29E] focus:outline-none focus:ring-2 focus:ring-[#FF5A36]/30"
                                  />
                                  <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={handleLinkGoogleSheet}
                                    disabled={!manualSheetUrl.trim() || isConnectingGoogleSheets}
                                    className="text-xs cursor-pointer"
                                  >
                                    Link Sheet
                                  </Button>
                                </div>
                              </div>

                              {/* Custom Webhook URL */}
                              <div className="space-y-1.5 pt-2 border-t border-[#EAE3D6] dark:border-[#334155]">
                                <label className="text-xs font-semibold text-[#44403C] dark:text-[#CBD5E1]">
                                  Google Apps Script Web App URL
                                </label>
                                <div className="flex gap-2">
                                  <input
                                    type="url"
                                    value={integrations.googleSheetsWebhookUrl || ""}
                                    onChange={(e) =>
                                      setIntegrations((prev) => ({
                                        ...prev,
                                        googleSheetsWebhookUrl: e.target.value,
                                      }))
                                    }
                                    placeholder="https://script.google.com/macros/s/AKfycb.../exec"
                                    className="flex-1 px-3 py-1.5 text-xs font-mono bg-white dark:bg-[#111827] border border-[#EAE3D6] dark:border-[#334155] rounded-xl text-[#1C1917] dark:text-[#F8FAFC] placeholder-[#A8A29E] focus:outline-none focus:ring-2 focus:ring-[#FF5A36]/30"
                                  />
                                  <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={handleTestGoogleSheets}
                                    disabled={
                                      !integrations.googleSheetsWebhookUrl?.trim() ||
                                      isTestingGoogleSheets
                                    }
                                    className="text-xs cursor-pointer"
                                  >
                                    {isTestingGoogleSheets ? (
                                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    ) : (
                                      "Test URL"
                                    )}
                                  </Button>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => setShowAppsScriptHelp((prev) => !prev)}
                                  className="text-[11px] text-[#FF5A36] dark:text-[#FF6B4A] hover:underline cursor-pointer block pt-1"
                                >
                                  {showAppsScriptHelp ? "Hide Apps Script code" : "View custom Apps Script snippet"}
                                </button>

                                {showAppsScriptHelp && (
                                  <div className="p-3 rounded-lg bg-white dark:bg-[#0F172A] border border-[#EAE3D6] dark:border-[#334155] space-y-2 mt-2">
                                    <div className="flex items-center justify-between">
                                      <span className="text-[11px] font-semibold text-[#1C1917] dark:text-[#F8FAFC]">
                                        Google Apps Script Code:
                                      </span>
                                      <button
                                        type="button"
                                        onClick={handleCopyScript}
                                        className="text-[10px] font-semibold text-[#FF5A36] hover:underline cursor-pointer"
                                      >
                                        {copiedScript ? "Copied!" : "Copy Code"}
                                      </button>
                                    </div>
                                    <pre className="text-[10px] font-mono text-[#57534E] dark:text-[#94A3B8] max-h-28 overflow-x-auto">
                                      {GOOGLE_APPS_SCRIPT_CODE}
                                    </pre>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* 3. Custom Webhook (Zapier / Make / Slack / Airtable) */}
              <div className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-[#EAE3D6] dark:border-[#1F2937] shadow-2xs space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                      <Sliders className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold text-[#1C1917] dark:text-[#F8FAFC]">
                          Custom Webhook
                        </h4>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
                          Zapier • Make • Slack • Airtable
                        </span>
                      </div>
                      <p className="text-xs text-[#78716C] dark:text-[#94A3B8] mt-1 leading-relaxed">
                        Dispatch JSON payloads to any HTTP endpoint whenever someone submits a response.
                      </p>
                    </div>
                  </div>

                  {/* Toggle Switch */}
                  <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                    <input
                      type="checkbox"
                      checked={Boolean(integrations.webhookEnabled)}
                      onChange={(e) =>
                        setIntegrations((prev) => ({
                          ...prev,
                          webhookEnabled: e.target.checked,
                        }))
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-[#E5E7EB] dark:bg-[#374151] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF5A36]"></div>
                  </label>
                </div>

                {integrations.webhookEnabled && (
                  <div className="space-y-3 pt-3 border-t border-[#EAE3D6] dark:border-[#1F2937]">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[#44403C] dark:text-[#CBD5E1]">
                        Target Webhook URL
                      </label>
                      <input
                        type="url"
                        value={integrations.webhookUrl || ""}
                        onChange={(e) =>
                          setIntegrations((prev) => ({
                            ...prev,
                            webhookUrl: e.target.value,
                          }))
                        }
                        placeholder="https://hooks.zapier.com/hooks/catch/... or custom API"
                        className="w-full px-3.5 py-2 text-xs font-mono bg-[#FAF8F5] dark:bg-[#1E293B] border border-[#EAE3D6] dark:border-[#334155] rounded-xl text-[#1C1917] dark:text-[#F8FAFC] placeholder-[#A8A29E] focus:outline-none focus:ring-2 focus:ring-[#FF5A36]/30 focus:border-[#FF5A36]"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={handleTestWebhook}
                        disabled={
                          !integrations.webhookUrl?.trim() || isTestingWebhook
                        }
                        className="cursor-pointer text-xs"
                      >
                        {isTestingWebhook ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />
                            <span>Testing Webhook...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5 mr-1" />
                            <span>Test Webhook Payload</span>
                          </>
                        )}
                      </Button>
                    </div>

                    {webhookTestResult && (
                      <div
                        className={`p-3 rounded-xl text-xs flex items-start gap-2.5 ${
                          webhookTestResult.success
                            ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40"
                            : "bg-rose-50 dark:bg-rose-950/30 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800/40"
                        }`}
                      >
                        {webhookTestResult.success ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                        )}
                        <span>{webhookTestResult.message}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-[#EAE3D6] dark:border-[#1F2937] bg-white dark:bg-[#111827] flex items-center justify-between sticky bottom-0 z-10">
              <div className="flex items-center gap-2">
                {integrationsSaveSuccess && (
                  <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Settings saved successfully!
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2.5">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsIntegrationsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleSaveIntegrations}
                  disabled={isSavingIntegrations}
                  className="bg-[#FF5A36] text-white hover:bg-[#E04826]"
                >
                  {isSavingIntegrations ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                      Saving...
                    </>
                  ) : (
                    "Save Settings"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
