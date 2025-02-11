import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import dbConnect from "@/lib/db";
import ResultFramework from "@/models/ResultFramework";

// GET all RF indicators
export async function GET() {
	try {
		await dbConnect();
		const rfs = await ResultFramework.find().sort({ createdAt: -1 });
		return NextResponse.json({ success: true, data: rfs });
	} catch (error) {
		console.error("Error fetching RF indicators:", error);
		return NextResponse.json(
			{ success: false, error: "Internal server error" },
			{ status: 500 }
		);
	}
}

// POST new RF indicator
export async function POST(request: NextRequest) {
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

		// Create a new object with only the fields we want to save
		const rfData = {
			indicator: data.indicator,
			yearOneTarget: data.yearOneTarget,
			yearTwoTarget: data.yearTwoTarget,
			yearThreeTarget: data.yearThreeTarget,
			yearFourTarget: data.yearFourTarget,
			...(data.baseline && { baseline: data.baseline }),
			...(data.yearFiveTarget && { yearFiveTarget: data.yearFiveTarget })
		};

		const rf = await ResultFramework.create(rfData);
		return NextResponse.json({ success: true, data: rf }, { status: 201 });
	} catch (error: any) {
		console.error("Error creating RF indicator:", error);
		return NextResponse.json(
			{
				success: false,
				error: error.message || "Failed to create RF indicator",
			},
			{ status: 400 }
		);
	}
} 