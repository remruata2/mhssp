import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import ConsultancyProcurement from '@/models/procurement/ConsultancyProcurement';

export async function GET() {
  try {
    await dbConnect();
    const consultancies = await ConsultancyProcurement.find({})
      .populate('contractor')
      .sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: consultancies });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch consultancies' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await dbConnect();

    const consultancy = await ConsultancyProcurement.create(body);
    const populatedConsultancy = await consultancy.populate('contractor');
    return NextResponse.json({ success: true, data: populatedConsultancy }, { status: 201 });
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: 'Reference number already exists' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create consultancy' },
      { status: 500 }
    );
  }
}
