import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/lib/db";
import { Notice } from "@/models/Notice";
import { SubNotice } from "@/models/SubNotice";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { existsSync } from "fs";
import { getToken } from "next-auth/jwt";

// Helper function to save PDF file
async function savePDF(file: File): Promise<string> {
	const bytes = await file.arrayBuffer();
	const buffer = Buffer.from(bytes);

	// Create a unique filename
	const filename = `${Date.now()}-${file.name}`;
	const uploadDir = path.join(process.cwd(), "public", "uploads", "notices");

	// Create directory if it doesn't exist
	if (!existsSync(uploadDir)) {
		await mkdir(uploadDir, { recursive: true });
	}

	const filepath = path.join(uploadDir, filename);

	// Save the file
	await writeFile(filepath, buffer);
	return `/uploads/notices/${filename}`;
}

export async function GET() {
	try {
		await dbConnect();

		// Get only published notices and sort by date
		const notices = await Notice.find({
			isPublished: true,
			publishDate: { $lte: new Date() }, // Only return notices whose publish date has passed
		})
			.sort({ publishDate: -1 })
			.lean();

		return NextResponse.json({ success: true, data: notices });
	} catch (error) {
		console.error("Error fetching notices:", error);
		return NextResponse.json(
			{ success: false, error: "Failed to fetch notices" },
			{ status: 500 }
		);
	}
}

export async function POST(req: NextRequest) {
	try {
		// Authorization: only admins can create notices
		const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
		if (!token) {
			return NextResponse.json(
				{ success: false, error: "Unauthorized" },
				{ status: 401 }
			);
		}
		if ((token as any).role !== "admin") {
			return NextResponse.json(
				{ success: false, error: "Forbidden" },
				{ status: 403 }
			);
		}

		await dbConnect();

		const formData = await req.formData();
		const title = formData.get("title") as string;
		const type = formData.get("type") as string;
		const isPublished = formData.get("isPublished") === "true";
		const publishDate = formData.get("publishDate") as string;

		let documentUrl = "";
		let url = "";

		// Handle different notice types
		if (type === "document") {
			const pdfFile = formData.get("document") as File;
			if (pdfFile) {
				documentUrl = await savePDF(pdfFile);
			}
		} else if (type === "url") {
			url = formData.get("url") as string;
		}

		// Create the notice
		const notice = await Notice.create({
			title,
			type,
			documentUrl,
			url,
			isPublished,
			publishDate,
		});

		// Handle sub notices if type is subNotices
		if (type === "subNotices") {
			const subNotices = [];
			let index = 0;

			// Keep checking for sub notices until we don't find any more
			while (formData.has(`subNotices[${index}][title]`)) {
				const title = formData.get(`subNotices[${index}][title]`) as string;
				const file = formData.get(`subNotices[${index}][file]`) as File;
				let documentUrl = formData.get(
					`subNotices[${index}][documentUrl]`
				) as string;

				// If there's a file, upload it
				if (file) {
					documentUrl = await savePDF(file);
				}

				subNotices.push({
					title,
					documentUrl,
					noticeId: notice._id,
					order: index,
				});

				index++;
			}

			// Create all sub notices
			if (subNotices.length > 0) {
				await SubNotice.create(subNotices);
			}
		}

		return NextResponse.json({ success: true, data: notice }, { status: 201 });
	} catch (error: any) {
		console.error("Error creating notice:", error);
		return NextResponse.json(
			{ success: false, error: error.message || "Failed to create notice" },
			{ status: 500 }
		);
	}
}
