// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
	const path = request.nextUrl.pathname;
	const sessionToken = request.cookies.get("next-auth.session-token")?.value;

	// Public paths that don't require authentication
	const publicPaths = ["/admin/login"];

	// Protected admin paths
	const adminPaths = ["/admin", "/admin/dashboard"];

	// 1. Handle public paths
	if (publicPaths.includes(path)) {
		if (sessionToken) {
			return NextResponse.redirect(new URL("/admin/dashboard", request.url));
		}
		return NextResponse.next();
	}

	// 2. Handle protected admin paths
	if (adminPaths.some((p) => path.startsWith(p))) {
		if (!sessionToken) {
			return NextResponse.redirect(new URL("/admin/login", request.url));
		}

		// Verify token validity
		const token = await getToken({
			req: request,
			secret: process.env.NEXTAUTH_SECRET,
		});

		// Add role check here
		if (!token || token.role !== "admin") {
			console.log(token?.role);
			return NextResponse.redirect(
				new URL("/?error=unauthorized", request.url)
			);
		}

		return NextResponse.next();
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/admin/:path*"],
};
