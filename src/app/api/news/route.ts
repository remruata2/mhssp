import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/lib/db";
import News from "@/models/News";
import fs from "fs/promises";
import path from "path";

const uploadDir = path.join(process.cwd(), "public/uploads");

// Ensure upload directory exists
(async () => {
	try {
		await fs.mkdir(uploadDir, { recursive: true });
		await fs.chmod(uploadDir, 0o755); // Set directory permissions to drwxr-xr-x
	} catch (error) {
		console.error("Error creating upload directory:", error);
	}
})();

interface NewsData {
	title: string;
	content: string;
	images?: string[];
	isPublished: boolean;
	publishDate: Date;
}

interface ApiError extends Error {
	errors?: Record<string, unknown>;
}

export async function POST(request: Request) {
	await dbConnect();

	try {
		const formData = await request.formData();

		// Debug: Log form data
		console.log("Form data received:", {
			title: formData.get("title"),
			content: formData.get("content"),
			files: formData.getAll("files"),
		});

		// Get form values
		const title = formData.get("title") as string;
		const content = formData.get("content") as string;
		const files = formData.getAll("files") as File[];

		// Validate required fields
		if (!title || !content) {
			console.error("Missing required fields:", { title, content, files });
			return NextResponse.json(
				{ success: false, error: "Title and content are required" },
				{ status: 400 }
			);
		}

		let images: string[] = [];

		if (files.length > 0) {
			try {
				// Process file uploads
				for (const file of files) {
					const buffer = await file.arrayBuffer();
					const filename = `${Date.now()}-${file.name}`;
					const filePath = path.join(uploadDir, filename);

					// Debug: Log file info
					console.log("File info:", {
						filename,
						filePath,
						fileSize: buffer.byteLength,
					});

					await fs.writeFile(filePath, Buffer.from(buffer));
					await fs.chmod(filePath, 0o644); // Set file permissions to -rw-r--r--
					images.push(`/uploads/${filename}`);
				}
			} catch (error) {
				console.error("File upload error:", error);
				return NextResponse.json(
					{ success: false, error: "File upload failed" },
					{ status: 500 }
				);
			}
		}

		// Debug: Log data being saved
		console.log("Creating news item with:", {
			title,
			content,
			images,
		});

		// Create news item
		const newsData: NewsData = {
			title,
			content,
			...(images.length > 0 ? { images } : {}),
			isPublished: false,
			publishDate: new Date(),
		};

		console.log("News data before creation:", newsData);

		// Create database entry
		const newsItem = await News.create(newsData);

		console.log("Created news item:", newsItem.toObject());

		return NextResponse.json({
			success: true,
			data: newsItem,
		});
	} catch (error: unknown) {
		const err = error as ApiError;
		console.error("Upload error:", err);
		// Log detailed error information
		if (err.errors) {
			console.error("Validation errors:", err.errors);
		}
		return NextResponse.json(
			{
				success: false,
				error: err.message || "Server error",
				details: err.errors || {},
			},
			{ status: 500 }
		);
	}
}

export async function GET() {
	try {
		await dbConnect();
		const news = await News.find().sort({ createdAt: -1 });
		return NextResponse.json({ success: true, data: news });
	} catch (error: unknown) {
		const err = error as Error;
		return NextResponse.json(
			{ success: false, error: err.message || "Failed to fetch news" },
			{ status: 500 }
		);
	}
}
