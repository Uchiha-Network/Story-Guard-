import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // Helper function: Compare hashes
    function hashSimilarity(hash1: string, hash2: string): number {
      if (hash1.length !== hash2.length) return 0;
      let matches = 0;
      for (let i = 0; i < hash1.length; i++) {
        if (hash1[i] === hash2[i]) matches++;
      }
      return Math.round((matches / hash1.length) * 100);
    }

    // Helper function: Get platform name
    function getPlatform(urlString: string): string {
      if (urlString.includes('instagram.com')) return 'Instagram';
      if (urlString.includes('twitter.com')) return 'Twitter';
      if (urlString.includes('pinterest.com')) return 'Pinterest';
      if (urlString.includes('facebook.com')) return 'Facebook';
      return 'Website';
    }

    const scanId = `scan_${Date.now()}`;

    // Simulate scanning delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock found images with hashes
    const foundImages = [
      { url: 'https://example.com/img1.jpg', hash: 'abc123def456' },
      { url: 'https://example.com/img2.jpg', hash: 'xyz789uvw012' },
    ];

    // Get registered IPs
    const registeredIPs = db.getAllIPs();
    const detectedViolations = [];

    // Compare each found image
    for (const foundImg of foundImages) {
      for (const registeredIP of registeredIPs) {
        const similarity = hashSimilarity(foundImg.hash, registeredIP.imageHash);
        
        if (similarity > 85) {
          const violation = {
            id: `vio_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            registeredIpId: registeredIP.id,
            foundUrl: url,
            foundImageUrl: foundImg.url,
            platform: getPlatform(url),
            similarity: similarity,
            detectedAt: new Date().toISOString(),
            status: 'pending' as const,
          };
          
          db.addViolation(violation);
          detectedViolations.push(violation);
        }
      }
    }

    // Create scan record AFTER all calculations
    const scanRecord = {
      id: scanId,
      url: url,
      scannedAt: new Date().toISOString(),
      imagesFound: foundImages.length,
      violationsDetected: detectedViolations.length,
      status: 'completed' as const,
    };
    
    db.addScan(scanRecord);

    return NextResponse.json({
      success: true,
      data: {
        scanId: scanId,
        url: url,
        imagesFound: foundImages.length,
        violationsDetected: detectedViolations.length,
        violations: detectedViolations,
      },
    });

  } catch (error) {
    console.error('Scan error:', error);
    return NextResponse.json(
      { error: 'Failed to scan URL' },
      { status: 500 }
    );
  }
}