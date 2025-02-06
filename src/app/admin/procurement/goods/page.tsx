"use client";

import { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import SearchAndFilter from "@/components/SearchAndFilter";
import Pagination from "@/components/Pagination";
import SlideOver from "@/components/SlideOver";

interface Contractor {
	_id: string;
	name: string;
}

interface GoodsCategory {
	_id: string;
	name: string;
}

interface GoodsProcurement {
	_id: string;
	referenceNo: string;
	goodsCategory: GoodsCategory;
	goodsName: string;
	quantity: number;
	contractSignedDate: string;
	contractor: Contractor;
	createdAt: string;
}

export default function GoodsPage() {
	const [goods, setGoods] = useState<GoodsProcurement[]>([]);
	const [contractors, setContractors] = useState<Contractor[]>([]);
	const [categories, setCategories] = useState<GoodsCategory[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [searchTerm, setSearchTerm] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const itemsPerPage = 10;

	const [formData, setFormData] = useState({
		referenceNo: "",
		goodsCategory: "",
		goodsName: "",
		quantity: "",
		contractSignedDate: "",
		contractor: "",
	});
	const [isEditing, setIsEditing] = useState(false);
	const [editingId, setEditingId] = useState("");

	useEffect(() => {
		fetchGoods();
		fetchContractors();
		fetchCategories();
	}, []);

	async function fetchContractors() {
		try {
			const response = await fetch("/api/procurement/contractors");
			const data = await response.json();
			if (data.success) {
				setContractors(data.data);
			} else {
				setError(data.error || "Failed to fetch contractors");
			}
		} catch (_error) {
			console.error("Error fetching contractors:", _error);
			setError("Failed to fetch contractors");
		}
	}

	async function fetchCategories() {
		try {
			const response = await fetch("/api/procurement/goods/categories");
			const data = await response.json();
			if (data.success) {
				setCategories(data.data);
			} else {
				console.error("Failed to fetch categories:", data.error);
			}
		} catch (error) {
			console.error("Error fetching categories:", error);
		}
	}

	async function fetchGoods() {
		try {
			setLoading(true);
			const response = await fetch("/api/procurement/goods");
			const data = await response.json();
			if (data.success) {
				setGoods(data.data);
			} else {
				setError(data.error);
			}
		} catch (error) {
			console.error("Error fetching goods:", error);
			setError("Failed to fetch goods");
		} finally {
			setLoading(false);
		}
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setLoading(true);
		setError("");

		try {
			// Validate all required fields
			if (
				!formData.referenceNo.trim() ||
				!formData.goodsName.trim() ||
				!formData.goodsCategory ||
				!formData.contractor ||
				!formData.contractSignedDate ||
				!formData.quantity
			) {
				setError("All fields are required");
				setLoading(false);
				return;
			}

			const selectedContractor = contractors.find(
				(c) => c._id === formData.contractor
			);
			const selectedCategory = categories.find(
				(c) => c._id === formData.goodsCategory
			);

			if (!selectedContractor) {
				setError("Please select a contractor");
				setLoading(false);
				return;
			}

			if (!selectedCategory) {
				setError("Please select a category");
				setLoading(false);
				return;
			}

			if (Number(formData.quantity) <= 0) {
				setError("Quantity must be greater than 0");
				setLoading(false);
				return;
			}

			const goodsData = {
				...formData,
				contractor: selectedContractor._id,
				goodsCategory: selectedCategory._id,
				quantity: Number(formData.quantity),
			};

			const url = isEditing
				? `/api/procurement/goods/${editingId}`
				: "/api/procurement/goods";
			const method = isEditing ? "PUT" : "POST";

			const response = await fetch(url, {
				method,
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(goodsData),
			});

			const data = await response.json();

			if (data.success) {
				resetForm();
				fetchGoods();
				setIsModalOpen(false);
			} else {
				setError(data.error || "Failed to save goods procurement");
			}
		} catch (error) {
			setError("Failed to save goods procurement");
			console.log(error);
		} finally {
			setLoading(false);
		}
	}

	async function handleDelete(id: string) {
		if (
			!window.confirm("Are you sure you want to delete this goods procurement?")
		) {
			return;
		}

		try {
			const response = await fetch(`/api/procurement/goods/${id}`, {
				method: "DELETE",
			});

			const data = await response.json();

			if (data.success) {
				setGoods(goods.filter((g) => g._id !== id));
			} else {
				setError(data.error || "Failed to delete goods procurement");
			}
		} catch (_error) {
			console.error("Error deleting goods:", _error);
			setError("Failed to delete goods procurement");
		}
	}

	const handleEdit = (item: GoodsProcurement) => {
		setFormData({
			referenceNo: item.referenceNo.toString(),
			goodsCategory: item.goodsCategory._id,
			goodsName: item.goodsName,
			quantity: item.quantity.toString(),
			contractSignedDate: new Date(item.contractSignedDate)
				.toISOString()
				.split("T")[0],
			contractor: item.contractor._id,
		});
		setIsEditing(true);
		setEditingId(item._id);
		setIsModalOpen(true);
	};

	const handleAdd = () => {
		resetForm();
		setIsModalOpen(true);
	};

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const resetForm = () => {
		setFormData({
			referenceNo: "",
			goodsCategory: "",
			goodsName: "",
			quantity: "",
			contractSignedDate: "",
			contractor: "",
		});
		setIsEditing(false);
		setEditingId("");
		setError("");
	};

	// Filter goods based on search term
	const filteredGoods = goods.filter((item) => {
		const searchString = searchTerm.toLowerCase();
		return (
			item.referenceNo.toString().includes(searchString) ||
			item.goodsName.toLowerCase().includes(searchString) ||
			item.goodsCategory?.name.toLowerCase().includes(searchString) ||
			item.contractor?.name.toLowerCase().includes(searchString)
		);
	});

	// Calculate pagination
	const totalPages = Math.ceil(filteredGoods.length / itemsPerPage);
	const startIndex = (currentPage - 1) * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;
	const currentGoods = filteredGoods.slice(startIndex, endIndex);

	// Reset to first page when search term changes
	useEffect(() => {
		setCurrentPage(1);
	}, [searchTerm]);

	if (loading && goods.length === 0) {
		return (
			<div className="flex justify-center items-center min-h-screen">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
			</div>
		);
	}

	return (
		<div className="max-w-7xl mx-auto p-4">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-2xl font-bold text-gray-800">Goods Procurement</h1>
				<button
					onClick={handleAdd}
					className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center gap-2"
				>
					<FaPlus className="h-4 w-4" />
					Add New Goods
				</button>
			</div>

			{error && (
				<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
					{error}
				</div>
			)}

			<SearchAndFilter
				searchTerm={searchTerm}
				onSearchChange={setSearchTerm}
				placeholder="Search by reference no, goods name, category, or contractor..."
			/>

			<div className="bg-white shadow-md rounded-lg overflow-hidden mt-4">
				<table className="min-w-full divide-y divide-gray-200">
					<thead className="bg-gray-50">
						<tr>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Reference No
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Goods Name
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Category
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Quantity
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Contract Signed
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Contractor
							</th>
							<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
								Actions
							</th>
						</tr>
					</thead>
					<tbody className="bg-white divide-y divide-gray-200">
						{currentGoods.map((item) => (
							<tr key={item._id} className="hover:bg-gray-50">
								<td className="px-6 py-4 whitespace-nowrap">
									{item.referenceNo}
								</td>
								<td className="px-6 py-4">{item.goodsName}</td>
								<td className="px-6 py-4 whitespace-nowrap">
									{item.goodsCategory?.name}
								</td>
								<td className="px-6 py-4 whitespace-nowrap">{item.quantity}</td>
								<td className="px-6 py-4 whitespace-nowrap">
									{new Date(item.contractSignedDate).toLocaleDateString()}
								</td>
								<td className="px-6 py-4 ">{item.contractor?.name}</td>
								<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
									<button
										onClick={() => handleEdit(item)}
										className="text-indigo-600 hover:text-indigo-900 mr-4"
										title="Edit"
									>
										<FaEdit className="h-5 w-5 inline" />
									</button>
									<button
										onClick={() => handleDelete(item._id)}
										className="text-red-600 hover:text-red-900"
										title="Delete"
									>
										<FaTrash className="h-5 w-5 inline" />
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			<div className="mt-4">
				<Pagination
					currentPage={currentPage}
					totalPages={totalPages}
					onPageChange={setCurrentPage}
				/>
			</div>

			<SlideOver
				title={isEditing ? "Edit Goods" : "Add New Goods"}
				isOpen={isModalOpen}
				onClose={() => {
					setIsModalOpen(false);
					resetForm();
				}}
			>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label htmlFor="referenceNo" className="form-label">
							Reference No <span className="text-red-500">*</span>
						</label>
						<input
							type="text"
							id="referenceNo"
							name="referenceNo"
							value={formData.referenceNo}
							onChange={handleChange}
							className="form-input"
							required
						/>
					</div>

					<div>
						<label htmlFor="goodsCategory" className="form-label">
							Category <span className="text-red-500">*</span>
						</label>
						<select
							id="goodsCategory"
							name="goodsCategory"
							value={formData.goodsCategory}
							onChange={handleChange}
							className="form-select"
							required
						>
							<option value="">Select a category</option>
							{categories.map((category) => (
								<option key={category._id} value={category._id}>
									{category.name}
								</option>
							))}
						</select>
					</div>

					<div>
						<label htmlFor="goodsName" className="form-label">
							Goods Name <span className="text-red-500">*</span>
						</label>
						<input
							type="text"
							id="goodsName"
							name="goodsName"
							value={formData.goodsName}
							onChange={handleChange}
							className="form-input"
							required
						/>
					</div>

					<div>
						<label htmlFor="quantity" className="form-label">
							Quantity <span className="text-red-500">*</span>
						</label>
						<input
							type="number"
							id="quantity"
							name="quantity"
							value={formData.quantity}
							onChange={handleChange}
							className="form-input"
							required
							min="1"
						/>
					</div>

					<div>
						<label htmlFor="contractSignedDate" className="form-label">
							Contract Signed Date <span className="text-red-500">*</span>
						</label>
						<input
							type="date"
							id="contractSignedDate"
							name="contractSignedDate"
							value={formData.contractSignedDate}
							onChange={handleChange}
							className="form-input"
							required
						/>
					</div>

					<div>
						<label htmlFor="contractor" className="form-label">
							Contractor <span className="text-red-500">*</span>
						</label>
						<select
							id="contractor"
							name="contractor"
							value={formData.contractor}
							onChange={handleChange}
							className="form-select"
							required
						>
							<option value="">Select a contractor</option>
							{contractors.map((contractor) => (
								<option key={contractor._id} value={contractor._id}>
									{contractor.name}
								</option>
							))}
						</select>
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
							disabled={loading}
							className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
						>
							{loading ? (
								<span className="flex items-center gap-2">
									<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
									Saving...
								</span>
							) : (
								"Save"
							)}
						</button>
					</div>
				</form>
			</SlideOver>
		</div>
	);
}
