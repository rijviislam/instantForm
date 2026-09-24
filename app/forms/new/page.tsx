import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/dashboard/AppShell";
import { NewFormSelector } from "@/components/forms/NewFormSelector";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "New Form — InstantForm",
  description: "Create a new form with InstantForm",
};

export default async function NewFormPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <AppShell user={session.user}>
      <NewFormSelector />
    </AppShell>
  );
}
