import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { milestoneUpdateSchema } from '@/lib/validation';
import { ZodError } from 'zod';
import { deleteImage } from '@/lib/imageOptimization';

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;

    const milestone = await prisma.milestone.findUnique({
      where: { id },
    });

    if (!milestone) {
      return NextResponse.json(
        { error: 'Milestone not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    return NextResponse.json(milestone);
  } catch (error) {
    console.error('Failed to fetch milestone:', error);
    return NextResponse.json(
      { error: 'Failed to fetch milestone', code: 'INTERNAL_SERVER_ERROR' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;

    const body = await request.json();
    const validatedData = milestoneUpdateSchema.parse(body);

    // Check if milestone exists
    const existingMilestone = await prisma.milestone.findUnique({
      where: { id },
    });

    if (!existingMilestone) {
      return NextResponse.json(
        { error: 'Milestone not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    // If image URL is being changed, delete old image
    if (
      validatedData.imageUrl !== undefined &&
      existingMilestone.imageUrl &&
      validatedData.imageUrl !== existingMilestone.imageUrl
    ) {
      await deleteImage(existingMilestone.imageUrl);
    }

    const milestone = await prisma.milestone.update({
      where: { id },
      data: validatedData,
    });

    return NextResponse.json(milestone);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details: error.errors.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    console.error('Failed to update milestone:', error);
    return NextResponse.json(
      { error: 'Failed to update milestone', code: 'INTERNAL_SERVER_ERROR' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;

    // Check if milestone exists
    const existingMilestone = await prisma.milestone.findUnique({
      where: { id },
    });

    if (!existingMilestone) {
      return NextResponse.json(
        { error: 'Milestone not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    // Delete associated image if exists
    if (existingMilestone.imageUrl) {
      await deleteImage(existingMilestone.imageUrl);
    }

    // Delete milestone
    await prisma.milestone.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Failed to delete milestone:', error);
    return NextResponse.json(
      { error: 'Failed to delete milestone', code: 'INTERNAL_SERVER_ERROR' },
      { status: 500 }
    );
  }
}
