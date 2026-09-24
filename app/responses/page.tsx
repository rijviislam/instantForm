import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/dashboard/AppShell";
import { GlobalResponsesView } from "@/components/responses/GlobalResponsesView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Responses & Analytics — InstantForm",
  description: "View and analyze form submissions in real time",
};

export default async function ResponsesPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <AppShell user={session.user}>
      <GlobalResponsesView />
    </AppShell>
  );
}
