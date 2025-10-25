import { NextRequest, NextResponse } from 'next/server';
import { db, RegisteredIP } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { 
      imageName, 
      imageHash, 
      creatorName, 
      licenseType, 
      description, 
      tags,
      fileSize,
      dimensions,
    } = body;

    // Validate required fields
    if (!imageName || !imageHash || !creatorName || !licenseType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create new IP registration
    const newIP: RegisteredIP = {
      id: Date.now().toString(),
      imageUrl: `/uploads/${imageName}`, // In production, use cloud storage URL
      imageName,
      imageHash,
      creatorName,
      licenseType,
      description,
      tags: tags || [],
      uploadedAt: new Date().toISOString(),
      fileSize: fileSize || 0,
      dimensions: dimensions || { width: 0, height: 0 },
    };

    // Save to database
    const savedIP = db.addIP(newIP);

    return NextResponse.json({
      success: true,
      data: savedIP,
      message: 'IP registered successfully',
    });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Failed to register IP' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const allIPs = db.getAllIPs();
    
    return NextResponse.json({
      success: true,
      data: allIPs,
      total: allIPs.length,
    });
  } catch (error) {
    console.error('Fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch registered IPs' },
      { status: 500 }
    );
  }
}