import { NextRequest, NextResponse } from 'next/server';
import { fractionalizeIP } from '@/lib/ipfi';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ipAssetId, totalShares, pricePerShare } = body;

    if (!ipAssetId || !totalShares || !pricePerShare) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await fractionalizeIP(ipAssetId, totalShares, pricePerShare);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Fractionalization error:', error);
    return NextResponse.json(
      { error: 'Failed to fractionalize IP' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Mock data for now
    const assets = [
      {
        id: '1',
        totalShares: 1000,
        availableShares: 750,
        pricePerShare: 10,
        stakingEnabled: true,
        stakingAPR: 12.5,
        royaltyRate: 2.5,
        licensingFees: {
          commercial: 100,
          personal: 25,
          editorial: 50,
        },
        revenue: {
          total: 1250,
          licensing: 750,
          staking: 300,
          royalties: 200,
        },
      },
    ];

    return NextResponse.json({
      success: true,
      data: assets,
    });
  } catch (error) {
    console.error('Fetch assets error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch IP assets' },
      { status: 500 }
    );
  }
}