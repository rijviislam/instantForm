import React from "react";
import { getPublicFormApi } from "@/lib/api-client";
import { PublicFormRenderer } from "@/components/public-form/PublicFormRenderer";
import type { Metadata } from "next";

interface PublicFormPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PublicFormPageProps): Promise<Metadata> {
  const { slug } = await params;
  const res = await getPublicFormApi(slug);

  if (res.success && res.data) {
    return {
      title: `${res.data.title} — InstantForm`,
      description: res.data.description || "Complete this form on InstantForm",
    };
  }

  return {
    title: "Form — InstantForm",
  };
}

export default async function PublicFormPage({ params }: PublicFormPageProps) {
  const { slug } = await params;
  const res = await getPublicFormApi(slug);

  if (!res.success || !res.data) {
    return (
      <div className="w-full max-w-md rounded-3xl bg-white dark:bg-[#111827] border border-[#EAE3D6] dark:border-[#1F2937] p-8 sm:p-12 text-center card-shadow space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-[#F5F2EB] dark:bg-[#161F30] border border-[#EAE3D6] dark:border-[#293548] text-[#78716C] dark:text-[#94A3B8] flex items-center justify-center mx-auto mb-2">
          <span className="text-xl font-bold">404</span>
        </div>
        <h1 className="text-2xl font-semibold text-[#1C1917] dark:text-[#F8FAFC]">
          Form Not Found
        </h1>
        <p className="text-xs sm:text-sm text-[#78716C] dark:text-[#94A3B8] max-w-xs mx-auto leading-relaxed">
          This form is either unpublished, private, or does not exist.
        </p>
      </div>
    );
  }

  return <PublicFormRenderer form={res.data} />;
}
