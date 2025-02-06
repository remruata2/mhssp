"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function HeroBanner() {
	return (
		<div className="relative min-h-[65vh] flex items-center">
			{/* Background Image */}
			<div className="absolute inset-0">
				<Image
					src="/images/civilView.png"
					alt="Healthcare in Mizoram"
					fill
					priority
					className="object-cover"
				/>
				{/* Gradient Overlay */}
				<div className="absolute inset-0 z-10 bg-gradient-to-r from-black/30 to-[#2B415A]/50" />
			</div>

			{/* Content */}
			<div className="relative z-10 container mx-auto px-4 pb-5 sm:px-6 lg:px-8">
				<div className="max-w-3xl">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}
					>
						<h4 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mt-3 mb-6 leading-tight">
							Improving Management Capacity and Quality of Health Services in
							Mizoram
						</h4>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.2 }}
					></motion.div>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.4 }}
						className="flex flex-wrap gap-4"
					>
						<Link
							href="/about"
							className="px-8 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-colors"
						>
							Learn More
						</Link>
					</motion.div>
				</div>
			</div>
		</div>
	);
}
