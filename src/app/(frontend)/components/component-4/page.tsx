"use client";

import PageTitle from "@/components/ui/PageTitle";
import { motion } from "framer-motion";

export default function Component4Page() {
	return (
		<div className="min-h-screen bg-gray-50">
			<PageTitle
				title="Component 4"
				subtitle="Contingent Emergency Response Component"
			/>

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
				>
					<div className="bg-white shadow-xl rounded-lg p-8">
						<div className="prose prose-lg max-w-none">
							<h2 className="text-2xl font-bold text-gray-900 mb-4">
								Overview
							</h2>
							<p className="text-gray-600">
								The Contingent Emergency Response Component (CERC) provides a
								mechanism for provision of immediate response to an eligible
								crisis or emergency, as needed.
							</p>
						</div>
					</div>
				</motion.div>
			</div>
		</div>
	);
}
