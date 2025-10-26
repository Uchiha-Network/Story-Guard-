// File-backed JSON database for simple persistence
// This is a low-risk replacement for the in-memory DB used during development.
// It stores data in `data/db.json`. For production, replace with a real DB (Postgres, Supabase, etc.).

import fs from 'fs/promises';
import path from 'path';

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
  private dataPath: string;

  constructor() {
    // Store data in a project-local persistent directory so dev hot reloads
    // don't wipe registrations. Using workspace-local `storyguard-data`.
    const dataDir = process.env.NODE_ENV === 'production'
      ? path.join(process.cwd(), 'data')
      : path.join(process.cwd(), 'storyguard-data');
    this.dataPath = path.join(dataDir, 'db.json');
    // Load from disk if possible. Do not block constructor with await — use a sync startup loader instead.
    this.loadFromDisk().catch(err => {
      // If loading fails, keep using in-memory and create directory on demand
      console.warn('Could not load DB from disk, using in-memory fallback:', err?.message ?? err);
    });
  }

  private async loadFromDisk() {
    try {
      const raw = await fs.readFile(this.dataPath, 'utf-8');
      const parsed = JSON.parse(raw);

      if (parsed.registeredIPs) {
        for (const ip of parsed.registeredIPs) {
          this.registeredIPs.set(ip.id, ip);
        }
      }

      if (parsed.violations) {
        for (const v of parsed.violations) {
          this.violations.set(v.id, v);
        }
      }

      if (parsed.scanHistory) {
        for (const s of parsed.scanHistory) {
          this.scanHistory.set(s.id, s);
        }
      }
    } catch (err: any) {
      // If file doesn't exist, create directories and write an initial empty file
      if (err.code === 'ENOENT') {
        await fs.mkdir(path.dirname(this.dataPath), { recursive: true });
        await this.saveToDisk();
      } else {
        throw err;
      }
    }
  }

  private async saveToDisk() {
    const payload = {
      registeredIPs: Array.from(this.registeredIPs.values()),
      violations: Array.from(this.violations.values()),
      scanHistory: Array.from(this.scanHistory.values()),
    };

    await fs.mkdir(path.dirname(this.dataPath), { recursive: true });
    await fs.writeFile(this.dataPath, JSON.stringify(payload, null, 2), 'utf-8');
  }

  // Registered IP Methods
  addIP(ip: RegisteredIP): RegisteredIP {
    this.registeredIPs.set(ip.id, ip);
    // Persist asynchronously, don't block the request
    this.saveToDisk().catch(err => console.error('Failed to save DB:', err));
    return ip;
  }

  getIP(id: string): RegisteredIP | undefined {
    return this.registeredIPs.get(id);
  }

  getAllIPs(): RegisteredIP[] {
    return Array.from(this.registeredIPs.values());
  }

  deleteIP(id: string): boolean {
    const result = this.registeredIPs.delete(id);
    this.saveToDisk().catch(err => console.error('Failed to save DB:', err));
    return result;
  }

  // Violation Methods
  addViolation(violation: Violation): Violation {
    this.violations.set(violation.id, violation);
    this.saveToDisk().catch(err => console.error('Failed to save DB:', err));
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
      this.saveToDisk().catch(err => console.error('Failed to save DB:', err));
      return true;
    }
    return false;
  }

  // Scan History Methods
  addScan(scan: ScanHistory): ScanHistory {
    this.scanHistory.set(scan.id, scan);
    this.saveToDisk().catch(err => console.error('Failed to save DB:', err));
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

// Export the database instance
export const db = database;