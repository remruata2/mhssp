"use client";

import PageTitle from "@/components/ui/PageTitle";
import { motion } from "framer-motion";

export default function Component2Page() {
	return (
		<div className="min-h-screen bg-gray-50">
			<PageTitle
				title="Component 2"
				subtitle="Improve design and management of the state health insurance programs"
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
								This component will support to strengthen the design, systems,
								and operations of the health insurance schemes in the state.
								Strengthening will focus on reducing fragmentation between
								schemes, promoting synergy and convergence for efficiency gains,
								and augmenting the management capacity of the state insurance
								agency, thereby contributing to improved coverage and increased
								service utilization.
							</p>

							<p className="text-gray-600 mb-6">
								The component will support the state health insurance programs
								and their links with AB-PMJAY, contributing to reducing
								financial barriers in accessing hospital services, preventing
								catastrophic OOPE for health by poor families, and expanding
								coverage.
							</p>

							<p className="text-gray-600">
								For this, structural reforms are required for the two health
								insurance schemes that are running in parallel. The project will
								finance investments in such corrections at three levels: (a)
								strengthening of policy and design for increased operational
								efficiency; (b) strengthening of institutional capacity,
								systems, and processes of the state insurance agency for greater
								accountability; (c) community interventions for improving
								coverage and demand, thereby increasing utilization of services
								as well.
							</p>
						</div>
					</div>
				</motion.div>
			</div>
		</div>
	);
}
