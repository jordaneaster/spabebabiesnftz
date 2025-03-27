// Network configuration constants for the Space Babies NFT project

// Ethereum Testnet (Goerli)
export const ETHEREUM_TESTNET = {
  name: 'Goerli Testnet',
  chainId: '0x5',
  rpcUrl: 'https://goerli.infura.io/v3/YOUR_INFURA_ID', // Replace with your Infura ID
  currency: 'ETH',
  blockExplorer: 'https://goerli.etherscan.io',
  contractAddress: '0x0000000000000000000000000000000000000000' // Replace with your deployed contract
};

// Solana Testnet (Devnet)
export const SOLANA_TESTNET = {
  name: 'Solana Testnet',
  endpoint: 'https://api.testnet.solana.com',
  currency: 'SOL',
  blockExplorer: 'https://explorer.solana.com?cluster=testnet',
  programId: '' // Replace with your deployed program ID
};

// NFT pricing
export const NFT_PRICE_ETH = 0.01; // Price in ETH
export const NFT_PRICE_SOL = 0.1; // Price in SOL

// IPFS Gateway
export const IPFS_GATEWAY = 'https://ipfs.io/ipfs/';

// Metadata standards
export const METADATA_STANDARD = {
  ethereum: 'ERC-721',
  solana: 'Metaplex NFT Standard'
};
