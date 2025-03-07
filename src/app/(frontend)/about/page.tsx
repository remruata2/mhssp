"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
	FaHospital,
	FaUserMd,
	FaHandsHelping,
	FaChartLine,
} from "react-icons/fa";
import PageTitle from "@/components/ui/PageTitle";
import { motion } from "framer-motion";

export default function AboutPage() {
	return (
		<div className="min-h-screen bg-gray-50">
			<PageTitle
				title="About MHSSP"
				subtitle="Learn about the Mizoram Health Systems Strengthening Project"
			/>

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
				>
					<div className="grid md:grid-cols-2 gap-8 items-center mb-12">
						<div>
							<h2 className="text-3xl font-bold text-gray-900 mb-6">
								Our Mission
							</h2>
							<p className="text-lg text-gray-600 mb-4">
								The Mizoram Health Systems Strengthening Project (MHSSP) is a
								comprehensive initiative aimed at improving healthcare
								infrastructure, service delivery, and accessibility across the
								state of Mizoram.
							</p>
							<p className="text-lg text-gray-600">
								Supported by the World Bank, our project focuses on enhancing
								healthcare systems, improving medical facilities, and ensuring
								quality healthcare reaches every corner of Mizoram.
							</p>
						</div>
						<div className="rounded-lg overflow-hidden shadow-lg">
							<Image
								src="/images/mhssp.jpg"
								alt="MHSSP Healthcare Facility"
								width={600}
								height={400}
								className="w-full h-auto object-cover"
							/>
						</div>
					</div>

					<div className="bg-white shadow-xl rounded-lg p-8 mb-12">
						<p className="text-gray-700 mb-4">
							The Health and Family Welfare Department (H&FW Dept.), Government
							of Mizoram with technical and financial support from the World
							Bank, is implementing &#39;Mizoram Health Systems Strengthening
							Project&#39; (MHSSP) in the State for improving the health status
							of its citizens. The MHSSP intends to strengthen the management
							capacity and quality of health services in Mizoram.
						</p>

						<p className="text-gray-700 mb-4">
							We envision improved health for all by building a responsive
							health system that provides protection against ill-health and
							financial shocks due to payments for health. We are confident that
							improvements in the health system will herald a &#39;dawning of
							good health&#39; with the &#39;sunset on ill-health&#39;.
						</p>

						<p className="text-gray-700 mb-4">
							The Mizoram Health Systems Strengthening Project uses a
							system&#x27;s approach and is broken down into three individual
							components which need to be appreciated as forming part of a whole
							system&#x27;s approach
						</p>

						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
							<Link href="/components/component-1" className="group">
								<div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
									<div className="text-center mb-4">
										<h3 className="text-lg font-semibold text-[#1192c3] mb-2">
											Component: 1
										</h3>
									</div>
									<div className="mx-auto mb-4 w-20 h-20 bg-[#1192c3]/10 rounded-full flex items-center justify-center">
										<FaChartLine className="w-10 h-10 text-[#1192c3]" />
									</div>
									<p className="mt-4 text-sm text-gray-600 text-center">
										Strengthen Management & accountability through Internal
										Performance Agreements
									</p>
								</div>
							</Link>

							<Link href="/components/component-2" className="group">
								<div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
									<div className="text-center mb-4">
										<h3 className="text-lg font-semibold text-[#1192c3] mb-2">
											Component: 2
										</h3>
									</div>
									<div className="mx-auto mb-4 w-20 h-20 bg-[#1192c3]/10 rounded-full flex items-center justify-center">
										<FaUserMd className="w-10 h-10 text-[#1192c3]" />
									</div>
									<p className="mt-4 text-sm text-gray-600 text-center">
										Improve design and management of Health Insurance programs
									</p>
								</div>
							</Link>

							<Link href="/components/component-3" className="group">
								<div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
									<div className="text-center mb-4">
										<h3 className="text-lg font-semibold text-[#1192c3] mb-2">
											Component: 3
										</h3>
									</div>
									<div className="mx-auto mb-4 w-20 h-20 bg-[#1192c3]/10 rounded-full flex items-center justify-center">
										<FaHospital className="w-10 h-10 text-[#1192c3]" />
									</div>
									<p className="mt-4 text-sm text-gray-600 text-center">
										Quality of health service and innovations
									</p>
								</div>
							</Link>

							<Link href="/components/component-4" className="group">
								<div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
									<div className="text-center mb-4">
										<h3 className="text-lg font-semibold text-[#1192c3] mb-2">
											Component: 4
										</h3>
									</div>
									<div className="mx-auto mb-4 w-20 h-20 bg-[#1192c3]/10 rounded-full flex items-center justify-center">
										<FaHandsHelping className="w-10 h-10 text-[#1192c3]" />
									</div>
									<p className="mt-4 text-sm text-gray-600 text-center">
										Contingent Emergency Response Component
									</p>
								</div>
							</Link>
						</div>
					</div>

					<div className="bg-white shadow-xl rounded-lg p-8 mb-12">
						<h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
							Implementation Structure
						</h2>
						<div className="relative w-full max-w-4xl mx-auto">
							<Image
								src="/images/OrganogramMhssp.png"
								alt="MHSSP Implementation Structure"
								width={1000}
								height={600}
								className="w-full h-auto object-contain"
								priority
							/>
						</div>
						<p className="text-sm text-gray-500 text-center mt-4">
							Project Implementation Structure of Mizoram Health Systems
							Strengthening Project (MHSSP)
						</p>
					</div>

					<div className="bg-white shadow-xl rounded-lg p-8">
						<h2 className="text-3xl font-bold text-center text-gray-900 mb-6">
							Our Commitment
						</h2>
						<p className="max-w-3xl mx-auto text-lg text-gray-600 text-center">
							We are dedicated to creating a robust, accessible, and
							high-quality healthcare system that meets the unique needs of
							Mizoram&#39;s diverse population.
						</p>
					</div>
				</motion.div>
			</div>
		</div>
	);
}
