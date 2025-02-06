import Link from "next/link";

export default function Header() {
	return (
		<header className="bg-white shadow-md">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center py-4">
					<div className="flex items-center">
						<Link href="/" className="flex items-center">
							<span className="text-2xl font-bold text-gray-800">MHSSP</span>
						</Link>
					</div>

					<nav className="hidden md:flex space-x-8">
						<Link href="/about" className="text-gray-700 hover:text-gray-900">
							About Us
						</Link>
						<Link
							href="/services"
							className="text-gray-700 hover:text-gray-900"
						>
							Services
						</Link>
						<Link href="/schemes" className="text-gray-700 hover:text-gray-900">
							Schemes
						</Link>
						<Link
							href="/procurement"
							className="text-gray-700 hover:text-gray-900"
						>
							Procurement
						</Link>
						<Link href="/contact" className="text-gray-700 hover:text-gray-900">
							Contact
						</Link>
					</nav>
				</div>
			</div>
		</header>
	);
}
