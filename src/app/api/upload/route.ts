import { NextRequest, NextResponse } from 'next/server';
import { optimizeAndSaveImage } from '@/lib/imageOptimization';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided', code: 'NO_FILE' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error: 'Invalid file format. Only JPEG, PNG, and WebP are supported.',
          code: 'INVALID_FILE_FORMAT',
        },
        { status: 400 }
      );
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size exceeds 10MB limit.', code: 'FILE_TOO_LARGE' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Generate unique filename
    const filename = `${Date.now()}-${crypto.randomUUID()}`;

    // Optimize and save image
    const result = await optimizeAndSaveImage(buffer, filename);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Failed to upload image:', error);
    return NextResponse.json(
      { error: 'Failed to upload image', code: 'INTERNAL_SERVER_ERROR' },
      { status: 500 }
    );
  }
}
