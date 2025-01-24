import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Notice } from '@/models/Notice';
import { SubNotice } from '@/models/SubNotice';
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
    
    // Get only published notices and sort by date
    const notices = await Notice.find({
      isPublished: true,
      publishDate: { $lte: new Date() } // Only return notices whose publish date has passed
    })
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
    const type = formData.get('type') as string;
    const isPublished = formData.get('isPublished') === 'true';
    const publishDate = formData.get('publishDate') as string;

    let documentUrl = '';
    let url = '';

    // Handle different notice types
    if (type === 'document') {
      const pdfFile = formData.get('pdf') as File;
      if (pdfFile) {
        documentUrl = await savePDF(pdfFile);
      } else {
        documentUrl = formData.get('documentUrl') as string;
      }
    } else if (type === 'url') {
      url = formData.get('url') as string;
    }

    // Create the notice
    const notice = await Notice.create({
      title,
      type,
      documentUrl,
      url,
      isPublished,
      publishDate,
    });

    // Handle sub notices if type is subNotices
    if (type === 'subNotices') {
      const subNoticesData = JSON.parse(formData.get('subNotices') as string);
      
      // Create sub notices
      for (let i = 0; i < subNoticesData.length; i++) {
        const subNotice = subNoticesData[i];
        const subNoticeFile = formData.get(`subNoticeFile_${i}`) as File;
        
        let subNoticeDocumentUrl = subNotice.documentUrl;
        
        // If there's a file, upload it
        if (subNoticeFile) {
          subNoticeDocumentUrl = await savePDF(subNoticeFile);
        }
        
        await SubNotice.create({
          noticeId: notice._id,
          title: subNotice.title,
          documentUrl: subNoticeDocumentUrl,
        });
      }
    }

    return NextResponse.json({ success: true, data: notice });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'An error occurred' },
      { status: 500 }
    );
  }
}
