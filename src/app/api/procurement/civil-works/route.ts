import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/lib/db";
import CivilWorksProcurement from "@/models/procurement/CivilWorksProcurement";

export async function GET() {
	try {
		await dbConnect();
		const civilWorks = await CivilWorksProcurement.find()
			.sort({ createdAt: -1 })
			.populate("contractor")
			.lean();

		return NextResponse.json({ success: true, data: civilWorks });
	} catch (_error) {
		console.error("Error fetching civil works:", _error);
		return NextResponse.json(
			{ success: false, error: "Failed to fetch civil works" },
			{ status: 500 }
		);
	}
}

export async function POST(req: NextRequest) {
	try {
		await dbConnect();
		const data = await req.json();
		const civilWorks = await CivilWorksProcurement.create(data);

		return NextResponse.json(
			{ success: true, data: civilWorks },
			{ status: 201 }
		);
	} catch (error) {
		console.error("Error creating civil works:", error);

		// Check if this is a MongoDB error with code
		if (error instanceof Error && (error as { code?: number }).code === 11000) {
			return NextResponse.json(
				{ success: false, error: "Reference number already exists" },
				{ status: 400 }
			);
		}

		return NextResponse.json(
			{ success: false, error: "Failed to create civil works" },
			{ status: 400 }
		);
	}
}
