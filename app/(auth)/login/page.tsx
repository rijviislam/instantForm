import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { LoginForm } from "@/components/auth/LoginForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign in — InstantForm",
  description: "Sign in to your InstantForm account and continue creating beautiful forms.",
};

export default async function LoginPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <AuthLayout
      heading="Welcome back"
      subheading="Sign in to continue building with InstantForm."
    >
      <LoginForm />
    </AuthLayout>
  );
}
