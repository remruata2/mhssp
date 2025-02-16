"use client";

import { useState, useEffect, use, useCallback } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import SlideOver from "@/components/SlideOver";
import Link from "next/link";

interface RFIndicator {
	_id: string;
	indicator: string;
	baseline: string;
	yearOneTarget: string;
	yearTwoTarget: string;
	yearThreeTarget: string;
	yearFourTarget: string;
	yearFiveTarget: string;
}

interface RFStatus {
	_id: string;
	rfId: string;
	status: string;
	year: number;
	quarter: number;
	createdAt: string;
	remark?: string;
}

export default function RFStatusPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const resolvedParams = use(params);
	const [indicator, setIndicator] = useState<RFIndicator | null>(null);
	const [statuses, setStatuses] = useState<RFStatus[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [successMessage, setSuccessMessage] = useState<string | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [editingId, setEditingId] = useState("");

	const [formData, setFormData] = useState({
		status: "",
		year: 2021,
		quarter: 1,
		remark: "",
	});

	const fetchIndicator = useCallback(async () => {
		try {
			const response = await fetch(`/api/rf/${resolvedParams.id}`);
			const data = await response.json();
			if (data.success) {
				setIndicator(data.data);
			} else {
				setError(data.error);
			}
		} catch (error) {
			setError("Failed to fetch indicator");
		}
	}, [resolvedParams.id]);

	const fetchStatuses = useCallback(async () => {
		try {
			const response = await fetch(`/api/rf-status?rfId=${resolvedParams.id}`);
			const data = await response.json();
			if (data.success) {
				setStatuses(data.data);
			} else {
				setError(data.error);
			}
		} catch (error) {
			setError("Failed to fetch statuses");
		} finally {
			setLoading(false);
		}
	}, [resolvedParams.id]);

	useEffect(() => {
		fetchIndicator();
		fetchStatuses();
	}, [fetchIndicator, fetchStatuses]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setSuccessMessage(null);

		try {
			const url = isEditing ? `/api/rf-status/${editingId}` : "/api/rf-status";
			const method = isEditing ? "PUT" : "POST";

			const response = await fetch(url, {
				method,
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					...formData,
					rfId: resolvedParams.id,
				}),
			});

			const data = await response.json();

			if (data.success) {
				setSuccessMessage(
					isEditing
						? "Status updated successfully!"
						: "Status added successfully!"
				);
				resetForm();
				fetchStatuses();
				setIsModalOpen(false);
			} else {
				setError(data.error || "Failed to save status");
			}
		} catch (error) {
			setError("Failed to save status");
		}
	};

	const handleEdit = (status: RFStatus) => {
		setFormData({
			status: status.status,
			year: status.year,
			quarter: status.quarter,
			remark: status.remark || "",
		});
		setIsEditing(true);
		setEditingId(status._id);
		setIsModalOpen(true);
	};

	const handleDelete = async (id: string) => {
		if (!confirm("Are you sure you want to delete this status?")) return;

		try {
			const response = await fetch(`/api/rf-status/${id}`, {
				method: "DELETE",
			});

			const data = await response.json();
			if (data.success) {
				setSuccessMessage("Status deleted successfully!");
				fetchStatuses();
			} else {
				setError(data.error || "Failed to delete status");
			}
		} catch {
			setError("Failed to delete status");
		}
	};

	const resetForm = () => {
		setFormData({
			status: "",
			year: 2021,
			quarter: 1,
			remark: "",
		});
		setIsEditing(false);
		setEditingId("");
		setError(null);
	};

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>
	) => {
		const value =
			e.target.type === "number" ? parseInt(e.target.value) : e.target.value;
		setFormData({ ...formData, [e.target.name]: value });
	};

	if (loading) {
		return (
			<div className="flex justify-center items-center min-h-screen">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
			</div>
		);
	}

	return (
		<div className="max-w-7xl mx-auto p-4">
			<div className="flex justify-between items-center mb-6">
				<div>
					<Link
						href="/admin/rf"
						className="text-blue-600 hover:underline mb-2 block"
					>
						← Back to Result Framework
					</Link>
					<h1 className="text-2xl font-bold text-gray-800">
						Status Updates for Indicator
					</h1>
					{indicator && (
						<p className="mt-2 text-gray-600">{indicator.indicator}</p>
					)}
				</div>
				<button
					onClick={() => {
						resetForm();
						setIsModalOpen(true);
					}}
					className="bg-[#1192c3] text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center gap-2"
				>
					<FaPlus className="h-4 w-4" />
					Add Status
				</button>
			</div>

			{error && (
				<div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
					{error}
				</div>
			)}

			{successMessage && (
				<div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
					{successMessage}
				</div>
			)}

			<div className="bg-white rounded-lg shadow-md overflow-hidden">
				<table className="min-w-full divide-y divide-gray-200">
					<thead className="bg-gray-50">
						<tr>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Year
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Quarter
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Status
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Remark
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Last Updated
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Actions
							</th>
						</tr>
					</thead>
					<tbody className="bg-white divide-y divide-gray-200">
						{statuses.map((status) => (
							<tr key={status._id} className="hover:bg-gray-50">
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
									{status.year}
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
									Q{status.quarter}
								</td>
								<td className="px-6 py-4 whitespace-normal text-sm text-gray-900">
									{status.status}
								</td>
								<td className="px-6 py-4 whitespace-normal text-sm text-gray-900">
									{status.remark}
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
									{new Date(status.createdAt).toLocaleDateString()}
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
									<div className="flex space-x-2">
										<button
											onClick={() => handleEdit(status)}
											className="text-blue-600 hover:text-blue-900"
										>
											<FaEdit className="h-4 w-4" />
										</button>
										<button
											onClick={() => handleDelete(status._id)}
											className="text-red-600 hover:text-red-900"
										>
											<FaTrash className="h-4 w-4" />
										</button>
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			<SlideOver
				title={isEditing ? "Edit Status" : "Add New Status"}
				isOpen={isModalOpen}
				onClose={() => {
					setIsModalOpen(false);
					resetForm();
				}}
			>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label htmlFor="year" className="form-label">
							Year <span className="text-red-500">*</span>
						</label>
						<select
							id="year"
							name="year"
							value={formData.year}
							onChange={handleChange}
							className="form-select"
							required
						>
							<option value={2021}>2021</option>
							<option value={2022}>2022</option>
							<option value={2023}>2023</option>
							<option value={2024}>2024</option>
							<option value={2025}>2025</option>
						</select>
					</div>

					<div>
						<label htmlFor="quarter" className="form-label">
							Quarter <span className="text-red-500">*</span>
						</label>
						<select
							id="quarter"
							name="quarter"
							value={formData.quarter}
							onChange={handleChange}
							className="form-select"
							required
						>
							<option value={1}>Q1</option>
							<option value={2}>Q2</option>
							<option value={3}>Q3</option>
							<option value={4}>Q4</option>
						</select>
					</div>

					<div>
						<label htmlFor="status" className="form-label">
							Status <span className="text-red-500">*</span>
						</label>
						<textarea
							id="status"
							name="status"
							value={formData.status}
							onChange={handleChange}
							className="form-textarea"
							required
							rows={4}
						/>
					</div>

					<div>
						<label htmlFor="remark" className="form-label">
							Remark
						</label>
						<textarea
							id="remark"
							name="remark"
							value={formData.remark}
							onChange={handleChange}
							className="form-textarea"
							rows={2}
						/>
					</div>

					<div className="flex justify-end gap-3 mt-6">
						<button
							type="button"
							onClick={() => {
								setIsModalOpen(false);
								resetForm();
							}}
							className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
						>
							Cancel
						</button>
						<button
							type="submit"
							className="px-4 py-2 bg-[#1192c3] text-white rounded-md hover:bg-indigo-700"
						>
							{isEditing ? "Update" : "Save"}
						</button>
					</div>
				</form>
			</SlideOver>
		</div>
	);
}
