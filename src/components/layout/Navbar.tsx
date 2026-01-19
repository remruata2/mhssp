"use client";

import React, { useState, Fragment } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, Transition, Disclosure } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

interface NavItem {
	name: string;
	href: string;
	children?: {
		name: string;
		href: string;
		external?: boolean;
	}[];
}

export default function Navbar() {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const pathname = usePathname();

	const navigation: NavItem[] = [
		{ name: "Home", href: "/" },
		{ name: "Procurement", href: "/procurement" },
		{ name: "CKSI", href: "/cksi" },
		{
			name: "CI",
			href: "/ci",
			children: [
				{ name: "Community Intervention", href: "/ci" },
				{
					name: "SBCC Reports",
					href: "https://lookerstudio.google.com/embed/u/0/reporting/5bb5f9e8-c36d-4225-806d-0a6fa1d03479/page/fiZiF",
					external: true,
				},
			],
		},
		{ name: "News", href: "/news" },
		{ name: "Notice Board", href: "/notices" },
		{ name: "Result Framework", href: "/pdo-indicators" },
		{ name: "About", href: "/about" },
	];

	return (
		<>
			<nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-sm z-50">
				<div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
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

						<div className="hidden md:flex md:items-center md:space-x-8">
							{navigation.map((item) => {
								if (item.children) {
									const children = item.children;
									return (
										<Menu as="div" key={item.name} className="relative">
											{({ open }) => (
												<>
													<Menu.Button
														className={`flex items-center space-x-1 text-base font-medium transition-colors ${pathname === item.href ||
															pathname.startsWith(item.href + "/")
															? "text-[#1192c3]"
															: "text-gray-700 hover:text-[#1192c3]"
															}`}
													>
														<span>{item.name}</span>
														<ChevronDownIcon
															className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""
																}`}
														/>
													</Menu.Button>
													<Transition
														as={Fragment}
														enter="transition ease-out duration-100"
														enterFrom="transform opacity-0 scale-95"
														enterTo="transform opacity-100 scale-100"
														leave="transition ease-in duration-75"
														leaveFrom="transform opacity-100 scale-100"
														leaveTo="transform opacity-0 scale-95"
													>
														<Menu.Items className="absolute left-0 mt-2 w-56 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
															<div className="py-1">
																{children.map((child) => (
																	<Menu.Item key={child.name}>
																		{({ active }) => (
																			<Link
																				href={child.href}
																				target={
																					child.external ? "_blank" : undefined
																				}
																				rel={
																					child.external
																						? "noopener noreferrer"
																						: undefined
																				}
																				className={`block px-4 py-2 text-sm transition-colors ${active
																					? "bg-gray-100 text-[#1192c3]"
																					: "text-gray-700 hover:text-[#1192c3]"
																					}`}
																			>
																				{child.name}
																			</Link>
																		)}
																	</Menu.Item>
																))}
															</div>
														</Menu.Items>
													</Transition>
												</>
											)}
										</Menu>
									);
								}
								return (
									<Link
										key={item.href}
										href={item.href}
										className={`text-base font-medium transition-colors ${pathname === item.href
											? "text-[#1192c3]"
											: "text-gray-700 hover:text-[#1192c3]"
											}`}
									>
										{item.name}
									</Link>
								);
							})}
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
					<div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-inner">
						{navigation.map((item) => {
							if (item.children) {
								const children = item.children;
								return (
									<Disclosure key={item.name} as="div">
										{({ open }) => (
											<>
												<Disclosure.Button
													className={`flex w-full items-center justify-between px-3 py-2 rounded-md text-base font-medium transition-colors ${pathname === item.href ||
														pathname.startsWith(item.href + "/")
														? "text-[#1192c3] bg-gray-50"
														: "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
														}`}
												>
													<span>{item.name}</span>
													<ChevronDownIcon
														className={`h-5 w-5 transition-transform ${open ? "rotate-180" : ""
															}`}
													/>
												</Disclosure.Button>
												<Disclosure.Panel className="pl-4 space-y-1">
													{children.map((child) => (
														<Link
															key={child.name}
															href={child.href}
															target={child.external ? "_blank" : undefined}
															rel={
																child.external
																	? "noopener noreferrer"
																	: undefined
															}
															className="block px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-[#1192c3] hover:bg-gray-50 transition-colors"
															onClick={() => setIsMobileMenuOpen(false)}
														>
															{child.name}
														</Link>
													))}
												</Disclosure.Panel>
											</>
										)}
									</Disclosure>
								);
							}
							return (
								<Link
									key={item.href}
									href={item.href}
									className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${pathname === item.href
										? "text-[#1192c3] bg-gray-50"
										: "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
										}`}
									onClick={() => setIsMobileMenuOpen(false)}
								>
									{item.name}
								</Link>
							);
						})}
					</div>
				</div>
			</nav>
		</>
	);
}
