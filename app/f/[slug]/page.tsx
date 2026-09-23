import React from "react";
import { notFound } from "next/navigation";
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
      <div className="w-full max-w-md rounded-3xl bg-white dark:bg-[#1C1917] border border-[#E7E2D8] dark:border-[#2E2824] p-8 sm:p-12 text-center shadow-lg space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-[#F5F2EB] dark:bg-[#24201D] border border-[#E7E2D8] dark:border-[#2E2824] text-[#78716C] dark:text-[#A8A29E] flex items-center justify-center mx-auto mb-2">
          <span className="text-xl font-bold">404</span>
        </div>
        <h1 className="font-serif-editorial text-2xl font-normal text-[#1C1917] dark:text-[#FBF9F5]">
          Form Not Found
        </h1>
        <p className="text-xs sm:text-sm text-[#78716C] dark:text-[#A8A29E] max-w-xs mx-auto leading-relaxed">
          This form is either unpublished, private, or does not exist.
        </p>
      </div>
    );
  }

  return <PublicFormRenderer form={res.data} />;
}
