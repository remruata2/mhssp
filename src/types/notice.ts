export interface Notice {
  _id: string;
  title: string;
  type: 'document' | 'url' | 'subNotices';
  documentUrl?: string;
  url?: string;
  isPublished: boolean;
  publishDate: string;
  referenceNumber?: string;
  department?: string;
  category?: string;
  description?: string;
  expiryDate?: string;
  priority?: 'low' | 'medium' | 'high';
}

export interface SubNotice {
  _id?: string;
  title: string;
  documentUrl: string;
  noticeId?: string;
  referenceNumber?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SubNoticeFormData {
  title: string;
  documentUrl: string;
  referenceNumber?: string;
  description?: string;
}
