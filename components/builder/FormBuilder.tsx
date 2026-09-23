"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { randomUUID } from "crypto";
import {
  FormItem,
  FormField,
  FormFieldType,
  FormStyle,
  updateFormApi,
  publishFormApi,
  unpublishFormApi,
} from "@/lib/api-client";
import { BuilderTopBar, SaveState, ViewportMode } from "./BuilderTopBar";
import { FieldLibrary, FIELD_DEFINITIONS } from "./FieldLibrary";
import { BuilderCanvas } from "./BuilderCanvas";
import { FieldSettingsPanel } from "./FieldSettingsPanel";
import { BuilderPreview } from "./BuilderPreview";
import { Plus, Sliders, Layers } from "lucide-react";

interface FormBuilderProps {
  initialForm: FormItem;
}

export function FormBuilder({ initialForm }: FormBuilderProps) {
  const [form, setForm] = useState<FormItem>(initialForm);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(
    initialForm.fields && initialForm.fields.length > 0
      ? initialForm.fields[0].id
      : null
  );

  const [saveState, setSaveState] = useState<SaveState>("saved");
  const [viewport, setViewport] = useState<ViewportMode>("desktop");
  const [isPreview, setIsPreview] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  // Mobile / Tablet drawer toggles
  const [showLeftDrawer, setShowLeftDrawer] = useState(false);
  const [showRightDrawer, setShowRightDrawer] = useState(false);

  // Autosave reference
  const isDirtyRef = useRef(false);
  const formRef = useRef(form);
  formRef.current = form;

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
  const handleAddField = (type: FormFieldType) => {
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
    };

    setForm((prev) => {
      const currentFields = prev.fields || [];
      return {
        ...prev,
        fields: [...currentFields, newField],
      };
    });

    setSelectedFieldId(newFieldId);
    setShowLeftDrawer(false);
    markDirty();
  };

  // Update field configuration
  const handleUpdateField = (fieldId: string, updates: Partial<FormField>) => {
    setForm((prev) => ({
      ...prev,
      fields: (prev.fields || []).map((f) =>
        f.id === fieldId ? { ...f, ...updates } : f
      ),
    }));
    markDirty();
  };

  // Duplicate a field
  const handleDuplicateField = (fieldId: string) => {
    const target = form.fields.find((f) => f.id === fieldId);
    if (!target) return;

    const newId = `field_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
    const clonedField: FormField = {
      ...target,
      id: newId,
      label: `${target.label} (Copy)`,
    };

    setForm((prev) => {
      const idx = prev.fields.findIndex((f) => f.id === fieldId);
      const nextFields = [...prev.fields];
      nextFields.splice(idx + 1, 0, clonedField);
      return { ...prev, fields: nextFields };
    });

    setSelectedFieldId(newId);
    markDirty();
  };

  // Delete a field
  const handleDeleteField = (fieldId: string) => {
    setForm((prev) => {
      const nextFields = prev.fields.filter((f) => f.id !== fieldId);
      return { ...prev, fields: nextFields };
    });

    if (selectedFieldId === fieldId) {
      const remaining = form.fields.filter((f) => f.id !== fieldId);
      setSelectedFieldId(remaining.length > 0 ? remaining[0].id : null);
    }
    markDirty();
  };

  // Move field order up or down
  const handleMoveField = (fieldId: string, direction: "up" | "down") => {
    const fields = [...form.fields];
    const index = fields.findIndex((f) => f.id === fieldId);
    if (index === -1) return;

    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= fields.length) return;

    const temp = fields[index];
    fields[index] = fields[targetIndex];
    fields[targetIndex] = temp;

    setForm((prev) => ({ ...prev, fields }));
    markDirty();
  };

  // Update form settings (title, description, style)
  const handleUpdateForm = (updates: {
    title?: string;
    description?: string | null;
    style?: FormStyle;
  }) => {
    setForm((prev) => ({
      ...prev,
      ...updates,
    }));
    markDirty();
  };

  // Publish / Unpublish Toggle
  const handlePublishToggle = async () => {
    setIsPublishing(true);
    const isCurrentlyPublished = form.status === "PUBLISHED" || form.isPublished;

    try {
      // First ensure latest changes are saved
      await updateFormApi(form.id, {
        title: form.title,
        description: form.description,
        style: form.style,
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
    <div className="flex flex-col h-screen overflow-hidden bg-white dark:bg-[#1C1917]">
      {/* Top Bar */}
      <BuilderTopBar
        formId={form.id}
        slug={form.slug}
        title={form.title}
        status={form.status}
        saveState={saveState}
        viewport={viewport}
        isPreview={isPreview}
        onTitleChange={(title) => handleUpdateForm({ title })}
        onViewportChange={setViewport}
        onTogglePreview={() => setIsPreview(!isPreview)}
        onPublishToggle={handlePublishToggle}
        onManualSave={handleManualSave}
        isPublishing={isPublishing}
      />

      {/* Main 3-Column Working Layout */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left: Field Library */}
        <div className="hidden lg:block h-full">
          <FieldLibrary onAddField={handleAddField} />
        </div>

        {/* Center: Live Form Canvas */}
        <BuilderCanvas
          title={form.title}
          description={form.description}
          style={form.style}
          fields={form.fields}
          selectedFieldId={selectedFieldId}
          viewport={viewport}
          onSelectField={(id) => {
            setSelectedFieldId(id);
            // On mobile open settings drawer
            if (window.innerWidth < 1024) {
              setShowRightDrawer(true);
            }
          }}
          onUpdateField={handleUpdateField}
          onDuplicateField={handleDuplicateField}
          onDeleteField={handleDeleteField}
          onMoveField={handleMoveField}
          onOpenFieldLibrary={() => setShowLeftDrawer(true)}
        />

        {/* Right: Field Settings Panel */}
        <div className="hidden lg:block h-full">
          <FieldSettingsPanel
            selectedField={selectedField}
            formTitle={form.title}
            formDescription={form.description}
            formStyle={form.style}
            onUpdateField={handleUpdateField}
            onUpdateForm={handleUpdateForm}
          />
        </div>

        {/* Mobile Floating Drawer Toggles */}
        <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-[#1C1917] dark:bg-white text-white dark:text-[#1C1917] p-1.5 rounded-2xl shadow-xl border border-white/10">
          <button
            type="button"
            onClick={() => setShowLeftDrawer(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold hover:bg-white/10 dark:hover:bg-black/10 transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-[#FF5A36]" />
            <span>Add Field</span>
          </button>

          <div className="h-4 w-px bg-white/20 dark:bg-black/20" />

          <button
            type="button"
            onClick={() => setShowRightDrawer(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold hover:bg-white/10 dark:hover:bg-black/10 transition-colors"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Settings</span>
          </button>
        </div>

        {/* Mobile Left Drawer (Field Library) */}
        {showLeftDrawer && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-xs"
              onClick={() => setShowLeftDrawer(false)}
            />
            <div className="relative w-4/5 max-w-sm bg-white dark:bg-[#1C1917] h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
              <FieldLibrary onAddField={handleAddField} />
            </div>
          </div>
        )}

        {/* Mobile Right Drawer (Field Settings) */}
        {showRightDrawer && (
          <div className="lg:hidden fixed inset-0 z-50 flex justify-end">
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-xs"
              onClick={() => setShowRightDrawer(false)}
            />
            <div className="relative w-4/5 max-w-sm bg-white dark:bg-[#1C1917] h-full shadow-2xl z-10 animate-in slide-in-from-right duration-200">
              <FieldSettingsPanel
                selectedField={selectedField}
                formTitle={form.title}
                formDescription={form.description}
                formStyle={form.style}
                onUpdateField={handleUpdateField}
                onUpdateForm={handleUpdateForm}
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
          fields={form.fields}
          viewport={viewport}
          onClose={() => setIsPreview(false)}
        />
      )}
    </div>
  );
}
