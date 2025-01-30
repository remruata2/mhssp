import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Notice } from '@/models/Notice';

export async function GET() {
  try {
    await dbConnect();
    
    // Get all notices (both published and unpublished) and sort by date
    const notices = await Notice.find({})
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
