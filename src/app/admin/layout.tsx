"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Session } from "next-auth";
import Image from "next/image";

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
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	useEffect(() => {
		if (status === "unauthenticated") {
			router.push("/admin/login");
		}
	}, [status, router, session]);

	// Don't show layout on login page
	if (pathname === "/admin/login") {
		return <>{children}</>;
	}

	// Show loading state
	if (status === "loading") {
		return <div>Loading...</div>;
	}

	const toggleSidebar = () => {
		setIsSidebarOpen(!isSidebarOpen);
	};

	return (
		<div className="flex h-screen bg-gray-100 overflow-hidden">
			{/* Hamburger menu button */}
			<button
				onClick={toggleSidebar}
				className="fixed z-50 p-2 text-white bg-blue-800 rounded-md md:hidden top-4 left-4"
			>
				<svg
					className="w-6 h-6"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M4 6h16M4 12h16M4 18h16"
					/>
				</svg>
			</button>

			{/* Sidebar with sliding behavior */}
			<aside
				className={`fixed md:relative inset-y-0 left-0 w-64 bg-[#2F3241] shadow-md transform transition-transform duration-300 ease-in-out md:translate-x-0 z-40 ${
					isSidebarOpen ? "translate-x-0" : "-translate-x-full"
				}`}
			>
				<div className="py-4 h-full overflow-y-auto">
					<button
						onClick={toggleSidebar}
						className="absolute right-4 top-4 p-2 text-white bg-blue-800 rounded-md md:hidden"
					>
						<svg
							className="w-6 h-6"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</button>
					<Image
						src="/images/logobg.png"
						alt="MHSSP Logo"
						className="w-1/2 mx-auto"
						width={100}
						height={100}
					/>
					<h2 className="text-xl font-bold text-white text-center">
						MHSSP Admin
					</h2>
					<nav className="mt-6">
						<Link
							href="/admin/dashboard"
							className={`flex items-center px-6 py-3 text-white hover:bg-[#1192c3] ${
								pathname === "/admin/dashboard" ? "bg-white/20" : ""
							}`}
						>
							Dashboard
						</Link>
						<Link
							href="/admin/procurement"
							className={`flex items-center px-6 py-3  hover:bg-[#1192c3] ${
								pathname.startsWith("/admin/procurement")
									? "bg-white/20" : ""
							}`}
						>
							Procurement
						</Link>
						<Link
							href="/admin/news"
							className={`flex items-center px-6 py-3 text-white hover:bg-[#1192c3] ${
								pathname.startsWith("/admin/news") ? "bg-white/20" : ""
							}`}
						>
							News
						</Link>
						<Link
							href="/admin/notices"
							className={`flex items-center px-6 py-3 text-white hover:bg-[#1192c3] ${
								pathname.startsWith("/admin/notices") ? "bg-white/20" : ""
							}`}
						>
							Notice Board
						</Link>
					</nav>
					{/* Sign out button at bottom of sidebar */}
					<div className="p-4 border-t border-white/10">
						<button
							onClick={() => router.push("/api/auth/signout")}
							className="w-full px-4 py-2 text-left text-white hover:bg-[#1192c3] rounded"
						>
							Sign out
						</button>
					</div>
				</div>
			</aside>

			{/* Main content area */}
			<main
				className={`flex-1 overflow-y-auto transition-all duration-300 ${
					isSidebarOpen ? "ml-64" : "sm:ml-0 md:ml-0 lg:ml-0 xl:ml-0"
				} `}
			>
				<div className="p-8">
					{pathname === "/admin/dashboard" && (
						<div className="mb-8">
							<h1 className="text-2xl font-semibold text-gray-900 text-right">
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
