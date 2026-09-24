import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/dashboard/AppShell";
import { FormResponsesView } from "@/components/responses/FormResponsesView";
import { getFormByIdApi } from "@/lib/api-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Form Responses & Analytics — InstantForm",
  description: "View submissions and analytics for your form",
};

interface FormResponsesPageProps {
  params: Promise<{ id: string }>;
}

export default async function FormResponsesPage({
  params,
}: FormResponsesPageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const { id } = await params;
  const apiToken = (session as unknown as { apiToken?: string })?.apiToken;
  const res = await getFormByIdApi(id, apiToken);

  const formTitle = res.data?.title || "Form Responses";
  const formSlug = res.data?.slug || id;

  return (
    <AppShell user={session.user}>
      <FormResponsesView
        formId={id}
        formTitle={formTitle}
        formSlug={formSlug}
      />
    </AppShell>
  );
}
