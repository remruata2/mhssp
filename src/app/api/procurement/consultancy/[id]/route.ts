import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import ConsultancyProcurement from '@/models/procurement/ConsultancyProcurement';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, context: RouteParams) {
  try {
    const { id } = context.params;
    await dbConnect();
    const consultancy = await ConsultancyProcurement.findById(id).populate('contractor');
    
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

export async function PUT(request: NextRequest, context: RouteParams) {
  try {
    const body = await request.json();
    await dbConnect();

    const consultancy = await ConsultancyProcurement.findByIdAndUpdate(
      context.params.id,
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

export async function DELETE(request: NextRequest, context: RouteParams) {
  try {
    const { id } = context.params;
    await dbConnect();
    const consultancy = await ConsultancyProcurement.findByIdAndDelete(id);

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
