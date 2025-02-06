import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/lib/db";
import GoodsCategory from "@/models/procurement/GoodsCategory";

export async function GET() {
	try {
		await dbConnect();
		const categories = await GoodsCategory.find({}).sort({ name: 1 });
		return NextResponse.json({ success: true, data: categories });
	} catch (error) {
		return NextResponse.json(
			{ success: false, error: "Failed to fetch categories" },
			{ status: 500 }
		);
	}
}

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		await dbConnect();

		const category = await GoodsCategory.create(body);
		return NextResponse.json(
			{ success: true, data: category },
			{ status: 201 }
		);
	} catch (error: any) {
		if (error.code === 11000) {
			return NextResponse.json(
				{ success: false, error: "Category name already exists" },
				{ status: 400 }
			);
		}
		return NextResponse.json(
			{ success: false, error: error.message || "Failed to create category" },
			{ status: 500 }
		);
	}
}
