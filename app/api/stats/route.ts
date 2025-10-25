import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const stats = db.getStats();

    // Calculate revenue recovered (mock calculation)
    const revenuePerViolation = 50;
    const revenueRecovered = stats.resolvedViolations * revenuePerViolation;

    return NextResponse.json({
      success: true,
      data: {
        protectedImages: stats.totalIPs,
        activeViolations: stats.pendingViolations,
        scansThisWeek: stats.scansThisWeek,
        revenueRecovered,
        totalViolations: stats.totalViolations,
        resolvedViolations: stats.resolvedViolations,
        totalScans: stats.totalScans,
      },
    });
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}