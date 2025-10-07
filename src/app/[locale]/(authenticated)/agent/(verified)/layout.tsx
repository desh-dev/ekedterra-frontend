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
    const { isVerified } = await getRoles();
    if (!isVerified) {
      redirect({ href: "/", locale });
    }
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "No user found") {
      redirect({ href: "/", locale });
    } else throw error;
  }
  return <div>{children}</div>;
}
