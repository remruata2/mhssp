import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import GoodsProcurement from "@/models/procurement/GoodsProcurement";

interface RouteParams {
	params: {
		id: string;
	};
}

export async function GET(request: NextRequest, context: RouteParams) {
	try {
		await dbConnect();
		const { id } = context.params;
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
	} catch {
		return NextResponse.json(
			{ success: false, error: "Failed to fetch goods procurement" },
			{ status: 500 }
		);
	}
}

export async function PUT(request: NextRequest, context: RouteParams) {
	try {
		const body = await request.json();
		const { id } = await context.params;
		await dbConnect();

		const goods = await GoodsProcurement.findByIdAndUpdate(id, body, {
			new: true,
			runValidators: true,
		})
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
		console.error("Error updating goods:", error);
		return NextResponse.json(
			{
				success: false,
				error:
					error instanceof Error
						? error.message
						: "Failed to update goods procurement",
			},
			{ status: 500 }
		);
	}
}

export async function DELETE(request: NextRequest, context: RouteParams) {
	try {
		await dbConnect();
		const { id } = context.params;
		const goods = await GoodsProcurement.findByIdAndDelete(id);

		if (!goods) {
			return NextResponse.json(
				{ success: false, error: "Goods procurement not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json({ success: true, data: null });
	} catch (error) {
		return NextResponse.json(
			{
				success: false,
				error:
					error instanceof Error
						? error.message
						: "Failed to delete goods procurement",
			},
			{ status: 500 }
		);
	}
}
