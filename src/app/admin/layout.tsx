"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Session } from "next-auth";

// Function to format username
function formatUsername(username?: string | null): string {
	if (!username) return "Guest";
	return username.charAt(0).toUpperCase() + username.slice(1);
}

export default function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const { data: session, status } = useSession() as {
		data: Session | null;
		status: string;
	};
	console.log("Session:", session);
	const router = useRouter();
	const pathname = usePathname();

	// Don't show layout on login page
	if (pathname === "/admin/login") {
		return <>{children}</>;
	}

	// Show loading state
	if (status === "loading") {
		return <div>Loading...</div>;
	}

	// Redirect if not authenticated
	if (status === "unauthenticated") {
		router.push("/admin/login");
		return null;
	}

	return (
		<div className="min-h-screen bg-gray-100">
			{/* Sidebar */}
			<aside className="fixed inset-y-0 left-0 w-64 bg-blue-800 shadow-md flex flex-col">
				<div className="p-6">
					<h2 className="text-2xl font-bold text-white">MHSSP Admin</h2>
				</div>
				{/* Navigation links */}
				<nav className="flex-grow mt-6">
					<Link
						href="/admin/dashboard"
						className={`flex items-center px-6 py-3 text-white hover:bg-white/10 ${
							pathname === "/admin/dashboard" ? "bg-white/20" : ""
						}`}
					>
						Dashboard
					</Link>
					<Link
						href="/admin/procurement"
						className={`flex items-center px-6 py-3 text-white hover:bg-white/10 ${
							pathname.startsWith("/admin/procurement") ? "bg-white/20" : ""
						}`}
					>
						Procurement
					</Link>
					<Link
						href="/admin/news"
						className={`flex items-center px-6 py-3 text-white hover:bg-white/10 ${
							pathname.startsWith("/admin/news") ? "bg-white/20" : ""
						}`}
					>
						News
					</Link>
					<Link
						href="/admin/notices"
						className={`flex items-center px-6 py-3 text-white hover:bg-white/10 ${
							pathname.startsWith("/admin/notices") ? "bg-white/20" : ""
						}`}
					>
						Notice Board
					</Link>
					<Link
						href="/admin/pages"
						className={`flex items-center px-6 py-3 text-white hover:bg-white/10 ${
							pathname.startsWith("/admin/pages") ? "bg-white/20" : ""
						}`}
					>
						Manage Pages
					</Link>
				</nav>
				{/* Sign out button at bottom of sidebar */}
				<div className="p-4 border-t border-white/10">
					<button
						onClick={() => router.push("/api/auth/signout")}
						className="w-full px-4 py-2 text-left text-white hover:bg-white/10 rounded"
					>
						Sign out
					</button>
				</div>
			</aside>

			{/* Main content */}
			<main className="ml-64 p-8">
				<div className="max-w-7xl mx-auto">
					{pathname === "/admin/dashboard" && (
						<div className="mb-8">
							<h1 className="text-2xl font-semibold text-gray-900">
								Welcome, {formatUsername(session?.user?.username)}
							</h1>
						</div>
					)}
					{children}
				</div>
			</main>
		</div>
	);
}
