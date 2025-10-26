import { NextRequest, NextResponse } from 'next/server';
import { stakeShares } from '@/lib/ipfi';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { assetId, shares, lockPeriod } = body;

    if (!assetId || !shares || !lockPeriod) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await stakeShares(assetId, shares, lockPeriod);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Staking error:', error);
    return NextResponse.json(
      { error: 'Failed to stake shares' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Mock data for now
    const stakingPositions = [
      {
        assetId: '1',
        shares: 250,
        stakedAt: new Date().toISOString(),
        lockPeriod: 90,
        rewards: 125,
      },
    ];

    return NextResponse.json({
      success: true,
      data: stakingPositions,
    });
  } catch (error) {
    console.error('Fetch staking positions error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch staking positions' },
      { status: 500 }
    );
  }
}