// Updated /src/app/api/news/[id]/route.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import dbConnect from "@/lib/db";
import News from "@/models/News";
import fs from "fs/promises";
import path from "path";

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
		const file = formData.get("file") as File | null;
		const existingImageUrl = formData.get("imageUrl")?.toString();

		// Validation
		if (!title || !content) {
			return NextResponse.json(
				{ success: false, error: "Title and content are required" },
				{ status: 400 }
			);
		}

		// File handling
		let imageUrl = existingImageUrl;
		if (file) {
			try {
				const buffer = await file.arrayBuffer();
				const filename = `${Date.now()}-${file.name}`;
				const filePath = path.join(uploadDir, filename);

				await fs.writeFile(filePath, Buffer.from(buffer));
				imageUrl = `/uploads/${filename}`;
			} catch (error: unknown) {
				const err = error as Error & { errors?: Record<string, unknown> };
				return NextResponse.json(
					{ success: false, error: err.message || "File upload failed" },
					{ status: 500 }
				);
			}
		}

		// Update news item
		const updatedNews = await News.findByIdAndUpdate(
			id,
			{ title, content, ...(imageUrl && { imageUrl }) },
			{ new: true, runValidators: true }
		);

		if (!updatedNews) {
			return NextResponse.json(
				{ success: false, error: "News not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json({ success: true, data: updatedNews });
	} catch (error: unknown) {
		const err = error as Error & { errors?: Record<string, unknown> };
		return NextResponse.json(
			{
				success: false,
				error: err.message || "Server error",
				...(err.errors && { details: err.errors }),
			},
			{ status: 500 }
		);
	}
}

// DELETE Handler
export async function DELETE(request: NextRequest, context: Context) {
	try {
		await dbConnect();
		const { id } = await context.params;

		const deletedNews = await News.findByIdAndDelete(id);

		if (!deletedNews) {
			return NextResponse.json(
				{ success: false, error: "News not found" },
				{ status: 404 }
			);
		}

		// Clean up associated files
		if (deletedNews.images && deletedNews.images.length > 0) {
			await Promise.all(
				deletedNews.images.map(async (imagePath) => {
					const filePath = path.join(process.cwd(), "public", imagePath);
					await fs.unlink(filePath).catch(() => {}); // Silent fail if file not found
				})
			);
		}

		return NextResponse.json({ success: true, data: deletedNews });
	} catch (error: unknown) {
		const err = error as Error & { errors?: Record<string, unknown> };
		return NextResponse.json(
			{ success: false, error: err.message || "Server error" },
			{ status: 500 }
		);
	}
}
