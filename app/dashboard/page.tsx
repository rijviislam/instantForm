import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/dashboard/AppShell";
import { DashboardView } from "@/components/dashboard/DashboardView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard — InstantForm",
  description: "Create a form in seconds with InstantForm Dashboard",
};

export default async function DashboardPage() {
  const session = await auth();

  // Route protection
  if (!session?.user) {
    redirect("/login");
  }

  const apiToken = (session as unknown as { apiToken?: string })?.apiToken;

  return (
    <AppShell user={session.user}>
      <DashboardView user={session.user} apiToken={apiToken} />
    </AppShell>
  );
}
