import { NextResponse, NextRequest } from 'next/server';
import dbConnect from '@/lib/db';
import { Page } from '@/models/Page';

interface RouteParams {
  params: {
    slug: string;
  };
}

export async function GET(
  request: NextRequest,
  context: RouteParams
) {
  try {
    await dbConnect();
    const { slug } = context.params;
    
    // Only fetch published pages for the frontend
    const page = await Page.findOne({ 
      slug,
      isPublished: true 
    });
    
    if (!page) {
      return NextResponse.json(
        { success: false, error: 'Page not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: page });
  } catch (error) {
    console.error('Error fetching page:', error);
    return NextResponse.json(
      { success: false, error: 'Error fetching page' },
      { status: 500 }
    );
  }
}
