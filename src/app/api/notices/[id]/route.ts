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

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();

    const formData = await req.formData();
    const title = formData.get('title') as string;
    const type = formData.get('type') as 'document' | 'url';
    const category = formData.get('category') as string;
    const isPublished = formData.get('isPublished') === 'true';
    const publishDate = formData.get('publishDate') as string;

    const updateData: any = {
      title,
      type,
      category,
      isPublished,
      publishDate: new Date(publishDate),
    };

    // Handle document type
    if (type === 'document') {
      const documentFile = formData.get('document') as File | null;
      if (documentFile) {
        updateData.documentUrl = await savePDF(documentFile);
      }
    }
    
    // Handle URL type
    if (type === 'url') {
      const url = formData.get('url') as string;
      if (url) {
        updateData.url = url;
      }
    }

    const notice = await Notice.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!notice) {
      return NextResponse.json(
        { success: false, error: 'Notice not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: notice });
  } catch (error) {
    console.error('Error updating notice:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update notice' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();

    const notice = await Notice.findByIdAndDelete(params.id);
    if (!notice) {
      return NextResponse.json(
        { success: false, error: 'Notice not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: notice });
  } catch (error) {
    console.error('Error deleting notice:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete notice' },
      { status: 500 }
    );
  }
}
