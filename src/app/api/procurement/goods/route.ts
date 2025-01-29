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
    
    // Try to drop the unique index if it exists (in case it wasn't dropped by the model)
    try {
      await GoodsProcurement.collection.dropIndex('referenceNo_1');
    } catch {
      // Index might not exist, which is fine
    }
    
    const goods = await GoodsProcurement.create(data);
    const populatedGoods = await GoodsProcurement.findById(goods._id)
      .populate('goodsCategory', 'name')
      .populate('contractor', 'name')
      .lean();

    return NextResponse.json({ success: true, data: populatedGoods }, { status: 201 });
  } catch (error) {
    console.error('Error creating goods:', error);
    
    // Check if this is a duplicate key error
    if (error instanceof Error && error.message.includes('E11000 duplicate key error')) {
      // Try to drop the index again and retry the operation
      try {
        const retryData = await req.clone().json(); // Clone the request since it was already read
        await GoodsProcurement.collection.dropIndex('referenceNo_1');
        const goods = await GoodsProcurement.create(retryData);
        const populatedGoods = await GoodsProcurement.findById(goods._id)
          .populate('goodsCategory', 'name')
          .populate('contractor', 'name')
          .lean();
        return NextResponse.json({ success: true, data: populatedGoods }, { status: 201 });
      } catch (_retryError) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Failed to create goods procurement. Please try again.' 
          },
          { status: 500 }
        );
      }
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to create goods procurement'
      },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    await dbConnect();
    const data = await req.json();
    const { id, ...updateData } = data;

    const goods = await GoodsProcurement.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    )
      .populate('goodsCategory', 'name')
      .populate('contractor', 'name')
      .lean();

    if (!goods) {
      return NextResponse.json(
        { success: false, error: 'Goods procurement not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: goods });
  } catch (error) {
    console.error('Error updating goods:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to update goods procurement'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID is required' },
        { status: 400 }
      );
    }

    await dbConnect();
    const goods = await GoodsProcurement.findByIdAndDelete(id);

    if (!goods) {
      return NextResponse.json(
        { success: false, error: 'Goods procurement not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: null });
  } catch (error) {
    console.error('Error deleting goods:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to delete goods procurement'
      },
      { status: 500 }
    );
  }
}
