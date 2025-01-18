import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import GoodsProcurement from '@/models/procurement/GoodsProcurement';

interface Params {
  params: {
    id: string;
  };
}

export async function GET(request: Request, { params }: Params) {
  try {
    await dbConnect();
    const goods = await GoodsProcurement.findById(params.id)
      .populate('goodsCategory')
      .populate('contractor');
    
    if (!goods) {
      return NextResponse.json(
        { success: false, error: 'Goods procurement not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: goods });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch goods procurement' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, { params }: Params) {
  try {
    const body = await request.json();
    await dbConnect();
    
    const goods = await GoodsProcurement.findByIdAndUpdate(
      params.id,
      body,
      { new: true, runValidators: true }
    )
      .populate('goodsCategory')
      .populate('contractor');
    
    if (!goods) {
      return NextResponse.json(
        { success: false, error: 'Goods procurement not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: goods });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update goods procurement' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: Params) {
  try {
    await dbConnect();
    const goods = await GoodsProcurement.findByIdAndDelete(params.id);
    
    if (!goods) {
      return NextResponse.json(
        { success: false, error: 'Goods procurement not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete goods procurement' },
      { status: 500 }
    );
  }
}
