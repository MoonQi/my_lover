import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { milestoneSchema } from '@/lib/validation';
import { ZodError } from 'zod';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    const [milestones, total] = await Promise.all([
      prisma.milestone.findMany({
        orderBy: { date: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.milestone.count(),
    ]);

    return NextResponse.json({
      milestones,
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error('Failed to fetch milestones:', error);
    return NextResponse.json(
      { error: 'Failed to fetch milestones', code: 'INTERNAL_SERVER_ERROR' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = milestoneSchema.parse(body);

    const milestone = await prisma.milestone.create({
      data: validatedData,
    });

    return NextResponse.json(milestone, { status: 201 });
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

    console.error('Failed to create milestone:', error);
    return NextResponse.json(
      { error: 'Failed to create milestone', code: 'INTERNAL_SERVER_ERROR' },
      { status: 500 }
    );
  }
}
