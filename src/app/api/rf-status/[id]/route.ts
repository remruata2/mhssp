import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import dbConnect from "@/lib/db";
import RFStatus from "@/models/RFStatus";

interface Context {
	params: { id: string };
}

// GET single RF status
export async function GET(request: NextRequest, context: Context) {
	try {
		await dbConnect();
		const status = await RFStatus.findById(context.params.id).populate("rfId");

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
		const data = await request.json();

		const status = await RFStatus.findByIdAndUpdate(
			context.params.id,
			data,
			{ new: true, runValidators: true }
		).populate("rfId");

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
			{
				success: false,
				error: error.message || "Failed to update RF status",
			},
			{ status: 400 }
		);
	}
}

// DELETE RF status
export async function DELETE(request: NextRequest, context: Context) {
	try {
		await dbConnect();
		const status = await RFStatus.findByIdAndDelete(context.params.id);

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