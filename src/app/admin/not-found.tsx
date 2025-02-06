// src/app/not-found.tsx
import Link from "next/link";

export default function NotFound() {
	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
			<div className="space-y-4 text-center">
				<h1 className="text-6xl font-bold text-gray-900">404</h1>
				<p className="text-xl text-gray-600">
					Oops! The page you're looking for doesn't exist.
				</p>
				<p className="text-gray-500">
					You may have mistyped the address or the page has been moved.
				</p>
				<Link
					href="/"
					className="inline-block px-6 py-3 mt-6 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200"
				>
					Return to Homepage
				</Link>
			</div>
		</div>
	);
}
