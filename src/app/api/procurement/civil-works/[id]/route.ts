import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import CivilWork from '@/models/procurement/CivilWorksProcurement';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const civilWork = await CivilWork.findById(params.id).populate('contractor');
    
    if (!civilWork) {
      return NextResponse.json(
        { success: false, error: 'Civil work not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: civilWork });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch civil work' },
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

    const civilWork = await CivilWork.findByIdAndUpdate(
      params.id,
      { $set: body },
      { new: true, runValidators: true }
    ).populate('contractor');

    if (!civilWork) {
      return NextResponse.json(
        { success: false, error: 'Civil work not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: civilWork });
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: 'Lot number or contract number already exists' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update civil work' },
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
    const civilWork = await CivilWork.findByIdAndDelete(params.id);

    if (!civilWork) {
      return NextResponse.json(
        { success: false, error: 'Civil work not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete civil work' },
      { status: 500 }
    );
  }
}
