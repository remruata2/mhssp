import { getNews } from "@/lib/api/news";
import { NewsItem } from "@/types/news";

export default async function NewsItemPage({
	params,
}: {
	params: { id: string };
}) {
	const newsItem = await getNews.getById(params.id);

	if (!newsItem) {
		return (
			<div className="p-6">
				<h1 className="text-2xl font-bold mb-4">News not found</h1>
				<a href="/news" className="text-blue-600 hover:underline">Back to News</a>
			</div>
		);
	}

	return (
		<div className="p-6">
			<h1 className="text-3xl font-bold mb-4">{newsItem.title}</h1>
			<p className="text-gray-500 mb-4">
				Published on {new Date(newsItem.publishDate).toLocaleDateString()}
			</p>
			<div className="prose max-w-none">{newsItem.content}</div>
			{/* We'll add image gallery here later */}
		</div>
	);
}
