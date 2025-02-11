import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import dbConnect from "@/lib/db";
import ResultFramework from "@/models/ResultFramework";

interface Context {
	params: { id: string };
}

// GET single RF indicator
export async function GET(request: NextRequest, context: Context) {
	try {
		await dbConnect();
		const rf = await ResultFramework.findById(context.params.id);

		if (!rf) {
			return NextResponse.json(
				{ success: false, error: "RF indicator not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json({ success: true, data: rf });
	} catch (error) {
		console.error("Error fetching RF indicator:", error);
		return NextResponse.json(
			{ success: false, error: "Internal server error" },
			{ status: 500 }
		);
	}
}

// PUT (update) RF indicator
export async function PUT(request: NextRequest, context: Context) {
	try {
		await dbConnect();
		const data = await request.json();

		// Basic validation for required fields only
		if (!data.indicator) {
			return NextResponse.json(
				{ success: false, error: "Indicator is required" },
				{ status: 400 }
			);
		}

		if (!data.yearOneTarget) {
			return NextResponse.json(
				{ success: false, error: "Year 1 target is required" },
				{ status: 400 }
			);
		}

		if (!data.yearTwoTarget) {
			return NextResponse.json(
				{ success: false, error: "Year 2 target is required" },
				{ status: 400 }
			);
		}

		if (!data.yearThreeTarget) {
			return NextResponse.json(
				{ success: false, error: "Year 3 target is required" },
				{ status: 400 }
			);
		}

		if (!data.yearFourTarget) {
			return NextResponse.json(
				{ success: false, error: "Year 4 target is required" },
				{ status: 400 }
			);
		}

		// Create a new object with only the fields we want to update
		const rfData = {
			indicator: data.indicator,
			yearOneTarget: data.yearOneTarget,
			yearTwoTarget: data.yearTwoTarget,
			yearThreeTarget: data.yearThreeTarget,
			yearFourTarget: data.yearFourTarget,
			...(data.baseline && { baseline: data.baseline }),
			...(data.yearFiveTarget && { yearFiveTarget: data.yearFiveTarget })
		};

		const rf = await ResultFramework.findByIdAndUpdate(
			context.params.id,
			rfData,
			{ new: true, runValidators: true }
		);

		if (!rf) {
			return NextResponse.json(
				{ success: false, error: "RF indicator not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json({ success: true, data: rf });
	} catch (error: any) {
		console.error("Error updating RF indicator:", error);
		return NextResponse.json(
			{
				success: false,
				error: error.message || "Failed to update RF indicator",
			},
			{ status: 400 }
		);
	}
}

// DELETE RF indicator
export async function DELETE(request: NextRequest, context: Context) {
	try {
		await dbConnect();
		const rf = await ResultFramework.findByIdAndDelete(context.params.id);

		if (!rf) {
			return NextResponse.json(
				{ success: false, error: "RF indicator not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json({ success: true, data: rf });
	} catch (error) {
		console.error("Error deleting RF indicator:", error);
		return NextResponse.json(
			{ success: false, error: "Internal server error" },
			{ status: 500 }
		);
	}
} 