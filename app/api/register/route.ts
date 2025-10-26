import { NextRequest, NextResponse } from 'next/server';
import { db, RegisteredIP } from '@/lib/db';
import { registerIPAsset, IPMetadata } from '@/lib/story';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || '';

    let imageFile: File | null = null;
    let payload: any = {};

    if (contentType.includes('multipart/form-data')) {
      const form = await request.formData();
      imageFile = form.get('file') as File | null;
      payload = {
        imageName: form.get('imageName')?.toString(),
        creatorName: form.get('creatorName')?.toString(),
        licenseType: form.get('licenseType')?.toString(),
        description: form.get('description')?.toString(),
        tags: form.getAll('tags')?.map((t) => t.toString()) || [],
      };
    } else {
      payload = await request.json();
    }

    const { imageName, creatorName, licenseType, description, tags } = payload;

    // Basic validation
    if (!imageName && !imageFile) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // If a file was uploaded, compute SHA-256 and save to public/uploads
    let imageHash = payload.imageHash || '';
    let fileSize = payload.fileSize || 0;
    let imageUrl = payload.imageUrl || '';
    const dimensions = payload.dimensions || { width: 0, height: 0 };

    if (imageFile) {
      const arrayBuffer = await imageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const hash = crypto.createHash('sha256').update(buffer).digest('hex');
      imageHash = hash;
      fileSize = buffer.length;

      // Save the file to a persistent uploads directory inside the project
      const uploadsDir = process.env.NODE_ENV === 'production'
        ? path.join(process.cwd(), 'public', 'uploads')
        : path.join(process.cwd(), 'storyguard-data', 'uploads');
      await fs.mkdir(uploadsDir, { recursive: true });
      const fileName = `${Date.now()}_${imageFile.name.replace(/[^a-zA-Z0-9_.-]/g, '_')}`;
      const filePath = path.join(uploadsDir, fileName);
      await fs.writeFile(filePath, buffer);
      
      // In development, serve files via the API route that reads from
      // `storyguard-data/uploads`. In production we use the public uploads
      imageUrl = process.env.NODE_ENV === 'production'
        ? `/uploads/${fileName}`
        : `/api/uploads/${fileName}`;
    }

    // Prepare metadata for Story Protocol
    const ipMetadata: IPMetadata = {
      name: imageName || (imageFile ? imageFile.name : 'Uploaded Image'),
      description: description || `Image by ${creatorName || 'Unknown'}`,
      ipType: 'image',
      creatorName: creatorName || 'Unknown',
      tags: tags || [],
      attributes: {
        fileHash: imageHash,
        fileSize: fileSize || 0,
        mimeType: (imageFile as any)?.type || 'image/*',
      },
    };

    // Register on Story Protocol blockchain (mock)
    const blockchainResult = await registerIPAsset(ipMetadata);

    // Create new IP registration
    const newIP: RegisteredIP = {
      id: blockchainResult.ipAssetId, // Use blockchain ID
      imageUrl: imageUrl || blockchainResult.ipfsUrl,
      imageName: imageName || (imageFile ? imageFile.name : 'uploaded'),
      imageHash,
      creatorName: creatorName || 'Unknown',
      licenseType: licenseType || 'Unknown',
      description,
      tags: tags || [],
      uploadedAt: new Date().toISOString(),
      fileSize: fileSize || 0,
      dimensions,
    };

    // Save to database
    const savedIP = db.addIP(newIP);

    return NextResponse.json({
      success: true,
      data: {
        ...savedIP,
        blockchain: {
          txHash: blockchainResult.txHash,
          blockNumber: blockchainResult.blockNumber,
          ipAssetId: blockchainResult.ipAssetId,
          ipfsUrl: blockchainResult.ipfsUrl,
        },
      },
      message: 'IP registered successfully on Story Protocol',
    });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Failed to register IP on blockchain' },
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