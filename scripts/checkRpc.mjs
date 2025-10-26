import { JsonRpcProvider } from 'ethers';

// RPC URL – this matches what's in lib/blockchain.ts
const rpcUrl = 'https://polygon-mainnet.g.alchemy.com/v2/dRVeWKDhk2nfV_271854j';

async function check() {
  try {
    const provider = new JsonRpcProvider(rpcUrl);
    const network = await provider.getNetwork();
    const blockNumber = await provider.getBlockNumber();
    console.log('RPC URL:', rpcUrl);
    console.log('Connected network:', network);
    console.log('Latest block number:', blockNumber);
    // Simple request to ensure provider is responding
    const chainId = network.chainId;
    console.log('Chain ID:', chainId);
    process.exit(0);
  } catch (err) {
    console.error('RPC check failed:', err);
    process.exit(2);
  }
}

check();
