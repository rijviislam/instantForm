import React from "react";
import Link from "next/link";

export default function PublicFormLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full min-h-screen selection:bg-[#FF5A36]/20 selection:text-[#FF5A36]">
      {children}
    </div>
  );
}
