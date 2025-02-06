"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

interface ProjectHighlightProps {
	title: string;
	description: string;
	image: string;
	link: string;
	isReversed?: boolean;
}

export default function ProjectHighlight({
	title,
	description,
	image,
	link,
	isReversed = false,
}: ProjectHighlightProps) {
	const containerVariants = {
		hidden: {},
		visible: {
			transition: {
				staggerChildren: 0.2,
			},
		},
	};

	const itemVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: { opacity: 1, y: 0 },
	};

	return (
		<div className="py-16 bg-white mb-10 border-2 shadow-md">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div
					className={`grid md:grid-cols-2 gap-8 items-center ${
						isReversed ? "direction-rtl" : ""
					}`}
				>
					{/* Text Content */}
					<motion.div
						className={`${isReversed ? "md:order-2" : ""}`}
						variants={containerVariants}
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true }}
					>
						<motion.h2
							className="text-3xl font-bold text-[#1192c3] mb-4"
							variants={itemVariants}
						>
							{title}
						</motion.h2>
						<motion.p
							className="text-lg text-gray-600 mb-6"
							variants={itemVariants}
						>
							{description}
						</motion.p>
						<motion.div variants={itemVariants}>
							<Link
								href={link}
								className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium group"
							>
								Learn More
								<FaArrowRight className="ml-2 transform group-hover:translate-x-1 transition-transform" />
							</Link>
						</motion.div>
					</motion.div>

					{/* Image */}
					<motion.div
						className={`relative h-[400px] rounded-lg overflow-hidden ${
							isReversed ? "md:order-1" : ""
						}`}
						initial={{ opacity: 0, scale: 0.95 }}
						whileInView={{ opacity: 1, scale: 1 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5 }}
					>
						<Image
							src={image}
							alt={title}
							fill
							className="object-cover"
							sizes="(max-width: 768px) 100vw, 50vw"
						/>
					</motion.div>
				</div>
				<hr className="mt-8 border-t border-gray-200" />
			</div>
		</div>
	);
}
