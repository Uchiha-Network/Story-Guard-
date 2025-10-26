// Enhanced Story Protocol blockchain integration
import { 
  BrowserProvider, 
  JsonRpcProvider, 
  Signer, 
  Contract,
  ContractTransactionResponse,
  TransactionReceipt
} from 'ethers';
import { IPMetadata } from './story';
import { MediaType } from './media';

// Ethereum provider interface following EIP-1193
interface RequestArguments {
  method: string;
  params?: unknown[] | Record<string, unknown>;
}

interface EthereumProvider {
  request(args: RequestArguments): Promise<unknown>;
  isMetaMask?: boolean;
  on?(event: string, listener: (...args: any[]) => void): void;
  removeListener?(event: string, listener: (...args: any[]) => void): void;
  emit?(event: string, ...args: any[]): void;
}

// Extend window interface
declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

// Story Protocol configuration
export interface StoryProtocolConfig {
  network: 'testnet' | 'mainnet';
  chainId: number;
  rpcUrl: string;
  ipRegistry: string;
  licensingModule: string;
  stakingModule: string;
  ipfsGateway: string;
}

// Network configurations
export const STORY_NETWORKS: Record<string, StoryProtocolConfig> = {
  testnet: {
    network: 'testnet',
    chainId: 137, // Polygon mainnet
    rpcUrl: 'https://polygon-mainnet.g.alchemy.com/v2/dRVeWKDhk2nfV_271854j',
    ipRegistry: '0x5FbDB2315678afecb367f032d93F642f64180aa3', // Story Protocol IP Registry
    licensingModule: '0x610178dA211FEF7D417bC0e6FeD39F05609AD788', // Licensing
    stakingModule: '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199',  // Staking
    ipfsGateway: 'https://ipfs.io/ipfs',
  },
  mainnet: {
    network: 'mainnet',
    chainId: 137, // Polygon mainnet
    rpcUrl: 'https://polygon-rpc.com',
    ipRegistry: '0xC59b0D53F2404B6b32551e2112A3957527153782', // Story Protocol IP Registry
    licensingModule: '0x1234567890123456789012345678901234567890', // Add actual contract
    stakingModule: '0x0987654321098765432109876543210987654321', // Add actual contract
    ipfsGateway: 'https://ipfs.io/ipfs',
  },
};

// Enhanced blockchain registration result
export interface EnhancedBlockchainRegistration {
  success: boolean;
  ipAssetId: string;
  txHash: string;
  blockNumber: number;
  timestamp: string;
  ipfsUrl: string;
  network: string;
  contracts: {
    registry: string;
    licensing: string;
    staking: string;
  };
  metadata: {
    onChain: string;
    ipfs: string;
  };
}

// IP Asset interface
export interface IPAsset {
  id: string;
  owner: string;
  mediaType: MediaType;
  metadata: IPMetadata;
  registration: EnhancedBlockchainRegistration;
  licenses: License[];
  stakes: Stake[];
}

// License interface
export interface License {
  id: string;
  assetId: string;
  licensee: string;
  terms: string;
  validUntil: number;
  revocable: boolean;
}

// Stake interface
export interface Stake {
  id: string;
  assetId: string;
  staker: string;
  amount: string;
  lockedUntil: number;
}

// Get provider for Story Protocol network
export function getStoryProvider(network: 'testnet' | 'mainnet'): JsonRpcProvider {
  const config = STORY_NETWORKS[network];
  return new JsonRpcProvider(config.rpcUrl);
}

// Connect wallet to Story Protocol
export async function connectToStoryProtocol(network: 'testnet' | 'mainnet'): Promise<Signer> {
  if (typeof window === 'undefined') {
    throw new Error('Browser environment required');
  }

  if (!window.ethereum) {
    // Provide more helpful error message with MetaMask link
    throw new Error(
      'No Web3 wallet detected. Please install MetaMask (https://metamask.io) or another Web3 wallet.'
    );
  }

  const config = STORY_NETWORKS[network];
  const ethereum = window.ethereum;
  const provider = new BrowserProvider(ethereum);
  
  try {
    // Request account access
    const accounts = await ethereum.request({ 
      method: 'eth_requestAccounts' 
    }) as string[];
    
    if (!accounts || accounts.length === 0) {
      throw new Error('No accounts found. Please unlock your wallet.');
    }
    
    // Switch to Story Protocol network (Polygon/Mumbai)
    try {
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${config.chainId.toString(16)}` }],
      });
    } catch (error: any) {
      if (error.code === 4902) {
        // Network doesn't exist, add it
        await ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: `0x${config.chainId.toString(16)}`,
            chainName: network === 'testnet' ? 'Mumbai Testnet' : 'Polygon Mainnet',
            nativeCurrency: {
              name: 'MATIC',
              symbol: 'MATIC',
              decimals: 18,
            },
            rpcUrls: [config.rpcUrl],
            blockExplorerUrls: [
              network === 'testnet' 
                ? 'https://mumbai.polygonscan.com' 
                : 'https://polygonscan.com'
            ],
          }],
        });
      } else {
        throw error;
      }
    }

    return await provider.getSigner();
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    throw new Error(`Failed to connect wallet: ${errorMessage}`);
  }
}

// Enhanced registration with proper IPFS handling
export async function registerIPAssetEnhanced(
  signer: Signer,
  metadata: IPMetadata,
  mediaHash: string,
  network: 'testnet' | 'mainnet'
): Promise<EnhancedBlockchainRegistration> {
  const config = STORY_NETWORKS[network];

  try {
    // Upload metadata to IPFS (mock or real implementation)
    const ipfsMetadata = await uploadToIPFS(metadata as any);

    // Prepare on-chain metadata
    const onChainMetadata = {
      name: metadata.name,
      mediaHash,
      ipfsHash: ipfsMetadata.hash,
    };
    
    // Register on Story Protocol
    const registry = new Contract(
      config.ipRegistry,
      ['function register(string memory name, bytes32 mediaHash, string memory ipfsHash)'],
      signer
    );
    
    const tx = await registry.register(
      onChainMetadata.name,
      onChainMetadata.mediaHash,
      onChainMetadata.ipfsHash
    ) as ContractTransactionResponse;
    
  const receipt = await tx.wait() as TransactionReceipt;
    
    if (!receipt.status) {
      throw new Error('Transaction failed');
    }

    const event = receipt.logs[0];
    if (!event) {
      throw new Error('No event emitted');
    }

    return {
      success: true,
      ipAssetId: event.topics[1], // First indexed parameter
      txHash: receipt.hash,
      blockNumber: receipt.blockNumber,
      timestamp: new Date().toISOString(),
  ipfsUrl: `${config.ipfsGateway}/ipfs/${ipfsMetadata.hash}`,
      network: network,
      contracts: {
        registry: config.ipRegistry,
        licensing: config.licensingModule,
        staking: config.stakingModule,
      },
      metadata: {
        onChain: JSON.stringify(onChainMetadata),
        ipfs: ipfsMetadata.hash,
      },
    };
  } catch (error: unknown) {
    console.error('Failed to register IP asset:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to register IP asset';
    throw new Error(errorMessage);
  }
}

// Mock IPFS upload (replace with actual IPFS implementation)
async function uploadToIPFS(data: any): Promise<{ hash: string }> {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { hash: `Qm${Math.random().toString(36).substr(2, 44)}` };
}