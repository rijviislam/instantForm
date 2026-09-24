"use client";

import React, { useState } from "react";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function LogoutButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <Button
      variant="secondary"
      size="md"
      onClick={handleLogout}
      disabled={isLoading}
      iconLeft={<LogOut className="w-4 h-4 text-[#E44825]" />}
      className="text-[#E44825] hover:bg-[#FFF0EB] hover:border-[#FFD8CC]"
    >
      {isLoading ? "Signing out..." : "Sign out"}
    </Button>
  );
}
