// Simplified Story Protocol integration
// In production, you would use the full SDK with proper wallet connection

export interface IPMetadata {
  name: string;
  description: string;
  ipType: 'image' | 'video' | 'audio' | 'text';
  creatorName: string;
  tags: string[];
  attributes: {
    fileHash: string;
    fileSize: number;
    mimeType: string;
  };
}

export interface BlockchainRegistration {
  success: boolean;
  ipAssetId: string;
  txHash: string;
  blockNumber: number;
  timestamp: string;
  ipfsUrl: string;
  network: string;
}

// Mock blockchain registration (replace with real Story Protocol calls in production)
export async function registerIPAsset(metadata: IPMetadata): Promise<BlockchainRegistration> {
  try {
    console.log('📝 Registering IP on Story Protocol...', metadata);

    // Simulate blockchain transaction
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate mock blockchain response
    const mockResponse: BlockchainRegistration = {
      success: true,
      ipAssetId: `sp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      txHash: `0x${Array.from({length: 64}, () => 
        Math.floor(Math.random() * 16).toString(16)).join('')}`,
      blockNumber: Math.floor(Math.random() * 1000000) + 5000000,
      timestamp: new Date().toISOString(),
      ipfsUrl: `ipfs://Qm${Math.random().toString(36).substr(2, 44)}`,
      network: 'Story Protocol Odyssey Testnet',
    };

    console.log('✅ IP Asset registered on blockchain:', mockResponse);

    return mockResponse;

  } catch (error) {
    console.error('❌ Failed to register IP on Story Protocol:', error);
    throw new Error('Blockchain registration failed');
  }
}

// Wallet connection utilities
export function isWalletConnected(): boolean {
  if (typeof window === 'undefined') return false;
  return typeof (window as any).ethereum !== 'undefined';
}

export async function connectWallet(): Promise<string | null> {
  if (!isWalletConnected()) {
    throw new Error('No wallet detected. Please install MetaMask or another Web3 wallet.');
  }

  try {
    const ethereum = (window as any).ethereum;
    
    // Request account access
    const accounts = await ethereum.request({ 
      method: 'eth_requestAccounts' 
    });

    if (accounts.length === 0) {
      throw new Error('No accounts found');
    }

    console.log('✅ Wallet connected:', accounts[0]);
    return accounts[0];

  } catch (error: any) {
    console.error('❌ Failed to connect wallet:', error);
    
    if (error.code === 4001) {
      throw new Error('User rejected wallet connection');
    }
    
    throw new Error('Failed to connect wallet');
  }
}

export async function getWalletAddress(): Promise<string | null> {
  if (!isWalletConnected()) {
    return null;
  }

  try {
    const ethereum = (window as any).ethereum;
    const accounts = await ethereum.request({ 
      method: 'eth_accounts' 
    });
    
    return accounts.length > 0 ? accounts[0] : null;

  } catch (error) {
    console.error('Failed to get wallet address:', error);
    return null;
  }
}

export async function switchToStoryNetwork(): Promise<boolean> {
  if (!isWalletConnected()) {
    return false;
  }

  try {
    const ethereum = (window as any).ethereum;
    
    // Story Protocol Odyssey Testnet parameters
    await ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [{
        chainId: '0x1E19', // 7705 in hex (Story Odyssey testnet)
        chainName: 'Story Protocol Odyssey Testnet',
        nativeCurrency: {
          name: 'IP Token',
          symbol: 'IP',
          decimals: 18,
        },
        rpcUrls: ['https://rpc.odyssey.storyrpc.io'],
        blockExplorerUrls: ['https://odyssey.storyscan.xyz/'],
      }],
    });

    console.log('✅ Switched to Story Protocol network');
    return true;

  } catch (error) {
    console.error('❌ Failed to switch network:', error);
    return false;
  }
}

// Upload to IPFS (mock implementation)
export async function uploadToIPFS(file: File): Promise<string> {
  console.log('📤 Uploading to IPFS (mock):', file.name);
  // Simulate upload delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  // Generate mock IPFS hash
  const mockHash = `Qm${Math.random().toString(36).substr(2, 44)}`;
  const ipfsUrl = `ipfs://${mockHash}`;
  console.log('✅ Uploaded (mock) to IPFS:', ipfsUrl);
  return ipfsUrl;
}

// Check if transaction is confirmed
export async function waitForTransaction(txHash: string): Promise<boolean> {
  console.log('⏳ Waiting for transaction confirmation:', txHash);
  
  // Simulate confirmation delay
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  console.log('✅ Transaction confirmed:', txHash);
  return true;
}
