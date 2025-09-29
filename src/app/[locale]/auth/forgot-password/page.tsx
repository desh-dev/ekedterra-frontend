import { ForgotPasswordForm } from "@/components/forgot-password-form";
import BottomNav from "@/components/layout/bottom-nav";

interface PageProps {
  params: {
    locale: string;
  };
}

const metadata = (locale: string) => {
  if (locale === "en") {
    return {
      title: "Forgot Password",
      description: "Find your account and reset your password.",
    };
  }
  return {
    title: "Mot de passe oublié",
    description: "Trouvez votre compte et réinitialisez votre mot de passe.",
  };
};

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  return metadata(locale);
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
