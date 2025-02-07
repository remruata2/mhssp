import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import dbConnect from "@/lib/db";
import { SubNotice } from "@/models/SubNotice";

interface Context {
	params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, context: Context) {
	try {
		await dbConnect();

		const { id } = await context.params;

		if (!id) {
			return NextResponse.json(
				{ success: false, error: "Notice ID is required" },
				{ status: 400 }
			);
		}

		const subNotices = await SubNotice.find({ noticeId: id }).sort({
			order: 1,
		}); // Sort by order ascending

		return NextResponse.json({ success: true, data: subNotices });
	} catch (error: unknown) {
		const errorMessage =
			error instanceof Error ? error.message : "An error occurred";
		return NextResponse.json(
			{ success: false, error: errorMessage },
			{ status: 500 }
		);
	}
}
