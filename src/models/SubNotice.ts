import mongoose, { Schema, Document } from 'mongoose';

export interface ISubNotice extends Document {
  noticeId: mongoose.Types.ObjectId;
  title: string;
  documentUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

const SubNoticeSchema = new Schema({
  noticeId: {
    type: Schema.Types.ObjectId,
    ref: 'Notice',
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  documentUrl: {
    type: String,
    required: true,
    trim: true,
  },
}, {
  timestamps: true,
});

// Create indexes
SubNoticeSchema.index({ noticeId: 1 });
SubNoticeSchema.index({ createdAt: -1 });

// Add any virtual fields if needed
SubNoticeSchema.virtual('notice', {
  ref: 'Notice',
  localField: 'noticeId',
  foreignField: '_id',
  justOne: true,
});

// Export the model and return your ISubNotice interface
export const SubNotice = mongoose.models.SubNotice || mongoose.model<ISubNotice>('SubNotice', SubNoticeSchema);
