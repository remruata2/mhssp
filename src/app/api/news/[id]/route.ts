// Updated /src/app/api/news/[id]/route.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import dbConnect from "@/lib/db";
import News from "@/models/News";
import fs from "fs/promises";
import path from "path";
import { cacheBusterUrl } from "@/lib/imageCacheBuster";

const uploadDir = path.join(process.cwd(), "public/uploads");

interface Context {
	params: Promise<{ id: string }>;
}

// GET Handler
export async function GET(request: NextRequest, context: Context) {
	try {
		await dbConnect();
		const { id } = await context.params;

		const news = await News.findById(id);

		if (!news) {
			return NextResponse.json(
				{ success: false, error: "News not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json({ success: true, data: news });
	} catch (error) {
		console.error("Error fetching news:", error);
		return NextResponse.json(
			{ success: false, error: "Internal server error" },
			{ status: 500 }
		);
	}
}

// PUT Handler (Update)
export async function PUT(request: NextRequest, context: Context) {
	await dbConnect();

	try {
		// Get form data using Next 15's native methods
		const formData = await request.formData();

		// Extract form values
		const { id } = await context.params;
		const title = formData.get("title")?.toString();
		const content = formData.get("content")?.toString();
		const files = formData.getAll("files") as File[]; // Get all files
		console.log("PUT request received for news ID:", id);
		console.log("TargetFile: route.ts");
		console.log("Form data:", {
			title,
			content,
			fileCount: files.length,
			previewImageUrls: formData.getAll("previewImageUrls[]"),
		});

		// Get the existing news item
		const existingNews = await News.findById(id);
		if (!existingNews) {
			return NextResponse.json(
				{ success: false, error: "News not found" },
				{ status: 404 }
			);
		}

		// Get preview image URLs from form data and normalize them for comparison
		const previewImageUrls = formData
			.getAll("previewImageUrls[]")
			.map((url) => {
				const urlString = url.toString();

				// Extract just the path part from the URL
				// This handles both full URLs and relative paths
				try {
					if (urlString.includes("http")) {
						// For full URLs, extract the pathname
						const urlObj = new URL(urlString);
						const pathname = urlObj.pathname;

						// Remove any query parameters
						return pathname.split("?")[0];
					}
				} catch (e) {
					console.warn("Error parsing URL:", urlString, e);
				}

				// For relative paths or if URL parsing failed
				return urlString.split("?")[0];
			});

		console.log("Normalized preview URLs:", previewImageUrls);
		console.log("Existing images:", existingNews.images);

		// Validation
		if (!title || !content) {
			return NextResponse.json(
				{ success: false, error: "Title and content are required" },
				{ status: 400 }
			);
		}

		// Prepare update data
		const updateData: any = { title, content };
		let finalImages: string[] = [];

		// Handle image updates based on preview URLs and new uploads
		try {
			// If removeImage flag is true, remove all images
			if (previewImageUrls.length === 0) {
				console.log("removeImage flag is true, removing all images");

				// Delete all existing image files
				if (existingNews.images && existingNews.images.length > 0) {
					existingNews.images.forEach((imagePath) => {
						try {
							const cleanPath = imagePath.split("?")[0];
							const filePath = path.join(process.cwd(), "public", cleanPath);
							fs.access(filePath)
								.then(() => fs.unlink(filePath))
								.then(() => console.log(`Deleted image: ${filePath}`))
								.catch((err) =>
									console.warn(`Error deleting image: ${filePath}`, err)
								);
						} catch (error) {
							console.warn("Error handling image deletion:", error);
						}
					});
				}

				// Set images to empty array
				finalImages = [];
			} else {
				// 1. Keep existing images that are still in the preview
				if (existingNews.images && existingNews.images.length > 0) {
					// For each existing image, check if it should be kept
					existingNews.images.forEach((existingImage) => {
						// Clean the path for comparison
						const cleanPath = existingImage.split("?")[0];

						// Check if any preview URL contains this path
						const shouldKeep = previewImageUrls.some((previewUrl) => {
							// Extract just the path part for comparison
							return previewUrl === cleanPath;
						});

						if (shouldKeep) {
							finalImages.push(existingImage);
							console.log("Keeping existing image:", existingImage);
						} else {
							// Delete the image file that's being removed
							try {
								const filePath = path.join(process.cwd(), "public", cleanPath);
								fs.access(filePath)
									.then(() => fs.unlink(filePath))
									.then(() => console.log(`Deleted image: ${filePath}`))
									.catch((err) =>
										console.warn(`Error deleting image: ${filePath}`, err)
									);
							} catch (error) {
								console.warn("Error handling image deletion:", error);
							}
							console.log("Removing existing image:", existingImage);
						}
					});
				}

				// 2. Add any new uploaded images
				if (files.length > 0) {
					for (const file of files) {
						if (!file.size) continue;

						const buffer = await file.arrayBuffer();
						const filename = `${Date.now()}-${file.name}`;
						const filePath = path.join(uploadDir, filename);

						await fs.writeFile(filePath, Buffer.from(buffer));
						await fs.chmod(filePath, 0o644);

						const newImagePath = `/uploads/${filename}`;
						finalImages.push(newImagePath);
						console.log("Added new image:", newImagePath);
					}
				}
			}
		} catch (error) {
			console.error("Error handling images:", error);
			return NextResponse.json(
				{ success: false, error: "Image processing failed" },
				{ status: 500 }
			);
		}

		// Update updateData with finalImages
		updateData.images = finalImages;

		// Update news item in database
		const updatedNews = await News.findByIdAndUpdate(id, updateData, {
			new: true,
			runValidators: true,
		});

		console.log("News updated successfully:", updatedNews);

		return NextResponse.json({ success: true, data: updatedNews });
	} catch (error) {
		console.error("Error updating news:", error);
		return NextResponse.json(
			{ success: false, error: "Internal server error" },
			{ status: 500 }
		);
	}
}

// DELETE Handler
export async function DELETE(request: NextRequest, context: Context) {
	try {
		await dbConnect();
		const { id } = await context.params;

		// Get the news item before deletion to access its image URL
		const newsItem = await News.findById(id);

		if (!newsItem) {
			return NextResponse.json(
				{ success: false, error: "News not found" },
				{ status: 404 }
			);
		}

		// Delete the news item from the database
		const deletedNews = await News.findByIdAndDelete(id);

		// Delete the associated image files if they exist
		if (newsItem.images && newsItem.images.length > 0) {
			await Promise.all(
				newsItem.images.map(async (imagePath) => {
					try {
						// Extract clean path without query parameters
						const cleanPath = imagePath.split("?")[0];
						const absolutePath = path.join(process.cwd(), "public", cleanPath);

						console.log(`Attempting to delete image file: ${absolutePath}`);

						// Check if file exists before attempting to delete
						await fs
							.access(absolutePath)
							.then(async () => {
								await fs.unlink(absolutePath);
								console.log(`Successfully deleted image file: ${absolutePath}`);
							})
							.catch((err) => {
								console.warn(
									`Image file not found or could not be deleted: ${absolutePath}`,
									err
								);
							});
					} catch (error) {
						console.error("Error deleting image file:", error);
						// Continue execution even if image deletion fails
					}
				})
			);
		}

		return NextResponse.json({ success: true, data: deletedNews });
	} catch (error) {
		console.error("Error deleting news:", error);
		return NextResponse.json(
			{ success: false, error: "Internal server error" },
			{ status: 500 }
		);
	}
}
