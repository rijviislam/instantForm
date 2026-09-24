import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/dashboard/AppShell";
import { TemplateGallery } from "@/components/templates/TemplateGallery";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Templates — InstantForm",
  description: "Browse curated designer templates for surveys, feedback, and leads.",
};

export default async function TemplatesPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <AppShell user={session.user}>
      <TemplateGallery />
    </AppShell>
  );
}
