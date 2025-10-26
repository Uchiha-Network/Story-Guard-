import { NextRequest, NextResponse } from 'next/server';
import { issueLicense } from '@/lib/ipfi';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { assetId, licenseeAddress, licenseType, duration } = body;

    if (!assetId || !licenseeAddress || !licenseType || !duration) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await issueLicense(assetId, licenseeAddress, licenseType, duration);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('License issuance error:', error);
    return NextResponse.json(
      { error: 'Failed to issue license' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Mock data for now
    const licenses = [
      {
        id: 'lic_1',
        assetId: '1',
        licenseeAddress: '0x1234...',
        licenseType: 'commercial',
        fee: 100,
        duration: 365,
        issuedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];

    return NextResponse.json({
      success: true,
      data: licenses,
    });
  } catch (error) {
    console.error('Fetch licenses error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch licenses' },
      { status: 500 }
    );
  }
}