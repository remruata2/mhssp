"use client";

import React, { useState, useEffect } from "react";
import { Notice } from "@/types/notice";
import NoticeComponent from "@/components/Notice";
import PageTitle from "@/components/ui/PageTitle";
import { motion } from "framer-motion";
import { FaSearch, FaCalendarAlt } from "react-icons/fa";

interface GroupedNotices {
	[key: string]: Notice[];
}

export default function NoticesPage() {
	const [notices, setNotices] = useState<Notice[]>([]);
	const [loading, setLoading] = useState(true);
	const [filteredNotices, setFilteredNotices] = useState<Notice[]>([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [dateFilter, setDateFilter] = useState("");

	useEffect(() => {
		const fetchNotices = async () => {
			try {
				const response = await fetch("/api/notices");
				const data = await response.json();
				if (data.success) {
					// Sort notices by date in descending order
					const sortedNotices = data.data.sort(
						(a: Notice, b: Notice) =>
							new Date(b.publishDate).getTime() -
							new Date(a.publishDate).getTime()
					);
					setNotices(sortedNotices);
					setFilteredNotices(sortedNotices);
				}
			} catch {
				console.error("Error fetching notices:");
			} finally {
				setLoading(false);
			}
		};

		fetchNotices();
	}, []);

	useEffect(() => {
		const filterNotices = () => {
			let filtered = [...notices];

			// Apply search filter
			if (searchQuery.trim()) {
				filtered = filtered.filter((notice) =>
					notice.title.toLowerCase().includes(searchQuery.toLowerCase())
				);
			}

			// Apply date filter
			if (dateFilter) {
				const filterDate = new Date(dateFilter);
				filtered = filtered.filter((notice) => {
					const noticeDate = new Date(notice.publishDate);
					return (
						noticeDate.getFullYear() === filterDate.getFullYear() &&
						noticeDate.getMonth() === filterDate.getMonth() &&
						noticeDate.getDate() === filterDate.getDate()
					);
				});
			}

			setFilteredNotices(filtered);
		};

		filterNotices();
	}, [notices, searchQuery, dateFilter]);

	const groupNoticesByDate = (notices: Notice[]): GroupedNotices => {
		return notices.reduce((groups: GroupedNotices, notice) => {
			const date = new Date(notice.publishDate);
			const dateStr = date.toLocaleDateString("en-US", {
				year: "numeric",
				month: "long",
				day: "numeric",
			});

			if (!groups[dateStr]) {
				groups[dateStr] = [];
			}
			groups[dateStr].push(notice);
			return groups;
		}, {});
	};

	const groupedNotices = groupNoticesByDate(filteredNotices);

	return (
		<div className="min-h-screen bg-gray-50">
			<PageTitle
				title="Notice Board"
				subtitle="Important notices and announcements from MHSSP"
			/>

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="container mx-auto"
				>
					{/* Search and Filter Section */}
					<div className="bg-white border border-gray-200 p-6 mb-8">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div className="relative">
								<label
									htmlFor="search"
									className="block text-sm font-medium text-gray-700 mb-2"
								>
									Search Notices
								</label>
								<div className="relative">
									<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
										<FaSearch className="h-5 w-5 text-gray-400" />
									</div>
									<input
										type="text"
										id="search"
										placeholder="Search by title..."
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
										className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
									/>
								</div>
							</div>

							<div>
								<label
									htmlFor="date"
									className="block text-sm font-medium text-gray-700 mb-2"
								>
									Filter by Date
								</label>
								<div className="relative">
									<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
										<FaCalendarAlt className="h-5 w-5 text-gray-400" />
									</div>
									<input
										type="date"
										id="date"
										value={dateFilter}
										onChange={(e) => setDateFilter(e.target.value)}
										className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
									/>
								</div>
								{dateFilter && (
									<button
										onClick={() => setDateFilter("")}
										className="mt-2 text-sm text-gray-600 hover:text-gray-900"
									>
										Clear Date Filter
									</button>
								)}
							</div>
						</div>
					</div>

					{/* Notices Section */}
					<div className="space-y-6">
						{loading ? (
							<div className="flex justify-center items-center h-64 bg-white border border-gray-200">
								<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
							</div>
						) : filteredNotices.length === 0 ? (
							<div className="bg-white border border-gray-200 p-12 text-center">
								<p className="text-gray-500">No notices found</p>
							</div>
						) : (
							Object.entries(groupedNotices).map(([date, notices]) => (
								<div key={date} className="space-y-4">
									<div className="flex items-center">
										<FaCalendarAlt className="h-5 w-5 text-[#1192c3]" />
										<h2 className="px-4 text-lg font-semibold text-[#1192c3]">
											{date}
										</h2>
									</div>
									<div className="space-y-4">
										{notices.map((notice) => (
											<NoticeComponent key={notice._id} notice={notice} />
										))}
									</div>
								</div>
							))
						)}
					</div>
				</motion.div>
			</div>
		</div>
	);
}
