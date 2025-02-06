"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface PageData {
	title: string;
	content: string;
	isPublished: boolean;
}

export default function PreviewPage({ params }: { params: { id: string } }) {
	const { id } = params;
	const router = useRouter();
	const [pageData, setPageData] = useState<PageData | null>(null);
	const [loading, setLoading] = useState(true);

	const fetchPage = async () => {
		try {
			const response = await fetch(`/api/pages/${id}`);
			if (!response.ok) {
				throw new Error("Failed to fetch page");
			}
			const data = await response.json();
			setPageData(data);
		} catch (error: unknown) {
			console.error("Error fetching page:", error);
			router.push("/404");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchPage();
	}, [id, router]);

	if (loading) {
		return <div>Loading...</div>;
	}

	if (!pageData) {
		return <div>Page not found</div>;
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-8">
				<p className="text-yellow-700">
					<span className="font-bold">Preview Mode</span> - This is how the page
					will look when{" "}
					{pageData.isPublished ? "published" : "it gets published"}
				</p>
			</div>

			<article className="prose lg:prose-xl mx-auto">
				<h1>{pageData.title}</h1>
				<div dangerouslySetInnerHTML={{ __html: pageData.content }} />
			</article>

			<div className="mt-8 text-center">
				<button
					onClick={() => router.back()}
					className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
				>
					← Back to Editor
				</button>
			</div>
		</div>
	);
}
