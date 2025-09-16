import { updateSession } from "@/lib/supabase/middleware";
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { type NextRequest } from "next/server";

const intlMiddleware = createIntlMiddleware(routing);

export async function middleware(request: NextRequest) {
  // First handle internationalization
  // const intlResponse = intlMiddleware(request);
  
  // Then handle Supabase authentication
  const authResponse = await updateSession(request);
  
  // Return the intl response if it's a redirect, otherwise return auth response
  return authResponse;
}

export const config = {
  matcher: [
    "/",
  ],
};
