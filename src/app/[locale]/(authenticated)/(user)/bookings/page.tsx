import BookingPage from "@/components/bookings";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.bookings" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function Page() {
  return <BookingPage />;
}
