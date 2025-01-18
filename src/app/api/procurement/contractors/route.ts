import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Contractor from '@/models/procurement/Contractor';

export async function GET() {
  try {
    await dbConnect();
    const contractors = await Contractor.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: contractors });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch contractors' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await dbConnect();

    const contractor = await Contractor.create(body);
    return NextResponse.json({ success: true, data: contractor }, { status: 201 });
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: 'Registration number already exists' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create contractor' },
      { status: 500 }
    );
  }
}
