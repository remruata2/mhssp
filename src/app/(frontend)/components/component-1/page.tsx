"use client";

import PageTitle from "@/components/ui/PageTitle";
import { motion } from "framer-motion";

export default function Component1Page() {
	return (
		<div className="min-h-screen bg-gray-50">
			<PageTitle
				title="Component 1"
				subtitle="Strengthen Management & Accountability through Internal Performance Agreements"
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
							<p className="text-gray-600 mb-6">
								This component focuses on reforms in governance and management
								structures through IPAs between the DoHFW and its subsidiaries
								at the state and substate levels. An RBF approach is expected to
								strengthen the management and accountability relationships
								between the state- and the substate-level implementing units.
								Fund transfers to institutions and health facilities would be
								made against the achievement of performance indicators specified
								in IPAs.
							</p>

							<p className="text-gray-600 mb-6">
								The IPAs aim to foster a spirit of more accountable government,
								along with results-based monitoring, contributing to
								improvements in management of the system and delivery of quality
								health services. At the health facility level, this approach
								will provide flexible resources, strengthening management
								autonomy of decentralized structures.
							</p>

							<p className="text-gray-600">
								A system of geographic equity adjustments will be put in place
								to ensure that the most destitute health facility will have
								relatively the largest performance budget. Measures that will
								govern these geographic equity adjustments will include travel
								time to the state capital, human resources density, poverty
								scores, and immunization coverage.
							</p>
						</div>
					</div>
				</motion.div>
			</div>
		</div>
	);
}
