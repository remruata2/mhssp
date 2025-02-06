import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/lib/db";
import GoodsProcurement from "@/models/procurement/GoodsProcurement";

export async function GET(request: NextRequest) {
	try {
		await dbConnect();
		const { searchParams } = new URL(request.url);
		const referenceNo = searchParams.get("referenceNo");

		if (!referenceNo) {
			return NextResponse.json(
				{ success: false, error: "Reference number is required" },
				{ status: 400 }
			);
		}

		// Check if reference number exists
		const existingGoods = await GoodsProcurement.findOne({
			referenceNo,
		}).lean();

		if (existingGoods) {
			return NextResponse.json(
				{ success: false, error: "Reference number already exists" },
				{ status: 400 }
			);
		}

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Error checking reference number:", error);
		return NextResponse.json(
			{
				success: false,
				error:
					error instanceof Error
						? error.message
						: "Failed to check reference number",
			},
			{ status: 500 }
		);
	}
}
