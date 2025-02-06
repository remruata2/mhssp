import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import News from '@/models/News';
import fs from 'fs/promises';
import path from 'path';

const uploadDir = path.join(process.cwd(), 'public/uploads');

// Ensure upload directory exists
(async () => {
  try {
    await fs.mkdir(uploadDir, { recursive: true });
  } catch (error) {
    console.error('Error creating upload directory:', error);
  }
})();

export async function POST(request: Request) {
  await dbConnect();

  try {
    const formData = await request.formData();
    
    // Debug: Log form data
    console.log('Form data received:', {
      title: formData.get('title'),
      content: formData.get('content'),
      file: formData.get('file')
    });
    
    // Get form values
    const title = formData.get('title')?.toString();
    const content = formData.get('content')?.toString();
    const file = formData.get('file') as File | null;

    // Validate required fields
    if (!title || !content) {
      console.error('Missing required fields:', { title, content, file });
      return NextResponse.json(
        { success: false, error: 'Title and content are required' },
        { status: 400 }
      );
    }

    let imageUrl = null;

    if (file) {
      try {
        // Process file upload
        const buffer = await file.arrayBuffer();
        const filename = `${Date.now()}-${file.name}`;
        const filePath = path.join(uploadDir, filename);
        
        // Debug: Log file info
        console.log('File info:', {
          filename,
          filePath,
          fileSize: buffer.byteLength
        });
        
        await fs.writeFile(filePath, Buffer.from(buffer));
        imageUrl = `/uploads/${filename}`;

      } catch (error) {
        console.error('File upload error:', error);
        return NextResponse.json(
          { success: false, error: 'File upload failed' },
          { status: 500 }
        );
      }
    }

    // Debug: Log data being saved
    console.log('Creating news item with:', {
      title,
      content,
      imageUrl
    });

    // Create news item
    const newsData = {
      title,
      content,
      ...(imageUrl ? { imageUrl } : {}),
      isPublished: false,
      publishDate: new Date(),
    };

    console.log('News data before creation:', newsData);

    // Create database entry
    const newsItem = await News.create(newsData);

    console.log('Created news item:', newsItem.toObject());

    return NextResponse.json({
      success: true,
      data: newsItem
    });

  } catch (error: any) {
    console.error('Upload error:', error);
    // Log detailed error information
    if (error.errors) {
      console.error('Validation errors:', error.errors);
    }
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Server error',
        details: error.errors || {}
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await dbConnect();
    const news = await News.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: news });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
}
