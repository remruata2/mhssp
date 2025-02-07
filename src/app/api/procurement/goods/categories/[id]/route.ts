import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import dbConnect from "@/lib/db";
import GoodsCategory from "@/models/procurement/GoodsCategory";

interface Context {
	params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, context: Context) {
	try {
		await dbConnect();
		const { id } = await context.params;

		const category = await GoodsCategory.findById(id);

		if (!category) {
			return NextResponse.json(
				{ success: false, error: "Category not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json({ success: true, data: category });
	} catch (error) {
		console.error("Error fetching category:", error);
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

		const category = await GoodsCategory.findByIdAndUpdate(
			id,
			{ $set: body },
			{ new: true, runValidators: true }
		);

		if (!category) {
			return NextResponse.json(
				{ success: false, error: "Category not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json({ success: true, data: category });
	} catch (error: any) {
		if (error.code === 11000) {
			return NextResponse.json(
				{ success: false, error: "Category name already exists" },
				{ status: 400 }
			);
		}
		console.error("Error updating category:", error);
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

		const category = await GoodsCategory.findByIdAndDelete(id);

		if (!category) {
			return NextResponse.json(
				{ success: false, error: "Category not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json({ success: true, data: {} });
	} catch (error) {
		console.error("Error deleting category:", error);
		return NextResponse.json(
			{ success: false, error: "Internal server error" },
			{ status: 500 }
		);
	}
}
