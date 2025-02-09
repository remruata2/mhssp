import mongoose from "mongoose";

const NewsSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: [true, "Please provide a title"],
			maxlength: [100, "Title cannot be more than 100 characters"],
		},
		content: {
			type: String,
			required: true,
		},
		images: {
			type: [String],
			default: [],
		},
		isPublished: {
			type: Boolean,
			default: false,
		},
		publishDate: {
			type: Date,
			default: Date.now,
		},
	},
	{
		timestamps: true,
	}
);

// Delete the model if it exists to prevent schema modification errors
if (mongoose.models.News) {
	delete mongoose.models.News;
}

export default mongoose.model("News", NewsSchema);
