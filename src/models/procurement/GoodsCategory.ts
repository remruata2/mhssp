import mongoose, { Document } from 'mongoose';

export interface IGoodsCategory extends Document {
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  // Virtual fields
  totalItems?: number;
}

const goodsCategorySchema = new mongoose.Schema<IGoodsCategory>(
  {
    name: { 
      type: String, 
      required: [true, 'Please provide a category name'],
      trim: true,
      unique: true,
      minlength: [2, 'Category name must be at least 2 characters long'],
      maxlength: [50, 'Category name cannot exceed 50 characters']
    },
    description: {
      type: String,
      trim: true,
      maxlength: [200, 'Description cannot exceed 200 characters']
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Create indexes for better query performance
goodsCategorySchema.index({ name: 1 });

// Virtual for total items in this category
goodsCategorySchema.virtual('totalItems', {
  ref: 'GoodsProcurement',
  localField: '_id',
  foreignField: 'goodsCategory',
  count: true
});

// Pre-save middleware
goodsCategorySchema.pre('save', function(next) {
  // Convert name to title case
  this.name = this.name
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  next();
});

export default mongoose.models.GoodsCategory ||
  mongoose.model<IGoodsCategory>('GoodsCategory', goodsCategorySchema);
