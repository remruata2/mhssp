import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import dbConnect from "@/lib/db";
import { SubNotice } from "@/models/SubNotice";

interface Context {
	params: Promise<{ id: string; subnoticeId: string }>;
}

export async function DELETE(request: NextRequest, context: Context) {
	try {
		await dbConnect();
		const { id, subnoticeId } = await context.params;

		const subNotice = await SubNotice.findOneAndDelete({
			_id: subnoticeId,
			noticeId: id,
		});

		if (!subNotice) {
			return NextResponse.json(
				{ success: false, error: "Sub notice not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json({ success: true, data: subNotice });
	} catch (error) {
		console.error("Error deleting subnotice:", error);
		return NextResponse.json(
			{ success: false, error: "Internal server error" },
			{ status: 500 }
		);
	}
}
