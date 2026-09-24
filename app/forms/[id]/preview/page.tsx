import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/dashboard/AppShell";
import Link from "next/link";
import { ArrowLeft, Edit3, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Preview Form — InstantForm",
  description: "Preview form layout and styling",
};

interface PreviewFormPageProps {
  params: Promise<{ id: string }>;
}

export default async function PreviewFormPage({ params }: PreviewFormPageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const { id } = await params;

  return (
    <AppShell user={session.user}>
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
        {/* Navigation Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#EAE3D6]">
          <div className="flex items-center gap-3">
            <Link
              href="/forms"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#57534E] hover:text-[#1C1917] px-3.5 py-1.5 rounded-full bg-white border border-[#EAE3D6] hover:bg-[#FAF8F5] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Forms</span>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Link href={`/forms/${id}/edit`}>
              <Button
                variant="primary"
                size="sm"
                iconLeft={<Edit3 className="w-3.5 h-3.5" />}
                className="shadow-md shadow-[#FF5A36]/20"
              >
                Edit Form
              </Button>
            </Link>
          </div>
        </div>

        {/* Preview Shell Container */}
        <div className="max-w-xl mx-auto rounded-3xl bg-white border border-[#EAE3D6] p-8 sm:p-12 card-shadow space-y-6">
          <div className="text-center space-y-2 border-b border-[#F5F2EB] pb-6">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#FFF0EB] text-[#FF5A36] border border-[#FFD8CC]">
              <Sparkles className="w-3 h-3" /> Live Preview
            </span>
            <h1 className="font-semibold text-2xl sm:text-3xl text-[#1C1917] tracking-tight">
              Preview Mode
            </h1>
            <p className="text-xs text-[#78716C]">
              This is a live preview shell for form ID <code className="font-mono text-[11px]">{id}</code>.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#EAE3D6] text-center space-y-3">
            <p className="text-xs text-[#57534E]">
              Public response submission engine and standalone form rendering will be activated when the form builder and public sharing are connected.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
