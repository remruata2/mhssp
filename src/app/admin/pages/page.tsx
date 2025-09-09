"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Page {
	_id: string;
	title: string;
	slug: string;
	isPublished: boolean;
	createdAt: string;
}

export default function PagesAdmin() {
	const [pages, setPages] = useState<Page[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	const fetchPages = async () => {
		try {
			const response = await fetch("/api/pages", {
				headers: {
					Accept: "application/json",
				},
			});

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(`Failed to fetch pages: ${errorText}`);
			}

			const data = await response.json();
			if (data.success) {
				setPages(data.data);
			} else {
				throw new Error(data.error || "Failed to fetch pages");
			}
		} catch (error) {
			console.error("Error fetching pages:", error);
			setError(
				error instanceof Error ? error.message : "Failed to fetch pages"
			);
		} finally {
			setLoading(false);
		}
	};

	const handleDelete = async (id: string) => {
		if (!confirm("Are you sure you want to delete this page?")) {
			return;
		}

		try {
			const response = await fetch(`/api/pages/${id}`, {
				method: "DELETE",
				headers: {
					Accept: "application/json",
				},
			});

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(`Failed to delete page: ${errorText}`);
			}

			const data = await response.json();
			if (data.success) {
				setPages(pages.filter((page) => page._id !== id));
			} else {
				throw new Error(data.error || "Failed to delete page");
			}
		} catch (error) {
			console.error("Error deleting page:", error);
			setError(
				error instanceof Error ? error.message : "Failed to delete page"
			);
		}
	};

	useEffect(() => {
		fetchPages();
	}, []);

	if (loading) {
		return <div>Loading...</div>;
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="flex justify-between items-center mb-8">
				<h1 className="text-2xl font-bold">Pages</h1>
				<Link
					href="/admin/pages/new"
					className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
				>
					Create New Page
				</Link>
			</div>

			{error && (
				<div className="bg-red-50 text-red-500 p-4 rounded-md mb-4">
					{error}
				</div>
			)}

			<div className="bg-white shadow-md rounded-lg overflow-hidden">
				<table className="min-w-full divide-y divide-gray-200">
					<thead className="bg-gray-50">
						<tr>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Title
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Slug
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Status
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Created At
							</th>
							<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
								Actions
							</th>
						</tr>
					</thead>
					<tbody className="bg-white divide-y divide-gray-200">
						{pages.map((page) => (
							<tr key={page._id}>
								<td className="px-6 py-4 whitespace-nowrap">
									<div className="text-sm font-medium text-gray-900">
										{page.title}
									</div>
								</td>
								<td className="px-6 py-4 whitespace-nowrap">
									<div className="text-sm text-gray-500">{page.slug}</div>
								</td>
								<td className="px-6 py-4 whitespace-nowrap">
									<span
										className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
											page.isPublished
												? "bg-green-100 text-green-800"
												: "bg-yellow-100 text-yellow-800"
										}`}
									>
										{page.isPublished ? "Published" : "Draft"}
									</span>
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
									{new Date(page.createdAt).toLocaleDateString()}
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
									<Link
										href={`/admin/pages/${page._id}/edit`}
										className="text-indigo-600 hover:text-indigo-900 mr-4"
									>
										Edit
									</Link>
									<Link
										href={`/admin/pages/builder?id=${page._id}`}
										className="text-blue-600 hover:text-blue-900 mr-4"
									>
										Open in Builder
									</Link>
									<button
										onClick={() => handleDelete(page._id)}
										className="text-red-600 hover:text-red-900"
									>
										Delete
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
