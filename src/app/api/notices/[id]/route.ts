import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Notice } from '@/models/Notice';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(
  request: Request,
  context: RouteParams
) {
  try {
    const { id } = await Promise.resolve(context.params);

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Notice ID is required' },
        { status: 400 }
      );
    }

    await dbConnect();

    const notice = await Notice.findById(id);
    if (!notice) {
      return NextResponse.json(
        { success: false, error: 'Notice not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: notice });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An error occurred';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  context: RouteParams
) {
  try {
    const { id } = await Promise.resolve(context.params);

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Notice ID is required' },
        { status: 400 }
      );
    }

    await dbConnect();

    const formData = await request.formData();
    const title = formData.get('title') as string;
    const type = formData.get('type') as 'document' | 'url' | 'subNotices';
    const isPublished = formData.get('isPublished') === 'true';
    const publishDate = formData.get('publishDate') as string;

    const updateData: any = {
      title,
      type,
      isPublished,
      publishDate: new Date(publishDate),
    };

    if (type === 'document') {
      const documentFile = formData.get('document') as File | null;
      if (documentFile) {
        // Handle document file upload here
        updateData.documentUrl = ''; // Update with actual URL
      }
    } else if (type === 'url') {
      const url = formData.get('url') as string;
      if (url) {
        updateData.url = url;
      }
    }

    const notice = await Notice.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!notice) {
      return NextResponse.json(
        { success: false, error: 'Notice not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: notice });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An error occurred';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: RouteParams
) {
  try {
    const { id } = await Promise.resolve(context.params);

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Notice ID is required' },
        { status: 400 }
      );
    }

    await dbConnect();

    const notice = await Notice.findByIdAndDelete(id);
    if (!notice) {
      return NextResponse.json(
        { success: false, error: 'Notice not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: notice });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An error occurred';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
