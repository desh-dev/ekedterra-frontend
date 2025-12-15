import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { jwtDecode, JwtPayload } from "jwt-decode";

interface CustomJwtPayload extends JwtPayload {
  user_roles: string[];
  user_verified: boolean;
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  // With Fluid compute, don't put this client in a global environment
  // variable. Always create a new one on each request.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Do not run code between createServerClient and
  // supabase.auth.getClaims(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: If you remove getClaims() and you use server-side rendering
  // with the Supabase client, your users may be randomly logged out.
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;
  const pathname = request.nextUrl.pathname;

  // Extract locale from pathname
  const localeMatch = pathname.match(/^\/(en|fr)/);
  const locale = localeMatch ? localeMatch[1] : "fr";
  // Check if accessing protected authenticated routes
  const isAuthenticatedRoute = pathname.match(
    /\/(en|fr)\/(account-settings|profile)/
  );

  // Check if accessing user-only routes
  const isUserRoute = pathname.match(/\/(en|fr)\/(bookings|favorites)/);

  // Check if accessing agent verified routes
  const isVerifiedAgentRoute = pathname.match(
    /\/(en|fr)\/agent\/(listings|products)/
  );

  // Check if accessing admin routes
  const isAdminRoute = pathname.match(/\/(en|fr)\/admin/);

  // Check if accessing auth pages (login, sign-up, etc)
  const isAuthPage =
    pathname.includes("/auth/") && !pathname.includes("/auth/callback");

  // If user is logged in and trying to access auth pages, redirect to home
  if (user && isAuthPage) {
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}`;
    return NextResponse.redirect(url);
  }

  // If user is not logged in and trying to access authenticated routes
  if (
    !user &&
    (isAuthenticatedRoute?.length || isAdminRoute?.length || isUserRoute)
  ) {
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/auth/login`;
    return NextResponse.redirect(url);
  }

  // Check admin routes first - require admin role
  if (isAdminRoute?.length) {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const jwt: CustomJwtPayload = jwtDecode(session?.access_token || "");
    const isAdmin = jwt.user_roles?.some((r: string) => r === "admin");

    if (!isAdmin) {
      const url = request.nextUrl.clone();
      url.pathname = `/${locale}`;
      return NextResponse.redirect(url);
    }
  }

  // If user is logged in and trying to access protected routes, check roles
  if (user && (isUserRoute?.length || isVerifiedAgentRoute?.length)) {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const jwt: CustomJwtPayload = jwtDecode(session?.access_token || "");
    const isAdmin = jwt.user_roles?.some((r: string) => r === "admin");
    const isAgent = jwt.user_roles?.some((r: string) => r === "agent");
    const isUserRole = !isAdmin && !isAgent;
    const isVerified = jwt.user_verified;

    // Check user-only routes (bookings, favorites)
    if (isUserRoute?.length && !isUserRole) {
      const url = request.nextUrl.clone();
      url.pathname = `/${locale}`;
      return NextResponse.redirect(url);
    }

    // Check verified agent routes (listings, products)
    if (isVerifiedAgentRoute?.length && !isVerified) {
      const url = request.nextUrl.clone();
      url.pathname = `/${locale}`;
      return NextResponse.redirect(url);
    }
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  // If you're creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse;
}
