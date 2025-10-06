import { redirect } from "@/i18n/routing";
import { getRoles } from "@/lib/data/server";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  try {
    const { isUser } = await getRoles();
    if (!isUser) {
      redirect({ href: "/", locale });
    }
  } catch (error: any) {
    if (error?.message === "No user found") {
      redirect({ href: "/", locale });
    } else throw error;
  }
  return children;
}
