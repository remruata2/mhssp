import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/lib/db";
import { Page } from "@/models/Page";

// Mock database (replace with actual database logic)
let pages = [];

export async function GET() {
	try {
		await dbConnect();
		const pages = await Page.find().sort({ createdAt: -1 });
		return NextResponse.json({ success: true, data: pages });
	} catch (error) {
		return NextResponse.json(
			{ success: false, error: "Failed to fetch pages" },
			{ status: 500 }
		);
	}
}

export async function POST(request: NextRequest) {
	try {
		const { title, content } = await request.json();

		if (!title || !content) {
			return NextResponse.json(
				{ success: false, error: "Title and content are required" },
				{ status: 400 }
			);
		}

		// Create a slug from the title
		const slug = title
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/(^-|-$)+/g, "");

		await dbConnect();
		const page = await Page.create({
			title,
			content,
			slug,
		});

		return NextResponse.json({ success: true, data: page });
	} catch (error) {
		return NextResponse.json(
			{ success: false, error: "Failed to create page" },
			{ status: 500 }
		);
	}
}
