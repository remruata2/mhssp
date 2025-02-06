import { NextResponse, NextRequest } from "next/server";
import GoodsProcurement from "@/models/procurement/GoodsProcurement";
import "@/models/procurement/GoodsCategory";
import "@/models/procurement/Contractor";

export async function GET() {
	try {
		const goods = await GoodsProcurement.find()
			.populate("goodsCategory", "name")
			.populate("contractor", "name")
			.sort({ createdAt: -1 })
			.select(
				"referenceNo goodsName quantity contractSignedDate contractor goodsCategory createdAt"
			)
			.lean();

		return NextResponse.json({ success: true, data: goods });
	} catch (error: unknown) {
		const message =
			error instanceof Error ? error.message : "Unknown error occurred";
		console.error("Error fetching goods:", error);
		return NextResponse.json(
			{ success: false, error: message },
			{ status: 500 }
		);
	}
}

export async function POST(req: NextRequest) {
	try {
		const data = await req.json();

		const goods = await GoodsProcurement.create(data);
		const populatedGoods = await GoodsProcurement.findById(goods._id)
			.populate("goodsCategory", "name")
			.populate("contractor", "name")
			.lean();

		return NextResponse.json(
			{ success: true, data: populatedGoods },
			{ status: 201 }
		);
	} catch (error: unknown) {
		const message =
			error instanceof Error
				? error.message
				: "Failed to create goods procurement";
		return NextResponse.json(
			{ success: false, error: message },
			{ status: 500 }
		);
	}
}

export async function PUT(req: NextRequest) {
	try {
		const data = await req.json();
		const { id, ...updateData } = data;

		// First try to drop any existing unique index
		try {
			const GoodsProcurementModel = GoodsProcurement;
			if (GoodsProcurementModel) {
				await GoodsProcurementModel.collection.dropIndex("referenceNo_1");
			}
		} catch (error) {
			// Index might not exist, which is fine
			console.log("Index drop during update:", error);
		}

		const updated = await GoodsProcurement.findByIdAndUpdate(
			id,
			{ $set: updateData },
			{ new: true, runValidators: true }
		)
			.populate("goodsCategory", "name")
			.populate("contractor", "name")
			.lean();

		if (!updated) {
			return NextResponse.json(
				{ success: false, error: "Goods procurement not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json({ success: true, data: updated });
	} catch (error: unknown) {
		const message =
			error instanceof Error
				? error.message
				: "Failed to update goods procurement";
		console.error("Update error:", error);
		return NextResponse.json(
			{ success: false, error: message },
			{ status: 500 }
		);
	}
}

export async function DELETE(req: NextRequest) {
	try {
		const url = new URL(req.url);
		const id = url.searchParams.get("id");

		if (!id) {
			return NextResponse.json(
				{ success: false, error: "ID is required" },
				{ status: 400 }
			);
		}

		const deleted = await GoodsProcurement.findByIdAndDelete(id);

		if (!deleted) {
			return NextResponse.json(
				{ success: false, error: "Goods procurement not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json({ success: true, data: {} });
	} catch (error: unknown) {
		const message =
			error instanceof Error
				? error.message
				: "Failed to delete goods procurement";
		return NextResponse.json(
			{ success: false, error: message },
			{ status: 500 }
		);
	}
}
