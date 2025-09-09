import mongoose, { Model } from "mongoose";

interface IPage {
	title: string;
	slug: string;
	content: string;
	isPublished: boolean;
	showInMenu: boolean;
	menuOrder: number;
	category?: string;
	thumbnailUrl?: string;
	excerpt?: string;
	publishedAt: Date | null;
	createdAt: Date;
	updatedAt: Date;
}

const pageSchema = new mongoose.Schema<IPage>(
	{
		title: {
			type: String,
			required: [true, "Please provide a title"],
			trim: true,
		},
		slug: {
			type: String,
			required: [true, "Please provide a slug"],
			unique: true,
			trim: true,
		},
		content: {
			type: String,
			required: [true, "Please provide content"],
		},
		isPublished: {
			type: Boolean,
			default: false,
		},
		showInMenu: {
			type: Boolean,
			default: false,
		},
		menuOrder: {
			type: Number,
			default: 0,
		},
		category: {
			type: String,
			default: "",
			trim: true,
		},
		thumbnailUrl: {
			type: String,
			default: "",
			trim: true,
		},
		excerpt: {
			type: String,
			default: "",
			trim: true,
		},
		publishedAt: {
			type: Date,
			default: null,
		},
	},
	{
		timestamps: true,
	}
);

// Create or get the model
export const Page =
	(mongoose.models.Page as Model<IPage>) ||
	mongoose.model<IPage>("Page", pageSchema);
