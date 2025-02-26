"use client";

import { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import SlideOver from "@/components/SlideOver";
import Image from "next/image";
import Link from "next/link";
import { cacheBusterUrl } from "@/lib/imageCacheBuster";
import { ensurePort8443 } from "@/components/News";

interface NewsItem {
	_id: string;
	title: string;
	content: string;
	images: string[];
	createdAt: string;
	isPublished?: boolean;
	publishDate?: string;
	updatedAt?: string;
}

const truncateText = (text: string, maxLength: number = 150) => {
	if (text.length <= maxLength) return text;
	return text.slice(0, maxLength) + "...";
};

export default function NewsAdmin() {
	const [news, setNews] = useState<NewsItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [formData, setFormData] = useState({
		title: "",
		content: "",
		files: [] as File[],
	});
	const [previewImageUrls, setPreviewImageUrls] = useState<string[]>([]);
	const [isEditing, setIsEditing] = useState(false);
	const [editingId, setEditingId] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [successMessage, setSuccessMessage] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);

	useEffect(() => {
		fetchNews();
	}, []);

	const fetchNews = async () => {
		try {
			const response = await fetch("/api/news");
			const data = await response.json();
			if (data.success) {
				setNews(data.data);
			}
		} catch (error) {
			console.error("Error fetching news:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setSuccessMessage(null);
		setIsLoading(true);

		try {
			// Validate required fields
			if (!formData.title.trim()) {
				throw new Error("Title is required");
			}
			if (!formData.content.trim()) {
				throw new Error("Content is required");
			}

			// Validate title length
			if (formData.title.length < 3) {
				throw new Error("Title must be at least 3 characters long");
			}
			if (formData.title.length > 100) {
				throw new Error("Title cannot exceed 100 characters");
			}

			// Validate content length - only minimum length
			if (formData.content.length < 10) {
				throw new Error("Content must be at least 10 characters long");
			}

			const formDataToSubmit = new FormData();
			formDataToSubmit.append("title", formData.title);
			formDataToSubmit.append("content", formData.content);

			// Handle new files
			formData.files.forEach((file) => {
				formDataToSubmit.append("files", file);
			});

			// Handle existing images in edit mode
			if (isEditing) {
				// Only send existing URLs that are still in the previewImageUrls array
				const existingUrls = previewImageUrls
					.filter((url) => url.includes("/uploads/"))
					.map((url) => url.split(window.location.origin).pop()) // Remove the base URL
					.filter((path): path is string => !!path); // Type guard to ensure non-null

				existingUrls.forEach((url) => {
					formDataToSubmit.append("existingImageUrls", url);
				});
			}

			const url = isEditing ? `/api/news/${editingId}` : "/api/news";
			const method = isEditing ? "PUT" : "POST";

			const response = await fetch(url, {
				method,
				body: formDataToSubmit,
			});

			const data = await response.json();

			if (data.success) {
				setSuccessMessage(
					isEditing ? "News updated successfully!" : "News added successfully!"
				);
				resetForm();
				fetchNews();
				setIsModalOpen(false);
			} else {
				throw new Error(data.message || "Failed to save news");
			}
		} catch (err) {
			console.error("Form submission error:", err);
			setError(err instanceof Error ? err.message : "An error occurred");
		} finally {
			setIsLoading(false);
		}
	};

	const handleEdit = (item: NewsItem) => {
		console.log("Editing item:", item); // Debug log
		setFormData({
			title: item.title,
			content: item.content,
			files: [],
		});

		// Handle image URLs
		let urls: string[] = [];
		if (item.images && item.images.length > 0) {
			urls = item.images.map((path) => {
				// If the path starts with '/uploads/', prepend the base URL
				if (path.startsWith("/uploads/")) {
					return `${window.location.origin}${path}`;
				}
				return path;
			});
			console.log("Image URLs:", urls); // Debug log
		}

		setPreviewImageUrls(urls);
		setIsEditing(true);
		setEditingId(item._id);
		setIsModalOpen(true);
	};

	const handleAdd = () => {
		resetForm();
		setIsModalOpen(true);
	};

	const handleDelete = async (id: string) => {
		if (!confirm("Are you sure you want to delete this news item?")) return;

		try {
			const response = await fetch(`/api/news/${id}`, {
				method: "DELETE",
			});

			const data = await response.json();
			if (data.success) {
				fetchNews();
			} else {
				setError(data.error || "Failed to delete news");
			}
		} catch {
			setError("Failed to delete news");
		}
	};

	const resetForm = () => {
		setFormData({
			title: "",
			content: "",
			files: [],
		});
		setPreviewImageUrls([]);
		setIsEditing(false);
		setEditingId("");
		setError(null);
	};

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const newFiles = Array.from(e.target.files || []);

		// Create preview URLs for all new files
		const newPreviewUrls = await Promise.all(
			newFiles.map((file) => {
				return new Promise<string>((resolve, reject) => {
					if (!file.type.startsWith("image/")) {
						reject(new Error("Invalid file type"));
						return;
					}

					const reader = new FileReader();
					reader.onloadend = () => {
						const result = reader.result as string;
						if (result && result.startsWith("data:image")) {
							resolve(result);
						} else {
							reject(new Error("Invalid image data"));
						}
					};
					reader.onerror = () => reject(new Error("Failed to read file"));
					reader.readAsDataURL(file);
				});
			})
		).then((urls) => urls.filter((url) => url)); // Filter out any undefined/null values

		setFormData((prev) => ({
			...prev,
			files: [...prev.files, ...newFiles],
		}));
		setPreviewImageUrls((prev) => [...prev, ...newPreviewUrls]);
	};

	const removeImage = (index: number) => {
		console.log("Removing image at index:", index); // Debug log
		console.log("Current preview URLs:", previewImageUrls); // Debug log

		setPreviewImageUrls((prev) => {
			const updated = prev.filter((_, i) => i !== index);
			console.log("Updated preview URLs:", updated); // Debug log
			return updated;
		});

		setFormData((prev) => ({
			...prev,
			files: prev.files.filter((_, i) => i !== index),
		}));
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
				<h1 className="text-2xl font-bold text-gray-800">Manage News</h1>
				<button
					onClick={handleAdd}
					className="bg-[#1192c3] text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center gap-2"
				>
					<FaPlus className="h-4 w-4" />
					Add News
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
				{news.map((item) => (
					<div key={item._id} className="p-4 border-b">
						<div className="flex justify-between items-center">
							<div>
								<h3 className="text-lg font-medium text-gray-800">
									{item.title}
								</h3>
								<p className="text-sm text-gray-500 mt-1">
									{truncateText(item.content)}
								</p>
								<span className="text-sm text-gray-500">
									{new Date(item.createdAt).toLocaleDateString()}
								</span>
							</div>
							<div className="flex gap-2">
								<button
									onClick={() => handleEdit(item)}
									className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
								>
									<FaEdit className="h-5 w-5" />
								</button>
								<button
									onClick={() => handleDelete(item._id)}
									className="p-2 text-red-600 hover:bg-red-50 rounded-full"
								>
									<FaTrash className="h-5 w-5" />
								</button>
							</div>
						</div>
					</div>
				))}
			</div>

			<SlideOver
				title={isEditing ? "Edit News" : "Add News"}
				isOpen={isModalOpen}
				onClose={() => {
					setIsModalOpen(false);
					resetForm();
				}}
			>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label htmlFor="title" className="form-label">
							Title <span className="text-red-500">*</span>
						</label>
						<input
							type="text"
							id="title"
							name="title"
							value={formData.title}
							onChange={handleChange}
							className="form-input"
							required
							minLength={3}
							maxLength={100}
						/>
						<p className="mt-1 text-xs text-gray-500">
							{formData.title.length}/100 characters
						</p>
					</div>

					<div>
						<label htmlFor="content" className="form-label">
							Content <span className="text-red-500">*</span>
						</label>
						<textarea
							id="content"
							name="content"
							value={formData.content}
							onChange={handleChange}
							rows={10}
							className="form-textarea"
							required
							minLength={10}
						/>
						<p className="mt-1 text-xs text-gray-500">Minimum 10 characters</p>
					</div>

					<div>
						<label htmlFor="file" className="form-label">
							Images {!isEditing && <span className="text-red-500">*</span>}
						</label>
						<div className="space-y-2">
							{isEditing && previewImageUrls.length > 0 && (
								<p className="text-sm text-gray-600">
									Currently has {previewImageUrls.length} image
									{previewImageUrls.length !== 1 ? "s" : ""}
								</p>
							)}
							<input
								type="file"
								id="file"
								name="file"
								onChange={handleFileChange}
								className="form-input"
								accept="image/*"
								multiple
								{...(!isEditing && { required: true })}
							/>
							<p className="text-xs text-gray-500">
								{isEditing
									? "Select files to add more images or remove existing ones above"
									: "You can select multiple images"}
							</p>
						</div>
					</div>

					{previewImageUrls.length > 0 && (
						<div className="grid grid-cols-2 gap-4 mb-4">
							{previewImageUrls.map((url, index) => {
								console.log("Rendering image URL:", url); // Debug log
								if (!url) {
									console.log("Skipping empty URL at index:", index);
									return null;
								}

								return (
									<div key={index} className="relative">
										<Image
											src={cacheBusterUrl(ensurePort8443(url))}
											alt={`Preview ${index + 1}`}
											width={200}
											height={200}
											className="object-cover rounded-lg h-48 w-full"
											unoptimized={true}
										/>
										<button
											type="button"
											onClick={() => removeImage(index)}
											className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
										>
											<FaTrash className="h-4 w-4" />
										</button>
									</div>
								);
							})}
						</div>
					)}

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
							disabled={isLoading}
							className="px-4 py-2 bg-[#1192c3] text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
						>
							{isLoading ? (
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
