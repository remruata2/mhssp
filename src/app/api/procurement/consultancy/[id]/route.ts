import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import ConsultancyProcurement from '@/models/procurement/ConsultancyProcurement';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const consultancy = await ConsultancyProcurement.findById(params.id).populate('contractor');
    
    if (!consultancy) {
      return NextResponse.json(
        { success: false, error: 'Consultancy not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: consultancy });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch consultancy' },
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

    const consultancy = await ConsultancyProcurement.findByIdAndUpdate(
      params.id,
      { $set: body },
      { new: true, runValidators: true }
    ).populate('contractor');

    if (!consultancy) {
      return NextResponse.json(
        { success: false, error: 'Consultancy not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: consultancy });
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: 'Reference number already exists' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update consultancy' },
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
    const consultancy = await ConsultancyProcurement.findByIdAndDelete(params.id);

    if (!consultancy) {
      return NextResponse.json(
        { success: false, error: 'Consultancy not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete consultancy' },
      { status: 500 }
    );
  }
}
