"use client";

import { useEffect, useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import PageTitle from "@/components/ui/PageTitle";
import { ImageModal } from "@/components/News";

interface NewsItem {
	_id: string;
	title: string;
	content: string;
	images: string[];
	publishDate: string;
	createdAt: string;
}

export default function NewsDetailPage({ params }: { params: Promise<{ id: string }> }) {
	const resolvedParams = use(params);
	const [news, setNews] = useState<NewsItem | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [selectedImage, setSelectedImage] = useState<{ url: string; title: string } | null>(null);

	useEffect(() => {
		const fetchNews = async () => {
			try {
				const response = await fetch(`/api/news/${resolvedParams.id}`);
				const data = await response.json();
				
				if (data.success) {
					setNews(data.data);
				} else {
					setError(data.message || "Failed to fetch news");
				}
			} catch (error) {
				setError("Failed to fetch news");
			} finally {
				setLoading(false);
			}
		};

		fetchNews();
	}, [resolvedParams.id]);

	if (loading) {
		return (
			<div className="flex justify-center items-center min-h-screen">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
			</div>
		);
	}

	if (error || !news) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<h1 className="text-2xl font-bold text-gray-800 mb-4">
						{error || "News not found"}
					</h1>
					<a href="/news" className="text-blue-600 hover:underline">
						Back to News
					</a>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<PageTitle 
				title={news.title}
				subtitle={new Date(news.publishDate).toLocaleDateString()}
			/>

			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<motion.article
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="bg-white rounded-lg shadow-lg overflow-hidden"
				>
					<div className="p-6">
							<h3 className="text-sm text-gray-500">
								{new Date(news.createdAt).toLocaleDateString()}
							</h3>
						<div className="flex items-start mb-6">
							<h1 className="text-3xl font-bold text-gray-900">{news.title}</h1>
						</div>

						<div className="prose max-w-none mb-8">
							{news.content.split('\n').map((paragraph, index) => (
								<p key={index} className="mb-4 text-gray-700">
									{paragraph}
								</p>
							))}
						</div>

						{news.images && news.images.length > 0 && (
							<div className="mt-8">
								<h2 className="text-xl font-semibold mb-4 text-gray-900">Images</h2>
								<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
									{news.images.map((image, index) => (
										<div 
											key={index} 
											className="relative h-48 cursor-pointer hover:opacity-90 transition-opacity"
											onClick={() => setSelectedImage({ url: image, title: news.title })}
										>
											<Image
												src={image}
												alt={`${news.title} - Image ${index + 1}`}
												fill
												className="object-cover rounded-lg"
												unoptimized={true}
											/>
										</div>
									))}
								</div>
							</div>
						)}
					</div>
				</motion.article>

				<div className="mt-8 text-center">
					<Link
						href="/news"
						className="inline-block px-6 py-3 bg-[#1192c3] text-white rounded-md hover:bg-indigo-700 transition-colors"
					>
						Back to News
					</Link>
				</div>
			</div>

			<AnimatePresence>
				{selectedImage && (
					<ImageModal
						imageUrl={selectedImage.url}
						title={selectedImage.title}
						onClose={() => setSelectedImage(null)}
					/>
				)}
			</AnimatePresence>
		</div>
	);
}
