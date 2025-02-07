"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import PageTitle from "@/components/ui/PageTitle";
import Image from "next/image";
import {
	FaRulerCombined,
	FaCalendarAlt,
	FaUserTie,
	FaMoneyBill,
} from "react-icons/fa";

interface TechnicalReport {
	id: string;
	title: string;
	imageUrl: string;
	status: "completed" | "ongoing";
	generalInformation: {
		name: string;
		contractor: string;
		contractAmount: string;
		commencedDate?: string;
		inauguratedDate?: string;
	};
	area: {
		total: string;
	};
}

const TechnicalReportDisplay: React.FC<{ reports: TechnicalReport[] }> = ({
	reports,
}) => {
	return (
		<div className="space-y-8 bg-white-100 p-1 w-5/6 mx-auto">
			{reports.map((report, index) => (
				<motion.section
					key={report.id}
					initial={{ opacity: 0, y: 50 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, ease: "easeOut", delay: index * 0.2 }}
					viewport={{ once: true, margin: "-100px" }}
					className="bg-white rounded-lg shadow-md transform transition-all duration-500 ease-in-out hover:scale-102 hover:shadow-lg"
				>
					<div className="mb-0 p-3">
						<h2 className="text-3xl font-semibold text-black text-center pt-2 mb-8">
							{report.generalInformation.name}
						</h2>
						{/* <div className="mt-2 w-24 h-1 bg-red-600 mx-auto"></div> */}
						<hr className="my-4" />
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
						{/* Information Column */}
						<div className="grid grid-cols-1 gap-4 max-w-md mx-auto w-full">
							{/* Contractor Card */}
							<div className="bg-[#1192c3] p-4 rounded-lg shadow-sm transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-md">
								<div className="flex items-center mb-1 justify-center">
									<FaUserTie className="text-white text-lg mr-2" />
									<dt className="text-base font-bold text-white">Contractor</dt>
								</div>
								<dd className="text-lg text-white text-center">
									{report.generalInformation.contractor}
								</dd>
							</div>

							{/* Contract Amount Card */}
							<div className="bg-[#1192c3] p-4 rounded-lg shadow-sm transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-md">
								<div className="flex items-center mb-1 justify-center">
									<FaMoneyBill className="text-white text-lg mr-2" />
									<dt className="text-base font-bold text-white">
										Contract Amount
									</dt>
								</div>
								<dd className="text-lg text-white text-center">
									{report.generalInformation.contractAmount}
								</dd>
							</div>

							{/* Total Area Card */}
							<div className="bg-[#1192c3] p-4 rounded-lg shadow-sm transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-md">
								<div className="flex items-center mb-1 justify-center">
									<FaRulerCombined className="text-white text-lg mr-2" />
									<dt className="text-base font-bold text-white">Total Area</dt>
								</div>
								<dd className="text-lg text-white text-center">
									{report.area.total}
								</dd>
							</div>

							{/* Inaugurated Date Card */}
							<div className="bg-[#1192c3] p-4 rounded-lg shadow-sm transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-md">
								<div className="flex items-center justify-center mb-1">
									<FaCalendarAlt className="text-white text-lg mr-2" />
									<dt className="text-base font-bold text-white">
										{report.status === "completed"
											? "Date of Inauguration"
											: "Commencement Date"}
									</dt>
								</div>
								<dd className="text-lg text-white text-center">
									{report.status === "completed"
										? report.generalInformation.inauguratedDate
										: report.generalInformation.commencedDate}
								</dd>
							</div>
						</div>

						{/* Image Column */}
						<div className="relative h-96 rounded-lg overflow-hidden shadow-lg transform transition-all duration-300 ease-in-out hover:scale-102">
							<Image
								src={report.imageUrl}
								alt={report.title}
								fill
								className="object-cover transform transition-all duration-300 ease-in-out hover:scale-110"
							/>
						</div>
					</div>
				</motion.section>
			))}
		</div>
	);
};

