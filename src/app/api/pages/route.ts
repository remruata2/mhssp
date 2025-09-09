import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/lib/db";
import { Page } from "@/models/Page";

// Mock database (replace with actual database logic)

export async function GET(request: NextRequest) {
	try {
		await dbConnect();
		const { searchParams } = new URL(request.url);
		const category = searchParams.get("category");
		const isPublished = searchParams.get("isPublished");

		const filter: Record<string, unknown> = {};
		if (category) filter.category = category;
		if (isPublished === "true") filter.isPublished = true;
		if (isPublished === "false") filter.isPublished = false;

		const pages = await Page.find(filter).sort({ createdAt: -1 });
		return NextResponse.json({ success: true, data: pages });
	} catch {
		return NextResponse.json(
			{ success: false, error: "Failed to fetch pages" },
			{ status: 500 }
		);
	}
}

export async function POST(request: NextRequest) {
	try {
		const {
			title,
			content,
			slug: inputSlug,
			isPublished,
			showInMenu,
			menuOrder,
			category,
			thumbnailUrl,
			excerpt,
		} = await request.json();

		if (!title || !content) {
			return NextResponse.json(
				{ success: false, error: "Title and content are required" },
				{ status: 400 }
			);
		}

		// Create a slug from the title if not provided
		const slug =
			inputSlug && String(inputSlug).trim().length > 0
				? String(inputSlug)
				: title
						.toLowerCase()
						.replace(/[^a-z0-9]+/g, "-")
						.replace(/(^-|-$)+/g, "");

		await dbConnect();
		const page = await Page.create({
			title,
			content,
			slug,
			isPublished: Boolean(isPublished),
			showInMenu: Boolean(showInMenu),
			menuOrder: typeof menuOrder === "number" ? menuOrder : 0,
			category: category || "",
			thumbnailUrl: thumbnailUrl || "",
			excerpt: excerpt || "",
		});

		return NextResponse.json({ success: true, data: page });
	} catch {
		return NextResponse.json(
			{ success: false, error: "Failed to create page" },
			{ status: 500 }
		);
	}
}
