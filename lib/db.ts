// Simple in-memory database (replace with real DB later)
// In production, use PostgreSQL, MongoDB, or Supabase

export interface RegisteredIP {
  id: string;
  imageUrl: string;
  imageName: string;
  imageHash: string;
  creatorName: string;
  licenseType: string;
  description?: string;
  tags: string[];
  uploadedAt: string;
  fileSize: number;
  dimensions: { width: number; height: number };
}

export interface Violation {
  id: string;
  registeredIpId: string;
  foundUrl: string;
  foundImageUrl: string;
  platform: string;
  similarity: number;
  detectedAt: string;
  status: 'pending' | 'resolved' | 'disputed';
  notes?: string;
}

export interface ScanHistory {
  id: string;
  url: string;
  scannedAt: string;
  imagesFound: number;
  violationsDetected: number;
  status: 'completed' | 'scanning' | 'failed';
}

// Database class
class Database {
  private registeredIPs: Map<string, RegisteredIP> = new Map();
  private violations: Map<string, Violation> = new Map();
  private scanHistory: Map<string, ScanHistory> = new Map();

  // Registered IP Methods
  addIP(ip: RegisteredIP): RegisteredIP {
    this.registeredIPs.set(ip.id, ip);
    return ip;
  }

  getIP(id: string): RegisteredIP | undefined {
    return this.registeredIPs.get(id);
  }

  getAllIPs(): RegisteredIP[] {
    return Array.from(this.registeredIPs.values());
  }

  deleteIP(id: string): boolean {
    return this.registeredIPs.delete(id);
  }

  // Violation Methods
  addViolation(violation: Violation): Violation {
    this.violations.set(violation.id, violation);
    return violation;
  }

  getViolation(id: string): Violation | undefined {
    return this.violations.get(id);
  }

  getAllViolations(): Violation[] {
    return Array.from(this.violations.values());
  }

  getViolationsByStatus(status: string): Violation[] {
    return this.getAllViolations().filter(v => v.status === status);
  }

  updateViolationStatus(id: string, status: Violation['status']): boolean {
    const violation = this.violations.get(id);
    if (violation) {
      violation.status = status;
      return true;
    }
    return false;
  }

  // Scan History Methods
  addScan(scan: ScanHistory): ScanHistory {
    this.scanHistory.set(scan.id, scan);
    return scan;
  }

  getAllScans(): ScanHistory[] {
    return Array.from(this.scanHistory.values())
      .sort((a, b) => new Date(b.scannedAt).getTime() - new Date(a.scannedAt).getTime());
  }

  // Stats Methods
  getStats() {
    const allIPs = this.getAllIPs();
    const allViolations = this.getAllViolations();
    const allScans = this.getAllScans();

    return {
      totalIPs: allIPs.length,
      totalViolations: allViolations.length,
      pendingViolations: this.getViolationsByStatus('pending').length,
      resolvedViolations: this.getViolationsByStatus('resolved').length,
      totalScans: allScans.length,
      scansThisWeek: allScans.filter(s => {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return new Date(s.scannedAt) > weekAgo;
      }).length,
    };
  }
}

// Create singleton instance
const database = new Database();

// Seed with mock data
database.addIP({
  id: '1',
  imageUrl: '/images/sample1.jpg',
  imageName: 'sunset-beach.jpg',
  imageHash: 'abc123def456',
  creatorName: 'John Doe Photography',
  licenseType: 'All Rights Reserved',
  description: 'Beautiful sunset at the beach',
  tags: ['sunset', 'beach', 'nature'],
  uploadedAt: new Date().toISOString(),
  fileSize: 2048000,
  dimensions: { width: 1920, height: 1080 },
});

database.addIP({
  id: '2',
  imageUrl: '/images/sample2.jpg',
  imageName: 'mountain-view.jpg',
  imageHash: 'def456ghi789',
  creatorName: 'John Doe Photography',
  licenseType: 'Creative Commons BY',
  description: 'Mountain landscape',
  tags: ['mountain', 'landscape', 'nature'],
  uploadedAt: new Date().toISOString(),
  fileSize: 3072000,
  dimensions: { width: 2560, height: 1440 },
});

database.addViolation({
  id: '1',
  registeredIpId: '1',
  foundUrl: 'https://instagram.com/p/example1',
  foundImageUrl: 'https://example.com/stolen1.jpg',
  platform: 'Instagram',
  similarity: 98,
  detectedAt: new Date().toISOString(),
  status: 'pending',
});

database.addViolation({
  id: '2',
  registeredIpId: '2',
  foundUrl: 'https://twitter.com/example2',
  foundImageUrl: 'https://example.com/stolen2.jpg',
  platform: 'Twitter',
  similarity: 94,
  detectedAt: new Date().toISOString(),
  status: 'disputed',
});

database.addScan({
  id: '1',
  url: 'https://instagram.com/photographer',
  scannedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  imagesFound: 45,
  violationsDetected: 2,
  status: 'completed',
});

database.addScan({
  id: '2',
  url: 'https://pinterest.com/board/nature',
  scannedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  imagesFound: 120,
  violationsDetected: 0,
  status: 'completed',
});

// Export the database instance
export const db = database;