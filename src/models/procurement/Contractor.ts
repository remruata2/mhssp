import mongoose, { Document } from "mongoose";

export interface IContractor extends Document {
	name: string;
	email?: string;
	phone?: string;
	address?: string;
	createdAt: Date;
	updatedAt: Date;
}

const contractorSchema = new mongoose.Schema<IContractor>(
	{
		name: {
			type: String,
			required: [true, "Please provide a contractor name"],
			trim: true,
			unique: true,
			minlength: [2, "Contractor name must be at least 2 characters long"],
			maxlength: [100, "Contractor name cannot exceed 100 characters"],
		},
		email: {
			type: String,
			trim: true,
			lowercase: true,
			index: true,
			sparse: true,
			match: [
				/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
				"Please provide a valid email address",
			],
		},
		phone: {
			type: String,
			trim: true,
			match: [
				/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
				"Please provide a valid phone number",
			],
		},
		address: {
			type: String,
			trim: true,
			maxlength: [200, "Address cannot exceed 200 characters"],
		},
	},
	{
		timestamps: true,
	}
);

// Pre-save middleware
contractorSchema.pre("save", function (next) {
	// Convert name to title case
	this.name = this.name
		.toLowerCase()
		.split(" ")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
	next();
});

export default mongoose.models.Contractor ||
	mongoose.model<IContractor>("Contractor", contractorSchema);
