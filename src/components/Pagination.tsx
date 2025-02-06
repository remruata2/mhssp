"use client";

import React from "react";

interface PaginationProps {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
}

export default function Pagination({
	currentPage,
	totalPages,
	onPageChange,
}: PaginationProps) {
	const pageNumbers = [];
	const maxVisiblePages = 5;

	let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
	const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

	if (endPage - startPage + 1 < maxVisiblePages) {
		startPage = Math.max(1, endPage - maxVisiblePages + 1);
	}

	for (let i = startPage; i <= endPage; i++) {
		pageNumbers.push(i);
	}

	if (totalPages <= 1) return null;

	return (
		<nav
			className="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6"
			aria-label="Pagination"
		>
			<div className="hidden sm:block">
				<p className="text-sm text-gray-700">
					Showing page <span className="font-medium">{currentPage}</span> of{" "}
					<span className="font-medium">{totalPages}</span>
				</p>
			</div>
			<div className="flex flex-1 justify-between sm:justify-end">
				<button
					onClick={() => onPageChange(currentPage - 1)}
					disabled={currentPage === 1}
					className="relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed mr-2"
				>
					Previous
				</button>
				<div className="hidden md:flex">
					{startPage > 1 && (
						<>
							<button
								onClick={() => onPageChange(1)}
								className="relative inline-flex items-center px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 mx-1 rounded-md"
							>
								1
							</button>
							{startPage > 2 && (
								<span className="relative inline-flex items-center px-3 py-2 text-sm font-semibold text-gray-700">
									...
								</span>
							)}
						</>
					)}
					{pageNumbers.map((number) => (
						<button
							key={number}
							onClick={() => onPageChange(number)}
							className={`relative inline-flex items-center px-3 py-2 text-sm font-semibold mx-1 rounded-md ${
								currentPage === number
									? "bg-indigo-600 text-white"
									: "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
							}`}
						>
							{number}
						</button>
					))}
					{endPage < totalPages && (
						<>
							{endPage < totalPages - 1 && (
								<span className="relative inline-flex items-center px-3 py-2 text-sm font-semibold text-gray-700">
									...
								</span>
							)}
							<button
								onClick={() => onPageChange(totalPages)}
								className="relative inline-flex items-center px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 mx-1 rounded-md"
							>
								{totalPages}
							</button>
						</>
					)}
				</div>
				<button
					onClick={() => onPageChange(currentPage + 1)}
					disabled={currentPage === totalPages}
					className="relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed ml-2"
				>
					Next
				</button>
			</div>
		</nav>
	);
}