const InfrastructurePage = () => {
	const [activeTab, setActiveTab] = useState<"completed" | "ongoing">(
		"completed"
	);

	// Updated reports data with status
	const reports: TechnicalReport[] = [
		// Completed projects
		{
			id: "report-0",
			status: "completed",
			title: "Mizoram State Health Care Society",
			imageUrl: "/images/healthcare.jpg",
			generalInformation: {
				name: "Repair and Renovation of MSHCS Office",
				contractor: "Brilliance Consultancy, M/S Lalhruaitluanga",
				contractAmount: "₹92.95 Lakhs",
				inauguratedDate: "15 February 2023",
			},
			area: { total: "1224 sqm" },
		},
		{
			id: "report-1",
			status: "completed",
			title: "CMO Office, Khawzawl",
			imageUrl: "/images/khawzawl.jpeg",
			generalInformation: {
				name: "Construction of CMO Office Building",
				contractor: "Lushai Engineers",
				contractAmount: "₹3.45 Crores",
				inauguratedDate: "15 March 2023",
			},
			area: { total: "650 sqm" },
		},
		{
			id: "report-2",
			status: "completed",
			title: "CMO Office, Saitual",
			imageUrl: "/images/saitual.jpeg",
			generalInformation: {
				name: "Construction of CMO Office Building",
				contractor: "Lushai Engineers",
				contractAmount: "₹3.20 Crores",
				inauguratedDate: "1 April 2023",
			},
			area: { total: "600 sqm" },
		},
		{
			id: "report-3",
			status: "completed",
			title: "CMO Office, Hnahthial",
			imageUrl: "/images/hnahthial.jpeg",
			generalInformation: {
				name: "Construction of CMO Office Building",
				contractor: "Lushai Engineers",
				contractAmount: "₹3.97 Crores",
				inauguratedDate: "17 December 2021",
			},
			area: { total: "1224 sqm" },
		},
		// Ongoing projects
		{
			id: "ongoing-1",
			status: "ongoing",
			title: "MCON",
			imageUrl: "/images/new-hospital.jpg",
			generalInformation: {
				name: "Strengthening & Upgradation of Mizoram College of Nursing (MCON)",
				contractor: "M/s Lalnunmawia",
				contractAmount: "₹6.49 Crores",
				commencedDate: "4 November 2024",
			},
			area: { total: "4500 sqm" },
		},
		{
			id: "ongoing-2",
			status: "ongoing",
			title: "Civil Hospital, Lunglei",
			imageUrl: "/images/lunglei.jpeg",
			generalInformation: {
				name: "Repair & Renovation of Civil Hospital, Lunglei",
				contractor: "Brilliant Consultancy",
				contractAmount: "₹4.59 Crores",
				commencedDate: "4 August 2024",
			},
			area: { total: "4500 sqm" },
		},
		{
			id: "ongoing-3",
			status: "ongoing",
			title: "Siaha District Hospital",
			imageUrl: "/images/siaha.jpeg",
			generalInformation: {
				name: "Repair & Renovation of Siaha District Hospital",
				contractor: "Zamzo Engineering Construction & Consultancy",
				contractAmount: "₹2.51 Crores",
				commencedDate: "5 August 2024",
			},
			area: { total: "4500 sqm" },
		},
		{
			id: "ongoing-4",
			status: "ongoing",
			title: "Champhai District Hospital",
			imageUrl: "/images/champhai.jpeg",
			generalInformation: {
				name: "Repair & Renovation of Champhai District Hospital",
				contractor: "M/s F Sangkunga",
				contractAmount: "₹2.22 Crores",
				commencedDate: "25 March 2024",
			},
			area: { total: "4500 sqm" },
		},
		{
			id: "ongoing-5",
			status: "ongoing",
			title: "Lawngtlai District Hospital",
			imageUrl: "/images/new-hospital.jpg",
			generalInformation: {
				name: "Repair & Renovation of Lawngtlai District Hospital",
				contractor: "MW Venture",
				contractAmount: "₹2.53 Crores",
				commencedDate: "25 March 2023",
			},
			area: { total: "4500 sqm" },
		},
		{
			id: "ongoing-6",
			status: "ongoing",
			title: "CMO Office, Hnahthial",
			imageUrl: "/images/new-hospital.jpg",
			generalInformation: {
				name: "Construction of Emergency Staircase and Lift Shaft at CMO, Hnahthial",
				contractor: "Babie Construction & Consultancy Services",
				contractAmount: "₹1.09 Crores",
				commencedDate: "25 March 2023",
			},
			area: { total: "4500 sqm" },
		},
		{
			id: "ongoing-7",
			status: "ongoing",
			title: "CMO Office, Saitual",
			imageUrl: "/images/new-hospital.jpg",
			generalInformation: {
				name: "Construction of Emergency Staircase and Lift Shaft at CMO, Saitual",
				contractor: "Babie Construction & Consultancy Services",
				contractAmount: "₹1.06 Crores",
				commencedDate: "25 March 2023",
			},
			area: { total: "4500 sqm" },
		},
		{
			id: "ongoing-8",
			status: "ongoing",
			title: "CMO Office, Khawzawl",
			imageUrl: "/images/new-hospital.jpg",
			generalInformation: {
				name: "Construction of Emergency Staircase and Lift Shaft at CMO, Khawzawl",
				contractor: "Creative Minds",
				contractAmount: "₹0.88 Crores",
				commencedDate: "25 March 2023",
			},
			area: { total: "4500 sqm" },
		},
	];

	const filteredReports = reports.filter(
		(report) => report.status === activeTab
	);

	return (
		<div className="min-h-screen bg-gray-50 mx-auto px-30">
			<PageTitle title="Infrastructure Development" />

			{/* Tab Navigation */}
			<div className="flex justify-center mt-10">
				<button
					onClick={() => setActiveTab("completed")}
					className={`px-6 py-2 mx-2 rounded-t-lg w-1/3 ${
						activeTab === "completed"
							? "bg-[#1192c3] text-white"
							: "bg-gray-200 text-gray-600 hover:bg-gray-300"
					}`}
				>
					Completed Projects
				</button>
				<button
					onClick={() => setActiveTab("ongoing")}
					className={`px-6 py-2 mx-2 rounded-t-lg w-1/3 ${
						activeTab === "ongoing"
							? "bg-[#1192c3] text-white"
							: "bg-gray-200 text-gray-600 hover:bg-gray-300"
					}`}
				>
					Ongoing Projects
				</button>
			</div>
			<TechnicalReportDisplay reports={filteredReports} />
		</div>
	);
};

export default InfrastructurePage;
