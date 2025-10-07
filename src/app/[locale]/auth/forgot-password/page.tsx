import { ForgotPasswordForm } from "@/components/forgot-password-form";
import BottomNav from "@/components/layout/bottom-nav";
import { getTranslations } from "next-intl/server";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.forgotPassword" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <ForgotPasswordForm />
      </div>
      <BottomNav />
    </div>
  );
}
