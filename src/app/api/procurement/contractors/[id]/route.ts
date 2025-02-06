import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Contractor from "@/models/procurement/Contractor";

export async function GET(
	request: NextRequest,
	context: { params: { id: string } }
) {
	try {
		const { id } = context.params;
		await dbConnect();
		const contractor = await Contractor.findById(id);

		if (!contractor) {
			return NextResponse.json(
				{ success: false, error: "Contractor not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json({ success: true, data: contractor });
	} catch {
		return NextResponse.json(
			{ success: false, error: "Failed to fetch contractor" },
			{ status: 500 }
		);
	}
}

export async function PUT(
	request: NextRequest,
	context: { params: { id: string } }
) {
	try {
		const { id } = context.params;
		const body = await request.json();
		await dbConnect();

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
	} catch (error: any) {
		if (error.code === 11000) {
			return NextResponse.json(
				{ success: false, error: "Registration number already exists" },
				{ status: 400 }
			);
		}
		return NextResponse.json(
			{ success: false, error: error.message || "Failed to update contractor" },
			{ status: 500 }
		);
	}
}

export async function DELETE(
	request: NextRequest,
	context: { params: { id: string } }
) {
	try {
		const { id } = context.params;
		await dbConnect();
		const contractor = await Contractor.findByIdAndDelete(id);

		if (!contractor) {
			return NextResponse.json(
				{ success: false, error: "Contractor not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json({ success: true, data: {} });
	} catch {
		return NextResponse.json(
			{ success: false, error: "Failed to delete contractor" },
			{ status: 500 }
		);
	}
}
