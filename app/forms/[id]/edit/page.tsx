import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { FormBuilder } from "@/components/builder/FormBuilder";
import { getFormByIdApi, FormItem } from "@/lib/api-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Form Builder — InstantForm",
  description: "Visual drag-and-drop form editor",
};

interface EditFormPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditFormPage({ params }: EditFormPageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const { id } = await params;
  const res = await getFormByIdApi(id);

  if (!res.success || !res.data) {
    // If not found or API down, render a fallback default form with user's ID
    const fallbackForm: FormItem = {
      id,
      slug: `form-${id.substring(0, 8)}`,
      title: "Untitled Form",
      description: null,
      status: "DRAFT",
      isPublished: false,
      style: "classic",
      fields: [],
      userId: session.user.id || "",
      responsesCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return <FormBuilder initialForm={fallbackForm} />;
  }

  return <FormBuilder initialForm={res.data} />;
}
