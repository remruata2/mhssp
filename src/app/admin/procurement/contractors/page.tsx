"use client";

import { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import SlideOver from "@/components/SlideOver";

interface Contractor {
	_id: string;
	name: string;
	email: string;
	phone: string;
	address: string;
	createdAt: string;
}

export default function ContractorsPage() {
	const [contractors, setContractors] = useState<Contractor[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [successMessage, setSuccessMessage] = useState<string | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [editingId, setEditingId] = useState("");

	const [formData, setFormData] = useState({
		name: "",
		email: "",
		phone: "",
		address: "",
	});

	useEffect(() => {
		fetchContractors();
	}, []);

	async function fetchContractors() {
		try {
			const response = await fetch("/api/procurement/contractors");
			const data = await response.json();
			if (data.success) {
				const sanitizedContractors = data.data.map(
					(contractor: Partial<Contractor>) => ({
						_id: contractor._id || "",
						name: contractor.name || "",
						email: contractor.email || "",
						phone: contractor.phone || "",
						address: contractor.address || "",
						createdAt: contractor.createdAt || new Date().toISOString(),
					})
				);
				setContractors(sanitizedContractors);
			} else {
				setError(data.error || "Failed to fetch contractors");
			}
		} catch {
			setError("Failed to fetch contractors");
		} finally {
			setLoading(false);
		}
	}

	async function handleEdit(contractor: Contractor) {
		setFormData({
			name: contractor.name,
			email: contractor.email || "",
			phone: contractor.phone || "",
			address: contractor.address || "",
		});
		setEditingId(contractor._id);
		setIsEditing(true);
		setIsModalOpen(true);
	}

	async function handleDelete(id: string) {
		if (!window.confirm("Are you sure you want to delete this contractor?")) {
			return;
		}

		try {
			const response = await fetch(`/api/procurement/contractors/${id}`, {
				method: "DELETE",
			});
			const data = await response.json();

			if (data.success) {
				setSuccessMessage("Contractor deleted successfully");
				setContractors(contractors.filter((c) => c._id !== id));
				setTimeout(() => setSuccessMessage(null), 3000);
			} else {
				setError(data.error || "Failed to delete contractor");
				setTimeout(() => setError(null), 3000);
			}
		} catch {
			setError("Failed to delete contractor");
			setTimeout(() => setError(null), 3000);
		}
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setLoading(true);
		setError(null);

		try {
			// Validate form data
			if (!formData.name.trim()) {
				setError("Contractor name is required");
				setLoading(false);
				return;
			}

			if (
				formData.email &&
				!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)
			) {
				setError("Please enter a valid email address");
				setLoading(false);
				return;
			}

			if (
				formData.phone &&
				!/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(
					formData.phone
				)
			) {
				setError("Please enter a valid phone number");
				setLoading(false);
				return;
			}

			const url = isEditing
				? `/api/procurement/contractors/${editingId}`
				: "/api/procurement/contractors";

			const response = await fetch(url, {
				method: isEditing ? "PUT" : "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});

			const data = await response.json();

			if (data.success) {
				setSuccessMessage(
					isEditing
						? "Contractor updated successfully"
						: "Contractor created successfully"
				);
				fetchContractors();
				setIsModalOpen(false);
				setFormData({
					name: "",
					email: "",
					phone: "",
					address: "",
				});
				setIsEditing(false);
				setEditingId("");
			} else {
				setError(data.error || "Failed to save contractor");
			}
		} catch {
			setError("Failed to save contractor");
		} finally {
			setLoading(false);
		}
	}

	const handleAdd = () => {
		setIsEditing(false);
		setEditingId("");
		setFormData({
			name: "",
			email: "",
			phone: "",
			address: "",
		});
		setIsModalOpen(true);
	};

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	if (loading && contractors.length === 0) {
		return (
			<div className="flex justify-center items-center min-h-screen">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
			</div>
		);
	}

	return (
		<div className="max-w-7xl mx-auto p-4">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-2xl font-bold text-gray-800">Contractors</h1>
				<button
					onClick={handleAdd}
					className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center gap-2"
				>
					<FaPlus className="h-4 w-4" />
					Add Contractor
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

			<div className="mt-8">
				<div className="overflow-x-auto">
					<div className="inline-block min-w-full align-middle">
						<div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
							<table className="min-w-full table-fixed divide-y divide-gray-300">
								<thead className="bg-gray-50">
									<tr>
										<th className="w-1/6 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Name
										</th>
										<th className="w-1/6 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Email
										</th>
										<th className="w-1/6 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Phone
										</th>
										<th className="w-2/6 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Address
										</th>
										<th className="w-1/6 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Actions
										</th>
									</tr>
								</thead>
								<tbody className="bg-white divide-y divide-gray-200">
									{contractors.map((contractor) => (
										<tr key={contractor._id} className="hover:bg-gray-50">
											<td className="px-6 py-4 text-sm text-gray-900 truncate">
												{contractor.name}
											</td>
											<td className="px-6 py-4 text-sm text-gray-900 truncate">
												{contractor.email}
											</td>
											<td className="px-6 py-4 text-sm text-gray-900 truncate">
												{contractor.phone}
											</td>
											<td className="px-6 py-4 text-sm text-gray-900 truncate">
												{contractor.address}
											</td>
											<td className="px-6 py-4 text-sm text-gray-900">
												<div className="flex space-x-3">
													<button
														onClick={() => handleEdit(contractor)}
														className="text-blue-600 hover:text-blue-900"
													>
														<FaEdit className="h-4 w-4" />
													</button>
													<button
														onClick={() => handleDelete(contractor._id)}
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
					</div>
				</div>
			</div>

			<SlideOver
				title={isEditing ? "Edit Contractor" : "Add Contractor"}
				isOpen={isModalOpen}
				onClose={() => {
					setIsModalOpen(false);
					setFormData({
						name: "",
						email: "",
						phone: "",
						address: "",
					});
					setIsEditing(false);
					setEditingId("");
				}}
			>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label htmlFor="name" className="form-label">
							Contractor Name <span className="text-red-500">*</span>
						</label>
						<input
							type="text"
							id="name"
							name="name"
							value={formData.name}
							onChange={handleChange}
							className="form-input"
							required
							minLength={2}
							maxLength={100}
						/>
						<p className="mt-1 text-xs text-gray-500">
							{formData.name.length}/100 characters
						</p>
					</div>

					<div>
						<label htmlFor="email" className="form-label">
							Email Address
						</label>
						<input
							type="email"
							id="email"
							name="email"
							value={formData.email}
							onChange={handleChange}
							className="form-input"
							maxLength={100}
						/>
					</div>

					<div>
						<label htmlFor="phone" className="form-label">
							Phone Number
						</label>
						<input
							type="tel"
							id="phone"
							name="phone"
							value={formData.phone}
							onChange={handleChange}
							className="form-input"
							pattern="[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}"
						/>
					</div>

					<div>
						<label htmlFor="address" className="form-label">
							Address
						</label>
						<textarea
							id="address"
							name="address"
							value={formData.address}
							onChange={handleChange}
							className="form-textarea"
							maxLength={300}
							rows={4}
						/>
						<p className="mt-1 text-xs text-gray-500">
							{formData.address.length}/300 characters
						</p>
					</div>

					<div className="flex justify-end gap-3 mt-6">
						<button
							type="button"
							onClick={() => {
								setIsModalOpen(false);
								setFormData({
									name: "",
									email: "",
									phone: "",
									address: "",
								});
								setIsEditing(false);
								setEditingId("");
							}}
							className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={loading}
							className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
						>
							{loading ? (
								<span className="flex items-center gap-2">
									<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
									Saving...
								</span>
							) : isEditing ? (
								"Update"
							) : (
								"Create"
							)}
						</button>
					</div>
				</form>
			</SlideOver>
		</div>
	);
}
