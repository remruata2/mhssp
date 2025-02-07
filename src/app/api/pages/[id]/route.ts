import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/lib/db";
import { Page } from "@/models/Page";

interface Context {
	params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, context: Context) {
	try {
		await dbConnect();
		const { id } = await context.params;
		const page = await Page.findById(id);

		if (!page) {
			return NextResponse.json(
				{ success: false, error: "Page not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json({ success: true, data: page });
	} catch (error) {
		console.error("Error fetching page:", error);
		return NextResponse.json(
			{ success: false, error: "Error fetching page" },
			{ status: 500 }
		);
	}
}

export async function PUT(request: NextRequest, context: Context) {
	try {
		await dbConnect();
		const { id } = await context.params;
		const data = await request.json();

		// If publishing/unpublishing, update the publishedAt date
		if ("isPublished" in data) {
			data.publishedAt = data.isPublished ? new Date() : null;
		}

		const page = await Page.findByIdAndUpdate(
			id,
			{ $set: data },
			{ new: true, runValidators: true }
		);

		if (!page) {
			return NextResponse.json(
				{ success: false, error: "Page not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json({ success: true, data: page });
	} catch (error) {
		console.error("Error updating page:", error);
		return NextResponse.json(
			{ success: false, error: "Error updating page" },
			{ status: 500 }
		);
	}
}

export async function DELETE(request: NextRequest, context: Context) {
	try {
		await dbConnect();
		const { id } = await context.params;
		const page = await Page.findByIdAndDelete(id);

		if (!page) {
			return NextResponse.json(
				{ success: false, error: "Page not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json({ success: true, data: page });
	} catch (error) {
		console.error("Error deleting page:", error);
		return NextResponse.json(
			{ success: false, error: "Error deleting page" },
			{ status: 500 }
		);
	}
}
