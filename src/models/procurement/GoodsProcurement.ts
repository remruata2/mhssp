import { Schema, model, models, Document } from 'mongoose';

// Clear any existing model to prevent stale schema
if (models.GoodsProcurement) {
  delete models.GoodsProcurement;
}

export interface IGoodsProcurement extends Document {
  referenceNo: string;
  goodsCategory: Schema.Types.ObjectId;
  goodsName: string;
  quantity: number;
  contractSignedDate: Date;
  contractor: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const goodsProcurementSchema = new Schema<IGoodsProcurement>(
  {
    referenceNo: {
      type: String,
      required: [true, 'Reference number is required'],
      trim: true,
      unique: true,
    },
    goodsCategory: {
      type: Schema.Types.ObjectId,
      ref: 'GoodsCategory',
      required: [true, 'Goods category is required'],
    },
    goodsName: {
      type: String,
      required: [true, 'Goods name is required'],
      trim: true,
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [0, 'Quantity cannot be negative'],
    },
    contractSignedDate: {
      type: Date,
      required: [true, 'Contract signed date is required'],
    },
    contractor: {
      type: Schema.Types.ObjectId,
      ref: 'Contractor',
      required: [true, 'Contractor is required'],
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Create indexes for better query performance
goodsProcurementSchema.index({ createdAt: -1 });
goodsProcurementSchema.index({ goodsCategory: 1 });
goodsProcurementSchema.index({ contractor: 1 });

// Virtual for formatted date
goodsProcurementSchema.virtual('formattedContractSignedDate').get(function (this: IGoodsProcurement) {
  return this.contractSignedDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
});

export default model<IGoodsProcurement>('GoodsProcurement', goodsProcurementSchema);
