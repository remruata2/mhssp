export interface Notice {
  _id: string;
  title: string;
  type: 'document' | 'url' | 'subNotices';
  documentUrl?: string;
  url?: string;
  isPublished: boolean;
  publishDate: string;
}

export interface SubNotice {
  _id?: string;
  title: string;
  documentUrl: string;
  noticeId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SubNoticeFormData {
  title: string;
  documentUrl: string;
  file: File | null;
}
