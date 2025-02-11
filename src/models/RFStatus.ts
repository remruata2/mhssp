import mongoose from "mongoose";

const rfStatusSchema = new mongoose.Schema(
	{
		rfId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "ResultFramework",
			required: [true, "Result Framework reference is required"],
		},
		status: {
			type: String,
			required: [true, "Status is required"],
			trim: true,
		},
		year: {
			type: Number,
			required: [true, "Year is required"],
			enum: [2021, 2022, 2023, 2024, 2025],
		},
		quarter: {
			type: Number,
			required: [true, "Quarter is required"],
			enum: [1, 2, 3, 4],
		},
		remark: {
			type: String,
			required: false,
			trim: true,
		},
	},
	{
		timestamps: true,
	}
);

// Create a compound index to ensure unique combination of rfId, year, and quarter
rfStatusSchema.index({ rfId: 1, year: 1, quarter: 1 }, { unique: true });

const RFStatus = mongoose.models.RFStatus || mongoose.model("RFStatus", rfStatusSchema);

export default RFStatus; 