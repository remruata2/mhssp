import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Notice } from '@/models/Notice';
import { auth } from '@/lib/auth';

export async function GET() {
  try {
    // Authorization: only admins can view admin notices list
    const session = await auth();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    if (session.user?.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

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
