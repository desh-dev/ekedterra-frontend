import { LoginForm } from "@/components/login-form";
import { redirect } from "@/i18n/routing";
import { createClient } from "@/lib/supabase/server";

interface PageProps {
  params: {
    locale: string;
  };
}

const metadata = (locale: string) => {
  if (locale === "en") {
    return {
      title: "Log In",
      description: "Log in to Ekedterra to keep track of real estate.",
    };
  }
  return {
    title: "Connexion",
    description:
      "Connectez-vous sur Ekedterra pour suivre les biens immobiliers.",
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
  } catch (error: any) {
    throw error;
  }
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}
