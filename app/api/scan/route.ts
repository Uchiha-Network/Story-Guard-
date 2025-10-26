import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

interface FoundImage {
  url: string;
  hash: string;
}

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
      // For testing, return 100 if the URL contains the registered image URL
      // This is temporary until we implement proper image hash comparison
      if (url.includes(hash2)) {
        return 100;
      }
      return 0;
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

    // Get registered IPs first
  const registeredIPs = db.getAllIPs();
  const detectedViolations: Array<any> = [];

    // If no registered images, return early with no violations
    if (registeredIPs.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          scanId: scanId,
          url: url,
          imagesFound: 0,
          violationsDetected: 0,
          violations: [],
        },
      });
    }

    // For now we don't scrape the page. We'll try two pragmatic checks:
    // 1) If the scanned URL directly references a registered IP's upload filename
    // 2) If the scanned URL contains the registered imageUrl substring
    // This makes dev scanning reliable for pages that include the uploaded file path.

    const foundImages: FoundImage[] = [{ url, hash: url }];

    // Only check for violations if we have registered images
    if (registeredIPs.length > 0) {
      for (const registeredIP of registeredIPs) {
        const regUrl = (registeredIP.imageUrl || '').toString();
        // derive a filename to match against scanned URL
        const regFilename = regUrl.split('/').pop() || '';

        // Skip if there's no useful identifier
        if (!regFilename && !regUrl) continue;

        // match by filename or by substring of imageUrl
        const isMatchByFilename = regFilename && url.includes(regFilename);
        const isMatchByUrlSubstring = regUrl && url.includes(regUrl);

        if (isMatchByFilename || isMatchByUrlSubstring) {
          // Avoid adding duplicate violations for the same registered IP + scan
          const alreadyExists = detectedViolations.some(v => v.registeredIpId === registeredIP.id && v.foundUrl === url);
          if (alreadyExists) continue;

          const violation = {
            id: `vio_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            registeredIpId: registeredIP.id,
            foundUrl: url,
            foundImageUrl: regUrl || url,
            platform: getPlatform(url),
            similarity: 100,
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