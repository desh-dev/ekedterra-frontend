import InstallPrompt from "@/components/install-prompt";
import LoginIframe from "@/components/login-iframe";
import { EdgeStoreProvider } from "@/lib/edgestore";
import { CategoryStoreProvider } from "@/providers/app-store-provider";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";

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
        <EdgeStoreProvider>
          {children}
          <InstallPrompt />
          <LoginIframe />
        </EdgeStoreProvider>
      </CategoryStoreProvider>
    </NextIntlClientProvider>
  );
}
