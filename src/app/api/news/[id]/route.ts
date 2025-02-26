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
		const removeImage = formData.get("removeImage") === "true";

		console.log("PUT request received for news ID:", id);
		console.log("TargetFile: route.ts");
		console.log("Form data:", {
			title,
			content,
			fileCount: files.length,
			removeImage,
			previewImageUrls: formData.getAll("previewImageUrls[]"),
		});

		// Get preview image URLs from form data and normalize them for comparison
		const previewImageUrls = formData
			.getAll("previewImageUrls[]")
			.map((url) => {
				// If this is a full URL with origin, extract just the path part
				const urlString = url.toString();
				if (urlString.includes(process.env.NEXT_PUBLIC_BASE_URL || "")) {
					return new URL(urlString).pathname;
				}
				return urlString;
			});

		console.log("Normalized preview URLs:", previewImageUrls);

		// Validation
		if (!title || !content) {
			return NextResponse.json(
				{ success: false, error: "Title and content are required" },
				{ status: 400 }
			);
		}

		// Get the existing news item
		const existingNews = await News.findById(id);
		if (!existingNews) {
			return NextResponse.json(
				{ success: false, error: "News not found" },
				{ status: 404 }
			);
		}

		// Prepare update data
		const updateData: any = { title, content };

		// Handle image updates - following the same pattern as POST method
		if (files.length > 0) {
			try {
				let images: string[] = [];

				// Process all file uploads - same as in POST method
				for (const file of files) {
					if (!file.size) {
						console.log("Skipping empty file");
						continue;
					}

					const buffer = await file.arrayBuffer();
					const filename = `${Date.now()}-${file.name}`;
					const filePath = path.join(uploadDir, filename);

					await fs.writeFile(filePath, Buffer.from(buffer));
					await fs.chmod(filePath, 0o644); // Set file permissions to -rw-r--r--

					// Add to images array
					images.push(`/uploads/${filename}`);
					console.log("New image uploaded:", `/uploads/${filename}`);
				}

				// Keep existing images that are still in the preview
				if (existingNews.images) {
					// Need to normalize existing images for comparison
					const normalizedExistingImages = existingNews.images.map((img) => {
						// Extract just the path part regardless of query parameters
						return img.split("?")[0];
					});

					console.log("Normalized existing images:", normalizedExistingImages);

					// Find which existing images to keep
					for (const existingImage of normalizedExistingImages) {
						// Check if this path is in the preview URLs
						const isKept = previewImageUrls.some((previewUrl) => {
							// If previewUrl contains the existingImage path
							return previewUrl.includes(existingImage);
						});

						if (isKept) {
							// Keep the original path with any query parameters
							const originalPath =
								existingNews.images[
									normalizedExistingImages.indexOf(existingImage)
								];
							images.push(originalPath);
							console.log("Keeping image:", originalPath);
						} else {
							console.log("Removing image:", existingImage);
						}
					}
				}

				// Update the images array with all new image paths
				updateData.images = images;

				// Delete images that were removed from preview
				if (existingNews.images) {
					// Filter images that need to be deleted (not in preview)
					const imagesToDelete = existingNews.images.filter((existingImage) => {
						// Normalize the image path for comparison
						const normalizedPath = existingImage.split("?")[0];

						// Check if any preview URL contains this path
						const isKept = previewImageUrls.some((previewUrl) => {
							return previewUrl.includes(normalizedPath);
						});

						// Return true if image should be deleted (not kept)
						return !isKept;
					});

					console.log("Images to delete:", imagesToDelete);

					// Delete old image files if they exist
					await Promise.all(
						imagesToDelete.map(async (oldImagePath) => {
							try {
								// Extract clean path without query parameters
								const cleanPath = oldImagePath.split("?")[0];
								const oldFilePath = path.join(
									process.cwd(),
									"public",
									cleanPath
								);

								console.log(`Attempting to delete old image: ${oldFilePath}`);

								// Check if file exists before attempting to delete
								await fs
									.access(oldFilePath)
									.then(async () => {
										await fs.unlink(oldFilePath);
										console.log(
											`Successfully deleted old image: ${oldFilePath}`
										);
									})
									.catch((err) => {
										console.warn(
											`Old image not found or could not be deleted: ${oldFilePath}`,
											err
										);
									});
							} catch (error) {
								console.warn("Could not delete old image:", error);
								// Continue even if deletion fails
							}
						})
					);
				}
			} catch (error) {
				console.error("Error handling file upload:", error);
				return NextResponse.json(
					{ success: false, error: "File upload failed" },
					{ status: 500 }
				);
			}
		} else if (removeImage) {
			// If removeImage flag is true, set images to empty array
			updateData.images = [];

			console.log("Removing all images");

			// Delete existing image files
			if (existingNews.images && existingNews.images.length > 0) {
				await Promise.all(
					existingNews.images.map(async (imagePath) => {
						try {
							// Extract clean path without query parameters
							const cleanPath = imagePath.split("?")[0];
							const filePath = path.join(process.cwd(), "public", cleanPath);

							console.log(`Attempting to delete image: ${filePath}`);

							// Check if file exists before attempting to delete
							await fs
								.access(filePath)
								.then(async () => {
									await fs.unlink(filePath);
									console.log(`Successfully deleted image: ${filePath}`);
								})
								.catch((err) => {
									console.warn(
										`Image not found or could not be deleted: ${filePath}`,
										err
									);
								});
						} catch (error) {
							console.warn("Could not delete image:", error);
							// Continue even if deletion fails
						}
					})
				);
			}
		}
		// If neither uploading a new image nor removing existing ones, keep the current images

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
