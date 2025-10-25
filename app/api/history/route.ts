import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const history = db.getAllScans();

    return NextResponse.json({
      success: true,
      data: history,
      total: history.length,
    });
  } catch (error) {
    console.error('Fetch scan history error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch scan history' },
      { status: 500 }
    );
  }
}