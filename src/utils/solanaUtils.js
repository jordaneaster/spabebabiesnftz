// Solana utility functions for Space Babies NFT project

import { NFT_PRICE_SOL, SOLANA_TESTNET } from './constants';

/**
 * Get SOL balance for a wallet address
 * @param {string} address - Solana wallet address
 * @returns {Promise<number>} - Balance in SOL
 */
export const getSolanaBalance = async (address) => {
  try {
    if (!window.solana || !window.solana.isPhantom) {
      throw new Error("Phantom wallet not installed");
    }
    
    // We need to create a proper connection to Solana
    // For testnet or mock implementation, we can use a simple approach
    
    // Check if we have the @solana/web3.js library available
    if (typeof window.solanaWeb3 === 'undefined') {
      console.warn("@solana/web3.js not found, using mock balance");
      // Return a mock balance for development/testing
      return Math.random() * 9.9 + 0.1; // Random balance between 0.1 and 10 SOL
    }
    
    try {
      // Try to get the actual balance if possible
      const { Connection, PublicKey } = window.solanaWeb3;
      const connection = new Connection(SOLANA_TESTNET.endpoint);
      const publicKey = new PublicKey(address);
      
      // Get balance in lamports
      const balanceInLamports = await connection.getBalance(publicKey);
      
      // Convert lamports to SOL (1 SOL = 1,000,000,000 lamports)
      return balanceInLamports / 1_000_000_000;
    } catch (innerError) {
      console.warn("Error with Solana Web3 connection, using mock balance:", innerError);
      // Return a mock balance as fallback
      return Math.random() * 9.9 + 0.1;
    }
  } catch (error) {
    console.error("Error getting Solana balance:", error);
    // Don't throw here - return a default balance instead
    return 1.0; // Default to 1 SOL for development
  }
};

/**
 * Upload metadata to IPFS or Arweave
 * @param {Object} metadata - NFT metadata
 * @returns {Promise<string>} - Metadata URI
 */
export const uploadMetadata = async (metadata) => {
  // For a real implementation, you would use a service like NFT.Storage or Arweave
  console.log("Mock uploading metadata:", metadata);
  return `https://arweave.net/${Math.random().toString(36).substring(2, 15)}`;
};

/**
 * Mint an NFT on Solana using Phantom wallet
 * @param {string} address - Recipient wallet address
 * @param {Object} metadata - NFT metadata
 * @param {Object} network - Solana network configuration
 * @returns {Promise<Object>} - Transaction details
 */
export const mintSolanaNFT = async (address, metadata, network) => {
  try {
    if (!window.solana || !window.solana.isPhantom) {
      throw new Error("Phantom wallet not installed");
    }
    
    // Upload metadata (mock)
    const metadataUri = await uploadMetadata(metadata);
    
    // For development/testing, always return a successful mock result
    console.log(`Simulating Solana NFT minting for ${address} with metadata:`, metadata);
    
    // Simulate transaction delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate a consistent mock signature that can be saved and referenced
    const mockSignature = `${Date.now().toString(16)}${Math.random().toString(36).substring(2, 15)}`;
    const mockMint = `${Date.now().toString(16).substring(0, 8)}`;
    
    // Save the minted NFT info to localStorage for potential display in your app
    try {
      const mintedNFTs = JSON.parse(localStorage.getItem('mintedSolanaNFTs') || '[]');
      mintedNFTs.push({
        signature: mockSignature,
        mint: mockMint,
        metadata: metadata,
        address: address,
        timestamp: Date.now()
      });
      localStorage.setItem('mintedSolanaNFTs', JSON.stringify(mintedNFTs));
    } catch (err) {
      console.warn("Could not save NFT to localStorage:", err);
    }
    
    // Return mock transaction details
    return {
      signature: mockSignature,
      mint: mockMint,
      metadataUri
    };
  } catch (error) {
    console.error("Error minting Solana NFT:", error);
    throw error;
  }
};

/**
 * Get NFTs owned by a wallet on Solana
 * @param {string} address - Wallet address
 * @param {Object} network - Solana network configuration
 * @returns {Promise<Array>} - Array of owned NFTs
 */
export const getSolanaNFTs = async (address, network) => {
  try {
    // In a real implementation, you would:
    // 1. Connect to Solana network
    // 2. Query Metaplex for NFTs owned by the address
    
    // For now, we'll return mock data
    return [
      {
        mint: `${Math.random().toString(36).substring(2, 15)}`,
        metadata: {
          name: `Space Baby #${Math.floor(Math.random() * 10000)}`,
          description: 'A unique Space Baby from the Etherland metaverse',
          image: `https://picsum.photos/id/${Math.floor(Math.random() * 100)}/200/200`
        }
      }
    ];
  } catch (error) {
    console.error("Error getting Solana NFTs:", error);
    return [];
  }
};
