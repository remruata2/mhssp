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
    const isPublished = formData.get('isPublished') === 'true';
    const publishDate = formData.get('publishDate') as string;
    
    // Validate required fields
    if (!title || !type || !publishDate) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const noticeData: any = {
      title,
      type,
      isPublished: isPublished ? true : false,
      publishDate: new Date(publishDate),
    };

    // Handle document type
    if (type === 'document') {
      const documentFile = formData.get('pdf') as File;
      const documentUrl = formData.get('documentUrl') as string;

      // Check if either file or URL is provided
      if (!documentFile && !documentUrl) {
        return NextResponse.json(
          { success: false, error: 'Either document file or document URL is required' },
          { status: 400 }
        );
      }

      // If file is provided, save it and use its path
      if (documentFile) {
        noticeData.documentUrl = await savePDF(documentFile);
      } else {
        // If URL is provided, use it directly
        noticeData.documentUrl = documentUrl;
      }
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

    const notice = await Notice.create(noticeData);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Notice created successfully',
      data: notice 
    });

  } catch (error: any) {
    console.error('Error creating notice:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to create notice',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
}
