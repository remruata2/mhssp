import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import GoodsProcurement from '@/models/procurement/GoodsProcurement';
import '@/models/procurement/GoodsCategory';
import '@/models/procurement/Contractor';

export async function GET() {
  try {
    await dbConnect();
    const goods = await GoodsProcurement.find()
      .populate('goodsCategory', 'name')
      .populate('contractor', 'name')
      .sort({ createdAt: -1 })
      .select('referenceNo goodsName quantity contractSignedDate contractor goodsCategory createdAt')
      .lean();

    return NextResponse.json({ success: true, data: goods });
  } catch (error) {
    console.error('Error fetching goods:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch goods' 
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const data = await req.json();
    
    const goods = await GoodsProcurement.create(data);
    const populatedGoods = await GoodsProcurement.findById(goods._id)
      .populate('goodsCategory', 'name')
      .populate('contractor', 'name')
      .lean();

    return NextResponse.json({ success: true, data: populatedGoods }, { status: 201 });
  } catch (error) {
    console.error('Error creating goods:', error);
    
    // Handle duplicate reference number
    if (error instanceof Error && error.name === 'MongoError' && (error as any).code === 11000) {
      return NextResponse.json(
        { success: false, error: 'Reference number already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to create goods' 
      },
      { status: 400 }
    );
  }
}
