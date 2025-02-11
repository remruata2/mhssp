import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import dbConnect from "@/lib/db";
import RFStatus from "@/models/RFStatus";

// GET all RF statuses
export async function GET(request: NextRequest) {
	try {
		await dbConnect();
		const url = new URL(request.url);
		const rfId = url.searchParams.get("rfId");
		const year = url.searchParams.get("year");
		const quarter = url.searchParams.get("quarter");

		let query: any = {};
		if (rfId) query.rfId = rfId;
		if (year) query.year = parseInt(year);
		if (quarter) query.quarter = parseInt(quarter);

		const statuses = await RFStatus.find(query)
			.populate("rfId")
			.sort({ year: -1, quarter: -1 });

		return NextResponse.json({ success: true, data: statuses });
	} catch (error) {
		console.error("Error fetching RF statuses:", error);
		return NextResponse.json(
			{ success: false, error: "Internal server error" },
			{ status: 500 }
		);
	}
}

// POST new RF status
export async function POST(request: NextRequest) {
	try {
		await dbConnect();
		const data = await request.json();

		const status = await RFStatus.create(data);
		return NextResponse.json({ success: true, data: status }, { status: 201 });
	} catch (error: any) {
		console.error("Error creating RF status:", error);
		return NextResponse.json(
			{
				success: false,
				error: error.message || "Failed to create RF status",
			},
			{ status: 400 }
		);
	}
} 