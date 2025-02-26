// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
	const path = request.nextUrl.pathname;
	const sessionToken = request.cookies.get("next-auth.session-token")?.value;

	console.log("Middleware - Path:", path);
	console.log("Middleware - Session Token exists:", !!sessionToken);

	// Public paths that don't require authentication
	const publicPaths = ["/admin/login"];

	// Protected admin paths
	const adminPaths = ["/admin", "/admin/dashboard"];

	// 1. Handle public paths
	if (publicPaths.includes(path)) {
		console.log("Middleware - Public path detected");
		if (sessionToken) {
			console.log("Middleware - Session token exists, redirecting to dashboard");
			return NextResponse.redirect(new URL("/admin/dashboard", request.url));
		}
		console.log("Middleware - No session token, allowing access to public path");
		return NextResponse.next();
	}

	// 2. Handle protected admin paths
	if (adminPaths.some((p) => path.startsWith(p))) {
		console.log("Middleware - Protected path detected");
		if (!sessionToken) {
			console.log("Middleware - No session token, redirecting to login");
			return NextResponse.redirect(new URL("/admin/login", request.url));
		}

		// Verify token validity
		const token = await getToken({
			req: request,
			secret: process.env.NEXTAUTH_SECRET,
		});

		console.log("Middleware - Token:", JSON.stringify(token));
		console.log("Middleware - Token role:", token?.role);

		// Add role check here
		if (!token || token.role !== "admin") {
			console.log("Middleware - Invalid token or not admin role:", token?.role);
			return NextResponse.redirect(
				new URL("/?error=unauthorized", request.url)
			);
		}

		console.log("Middleware - Valid admin token, allowing access");
		return NextResponse.next();
	}

	console.log("Middleware - Path not handled by middleware");
	return NextResponse.next();
}

export const config = {
	matcher: ["/admin/:path*"],
};
