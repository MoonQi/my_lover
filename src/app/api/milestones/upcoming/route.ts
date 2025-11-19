import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { daysUntil } from '@/lib/dateUtils';

export async function GET() {
  try {
    // Fetch all milestones
    const milestones = await prisma.milestone.findMany({
      orderBy: { date: 'asc' },
    });

    // Calculate upcoming anniversaries (within next 30 days)
    const today = new Date();
    const upcomingAnniversaries = milestones
      .map((milestone) => {
        const milestoneDate = new Date(milestone.date);
        const currentYear = today.getFullYear();

        // Get this year's anniversary
        const thisYearAnniversary = new Date(
          currentYear,
          milestoneDate.getMonth(),
          milestoneDate.getDate()
        );

        // If this year's anniversary has passed, calculate next year's
        const nextAnniversary = thisYearAnniversary < today
          ? new Date(
              currentYear + 1,
              milestoneDate.getMonth(),
              milestoneDate.getDate()
            )
          : thisYearAnniversary;

        const days = daysUntil(nextAnniversary);

        // Calculate years since original milestone
        const yearsSince = currentYear - milestoneDate.getFullYear();

        return {
          ...milestone,
          nextAnniversary: nextAnniversary.toISOString(),
          daysUntil: days,
          yearsSince,
        };
      })
      .filter((item) => item.daysUntil >= 0 && item.daysUntil <= 30)
      .sort((a, b) => a.daysUntil - b.daysUntil); // Sort by soonest first

    return NextResponse.json({
      upcoming: upcomingAnniversaries,
      total: upcomingAnniversaries.length,
    });
  } catch (error) {
    console.error('Failed to fetch upcoming anniversaries:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch upcoming anniversaries',
        code: 'INTERNAL_SERVER_ERROR',
      },
      { status: 500 }
    );
  }
}
