import LoginIframe from "@/components/login-iframe";
import { CategoryStoreProvider } from "@/providers/category-store-provider";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { Toaster } from "react-hot-toast";

const locales = ["en", "fr"];

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <CategoryStoreProvider>
        {children}
        <Toaster />
        <LoginIframe />
      </CategoryStoreProvider>
    </NextIntlClientProvider>
  );
}
