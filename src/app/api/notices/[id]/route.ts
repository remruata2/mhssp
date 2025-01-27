import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Notice } from '@/models/Notice';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(
  request: Request,
  context: RouteParams
) {
  try {
    const { id } = await Promise.resolve(context.params);

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Notice ID is required' },
        { status: 400 }
      );
    }

    await dbConnect();

    const notice = await Notice.findById(id);
    if (!notice) {
      return NextResponse.json(
        { success: false, error: 'Notice not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: notice });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An error occurred';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

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

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
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
      const pdfFile = formData.get('document') as File;
      if (pdfFile) {
        documentUrl = await savePDF(pdfFile);
      } else {
        documentUrl = formData.get('documentUrl') as string;
      }
    } else if (type === 'url') {
      url = formData.get('url') as string;
    }

    // Update the notice
    const updateData: any = {
      title,
      type,
      isPublished,
      publishDate: new Date(publishDate),
    };

    if (type === 'document' && documentUrl) {
      updateData.documentUrl = documentUrl;
    } else if (type === 'url') {
      updateData.url = url;
    }

    const notice = await Notice.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true }
    );

    if (!notice) {
      return NextResponse.json(
        { success: false, error: 'Notice not found' },
        { status: 404 }
      );
    }

    // Handle sub notices if type is subNotices
    if (type === 'subNotices') {
      // Get existing sub notices to preserve order
      const existingSubNotices = await SubNotice.find({ noticeId: notice._id })
        .sort({ order: 1 });
      
      // Create a map of existing orders
      const orderMap = new Map(
        existingSubNotices.map(sn => [sn._id.toString(), sn.order])
      );

      // First, delete existing sub notices
      await SubNotice.deleteMany({ noticeId: notice._id });

      const subNotices = [];
      let index = 0;
      
      // Keep checking for sub notices until we don't find any more
      while (formData.has(`subNotices[${index}][title]`)) {
        const title = formData.get(`subNotices[${index}][title]`) as string;
        const file = formData.get(`subNotices[${index}][file]`) as File;
        let documentUrl = formData.get(`subNotices[${index}][documentUrl]`) as string;
        const subNoticeId = formData.get(`subNotices[${index}][id]`) as string;

        // If there's a file, upload it
        if (file) {
          documentUrl = await savePDF(file);
        }

        // Use existing order if available, otherwise use index
        const order = subNoticeId && orderMap.has(subNoticeId) 
          ? orderMap.get(subNoticeId)
          : index;

        subNotices.push({
          title,
          documentUrl,
          noticeId: notice._id,
          order
        });

        index++;
      }

      // Create all sub notices
      if (subNotices.length > 0) {
        await SubNotice.create(subNotices);
      }
    }

    return NextResponse.json({ success: true, data: notice });
  } catch (error: any) {
    console.error('Error updating notice:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update notice' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: RouteParams
) {
  try {
    const { id } = await Promise.resolve(context.params);

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Notice ID is required' },
        { status: 400 }
      );
    }

    await dbConnect();

    const notice = await Notice.findByIdAndDelete(id);
    if (!notice) {
      return NextResponse.json(
        { success: false, error: 'Notice not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: notice });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An error occurred';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
