import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import dbConnect from "@/lib/db";
import ConsultancyProcurement from "@/models/procurement/ConsultancyProcurement";

interface Context {
	params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, context: Context) {
	try {
		await dbConnect();
		const { id } = await context.params;

		const consultancy = await ConsultancyProcurement.findById(id).populate(
			"contractor"
		);

		if (!consultancy) {
			return NextResponse.json(
				{ success: false, error: "Consultancy not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json({ success: true, data: consultancy });
	} catch (error) {
		console.error("Error fetching consultancy:", error);
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

		const consultancy = await ConsultancyProcurement.findByIdAndUpdate(
			id,
			{ $set: body },
			{ new: true, runValidators: true }
		).populate("contractor");

		if (!consultancy) {
			return NextResponse.json(
				{ success: false, error: "Consultancy not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json({ success: true, data: consultancy });
	} catch (error) {
		console.error("Error updating consultancy:", error);
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

		const consultancy = await ConsultancyProcurement.findByIdAndDelete(id);

		if (!consultancy) {
			return NextResponse.json(
				{ success: false, error: "Consultancy not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json({ success: true, data: consultancy });
	} catch (error) {
		console.error("Error deleting consultancy:", error);
		return NextResponse.json(
			{ success: false, error: "Internal server error" },
			{ status: 500 }
		);
	}
}
