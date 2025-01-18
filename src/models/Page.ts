import mongoose, { Model } from 'mongoose';

interface IPage {
  title: string;
  slug: string;
  content: string;
  isPublished: boolean;
  showInMenu: boolean;
  menuOrder: number;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const pageSchema = new mongoose.Schema<IPage>(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Please provide a slug'],
      unique: true,
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Please provide content'],
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
export const Page = (mongoose.models.Page as Model<IPage>) || mongoose.model<IPage>('Page', pageSchema);
