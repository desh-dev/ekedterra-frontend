import HomePage from "@/components/home";
import { Metadata } from "next";

type Props = {
  params: { locale: string };
};

const translations = {
  en: {
    title: "Ekedterra - House to let",
    description: "Simplify your search for real estate",
  },
  fr: {
    title: "Ekedterra - Maison à louer",
    description: "Simplifiez votre recherche de biens immobiliers",
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = translations[locale as "en" | "fr"] || translations.fr;

  return {
    title: t.title,
    description: t.description,
    openGraph: {
      title: t.title,
      description: t.description,
    },
  };
}
export default function Page() {
  return <HomePage />;
}
