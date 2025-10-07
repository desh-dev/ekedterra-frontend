import Header from "@/components/favorites/header";
import BottomNav from "@/components/layout/bottom-nav";
import Footer from "@/components/layout/footer";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full min-h-screen flex flex-col">
      <Header />
      <main className="lg:max-w-7xl md:mx-auto lg:px-8">{children}</main>
      <Footer />
      <BottomNav />
    </div>
  );
}
