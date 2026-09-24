import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { RegisterForm } from "@/components/auth/RegisterForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create your account — InstantForm",
  description: "Create your InstantForm account to build beautiful forms in minutes.",
};

export default async function RegisterPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <AuthLayout
      heading="Create your InstantForm account"
      subheading="Build beautiful forms in minutes."
    >
      <RegisterForm />
    </AuthLayout>
  );
}
