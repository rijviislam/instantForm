import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/dashboard/AppShell";
import { LogoutButton } from "@/components/dashboard/LogoutButton";
import { User, Mail, Shield } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings — InstantForm",
  description: "Account settings and workspace preferences",
};

export default async function SettingsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const user = session.user;

  return (
    <AppShell user={user}>
      <div className="max-w-4xl space-y-8 animate-in fade-in duration-300">
        {/* Header */}
        <div className="pb-6 border-b border-[#E7E2D8] dark:border-[#1F2937]">
          <h1 className="font-serif-editorial text-3xl sm:text-4xl font-normal text-[#1C1917] dark:text-[#F8FAFC] tracking-tight">
            Account & Settings
          </h1>
          <p className="text-sm text-[#57534E] dark:text-[#94A3B8] mt-1">
            Manage your personal profile, security preferences, and workspace settings.
          </p>
        </div>

        {/* Profile Card */}
        <div className="rounded-3xl bg-white dark:bg-[#111827] border border-[#E7E2D8] dark:border-[#1F2937] p-6 sm:p-8 shadow-2xs">
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-[#F4EFE6] dark:border-[#1F2937]">
            {user.image ? (
              <img
                src={user.image}
                alt={user.name || "User avatar"}
                className="w-16 h-16 rounded-full object-cover border-2 border-[#FFD8CC] dark:border-[#FF5A36]/30"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-[#FFF0EB] dark:bg-[#FF5A36]/15 border border-[#FFD8CC] dark:border-[#FF5A36]/30 text-[#FF5A36] dark:text-[#FF6B4A] font-bold text-2xl flex items-center justify-center">
                {user.name ? user.name[0].toUpperCase() : <User className="w-8 h-8" />}
              </div>
            )}
            <div>
              <h2 className="text-lg font-bold text-[#1C1917] dark:text-[#F8FAFC]">{user.name || "Creator"}</h2>
              <p className="text-xs sm:text-sm text-[#78716C] dark:text-[#94A3B8]">{user.email}</p>
            </div>
          </div>

          <div className="space-y-4 max-w-lg">
            <div>
              <label className="block text-xs font-semibold text-[#78716C] dark:text-[#94A3B8] mb-1">
                Full Name
              </label>
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FAF8F5] dark:bg-[#161F30] border border-[#E7E2D8] dark:border-[#293548] text-sm text-[#1C1917] dark:text-[#F8FAFC]">
                <User className="w-4 h-4 text-[#78716C] dark:text-[#94A3B8]" />
                <span>{user.name || "—"}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#78716C] dark:text-[#94A3B8] mb-1">
                Email Address
              </label>
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FAF8F5] dark:bg-[#161F30] border border-[#E7E2D8] dark:border-[#293548] text-sm text-[#1C1917] dark:text-[#F8FAFC]">
                <Mail className="w-4 h-4 text-[#78716C] dark:text-[#94A3B8]" />
                <span>{user.email}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#78716C] dark:text-[#94A3B8] mb-1">
                Session Security
              </label>
              <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-[#FAF8F5] dark:bg-[#161F30] border border-[#E7E2D8] dark:border-[#293548] text-sm">
                <span className="flex items-center gap-2 text-[#1C1917] dark:text-[#F8FAFC]">
                  <Shield className="w-4 h-4 text-[#15803D] dark:text-emerald-400" />
                  <span>Verified JWT Session</span>
                </span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#EBF9F1] dark:bg-emerald-950/40 text-[#15803D] dark:text-emerald-400 border border-[#DCFCE7] dark:border-emerald-800/40">
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Security & Sign Out Section */}
        <div className="rounded-3xl bg-white dark:bg-[#111827] border border-[#E7E2D8] dark:border-[#1F2937] p-6 sm:p-8 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-[#1C1917] dark:text-[#F8FAFC]">Sign out of InstantForm</h3>
            <p className="text-xs sm:text-sm text-[#78716C] dark:text-[#94A3B8] mt-0.5">
              Securely invalidate your current active session on this device.
            </p>
          </div>

          <LogoutButton />
        </div>
      </div>
    </AppShell>
  );
}
