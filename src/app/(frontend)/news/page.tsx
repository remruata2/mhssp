"use client";

import News from "@/components/News";
import { motion } from "framer-motion";
import PageTitle from "@/components/ui/PageTitle";
import Link from "next/link";
import Image from "next/image";
import { cacheBusterUrl } from "@/lib/imageCacheBuster";

export default function NewsPage() {
	const title = "Latest News";

	return (
		<div className="min-h-screen bg-gray-50">
			<PageTitle
				title={title}
				subtitle="Stay updated with the latest news and announcements"
			/>

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="container mx-auto"
				>
					<div className="max-w-6xl mx-auto">
						<News>
							{({ items }) => (
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
									{items.map(
										(item) => (
											console.log(item),
											(
												<Link
													key={item._id}
													href={`/news/${item._id}`}
													className="group relative block overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow"
												>
													{item.images?.length > 0 && (
														<div className="relative h-48">
															<Image
																src={cacheBusterUrl(item.images[0])}
																alt={item.title}
																fill
																unoptimized={true}
																sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
																className="object-cover"
															/>
														</div>
													)}
													<div className="p-4 bg-white">
														<h2 className="text-xl font-semibold mb-2 text-gray-800">
															{item.title}
														</h2>
														<p className="text-gray-500 text-sm">
															{new Date(item.publishDate).toLocaleDateString()}
														</p>
													</div>
												</Link>
											)
										)
									)}
								</div>
							)}
						</News>
					</div>
				</motion.div>
			</div>
		</div>
	);
}
