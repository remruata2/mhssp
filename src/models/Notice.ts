import mongoose, { model, Document } from "mongoose";

export interface INotice {
	title: string;
	type: string;
	documentUrl?: string;
	url?: string;
	isPublished: boolean;
	publishDate: Date;
	schemaVersion: number;
}

export interface INoticeDocument extends INotice, Document {}

const noticeSchema = new mongoose.Schema<INoticeDocument>(
	{
		title: {
			type: String,
			required: [true, "Title is required"],
			minlength: [3, "Title must be at least 3 characters long"],
			maxlength: [250, "Title cannot exceed 250 characters"],
		},
		type: {
			type: String,
			required: [true, "Notice type is required"],
			enum: ["document", "url", "subNotices"],
		},
		documentUrl: {
			type: String,
			required: function (this: any) {
				return this.type === "document";
			},
			validate: {
				validator: function (this: any, v: string) {
					return this.type !== "document" || (v && v.length > 0);
				},
				message: "Document URL is required for document type notices",
			},
		},
		url: {
			type: String,
			required: function (this: any) {
				return this.type === "url";
			},
			validate: {
				validator: function (this: any, v: string) {
					if (this.type !== "url") return true;
					if (!v) return false;

					// Allow local paths starting with /
					if (v.startsWith("/")) return true;

					// For external URLs, check if it's a valid URL
					try {
						new URL(v);
						return true;
					} catch {
						return false;
					}
				},
				message:
					"Please enter a valid URL (can be a local path starting with / or a full URL)",
			},
		},
		isPublished: {
			type: Boolean,
			default: false,
		},
		publishDate: {
			type: Date,
			required: [true, "Publish date is required"],
			set: (v: string | Date) => new Date(v),
			get: (v: Date) => v.toISOString() as unknown as Date,
		},
		schemaVersion: {
			type: Number,
			default: 2,
			required: true,
		},
	},
	{
		timestamps: true,
		toJSON: { getters: true },
		toObject: { getters: true },
	}
);

// Delete the old model if it exists to force schema update
if (mongoose.models.Notice) {
	delete mongoose.models.Notice;
}

export const Notice = model<INoticeDocument>("Notice", noticeSchema);
