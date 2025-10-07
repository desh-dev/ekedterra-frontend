import FavoritesPage from "@/components/favorites";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.favorites" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function Page() {
  return <FavoritesPage />;
}
