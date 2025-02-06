import { NextRequest, NextResponse } from 'next/server';
import { join } from 'path';
import { createReadStream, existsSync } from 'fs';
import { stat, writeFile, mkdir } from 'fs/promises';

// Handle file uploads and serving
interface RouteParams {
  params: {
    path: string[];
  };
}

export async function POST(request: NextRequest, context: RouteParams) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create a safe filename
    const originalName = file.name;
    const extension = originalName.substring(originalName.lastIndexOf('.'));
    const timestamp = Date.now();
    const safeName = `${timestamp}${extension}`;
    
    // Save to public/uploads directory
    const uploadDir = join(process.cwd(), 'public/uploads');
    
    // Ensure upload directory exists
    await mkdir(uploadDir, { recursive: true });
    
    const filePath = join(uploadDir, safeName);
    await writeFile(filePath, buffer);
    
    // Return the public URL
    return NextResponse.json({ 
      url: `/uploads/${safeName}`,
      success: true 
    });
    
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Error uploading file' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest, context: RouteParams) {
  try {
    const filePath = join(process.cwd(), 'public', 'uploads', ...context.params.path);

    // Check if file exists
    if (!existsSync(filePath)) {
      return new NextResponse('File not found', { status: 404 });
    }

    // Get file stats
    const stats = await stat(filePath);
    
    // Create read stream
    const stream = createReadStream(filePath);

    // Determine content type
    let contentType = 'application/octet-stream';
    if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg')) {
      contentType = 'image/jpeg';
    } else if (filePath.endsWith('.png')) {
      contentType = 'image/png';
    } else if (filePath.endsWith('.pdf')) {
      contentType = 'application/pdf';
    }

    // Return response with proper headers
    return new NextResponse(stream as any, {
      headers: {
        'Content-Type': contentType,
        'Content-Length': stats.size.toString(),
        'Cache-Control': 'public, max-age=31536000',
      },
    });
  } catch (error) {
    console.error('Error serving file:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
