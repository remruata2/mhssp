import mongoose from "mongoose";

const resultFrameworkSchema = new mongoose.Schema(
	{
		indicator: {
			type: String,
			required: [true, "Indicator is required"],
			trim: true,
		},
		baseline: {
			type: String,
			required: false,
			trim: true,
		},
		yearOneTarget: {
			type: String,
			required: [true, "Year 1 target is required"],
			trim: true,
		},
		yearTwoTarget: {
			type: String,
			required: [true, "Year 2 target is required"],
			trim: true,
		},
		yearThreeTarget: {
			type: String,
			required: [true, "Year 3 target is required"],
			trim: true,
		},
		yearFourTarget: {
			type: String,
			required: [true, "Year 4 target is required"],
			trim: true,
		},
		yearFiveTarget: {
			type: String,
			required: false,
			trim: true,
		},
	},
	{
		timestamps: true,
	}
);

const ResultFramework = mongoose.models.ResultFramework || mongoose.model("ResultFramework", resultFrameworkSchema);

export default ResultFramework; 