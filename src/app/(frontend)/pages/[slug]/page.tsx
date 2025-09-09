import { notFound } from "next/navigation";
import { headers } from "next/headers";
import PageTitle from "@/components/ui/PageTitle";

async function getPage(slug: string) {
	try {
		const headersList = await headers();
		const host = headersList.get("host");
		if (!host) {
			console.error("Host header not found");
			return null;
		}

		const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
		const res = await fetch(`${protocol}://${host}/api/pages/slug/${slug}`, {
			next: { revalidate: 60 }, // Revalidate every minute
			headers: {
				Accept: "application/json",
			},
		});

		if (!res.ok) {
			if (res.status === 404) {
				return null;
			}
			const errorText = await res.text();
			console.error(`Failed to fetch page: ${errorText}`);
			return null;
		}

		const data = await res.json();
		return data.success ? data.data : null;
	} catch (error) {
		console.error("Error fetching page:", error);
		return null;
	}
}

export default async function Page({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const page = await getPage(slug);

	if (!page) {
		notFound();
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<PageTitle
				title={page.title || "Page"}
				subtitle={page.excerpt || undefined}
			/>
			<div
				className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
				dangerouslySetInnerHTML={{ __html: page.content }}
			/>
		</div>
	);
}
