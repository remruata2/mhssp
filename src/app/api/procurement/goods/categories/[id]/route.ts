import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import GoodsCategory from "@/models/procurement/GoodsCategory";

export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		await dbConnect();
		const category = await GoodsCategory.findById(params.id);

		if (!category) {
			return NextResponse.json(
				{ success: false, error: "Category not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json({ success: true, data: category });
	} catch (error) {
		return NextResponse.json(
			{ success: false, error: "Failed to fetch category" },
			{ status: 500 }
		);
	}
}

export async function PUT(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const body = await request.json();
		await dbConnect();

		const category = await GoodsCategory.findByIdAndUpdate(
			params.id,
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
		return NextResponse.json(
			{ success: false, error: error.message || "Failed to update category" },
			{ status: 500 }
		);
	}
}

export async function DELETE(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		await dbConnect();
		const category = await GoodsCategory.findByIdAndDelete(params.id);

		if (!category) {
			return NextResponse.json(
				{ success: false, error: "Category not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json({ success: true, data: {} });
	} catch (error) {
		return NextResponse.json(
			{ success: false, error: "Failed to delete category" },
			{ status: 500 }
		);
	}
}
