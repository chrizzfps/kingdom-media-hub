import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { createServerClient } from "@supabase/ssr";
import { routing } from "./i18n/routing";

// Next.js only supports a single proxy file, so the public site's i18n
// routing and the admin panel's auth guard are composed here.
const intlMiddleware = createMiddleware(routing);

export async function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/admin")) {
    return updateAdminSession(request);
  }
  return intlMiddleware(request);
}

/**
 * Optimistic auth check only (session cookie present + refreshed). The real
 * authorization check — is this user an approved Kingdom admin — happens
 * server-side via RLS (kingdom_is_admin()) on every read/write, and again in
 * app/admin/layout.tsx. See Next.js docs: proxy should never be the only
 * line of defense.
 */
async function updateAdminSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value } of cookiesToSet) request.cookies.set(name, value);
          response = NextResponse.next({ request });
          for (const { name, value, options } of cookiesToSet) response.cookies.set(name, value, options);
        },
      },
    },
  );

  // Do not run code between createServerClient and getClaims() — see Supabase docs.
  const { data } = await supabase.auth.getClaims();
  const isAuthed = !!data?.claims;
  const isLoginRoute = request.nextUrl.pathname === "/admin/login";

  if (!isAuthed && !isLoginRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }
  if (isAuthed && isLoginRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    return NextResponse.redirect(url);
  }
  return response;
}

export const config = {
  // Runs on everything except API routes, Next internals and files with an extension.
  matcher: ["/", "/admin/:path*", "/((?!api|_next|_vercel|.*\\..*).*)"],
};
