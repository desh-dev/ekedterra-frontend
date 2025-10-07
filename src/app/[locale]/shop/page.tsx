import ShopPage from "@/components/shop";
import { Metadata } from "next";

interface PageProps {
  params: Promise<{ locale: string }>;
}

const translations = {
  en: {
    title: "Ekedterra Shop - Bulk prices",
    description: "Welcome to Ekedterra Shop! Where we retail at bulk prices.",
  },
  fr: {
    title: "Ekedterra Shop - Prix de gros",
    description:
      "Bienvenue à Ekedterra Shop! Où nous retailons à prix de gros.",
  },
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
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
  return (
    <div>
      <ShopPage />
    </div>
  );
}
