"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  FormItem,
  FormField,
  FormFieldType,
  FormStyle,
  updateFormApi,
  publishFormApi,
  unpublishFormApi,
} from "@/lib/api-client";
import { FormTheme, resolveFormTheme } from "@/lib/form-theme";
import { BuilderTopBar, SaveState, ViewportMode } from "./BuilderTopBar";
import { FieldLibrary, FIELD_DEFINITIONS } from "./FieldLibrary";
import { BuilderCanvas } from "./BuilderCanvas";
import { FieldSettingsPanel } from "./FieldSettingsPanel";
import { BuilderPreview } from "./BuilderPreview";
import { DynamicFontLoader } from "./DynamicFontLoader";
import { Plus, Sliders } from "lucide-react";

interface FormBuilderProps {
  initialForm: FormItem;
}

export function FormBuilder({ initialForm }: FormBuilderProps) {
  const initialResolved = {
    ...initialForm,
    theme: resolveFormTheme(initialForm.theme, initialForm.style as any),
  };

  const [form, setForm] = useState<FormItem>(initialResolved);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(
    initialForm.fields && initialForm.fields.length > 0
      ? initialForm.fields[0].id
      : null
  );
  const [selectedElement, setSelectedElement] = useState<
    "form" | "container" | "button" | "style" | null
  >(null);
  const [inspectorTab, setInspectorTab] = useState<"field" | "form" | "style">(
    initialForm.fields && initialForm.fields.length > 0 ? "field" : "style"
  );

  const [saveState, setSaveState] = useState<SaveState>("saved");
  const [viewport, setViewport] = useState<ViewportMode>("desktop");
  const [isPreview, setIsPreview] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  // Mobile / Tablet drawer toggles
  const [showLeftDrawer, setShowLeftDrawer] = useState(false);
  const [showRightDrawer, setShowRightDrawer] = useState(false);

  // Undo / Redo History Stack
  const [history, setHistory] = useState<FormItem[]>([initialResolved]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const isUndoRedoAction = useRef(false);

  // Autosave reference
  const isDirtyRef = useRef(false);
  const formRef = useRef(form);
  formRef.current = form;

  const pushHistory = useCallback((nextForm: FormItem) => {
    if (isUndoRedoAction.current) {
      isUndoRedoAction.current = false;
      return;
    }
    setHistory((prev) => {
      const sliced = prev.slice(0, historyIndex + 1);
      const nextStack = [...sliced, nextForm];
      if (nextStack.length > 30) nextStack.shift();
      return nextStack;
    });
    setHistoryIndex((prev) => Math.min(prev + 1, 29));
  }, [historyIndex]);

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      isUndoRedoAction.current = true;
      const targetState = history[historyIndex - 1];
      setHistoryIndex((idx) => idx - 1);
      setForm(targetState);
      isDirtyRef.current = true;
    }
  }, [historyIndex, history]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      isUndoRedoAction.current = true;
      const targetState = history[historyIndex + 1];
      setHistoryIndex((idx) => idx + 1);
      setForm(targetState);
      isDirtyRef.current = true;
    }
  }, [historyIndex, history]);

  // Global Undo / Redo keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input or textarea
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "z") {
        e.preventDefault();
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "y") {
        e.preventDefault();
        handleRedo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleUndo, handleRedo]);

  // Debounced auto-sync to backend
  useEffect(() => {
    if (!isDirtyRef.current) return;

    setSaveState("unsaved");
    const timer = setTimeout(async () => {
      setSaveState("saving");
      try {
        const current = formRef.current;
        const res = await updateFormApi(current.id, {
          title: current.title,
          description: current.description,
          style: current.style,
          theme: current.theme,
          fields: current.fields,
        });

        if (res.success) {
          setSaveState("saved");
          isDirtyRef.current = false;
        } else {
          setSaveState("error");
        }
      } catch (err) {
        setSaveState("error");
      }
    }, 700);

    return () => clearTimeout(timer);
  }, [form]);

  const markDirty = () => {
    isDirtyRef.current = true;
  };

  // Manual save trigger (e.g. on error retry)
  const handleManualSave = async () => {
    setSaveState("saving");
    try {
      const res = await updateFormApi(form.id, {
        title: form.title,
        description: form.description,
        style: form.style,
        theme: form.theme,
        fields: form.fields,
      });

      if (res.success) {
        setSaveState("saved");
        isDirtyRef.current = false;
      } else {
        setSaveState("error");
      }
    } catch (err) {
      setSaveState("error");
    }
  };

  // Add field to form
  const handleAddField = (type: FormFieldType, defaultProps?: Record<string, any>) => {
    const def = FIELD_DEFINITIONS.find((d) => d.type === type);
    const newFieldId = `field_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;

    const newField: FormField = {
      id: newFieldId,
      type,
      label: def?.defaultLabel || "Question",
      required: false,
      options:
        type === "single_choice" || type === "multiple_choice" || type === "dropdown"
          ? ["Option 1", "Option 2", "Option 3"]
          : undefined,
      ...(defaultProps || {}),
    };

    const currentFields = form.fields || [];
    const updated: FormItem = {
      ...form,
      fields: [...currentFields, newField],
    };
    setForm(updated);
    pushHistory(updated);

    setSelectedFieldId(newFieldId);
    setSelectedElement(null);
    setInspectorTab("field");
    setShowLeftDrawer(false);
    markDirty();
  };

  // Update field configuration
  const handleUpdateField = (fieldId: string, updates: Partial<FormField>) => {
    const updated: FormItem = {
      ...formRef.current,
      fields: (formRef.current.fields || []).map((f) =>
        f.id === fieldId ? { ...f, ...updates } : f
      ),
    };
    setForm(updated);
    pushHistory(updated);
    markDirty();
  };

  // Duplicate a field
  const handleDuplicateField = (fieldId: string) => {
    const current = formRef.current;
    const target = current.fields.find((f) => f.id === fieldId);
    if (!target) return;

    const newId = `field_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
    const clonedField: FormField = {
      ...target,
      id: newId,
      label: `${target.label} (Copy)`,
    };

    const idx = current.fields.findIndex((f) => f.id === fieldId);
    const nextFields = [...current.fields];
    nextFields.splice(idx + 1, 0, clonedField);
    const updated: FormItem = { ...current, fields: nextFields };

    setForm(updated);
    pushHistory(updated);
    setSelectedFieldId(newId);
    setSelectedElement(null);
    setInspectorTab("field");
    markDirty();
  };

  // Delete a field
  const handleDeleteField = (fieldId: string) => {
    const current = formRef.current;
    const nextFields = current.fields.filter((f) => f.id !== fieldId);
    const updated: FormItem = { ...current, fields: nextFields };

    setForm(updated);
    pushHistory(updated);

    if (selectedFieldId === fieldId) {
      const remaining = current.fields.filter((f) => f.id !== fieldId);
      setSelectedFieldId(remaining.length > 0 ? remaining[0].id : null);
      if (remaining.length === 0) {
        setInspectorTab("style");
      }
    }
    markDirty();
  };

  // Move field order up or down
  const handleMoveField = (fieldId: string, direction: "up" | "down") => {
    const current = formRef.current;
    const fields = [...current.fields];
    const index = fields.findIndex((f) => f.id === fieldId);
    if (index === -1) return;

    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= fields.length) return;

    const temp = fields[index];
    fields[index] = fields[targetIndex];
    fields[targetIndex] = temp;

    const updated: FormItem = { ...current, fields };
    setForm(updated);
    pushHistory(updated);
    markDirty();
  };

  // Reorder fields directly via drag and drop
  const handleReorderFields = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;
    const current = formRef.current;
    const fields = [...current.fields];
    const [moved] = fields.splice(fromIndex, 1);
    fields.splice(toIndex, 0, moved);

    const updated: FormItem = { ...current, fields };
    setForm(updated);
    pushHistory(updated);
    markDirty();
  };

  // Update form settings (title, description, style, theme)
  const handleUpdateForm = (updates: {
    title?: string;
    description?: string | null;
    style?: FormStyle;
    theme?: FormTheme;
  }) => {
    const updated: FormItem = {
      ...formRef.current,
      ...updates,
    };
    setForm(updated);
    pushHistory(updated);
    markDirty();
  };

  // Visual element selection in canvas
  const handleSelectElement = (element: "form" | "container" | "button" | "style") => {
    setSelectedElement(element);
    if (element === "form") {
      setInspectorTab("form");
    } else if (element === "container" || element === "button" || element === "style") {
      setInspectorTab("style");
    }
    if (window.innerWidth < 1024) {
      setShowRightDrawer(true);
    }
  };

  // Publish / Unpublish Toggle
  const handlePublishToggle = async () => {
    setIsPublishing(true);
    const isCurrentlyPublished = form.status === "PUBLISHED" || form.isPublished;

    try {
      await updateFormApi(form.id, {
        title: form.title,
        description: form.description,
        style: form.style,
        theme: form.theme,
        fields: form.fields,
      });

      const res = isCurrentlyPublished
        ? await unpublishFormApi(form.id)
        : await publishFormApi(form.id);

      if (res.success && res.data) {
        setForm((prev) => ({
          ...prev,
          status: isCurrentlyPublished ? "DRAFT" : "PUBLISHED",
          isPublished: !isCurrentlyPublished,
        }));
      }
    } catch (err) {
      console.error("Publish toggle failed", err);
    }
    setIsPublishing(false);
  };

  const selectedField =
    form.fields.find((f) => f.id === selectedFieldId) || null;

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#FAF8F5]" data-lenis-prevent="true">
      {/* Dynamic Font Loader */}
      <DynamicFontLoader theme={form.theme} />

      {/* Top Bar */}
      <BuilderTopBar
        formId={form.id}
        slug={form.slug}
        title={form.title}
        status={form.status}
        saveState={saveState}
        viewport={viewport}
        isPreview={isPreview}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onTitleChange={(title) => handleUpdateForm({ title })}
        onViewportChange={setViewport}
        onTogglePreview={() => setIsPreview(!isPreview)}
        onPublishToggle={handlePublishToggle}
        onManualSave={handleManualSave}
        isPublishing={isPublishing}
      />

      {/* Main 3-Column Working Layout */}
      <div className="flex flex-1 min-h-0 overflow-hidden relative" data-lenis-prevent="true">
        {/* Left: Field Library */}
        <div className="hidden lg:flex flex-col h-full w-80 shrink-0 min-h-0" data-lenis-prevent="true">
          <FieldLibrary onAddField={handleAddField} />
        </div>

        {/* Center: Live Form Canvas */}
        <BuilderCanvas
          title={form.title}
          description={form.description}
          style={form.style}
          theme={form.theme}
          fields={form.fields}
          selectedFieldId={selectedFieldId}
          viewport={viewport}
          onSelectField={(id) => {
            setSelectedFieldId(id);
            setInspectorTab("field");
            if (window.innerWidth < 1024) {
              setShowRightDrawer(true);
            }
          }}
          onUpdateField={handleUpdateField}
          onDuplicateField={handleDuplicateField}
          onDeleteField={handleDeleteField}
          onMoveField={handleMoveField}
          onReorderFields={handleReorderFields}
          onOpenFieldLibrary={() => setShowLeftDrawer(true)}
        />

        {/* Right: Field & Visual Style Settings Panel */}
        <div className="hidden lg:flex flex-col h-full w-80 shrink-0 min-h-0" data-lenis-prevent="true">
          <FieldSettingsPanel
            selectedField={selectedField}
            formTitle={form.title}
            formDescription={form.description}
            formStyle={form.style}
            formTheme={form.theme}
            activeTab={inspectorTab}
            selectedElement={selectedElement}
            onTabChange={setInspectorTab}
            onUpdateField={handleUpdateField}
            onUpdateForm={handleUpdateForm}
            onUpdateTheme={(theme) => handleUpdateForm({ theme })}
          />
        </div>

        {/* Mobile Floating Drawer Toggles */}
        <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-[#1C1917] text-white p-1.5 rounded-2xl shadow-xl border border-white/10">
          <button
            type="button"
            onClick={() => setShowLeftDrawer(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold hover:bg-white/10 transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-[#FF5A36]" />
            <span>Add Field</span>
          </button>

          <div className="h-4 w-px bg-white/20" />

          <button
            type="button"
            onClick={() => setShowRightDrawer(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold hover:bg-white/10 transition-colors"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Settings & Style</span>
          </button>
        </div>

        {/* Mobile Left Drawer (Field Library) */}
        {showLeftDrawer && (
          <div className="lg:hidden fixed inset-0 z-50 flex" data-lenis-prevent="true">
            <div
              className="fixed inset-0 bg-black/40 backdrop-blur-xs"
              onClick={() => setShowLeftDrawer(false)}
            />
            <div className="relative w-4/5 max-w-sm bg-white h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200 min-h-0 flex flex-col">
              <FieldLibrary onAddField={handleAddField} />
            </div>
          </div>
        )}

        {/* Mobile Right Drawer (Field Settings) */}
        {showRightDrawer && (
          <div className="lg:hidden fixed inset-0 z-50 flex justify-end" data-lenis-prevent="true">
            <div
              className="fixed inset-0 bg-black/40 backdrop-blur-xs"
              onClick={() => setShowRightDrawer(false)}
            />
            <div className="relative w-4/5 max-w-sm bg-white h-full shadow-2xl z-10 animate-in slide-in-from-right duration-200 min-h-0 flex flex-col">
              <FieldSettingsPanel
                selectedField={selectedField}
                formTitle={form.title}
                formDescription={form.description}
                formStyle={form.style}
                formTheme={form.theme}
                activeTab={inspectorTab}
                selectedElement={selectedElement}
                onTabChange={setInspectorTab}
                onUpdateField={handleUpdateField}
                onUpdateForm={handleUpdateForm}
                onUpdateTheme={(theme) => handleUpdateForm({ theme })}
              />
            </div>
          </div>
        )}
      </div>

      {/* Respondent Preview Simulation Overlay */}
      {isPreview && (
        <BuilderPreview
          title={form.title}
          description={form.description}
          style={form.style}
          theme={form.theme}
          fields={form.fields}
          viewport={viewport}
          onClose={() => setIsPreview(false)}
        />
      )}
    </div>
  );
}
