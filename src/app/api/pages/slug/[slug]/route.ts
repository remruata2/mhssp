import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { Page } from "@/models/Page";

interface Context {
	params: Promise<{ slug: string }>;
}

export async function GET(_request: NextRequest, context: Context) {
	try {
		await dbConnect();
		const { slug } = await context.params;
		const page = await Page.findOne({ slug });
		if (!page) {
			return NextResponse.json(
				{ success: false, error: "Page not found" },
				{ status: 404 }
			);
		}
		return NextResponse.json({ success: true, data: page });
	} catch {
		return NextResponse.json(
			{ success: false, error: "Failed to fetch page" },
			{ status: 500 }
		);
	}
}
