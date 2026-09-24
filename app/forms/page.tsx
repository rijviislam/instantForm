import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/dashboard/AppShell";
import { FormsView } from "@/components/forms/FormsView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forms — InstantForm",
  description: "Create, manage, and organize all your forms in one place.",
};

export default async function FormsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <AppShell user={session.user}>
      <FormsView />
    </AppShell>
  );
}
