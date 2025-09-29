import Header from "@/components/favorites/header";
import BottomNav from "@/components/layout/bottom-nav";
import Footer from "@/components/layout/footer";
import { redirect } from "@/i18n/routing";
import { getRoles } from "@/lib/data/server";
import { createClient } from "@/lib/supabase/server";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getClaims();
    if (!data?.claims) {
      redirect({ href: "/", locale });
    }
  } catch (error: any) {
    throw error;
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
