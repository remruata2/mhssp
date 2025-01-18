import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import CivilWork from '@/models/procurement/CivilWorksProcurement';

export async function GET() {
  try {
    await dbConnect();
    const civilWorks = await CivilWork.find({})
      .populate('contractor')
      .sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: civilWorks });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch civil works' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await dbConnect();

    const civilWork = await CivilWork.create(body);
    const populatedCivilWork = await civilWork.populate('contractor');
    return NextResponse.json({ success: true, data: populatedCivilWork }, { status: 201 });
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: 'Lot number or contract number already exists' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create civil work' },
      { status: 500 }
    );
  }
}
