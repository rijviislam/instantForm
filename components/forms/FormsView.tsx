"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Plus, ChevronLeft, ChevronRight, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  FormItem,
  PaginationMeta,
  getFormsApi,
  deleteFormApi,
  duplicateFormApi,
  publishFormApi,
  unpublishFormApi,
} from "@/lib/api-client";
import { FormCard } from "./FormCard";
import { FormFilters, FilterStatus } from "./FormFilters";
import { DeleteConfirmModal } from "./DeleteConfirmModal";
import { EmptyForms } from "./EmptyForms";

export function FormsView() {
  const [forms, setForms] = useState<FormItem[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 1,
  });
  const [totalUserForms, setTotalUserForms] = useState<number | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("ALL");
  const [currentPage, setCurrentPage] = useState(1);

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  // Deletion modal state
  const [formToDelete, setFormToDelete] = useState<FormItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1); // Reset page on new search
    }, 250);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Fetch forms from API
  const fetchForms = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    const res = await getFormsApi({
      search: debouncedSearch,
      status: statusFilter,
      page: currentPage,
      limit: 12,
    });

    if (res.success && res.data) {
      setForms(res.data);
      if (res.pagination) {
        setPagination(res.pagination);
        if (statusFilter === "ALL" && !debouncedSearch) {
          setTotalUserForms(res.pagination.total);
        }
      }
    } else {
      setErrorMessage(res.message || "Failed to load forms.");
    }
    setIsLoading(false);
  }, [debouncedSearch, statusFilter, currentPage]);

  useEffect(() => {
    fetchForms();
  }, [fetchForms]);

  // Auto-dismiss toast
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Status Filter change handler
  const handleStatusFilterChange = (status: FilterStatus) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  // Duplicate handler
  const handleDuplicate = async (form: FormItem) => {
    const res = await duplicateFormApi(form.id);
    if (res.success && res.data) {
      setToastMessage({
        text: `Form "${form.title}" duplicated successfully.`,
        type: "success",
      });
      fetchForms();
    } else {
      setToastMessage({
        text: res.message || "Failed to duplicate form.",
        type: "error",
      });
    }
  };

  // Publish / Unpublish toggle handler
  const handleTogglePublish = async (form: FormItem) => {
    const isCurrentlyPublished = form.status === "PUBLISHED" || form.isPublished;
    const action = isCurrentlyPublished ? unpublishFormApi : publishFormApi;

    // Optimistic update
    setForms((prev) =>
      prev.map((f) =>
        f.id === form.id
          ? {
            ...f,
            status: isCurrentlyPublished ? "DRAFT" : "PUBLISHED",
            isPublished: !isCurrentlyPublished,
          }
          : f
      )
    );

    const res = await action(form.id);
    if (res.success) {
      setToastMessage({
        text: isCurrentlyPublished
          ? `"${form.title}" unpublished.`
          : `"${form.title}" is now published!`,
        type: "success",
      });
    } else {
      // Revert optimistic update
      fetchForms();
      setToastMessage({
        text: res.message || "Failed to update form status.",
        type: "error",
      });
    }
  };

  // Delete handlers
  const handleConfirmDelete = async () => {
    if (!formToDelete) return;
    setIsDeleting(true);

    const res = await deleteFormApi(formToDelete.id);
    if (res.success) {
      setToastMessage({
        text: `"${formToDelete.title}" was deleted.`,
        type: "success",
      });
      setFormToDelete(null);
      fetchForms();
    } else {
      setToastMessage({
        text: res.message || "Failed to delete form.",
        type: "error",
      });
    }
    setIsDeleting(false);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setDebouncedSearch("");
    setStatusFilter("ALL");
    setCurrentPage(1);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-[#1C1917] dark:bg-[#1E293B] text-white shadow-xl text-xs sm:text-sm font-medium border border-transparent dark:border-[#334155] animate-in slide-in-from-bottom-3 duration-200">
          {toastMessage.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-400" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#EAE3D6] dark:border-[#1F2937]">
        <div>
          <h1 className="font-serif-editorial text-3xl sm:text-4xl font-normal text-[#1C1917] dark:text-[#F8FAFC] tracking-tight">
            Forms
          </h1>
          <p className="text-xs sm:text-sm text-[#57534E] dark:text-[#94A3B8] mt-1">
            Create, manage, and organize all your forms in one place.
          </p>
        </div>

        <Link href="/forms/new">
          <Button
            variant="primary"
            size="md"
            iconLeft={<Plus className="w-4 h-4" />}
            className="shadow-md shadow-[#FF5A36]/20"
          >
            New Form
          </Button>
        </Link>
      </div>

      {/* Filters and Search Bar */}
      <FormFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={handleStatusFilterChange}
      />

      {/* Forms Content Area */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div
              key={idx}
              className="rounded-3xl bg-white dark:bg-[#111827] border border-[#EAE3D6] dark:border-[#1F2937] p-6 sm:p-7 card-shadow animate-pulse space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="h-5 w-20 bg-[#FAF8F5] dark:bg-[#1F2937] border border-[#EAE3D6] dark:border-[#374151] rounded-full" />
                <div className="h-5 w-16 bg-[#FAF8F5] dark:bg-[#1F2937] border border-[#EAE3D6] dark:border-[#374151] rounded-full" />
              </div>
              <div className="h-5 w-3/4 bg-[#FAF8F5] dark:bg-[#1F2937] rounded-md" />
              <div className="h-4 w-full bg-[#FAF8F5] dark:bg-[#1F2937] rounded-md" />
              <div className="pt-4 border-t border-[#EAE3D6] dark:border-[#1F2937] flex justify-between">
                <div className="h-4 w-24 bg-[#FAF8F5] dark:bg-[#1F2937] rounded-md" />
                <div className="h-4 w-20 bg-[#FAF8F5] dark:bg-[#1F2937] rounded-md" />
              </div>
            </div>
          ))}
        </div>
      ) : errorMessage ? (
        <div className="rounded-3xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/40 p-8 text-center text-red-700 dark:text-red-400">
          <p className="text-sm font-semibold">{errorMessage}</p>
          <Button variant="outline" size="sm" onClick={fetchForms} className="mt-4">
            Try again
          </Button>
        </div>
      ) : forms.length === 0 ? (
        totalUserForms === 0 && !debouncedSearch && statusFilter === "ALL" ? (
          <EmptyForms type="first-time" />
        ) : (
          <EmptyForms type="search-empty" onClearFilters={handleClearFilters} />
        )
      ) : (
        <div className="space-y-8">
          {/* Form Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {forms.map((form) => (
              <FormCard
                key={form.id}
                form={form}
                onDuplicate={handleDuplicate}
                onTogglePublish={handleTogglePublish}
                onDeleteRequest={(f) => setFormToDelete(f)}
              />
            ))}
          </div>

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between pt-6 border-t border-[#EAE3D6] dark:border-[#1F2937] text-xs sm:text-sm text-[#78716C] dark:text-[#94A3B8]">
              <span>
                Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
                {pagination.total} forms
              </span>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  iconLeft={<ChevronLeft className="w-3.5 h-3.5" />}
                >
                  Previous
                </Button>

                <span className="px-2 font-semibold text-[#1C1917] dark:text-[#F8FAFC]">
                  {currentPage} / {pagination.totalPages}
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage >= pagination.totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))}
                  iconRight={<ChevronRight className="w-3.5 h-3.5" />}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!formToDelete}
        formTitle={formToDelete?.title || "Untitled Form"}
        isDeleting={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setFormToDelete(null)}
      />
    </div>
  );
}
