import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import dbConnect from "@/lib/db";
import GoodsProcurement from "@/models/procurement/GoodsProcurement";

interface Context {
	params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, context: Context) {
	try {
		await dbConnect();
		const { id } = await context.params;

		const goods = await GoodsProcurement.findById(id)
			.populate("goodsCategory")
			.populate("contractor");

		if (!goods) {
			return NextResponse.json(
				{ success: false, error: "Goods procurement not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json({ success: true, data: goods });
	} catch (error) {
		console.error("Error fetching goods procurement:", error);
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

		const goods = await GoodsProcurement.findByIdAndUpdate(
			id,
			{ $set: body },
			{ new: true, runValidators: true }
		)
			.populate("goodsCategory")
			.populate("contractor");

		if (!goods) {
			return NextResponse.json(
				{ success: false, error: "Goods procurement not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json({ success: true, data: goods });
	} catch (error) {
		console.error("Error updating goods procurement:", error);
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

		const goods = await GoodsProcurement.findByIdAndDelete(id);

		if (!goods) {
			return NextResponse.json(
				{ success: false, error: "Goods procurement not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json({ success: true, data: null });
	} catch (error) {
		console.error("Error deleting goods procurement:", error);
		return NextResponse.json(
			{ success: false, error: "Internal server error" },
			{ status: 500 }
		);
	}
}
