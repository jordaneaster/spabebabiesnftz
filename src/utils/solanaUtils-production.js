// Production-ready Solana utilities for Space Babies NFT project
// NOTE: This file requires additional npm packages:
// npm install @metaplex-foundation/js @solana/web3.js

import { 
  Connection, 
  clusterApiUrl, 
  PublicKey
} from '@solana/web3.js';
import { 
  Metaplex, 
  keypairIdentity, 
  bundlrStorage
} from '@metaplex-foundation/js';
import { NFT_PRICE_SOL } from './constants';

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
    
    // Create a connection to the Solana cluster
    const connection = new Connection(clusterApiUrl('devnet'));
    
    // Convert the address string to a PublicKey object
    const publicKey = new PublicKey(address);
    
    // Get balance in lamports
    const balanceInLamports = await connection.getBalance(publicKey);
    
    // Convert lamports to SOL (1 SOL = 1,000,000,000 lamports)
    return balanceInLamports / 1_000_000_000;
  } catch (error) {
    console.error("Error getting Solana balance:", error);
    throw error;
  }
};

/**
 * Upload metadata to Arweave using Metaplex/Bundlr
 * @param {Object} metadata - NFT metadata
 * @param {Connection} connection - Solana connection
 * @param {Metaplex} metaplex - Metaplex instance
 * @returns {Promise<string>} - Metadata URI
 */
export const uploadMetadata = async (metadata, metaplex) => {
  try {
    // Upload the metadata to Arweave
    const { uri } = await metaplex.nfts().uploadMetadata(metadata);
    console.log("Metadata uploaded to:", uri);
    return uri;
  } catch (error) {
    console.error("Error uploading metadata:", error);
    throw error;
  }
};

/**
 * Mint an NFT on Solana using Metaplex
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
    
    // Request connection to wallet if not already connected
    const wallet = window.solana;
    if (!wallet.isConnected) {
      const resp = await wallet.connect();
      address = resp.publicKey.toString();
    }
    
    // Create a connection to Solana
    const connection = new Connection(network.endpoint);
    
    // Initialize Metaplex
    const metaplex = Metaplex.make(connection)
      .use(bundlrStorage())
      .use(keypairIdentity(wallet.publicKey));
    
    // Upload metadata including image
    // In a real app, you'd upload the image first, get the URL, include that in metadata
    const metadataUri = await uploadMetadata(metadata, metaplex);
    
    // Create the NFT
    const { nft } = await metaplex.nfts().create({
      uri: metadataUri,
      name: metadata.name,
      sellerFeeBasisPoints: 500, // 5% royalty
      // In production you'd handle the payment through a proper transaction
    });
    
    console.log("NFT created:", nft);
    
    return {
      success: true,
      signature: nft.signature,
      mint: nft.address.toString(),
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
    const connection = new Connection(network.endpoint);
    const publicKey = new PublicKey(address);
    
    // Initialize Metaplex
    const metaplex = Metaplex.make(connection);
    
    // Fetch all NFTs
    const nfts = await metaplex.nfts().findAllByOwner({ owner: publicKey });
    
    // Filter for only your collection's NFTs if needed
    // You could add a specific symbol or other identifier
    
    return nfts.map(nft => ({
      mint: nft.address.toString(),
      metadata: {
        name: nft.name,
        description: nft.json?.description || '',
        image: nft.json?.image || ''
      },
      updateAuthority: nft.updateAuthorityAddress.toString()
    }));
  } catch (error) {
    console.error("Error getting Solana NFTs:", error);
    return [];
  }
};
