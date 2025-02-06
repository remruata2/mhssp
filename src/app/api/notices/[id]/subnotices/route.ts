import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { SubNotice } from "@/models/SubNotice";

interface RouteParams {
	params: {
		id: string;
	};
}

export async function GET(request: Request, context: RouteParams) {
	try {
		const { id } = await Promise.resolve(context.params);

		if (!id) {
			return NextResponse.json(
				{ success: false, error: "Notice ID is required" },
				{ status: 400 }
			);
		}

		await dbConnect();

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
