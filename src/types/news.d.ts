declare module '@/types/news' {
  interface NewsItem {
    _id: string;
    title: string;
    content: string;
    images: string[];
    isPublished: boolean;
    publishDate: Date;
    createdAt: Date;
    updatedAt: Date;
  }
}

export {};
