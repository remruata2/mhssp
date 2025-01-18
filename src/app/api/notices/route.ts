import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Notice } from '@/models/Notice';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

// Helper function to save PDF file
async function savePDF(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Create a unique filename
  const filename = `${Date.now()}-${file.name}`;
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'notices');
  
  // Create directory if it doesn't exist
  if (!existsSync(uploadDir)) {
    await mkdir(uploadDir, { recursive: true });
  }
  
  const filepath = path.join(uploadDir, filename);

  // Save the file
  await writeFile(filepath, buffer);
  return `/uploads/notices/${filename}`;
}

export async function GET() {
  try {
    await dbConnect();
    
    // Get all notices, sorted by date
    const notices = await Notice.find()
      .sort({ publishDate: -1 })
      .lean();

    return NextResponse.json({ success: true, data: notices });
  } catch (error) {
    console.error('Error fetching notices:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch notices' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();

    const formData = await req.formData();
    const title = formData.get('title') as string;
    const type = formData.get('type') as 'document' | 'url';
    const category = formData.get('category') as string;
    const isPublished = formData.get('isPublished') === 'true';
    const publishDate = formData.get('publishDate') as string;
    
    // Validate required fields
    if (!title || !type || !category || !publishDate) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const noticeData: any = {
      title,
      type,
      category,
      isPublished: isPublished ? true : false,
      publishDate: new Date(publishDate),
    };

    // Handle document type
    if (type === 'document') {
      const documentFile = formData.get('document') as File;
      if (!documentFile) {
        return NextResponse.json(
          { success: false, error: 'Document file is required for document type notices' },
          { status: 400 }
        );
      }
      noticeData.documentUrl = await savePDF(documentFile);
    }
    
    // Handle URL type
    if (type === 'url') {
      const url = formData.get('url') as string;
      if (!url) {
        return NextResponse.json(
          { success: false, error: 'URL is required for URL type notices' },
          { status: 400 }
        );
      }
      noticeData.url = url;
    }

    // Create the notice
    const notice = await Notice.create(noticeData);

    return NextResponse.json({ success: true, data: notice });
  } catch (error) {
    console.error('Error creating notice:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create notice' },
      { status: 500 }
    );
  }
}
