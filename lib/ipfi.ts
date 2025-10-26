// IP Finance (IPFi) functionality
import { BlockchainRegistration } from './story';

export interface IPAsset {
  id: string;
  totalShares: number;
  availableShares: number;
  pricePerShare: number;
  stakingEnabled: boolean;
  stakingAPR: number;
  royaltyRate: number;
  licensingFees: {
    commercial: number;
    personal: number;
    editorial: number;
  };
  revenue: {
    total: number;
    licensing: number;
    staking: number;
    royalties: number;
  };
}

export interface StakingPosition {
  assetId: string;
  shares: number;
  stakedAt: string;
  lockPeriod: number; // in days
  rewards: number;
}

export interface LicenseTransaction {
  id: string;
  assetId: string;
  licenseeAddress: string;
  licenseType: 'commercial' | 'personal' | 'editorial';
  fee: number;
  duration: number; // in days
  issuedAt: string;
  expiresAt: string;
}

// Mock implementation - replace with actual blockchain calls
export async function fractionalizeIP(
  ipAssetId: string, 
  totalShares: number, 
  pricePerShare: number
): Promise<IPAsset> {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    id: ipAssetId,
    totalShares,
    availableShares: totalShares,
    pricePerShare,
    stakingEnabled: true,
    stakingAPR: 12.5, // 12.5% APR
    royaltyRate: 2.5, // 2.5% royalty
    licensingFees: {
      commercial: 100, // $100
      personal: 25,   // $25
      editorial: 50,  // $50
    },
    revenue: {
      total: 0,
      licensing: 0,
      staking: 0,
      royalties: 0,
    },
  };
}

export async function stakeShares(
  assetId: string,
  shares: number,
  lockPeriod: number
): Promise<StakingPosition> {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    assetId,
    shares,
    stakedAt: new Date().toISOString(),
    lockPeriod,
    rewards: 0,
  };
}

export async function issueLicense(
  assetId: string,
  licenseeAddress: string,
  licenseType: 'commercial' | 'personal' | 'editorial',
  duration: number
): Promise<LicenseTransaction> {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const issuedAt = new Date();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + duration);
  
  return {
    id: `lic_${Date.now()}`,
    assetId,
    licenseeAddress,
    licenseType,
    fee: licenseType === 'commercial' ? 100 : licenseType === 'editorial' ? 50 : 25,
    duration,
    issuedAt: issuedAt.toISOString(),
    expiresAt: expiresAt.toISOString(),
  };
}