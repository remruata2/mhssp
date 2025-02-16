import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import dbConnect from "@/lib/db";
import RFStatus from "@/models/RFStatus";

// Define Context interface to match the structure in the notices route
interface Context {
	params: Promise<{ id: string }>;
}

// GET single RF status
export async function GET(request: NextRequest, context: Context) {
	try {
		await dbConnect();
		const { id } = await context.params;
		const status = await RFStatus.findById(id).populate("rfId");

		if (!status) {
			return NextResponse.json(
				{ success: false, error: "RF status not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json({ success: true, data: status });
	} catch (error) {
		console.error("Error fetching RF status:", error);
		return NextResponse.json(
			{ success: false, error: "Internal server error" },
			{ status: 500 }
		);
	}
}

// PUT (update) RF status
export async function PUT(request: NextRequest, context: Context) {
	try {
		await dbConnect();
		const { id } = await context.params;
		const data = await request.json();

		const status = await RFStatus.findByIdAndUpdate(id, data, {
			new: true,
			runValidators: true,
		}).populate("rfId");

		if (!status) {
			return NextResponse.json(
				{ success: false, error: "RF status not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json({ success: true, data: status });
	} catch (error: any) {
		console.error("Error updating RF status:", error);
		return NextResponse.json(
			{ success: false, error: error.message || "Failed to update RF status" },
			{ status: 400 }
		);
	}
}

// DELETE RF status
export async function DELETE(request: NextRequest, context: Context) {
	try {
		await dbConnect();
		const { id } = await context.params;
		const status = await RFStatus.findByIdAndDelete(id);

		if (!status) {
			return NextResponse.json(
				{ success: false, error: "RF status not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json({ success: true, data: status });
	} catch (error) {
		console.error("Error deleting RF status:", error);
		return NextResponse.json(
			{ success: false, error: "Internal server error" },
			{ status: 500 }
		);
	}
}
