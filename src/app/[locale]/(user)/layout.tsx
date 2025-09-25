import Header from "@/components/favorites/header";
import BottomNav from "@/components/layout/bottom-nav";
import Footer from "@/components/layout/footer";
import { redirect } from "@/i18n/routing";
import { getRoles } from "@/lib/data/server";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const [{ isUser }, locale] = await Promise.all([
    getRoles(),
    (await params).locale,
  ]);
  if (!isUser) {
    redirect({ href: "/", locale });
  }
  return (
    <div className="w-full min-h-screen flex flex-col">
      <Header />
      <main className="lg:max-w-7xl md:mx-auto lg:px-8">{children}</main>
      <Footer />
      <BottomNav />
    </div>
  );
}
