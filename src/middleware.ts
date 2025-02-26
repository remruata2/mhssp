// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const cookieName =
	process.env.NODE_ENV === "production"
		? "__Secure-next-auth.session-token"
		: "next-auth.session-token";

export async function middleware(request: NextRequest) {
	const path = request.nextUrl.pathname;
	const sessionToken = request.cookies.get(cookieName)?.value;

	// Public routes that don't require authentication
	const publicRoutes = ["/admin/login"];

	// 1. Handle public routes first
	if (publicRoutes.includes(path)) {
		// Redirect logged-in users away from public routes
		if (sessionToken) {
			return NextResponse.redirect(new URL("/admin/dashboard", request.url));
		}
		// Allow access to public routes for unauthenticated users
		return NextResponse.next();
	}

	// 2. Protect admin routes (excluding public routes)
	if (path.startsWith("/admin")) {
		// Redirect unauthenticated users to login
		if (!sessionToken) {
			return NextResponse.redirect(new URL("/admin/login", request.url));
		}

		// Verify token and role for authenticated users
		const token = await getToken({
			req: request,
			secret: process.env.NEXTAUTH_SECRET,
		});

		// Block non-admin users from admin routes
		if (!token || token.role !== "admin") {
			return NextResponse.redirect(
				new URL("/?error=unauthorized", request.url)
			);
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/admin/:path*"],
};
