"use client";

import { useState, useEffect } from "react";
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
	createdAt: string;
}

export default function RFPage() {
	const [indicators, setIndicators] = useState<RFIndicator[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [successMessage, setSuccessMessage] = useState<string | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [editingId, setEditingId] = useState("");

	const [formData, setFormData] = useState({
		indicator: "",
		baseline: "",
		yearOneTarget: "",
		yearTwoTarget: "",
		yearThreeTarget: "",
		yearFourTarget: "",
		yearFiveTarget: "",
	});

	useEffect(() => {
		fetchIndicators();
	}, []);

	const fetchIndicators = async () => {
		try {
			const response = await fetch("/api/rf");
			const data = await response.json();
			if (data.success) {
				setIndicators(data.data);
			} else {
				setError(data.error);
			}
		} catch (error) {
			setError("Failed to fetch indicators");
		} finally {
			setLoading(false);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setSuccessMessage(null);

		try {
			const url = isEditing ? `/api/rf/${editingId}` : "/api/rf";
			const method = isEditing ? "PUT" : "POST";

			const response = await fetch(url, {
				method,
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});

			const data = await response.json();

			if (data.success) {
				setSuccessMessage(
					isEditing ? "Indicator updated successfully!" : "Indicator added successfully!"
				);
				resetForm();
				fetchIndicators();
				setIsModalOpen(false);
			} else {
				setError(data.error || "Failed to save indicator");
			}
		} catch (error) {
			setError("Failed to save indicator");
		}
	};

	const handleEdit = (indicator: RFIndicator) => {
		setFormData({
			indicator: indicator.indicator,
			baseline: indicator.baseline,
			yearOneTarget: indicator.yearOneTarget,
			yearTwoTarget: indicator.yearTwoTarget,
			yearThreeTarget: indicator.yearThreeTarget,
			yearFourTarget: indicator.yearFourTarget,
			yearFiveTarget: indicator.yearFiveTarget,
		});
		setIsEditing(true);
		setEditingId(indicator._id);
		setIsModalOpen(true);
	};

	const handleDelete = async (id: string) => {
		if (!confirm("Are you sure you want to delete this indicator?")) return;

		try {
			const response = await fetch(`/api/rf/${id}`, {
				method: "DELETE",
			});

			const data = await response.json();
			if (data.success) {
				setSuccessMessage("Indicator deleted successfully!");
				fetchIndicators();
			} else {
				setError(data.error || "Failed to delete indicator");
			}
		} catch {
			setError("Failed to delete indicator");
		}
	};

	const resetForm = () => {
		setFormData({
			indicator: "",
			baseline: "",
			yearOneTarget: "",
			yearTwoTarget: "",
			yearThreeTarget: "",
			yearFourTarget: "",
			yearFiveTarget: "",
		});
		setIsEditing(false);
		setEditingId("");
		setError(null);
	};

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
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
				<h1 className="text-2xl font-bold text-gray-800">Result Framework</h1>
				<button
					onClick={() => {
						resetForm();
						setIsModalOpen(true);
					}}
					className="bg-[#1192c3] text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center gap-2"
				>
					<FaPlus className="h-4 w-4" />
					Add Indicator
				</button>
			</div>

			{error && (
				<div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">{error}</div>
			)}

			{successMessage && (
				<div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
					{successMessage}
				</div>
			)}

			<div className="bg-white rounded-lg shadow-md overflow-hidden">
				<div className="overflow-x-auto">
					<table className="min-w-full divide-y divide-gray-200">
						<thead className="bg-gray-50">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Indicator
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Baseline
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Year 1
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Year 2
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Year 3
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Year 4
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Year 5
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Actions
								</th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-200">
							{indicators.map((indicator) => (
								<tr key={indicator._id} className="hover:bg-gray-50">
									<td className="px-6 py-4 whitespace-normal text-sm text-gray-900">
										{indicator.indicator}
									</td>
									<td className="px-6 py-4 whitespace-normal text-sm text-gray-900">
										{indicator.baseline}
									</td>
									<td className="px-6 py-4 whitespace-normal text-sm text-gray-900">
										{indicator.yearOneTarget}
									</td>
									<td className="px-6 py-4 whitespace-normal text-sm text-gray-900">
										{indicator.yearTwoTarget}
									</td>
									<td className="px-6 py-4 whitespace-normal text-sm text-gray-900">
										{indicator.yearThreeTarget}
									</td>
									<td className="px-6 py-4 whitespace-normal text-sm text-gray-900">
										{indicator.yearFourTarget}
									</td>
									<td className="px-6 py-4 whitespace-normal text-sm text-gray-900">
										{indicator.yearFiveTarget}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
										<div className="flex space-x-2">
											<button
												onClick={() => handleEdit(indicator)}
												className="text-blue-600 hover:text-blue-900"
											>
												<FaEdit className="h-4 w-4" />
											</button>
											<button
												onClick={() => handleDelete(indicator._id)}
												className="text-red-600 hover:text-red-900"
											>
												<FaTrash className="h-4 w-4" />
											</button>
											<Link
												href={`/admin/rf/${indicator._id}/status`}
												className="text-green-600 hover:text-green-900"
											>
												Status
											</Link>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>

			<SlideOver
				title={isEditing ? "Edit Indicator" : "Add New Indicator"}
				isOpen={isModalOpen}
				onClose={() => {
					setIsModalOpen(false);
					resetForm();
				}}
			>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label htmlFor="indicator" className="form-label">
							Indicator <span className="text-red-500">*</span>
						</label>
						<textarea
							id="indicator"
							name="indicator"
							value={formData.indicator}
							onChange={handleChange}
							className="form-textarea"
							required
							rows={3}
						/>
					</div>

					<div>
						<label htmlFor="baseline" className="form-label">
							Baseline
						</label>
						<input
							type="text"
							id="baseline"
							name="baseline"
							value={formData.baseline}
							onChange={handleChange}
							className="form-input"
						/>
					</div>

					<div>
						<label htmlFor="yearOneTarget" className="form-label">
							Year 1 Target <span className="text-red-500">*</span>
						</label>
						<input
							type="text"
							id="yearOneTarget"
							name="yearOneTarget"
							value={formData.yearOneTarget}
							onChange={handleChange}
							className="form-input"
							required
						/>
					</div>

					<div>
						<label htmlFor="yearTwoTarget" className="form-label">
							Year 2 Target <span className="text-red-500">*</span>
						</label>
						<input
							type="text"
							id="yearTwoTarget"
							name="yearTwoTarget"
							value={formData.yearTwoTarget}
							onChange={handleChange}
							className="form-input"
							required
						/>
					</div>

					<div>
						<label htmlFor="yearThreeTarget" className="form-label">
							Year 3 Target <span className="text-red-500">*</span>
						</label>
						<input
							type="text"
							id="yearThreeTarget"
							name="yearThreeTarget"
							value={formData.yearThreeTarget}
							onChange={handleChange}
							className="form-input"
							required
						/>
					</div>

					<div>
						<label htmlFor="yearFourTarget" className="form-label">
							Year 4 Target <span className="text-red-500">*</span>
						</label>
						<input
							type="text"
							id="yearFourTarget"
							name="yearFourTarget"
							value={formData.yearFourTarget}
							onChange={handleChange}
							className="form-input"
							required
						/>
					</div>

					<div>
						<label htmlFor="yearFiveTarget" className="form-label">
							Year 5 Target
						</label>
						<input
							type="text"
							id="yearFiveTarget"
							name="yearFiveTarget"
							value={formData.yearFiveTarget}
							onChange={handleChange}
							className="form-input"
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