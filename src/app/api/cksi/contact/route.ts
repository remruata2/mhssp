import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import dbConnect from "@/lib/db";

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { name, email, message } = body;

		// Validate the input
		if (!name || !email || !message) {
			return NextResponse.json(
				{ error: "Name, email, and message are required" },
				{ status: 400 }
			);
		}

		// Connect to MongoDB
		await dbConnect();

		// Here you can add code to save to MongoDB
		// const Contact = mongoose.model('Contact', contactSchema);
		// await Contact.create(contactMessage);

		return NextResponse.json(
			{ message: "Message sent successfully" },
			{ status: 200 }
		);
	} catch (error) {
		console.error("Contact form error:", error);
		return NextResponse.json(
			{ error: "Failed to send message" },
			{ status: 500 }
		);
	}
}
