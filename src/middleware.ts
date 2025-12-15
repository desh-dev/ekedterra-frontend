import { updateSession } from "@/lib/supabase/middleware";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { type NextRequest } from "next/server";

const intlMiddleware = createIntlMiddleware(routing);

export async function middleware(request: NextRequest) {
  const intlResponse = intlMiddleware(request);
  const authResponse = await updateSession(request);
  return  authResponse || intlResponse;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|manifest.webmanifest|.*\\.(?:svg|png|jpg|jpeg|gif|webp|devtools.json)$).*)",
    "/",
    "/(fr|en)/:path*",
  ],
};
