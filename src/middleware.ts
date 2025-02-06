import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
	const path = request.nextUrl.pathname;

	// Define public paths that don't require authentication
	const isPublicPath = path === "/admin/login";

	// Get the token
	const token = await getToken({
		req: request,
		secret: process.env.NEXTAUTH_SECRET,
	});

	// Redirect to login if accessing admin path without auth
	if (!isPublicPath && path.startsWith("/admin") && !token) {
		return NextResponse.redirect(
			new URL("/admin/login", process.env.NEXTAUTH_URL)
		);
	}

	// Redirect to admin dashboard if accessing login while authenticated
	if (isPublicPath && token) {
		return NextResponse.redirect(
			new URL("/admin/dashboard", process.env.NEXTAUTH_URL)
		);
	}

	return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
	matcher: ["/admin/:path*"],
};
