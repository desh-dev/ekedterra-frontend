import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { ApolloWrapper } from "@/providers/apollo-provider";
import "./globals.css";
import ReactQueryProvider from "@/providers/react-query-provider";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://ekedterra.com";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Ekedterra - Find your next home",
  description: "Simplify your property and stay search.",
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
    <html suppressHydrationWarning>
      <body className={` antialiased bg-white`}>
        <ReactQueryProvider>
          <ApolloWrapper>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem={false}
              disableTransitionOnChange
            >
              {children}
            </ThemeProvider>
          </ApolloWrapper>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
