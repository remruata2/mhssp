"use client";

import PageTitle from "@/components/ui/PageTitle";
import { motion } from "framer-motion";

export default function Component3Page() {
	return (
		<div className="min-h-screen bg-gray-50">
			<PageTitle
				title="Component 3"
				subtitle="Enhance quality of health services and support innovations"
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
								This component will improve the quality of health services by
								developing a comprehensive QA system, improving BMWM, enhancing
								human resource management, and piloting innovations. These
								investments will improve the capacity of the health facilities
								to respond to the ongoing COVID-19 pandemic as well as increased
								preparedness for future outbreaks.
							</p>

							<p className="text-gray-600 mb-6">
								The selection of targeted health facilities will address the
								equity issues between rural and urban. The investments in the
								areas which are hard to reach and neglect will be prioritized.
								Under this component, the project will support development of a
								gender-informed human resource policy that will define career
								pathways, roles, and competencies.
							</p>

							<p className="text-gray-600">
								This component involves various information and communication
								technology (ICT) activities to improve the overall efficiency
								and will also pilot ICT solutions under innovations.
							</p>
						</div>
					</div>
				</motion.div>
			</div>
		</div>
	);
}
