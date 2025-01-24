import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { SubNotice } from '@/models/SubNotice';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string; subnoticeId: string } }
) {
  try {
    await dbConnect();
    
    const subNotice = await SubNotice.findOneAndDelete({
      _id: params.subnoticeId,
      noticeId: params.id,
    });

    if (!subNotice) {
      return NextResponse.json(
        { success: false, error: 'Sub notice not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: subNotice });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
