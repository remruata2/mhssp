import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/lib/db";
import ConsultancyProcurement from "@/models/procurement/ConsultancyProcurement";
import Contractor from "@/models/procurement/Contractor";
import mongoose from "mongoose";

export async function GET() {
	try {
		await dbConnect();
		const consultancies = await ConsultancyProcurement.find({})
			.populate("contractor")
			.sort({ createdAt: -1 });
		return NextResponse.json({ success: true, data: consultancies });
	} catch {
		return NextResponse.json(
			{ success: false, error: "Failed to fetch consultancies" },
			{ status: 500 }
		);
	}
}

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		await dbConnect();

		// Validate contractor ID
		if (!body.contractor || !mongoose.Types.ObjectId.isValid(body.contractor)) {
			return NextResponse.json(
				{ success: false, error: "Please select a valid contractor" },
				{ status: 400 }
			);
		}

		// Verify contractor exists
		const contractor = await Contractor.findById(body.contractor);
		if (!contractor) {
			return NextResponse.json(
				{ success: false, error: "Selected contractor does not exist" },
				{ status: 400 }
			);
		}

		console.log("Contractor:", contractor);

		// Create the consultancy with contractor reference
		const consultancyData = {
			contractBidNo: body.contractBidNo,
			consultancyServices: body.consultancyServices,
			contractSigned: new Date(body.contractSigned), // Convert to Date object
			contractor: new mongoose.Types.ObjectId(contractor._id), // Ensure it's an ObjectId
		};

		console.log("Creating consultancy with data:", consultancyData);

		// Create a new instance and validate it
		const consultancy = new ConsultancyProcurement(consultancyData);
		await consultancy.validate(); // Validate before saving

		// Save if validation passes
		await consultancy.save();
		const populatedConsultancy = await consultancy.populate("contractor");

		return NextResponse.json(
			{ success: true, data: populatedConsultancy },
			{ status: 201 }
		);
	} catch (error: any) {
		console.error("Error creating consultancy:", error);

		// Handle duplicate key error
		if (error.code === 11000) {
			return NextResponse.json(
				{ success: false, error: "Reference number already exists" },
				{ status: 400 }
			);
		}

		// Handle validation errors
		if (error.name === "ValidationError") {
			const validationErrors = Object.values(error.errors).map(
				(err: any) => err.message
			);
			return NextResponse.json(
				{ success: false, error: validationErrors.join(", ") },
				{ status: 400 }
			);
		}

		return NextResponse.json(
			{
				success: false,
				error: error.message || "Failed to create consultancy",
			},
			{ status: 500 }
		);
	}
}
