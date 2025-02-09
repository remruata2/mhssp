import type { NewsItem } from "@/types/news";

export const getNews = {
	async getAll(): Promise<NewsItem[]> {
		try {
			const res = await fetch("/api/news");
			if (!res.ok) throw new Error("Failed to fetch news");
			return await res.json();
		} catch (error) {
			console.error("News API Error:", error);
			return [];
		}
	},

	async getById(id: string): Promise<NewsItem | null> {
		try {
			const res = await fetch(`/api/news/${id}`);
			if (!res.ok) throw new Error("News not found");
			return await res.json();
		} catch (error) {
			console.error("News API Error:", error);
			return null;
		}
	},
};
