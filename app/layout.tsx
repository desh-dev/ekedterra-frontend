import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { ApolloWrapper } from "@/providers/apollo-provider";
import Header from "@/components/layout/header";
import BottomNav from "@/components/layout/bottom-nav";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:5000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Airbnb Clone - Find your next stay",
  description: "Find unique places to stay and experiences around the world",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.className} antialiased bg-white`}>
        <ApolloWrapper>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
            disableTransitionOnChange
          >
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1 pb-16 md:pb-0">
                {children}
              </main>
              <BottomNav />
            </div>
          </ThemeProvider>
        </ApolloWrapper>
      </body>
    </html>
  );
}
