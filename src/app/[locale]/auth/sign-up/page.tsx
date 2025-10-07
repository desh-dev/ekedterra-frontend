import { SignUpForm } from "@/components/sign-up-form";
import { redirect } from "@/i18n/routing";
import { createClient } from "@/lib/supabase/server";

interface PageProps {
  params: Promise<{ locale: string }>;
}

const metadata = (locale: string) => {
  if (locale === "en") {
    return {
      title: "Sign Up",
      description:
        "Join the Ekedterra community and enjoy stress-free real estate search.",
    };
  }
  return {
    title: "Inscription",
    description:
      "Rejoignez la communauté Ekedterra et profitez de la recherche de biens immobiliers sans stress.",
  };
};

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  return metadata(locale);
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getClaims();
    if (data?.claims) {
      redirect({ href: "/", locale });
    }
  } catch (error: unknown) {
    throw error;
  }
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SignUpForm />
      </div>
    </div>
  );
}
