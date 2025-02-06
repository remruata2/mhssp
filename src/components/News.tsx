"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCalendarAlt, FaTimes } from "react-icons/fa";
import Image from 'next/image';

interface NewsItem {
	_id: string;
	title: string;
	content: string;
	publishDate: string;
	imageUrl?: string;
}

interface ImageModalProps {
  imageUrl: string;
  title: string;
  onClose: () => void;
}

const ImageModal = ({ imageUrl, title, onClose }: ImageModalProps) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
    onClick={onClose}
  >
    <div className="relative max-w-7xl w-full max-h-[90vh] flex flex-col items-center">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
      >
        <FaTimes size={24} />
      </button>
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
      >
        <Image
          src={imageUrl}
          alt={title}
          width={1920}
          height={1080}
          className="max-w-full max-h-[85vh] object-contain"
          onClick={(e) => e.stopPropagation()}
        />
      </motion.div>
      <p className="text-white mt-2 text-center">{title}</p>
    </div>
  </motion.div>
);

export default function News() {
	const [news, setNews] = useState<NewsItem[]>([]);
	const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<{ url: string; title: string } | null>(null);

	useEffect(() => {
		const fetchNews = async () => {
			try {
				const response = await fetch("/api/news");
				const data = await response.json();
				setNews(data.data || []);
			} catch (error) {
				console.error("Error fetching news:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchNews();
	}, []);

	if (loading) {
		return (
			<div className="bg-white shadow-md rounded-lg p-6">
				<div className="space-y-4">
					{[1, 2, 3].map((i) => (
						<div key={i} className="animate-pulse flex gap-6">
							<div className="w-1/3 h-48 bg-gray-200 rounded"></div>
							<div className="w-2/3 space-y-4">
								<div className="h-4 bg-gray-200 rounded w-1/4"></div>
								<div className="h-8 bg-gray-200 rounded w-3/4"></div>
							</div>
						</div>
					))}
				</div>
			</div>
		);
	}

	// Group news by date
	const groupedNews = news.reduce(
		(groups: { [key: string]: NewsItem[] }, item) => {
			const date = new Date(item.publishDate).toLocaleDateString("en-IN", {
				day: "numeric",
				month: "long",
				year: "numeric",
			});
			if (!groups[date]) {
				groups[date] = [];
			}
			groups[date].push(item);
			return groups;
		},
		{}
	);

	// Sort dates in descending order
	const sortedDates = Object.keys(groupedNews).sort(
		(a, b) => new Date(b).getTime() - new Date(a).getTime()
	);

	return (
		<div className="bg-white shadow-md rounded-lg p-6">
			<div className="space-y-8">
				{sortedDates.map((date) => (
					<div key={date} className="space-y-4">
						<div className="flex items-center space-x-2 text-[#1192c3]">
							<FaCalendarAlt className="text-[#1192c3]" />
							<h3 className="text-lg font-semibold">{date}</h3>
						</div>
						<div className="space-y-6 pl-6 border-l-2 border-[#1192c3]">
							{groupedNews[date].map((item, index) => (
								<motion.div
									key={item._id}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: index * 0.1 }}
									className="bg-white rounded-lg border border-gray-100 p-4 hover:shadow-md transition-shadow"
								>
									<div className="flex flex-col md:flex-row gap-6">
										{item.imageUrl ? (
											<div className="w-full md:w-1/3">
												<div 
													className="relative w-full h-48 md:h-full overflow-hidden rounded-lg cursor-pointer"
													onClick={() => setSelectedImage({ url: item.imageUrl!, title: item.title })}
												>
													<Image
														src={item.imageUrl}
														alt={item.title}
														width={800}
														height={600}
														className="w-full h-full object-cover bg-gray-50 hover:opacity-90 transition-opacity"
													/>
												</div>
											</div>
										) : (
											null
										)}
										<div className="w-full md:w-2/3">
											<h4 className="text-lg font-medium text-gray-900 mb-4">
												{item.title}
											</h4>
											<p className="text-gray-600 whitespace-pre-wrap">
												{item.content}
											</p>
										</div>
									</div>
								</motion.div>
							))}
						</div>
					</div>
				))}
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
