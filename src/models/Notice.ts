import mongoose from 'mongoose';

const noticeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    minlength: [3, 'Title must be at least 3 characters long'],
    maxlength: [100, 'Title cannot exceed 100 characters'],
  },
  type: {
    type: String,
    required: [true, 'Notice type is required'],
    enum: ['document', 'url'],
  },
  documentUrl: {
    type: String,
    required: function(this: any) {
      return this.type === 'document';
    },
    validate: {
      validator: function(this: any, v: string) {
        return this.type !== 'document' || (v && v.length > 0);
      },
      message: 'Document URL is required for document type notices'
    }
  },
  url: {
    type: String,
    required: function(this: any) {
      return this.type === 'url';
    },
    validate: {
      validator: function(this: any, v: string) {
        if (this.type !== 'url') return true;
        if (!v) return false;
        
        // Allow local paths starting with /
        if (v.startsWith('/')) return true;
        
        // For external URLs, check if it's a valid URL
        try {
          new URL(v);
          return true;
        } catch {
          return false;
        }
      },
      message: 'Please enter a valid URL (can be a local path starting with / or a full URL)'
    }
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['General', 'Important', 'Announcement', 'Tender'],
  },
  isPublished: {
    type: Boolean,
    default: false,
  },
  publishDate: {
    type: Date,
    required: true,
    set: (v: string) => new Date(v),
    get: (v: Date) => v?.toISOString().split('T')[0],
  },
  schemaVersion: {
    type: Number,
    default: 2,
    required: true
  }
}, {
  timestamps: true,
  toJSON: { getters: true },
  toObject: { getters: true }
});

// Delete the old model if it exists to force schema update
if (mongoose.models.Notice) {
  delete mongoose.models.Notice;
}

export const Notice = mongoose.model('Notice', noticeSchema);
