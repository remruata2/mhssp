import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { SubNotice } from '@/models/SubNotice';

interface RouteParams {
  params: {
    id: string;
    subnoticeId: string;
  };
}

export async function DELETE(
  request: Request,
  context: RouteParams
) {
  try {
    await dbConnect();
    
    const { id, subnoticeId } = context.params;
    const subNotice = await SubNotice.findOneAndDelete({
      _id: subnoticeId,
      noticeId: id,
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
