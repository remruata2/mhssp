"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Navbar() {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const pathname = usePathname();

	const navigation = [
		{ name: "Home", href: "/" },
		{ name: "Procurement", href: "/procurement" },
		{ name: "CKSI", href: "/cksi" },
		{ name: "News", href: "/news" },
		{ name: "Notice Board", href: "/notices" },
		{ name: "About", href: "/about" },
	];

	return (
		<>
			<nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-sm z-50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between h-30 py-3">
						{/* Logo and Website Name */}
						<div className="flex items-center">
							<Link href="/" className="flex items-center space-x-4">
								<Image
									src="/images/logo.png"
									alt="MHSSP Logo"
									width={78}
									height={78}
									className="h-20 w-auto"
								/>
								<div>
									<span className="block text-s text-gray-700 text-xl">
										Mizoram Health Systems Strengthening Project
									</span>
									<span className="block text-xs text-gray-500 italic">
										Health & Family Welfare Department
									</span>
								</div>
							</Link>
						</div>

						{/* Desktop Navigation */}
						<div className="hidden md:flex md:items-center md:space-x-8">
							{navigation.map((item) => (
								<Link
									key={item.href}
									href={item.href}
									className={`text-base font-medium ${
										pathname === item.href
											? "text-[#1192c3]"
											: "text-gray-700 hover:text-[#1192c3]"
									}`}
								>
									{item.name}
								</Link>
							))}
						</div>

						{/* Mobile menu button */}
						<div className="flex items-center md:hidden">
							<button
								onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
								className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
							>
								<span className="sr-only">Open main menu</span>
								{isMobileMenuOpen ? (
									<svg
										className="block h-6 w-6"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M6 18L18 6M6 6l12 12"
										/>
									</svg>
								) : (
									<svg
										className="block h-6 w-6"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M4 6h16M4 12h16M4 18h16"
										/>
									</svg>
								)}
							</button>
						</div>
					</div>
				</div>

				{/* Mobile menu */}
				<div className={`md:hidden ${isMobileMenuOpen ? "block" : "hidden"}`}>
					<div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
						{navigation.map((item) => (
							<Link
								key={item.href}
								href={item.href}
								className={`block px-3 py-2 rounded-md text-base font-medium ${
									pathname === item.href
										? "text-indigo-600 bg-indigo-50"
										: "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
								}`}
							>
								{item.name}
							</Link>
						))}
					</div>
				</div>
			</nav>
		</>
	);
}
