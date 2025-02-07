import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import dbConnect from "@/lib/db";
import Contractor from "@/models/procurement/Contractor";

interface Context {
	params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, context: Context) {
	try {
		await dbConnect();
		const { id } = await context.params;

		const contractor = await Contractor.findById(id);

		if (!contractor) {
			return NextResponse.json(
				{ success: false, error: "Contractor not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json({ success: true, data: contractor });
	} catch (error) {
		console.error("Error fetching contractor:", error);
		return NextResponse.json(
			{ success: false, error: "Internal server error" },
			{ status: 500 }
		);
	}
}

export async function PUT(request: NextRequest, context: Context) {
	try {
		await dbConnect();
		const { id } = await context.params;
		const body = await request.json();

		const contractor = await Contractor.findByIdAndUpdate(
			id,
			{ $set: body },
			{ new: true, runValidators: true }
		);

		if (!contractor) {
			return NextResponse.json(
				{ success: false, error: "Contractor not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json({ success: true, data: contractor });
	} catch (error) {
		console.error("Error updating contractor:", error);

		return NextResponse.json(
			{ success: false, error: "Internal server error" },
			{ status: 500 }
		);
	}
}

export async function DELETE(request: NextRequest, context: Context) {
	try {
		await dbConnect();
		const { id } = await context.params;

		const contractor = await Contractor.findByIdAndDelete(id);

		if (!contractor) {
			return NextResponse.json(
				{ success: false, error: "Contractor not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json({ success: true, data: contractor });
	} catch (error) {
		console.error("Error deleting contractor:", error);
		return NextResponse.json(
			{ success: false, error: "Internal server error" },
			{ status: 500 }
		);
	}
}
