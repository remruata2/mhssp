import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import dbConnect from "@/lib/db";
import CivilWork from "@/models/procurement/CivilWorksProcurement";

interface Context {
	params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, context: Context) {
	try {
		await dbConnect();
		const { id } = await context.params;

		const civilWork = await CivilWork.findById(id).populate("contractor");

		if (!civilWork) {
			return NextResponse.json(
				{ success: false, error: "Civil work not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json({ success: true, data: civilWork });
	} catch (error) {
		console.error("Error fetching civil work:", error);
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

		const civilWork = await CivilWork.findByIdAndUpdate(
			id,
			{ $set: body },
			{ new: true, runValidators: true }
		).populate("contractor");

		if (!civilWork) {
			return NextResponse.json(
				{ success: false, error: "Civil work not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json({ success: true, data: civilWork });
	} catch (error: unknown) {
		if (error instanceof Error) {
			console.error("Error updating civil work:", error);

			return NextResponse.json(
				{ success: false, error: error.message },
				{ status: 500 }
			);
		}
	}
}

export async function DELETE(request: NextRequest, context: Context) {
	try {
		await dbConnect();
		const { id } = await context.params;

		const civilWork = await CivilWork.findByIdAndDelete(id);

		if (!civilWork) {
			return NextResponse.json(
				{ success: false, error: "Civil work not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json({ success: true, data: civilWork });
	} catch (error: unknown) {
		if (error instanceof Error) {
			console.error("Error deleting civil work:", error);
			return NextResponse.json(
				{ success: false, error: error.message },
				{ status: 500 }
			);
		}
	}
}
