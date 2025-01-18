import mongoose, { Document } from 'mongoose';
import { IContractor } from './Contractor';
import { IGoodsCategory } from './GoodsCategory';

export interface IGoodsProcurement extends Document {
  referenceNo: number;
  goodsCategory: mongoose.Types.ObjectId | IGoodsCategory;
  itemName: string;
  quantity: number;
  contractSignedDate: Date;
  contractor: mongoose.Types.ObjectId | IContractor;
  createdAt: Date;
  updatedAt: Date;
  // Virtual fields
  formattedDate: string;
  isExpired: boolean;
  daysSinceCreation: number;
  totalValue: number;
}

const goodsProcurementSchema = new mongoose.Schema<IGoodsProcurement>(
  {
    referenceNo: { 
      type: Number, 
      required: [true, 'Please provide a reference number'],
      unique: true,
      index: true,
      validate: {
        validator: Number.isInteger,
        message: 'Reference number must be an integer'
      }
    },
    goodsCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'GoodsCategory',
      required: [true, 'Please specify a goods category'],
    },
    itemName: { 
      type: String, 
      required: [true, 'Please provide an item name'],
      trim: true,
      minlength: [3, 'Item name must be at least 3 characters long'],
      maxlength: [100, 'Item name cannot exceed 100 characters']
    },
    quantity: { 
      type: Number, 
      required: [true, 'Please specify quantity'],
      min: [1, 'Quantity must be at least 1'],
      validate: {
        validator: Number.isInteger,
        message: 'Quantity must be a whole number'
      }
    },
    unitPrice: { 
      type: Number, 
      required: [true, 'Please specify unit price'],
      min: [0, 'Unit price must be at least 0'],
      validate: {
        validator: Number.isFinite,
        message: 'Unit price must be a number'
      }
    },
    contractSignedDate: { 
      type: Date, 
      required: [true, 'Please provide contract signed date'],
      validate: {
        validator: function(value: Date) {
          return value <= new Date();
        },
        message: 'Contract signed date cannot be in the future'
      }
    },
    contractor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Contractor',
      required: [true, 'Please specify a contractor'],
    },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Create indexes for better query performance
goodsProcurementSchema.index({ createdAt: -1 });
goodsProcurementSchema.index({ goodsCategory: 1 });
goodsProcurementSchema.index({ contractor: 1 });

// Virtual for formatted date
goodsProcurementSchema.virtual('formattedDate').get(function() {
  return this.contractSignedDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Virtual to check if contract is older than 1 year
goodsProcurementSchema.virtual('isExpired').get(function() {
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  return this.contractSignedDate < oneYearAgo;
});

// Virtual for days since creation
goodsProcurementSchema.virtual('daysSinceCreation').get(function() {
  const diffTime = Math.abs(new Date().getTime() - this.createdAt.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Virtual for total value
goodsProcurementSchema.virtual('totalValue').get(function() {
  return this.quantity * this.unitPrice;
});

// Pre-save middleware
goodsProcurementSchema.pre('save', function(next) {
  if (this.contractSignedDate > new Date()) {
    next(new Error('Contract signed date cannot be in the future'));
    return;
  }
  if (this.unitPrice < 0) {
    next(new Error('Unit price cannot be negative'));
    return;
  }
  next();
});

export default mongoose.models.GoodsProcurement ||
  mongoose.model<IGoodsProcurement>('GoodsProcurement', goodsProcurementSchema);
