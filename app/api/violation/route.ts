import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');

    let violations;
    if (status) {
      violations = db.getViolationsByStatus(status);
    } else {
      violations = db.getAllViolations();
    }

    return NextResponse.json({
      success: true,
      data: violations,
      total: violations.length,
    });
  } catch (error) {
    console.error('Fetch violations error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch violations' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { error: 'ID and status are required' },
        { status: 400 }
      );
    }

    const updated = db.updateViolationStatus(id, status);

    if (!updated) {
      return NextResponse.json(
        { error: 'Violation not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Violation status updated',
    });
  } catch (error) {
    console.error('Update violation error:', error);
    return NextResponse.json(
      { error: 'Failed to update violation' },
      { status: 500 }
    );
  }
}