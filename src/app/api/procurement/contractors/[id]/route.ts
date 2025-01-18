import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Contractor from '@/models/procurement/Contractor';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const contractor = await Contractor.findById(params.id);
    
    if (!contractor) {
      return NextResponse.json(
        { success: false, error: 'Contractor not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: contractor });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch contractor' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    await dbConnect();

    const contractor = await Contractor.findByIdAndUpdate(
      params.id,
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!contractor) {
      return NextResponse.json(
        { success: false, error: 'Contractor not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: contractor });
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: 'Registration number already exists' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update contractor' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const contractor = await Contractor.findByIdAndDelete(params.id);

    if (!contractor) {
      return NextResponse.json(
        { success: false, error: 'Contractor not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete contractor' },
      { status: 500 }
    );
  }
}
