"use client";

import React, { useState, useEffect } from "react";
import {
	FaFilePdf,
	FaChevronRight,
	FaHashtag,
	FaBuilding,
	FaTag,
	FaExclamationTriangle,
} from "react-icons/fa";
import { Notice, SubNotice } from "@/types/notice";

interface NoticeProps {
	notice: Notice;
}

const SubNoticesList = ({ noticeId }: { noticeId: string }) => {
	const [subNotices, setSubNotices] = useState<SubNotice[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchSubNotices = async () => {
			try {
				const response = await fetch(`/api/notices/${noticeId}/subnotices`);
				if (!response.ok) {
					throw new Error("Failed to fetch sub notices");
				}
				const data = await response.json();
				if (data.success) {
					setSubNotices(data.data);
				} else {
					setError(data.error || "Error fetching sub notices");
				}
			} catch (error) {
				const errorMessage =
					error instanceof Error ? error.message : "An error occurred";
				setError(errorMessage);
			} finally {
				setLoading(false);
			}
		};

		fetchSubNotices();
	}, [noticeId]);

	if (loading)
		return (
			<div className="text-sm text-gray-500 pl-8">Loading sub notices...</div>
		);
	if (error) return <div className="text-sm text-red-500 pl-8">{error}</div>;

	return (
		<div className="mt-4 space-y-3">
			{subNotices.map((subNotice) => (
				<div
					key={subNotice._id}
					className="flex items-start pl-4 border-l-2 border-gray-200"
				>
					<FaChevronRight className="mt-1 mr-2 text-gray-400" />
					<div className="flex-1">
						<a
							href={subNotice.documentUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="text-sm text-gray-700 hover:text-[#1192c3] font-medium"
						>
							{subNotice.title}
						</a>
						{subNotice.referenceNumber && (
							<div className="flex items-center mt-1 text-xs text-gray-500">
								<FaHashtag className="mr-1" />
								<span>{subNotice.referenceNumber}</span>
							</div>
						)}
						{subNotice.description && (
							<p className="mt-1 text-sm text-gray-600">
								{subNotice.description}
							</p>
						)}
					</div>
				</div>
			))}
		</div>
	);
};

export default function NoticeComponent({ notice }: NoticeProps) {
	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	const noticeUrl =
		notice.type === "document" ? notice.documentUrl : notice.url;

	const getPriorityColor = (priority?: string) => {
		switch (priority) {
			case "high":
				return "text-red-600";
			case "medium":
				return "text-orange-600";
			case "low":
				return "text-green-600";
			default:
				return "text-gray-600";
		}
	};

	return (
		<div className="bg-white border border-gray-200 p-6 transition-all duration-200 hover:border-gray-300">
			{/* Notice Header */}
			<div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
				<div className="flex items-center"></div>

				{notice.referenceNumber && (
					<div className="flex items-center">
						<FaHashtag className="mr-2" />
						<span>{notice.referenceNumber}</span>
					</div>
				)}

				{notice.department && (
					<div className="flex items-center">
						<FaBuilding className="mr-2" />
						<span>{notice.department}</span>
					</div>
				)}

				{notice.category && (
					<div className="flex items-center">
						<FaTag className="mr-2" />
						<span>{notice.category}</span>
					</div>
				)}

				{notice.priority && (
					<div
						className={`flex items-center ${getPriorityColor(notice.priority)}`}
					>
						<FaExclamationTriangle className="mr-2" />
						<span className="uppercase text-xs font-medium">
							{notice.priority} Priority
						</span>
					</div>
				)}

				{notice.type === "document" && (
					<div className="flex items-center text-red-600">
						<FaFilePdf className="mr-1" />
						<span className="text-xs uppercase font-medium">PDF</span>
					</div>
				)}
			</div>

			{/* Notice Content */}
			{notice.type === "subNotices" ? (
				<>
					<h3 className="text-lg font-semibold text-gray-800 mb-2">
						{notice.title}
					</h3>
					{notice.description && (
						<p className="text-gray-600 mb-4">{notice.description}</p>
					)}
					<SubNoticesList noticeId={notice._id} />
				</>
			) : (
				<a
					href={noticeUrl}
					target="_blank"
					rel="noopener noreferrer"
					className="block group"
				>
					<h3 className="text-lg font-semibold text-gray-800 group-hover:text-[#1192c3] transition-colors duration-200">
						{notice.title}
					</h3>
					{notice.description && (
						<p className="mt-2 text-gray-600">{notice.description}</p>
					)}
				</a>
			)}

			{/* Expiry Date if available */}
			{notice.expiryDate && (
				<div className="mt-4 text-sm text-gray-500">
					Expires on: {formatDate(notice.expiryDate)}
				</div>
			)}
		</div>
	);
}
