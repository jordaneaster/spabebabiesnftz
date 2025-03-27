// Ethereum utility functions for Space Babies NFT project

import { ethers } from 'ethers';
import { NFT_PRICE_ETH, IPFS_GATEWAY } from './constants';
import SpaceBabiesABI from '../contracts/SpaceBabiesABI.json';

/**
 * Get ETH balance for a wallet address
 * @param {string} address - Ethereum wallet address
 * @returns {Promise<number>} - Balance in ETH
 */
export const getEthereumBalance = async (address) => {
  try {
    if (!window.ethereum) throw new Error("MetaMask not installed");
    
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const balance = await provider.getBalance(address);
    
    // Convert wei to ETH
    return parseFloat(ethers.utils.formatEther(balance));
  } catch (error) {
    console.error("Error getting Ethereum balance:", error);
    throw error;
  }
};

/**
 * Upload metadata to IPFS
 * @param {Object} metadata - NFT metadata
 * @returns {Promise<string>} - IPFS URI
 */
export const uploadToIPFS = async (metadata) => {
  try {
    // For a real implementation, you would use an IPFS service like Pinata or NFT.Storage
    // This is a placeholder that returns a mock IPFS hash
    console.log("Mock uploading metadata to IPFS:", metadata);
    const mockHash = `Qm${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    return `ipfs://${mockHash}`;
  } catch (error) {
    console.error("Error uploading to IPFS:", error);
    throw error;
  }
};

/**
 * Mint an NFT on Ethereum
 * @param {string} address - Recipient wallet address
 * @param {Object} metadata - NFT metadata
 * @param {Object} network - Ethereum network configuration
 * @returns {Promise<Object>} - Transaction details
 */
export const mintEthereumNFT = async (address, metadata, network) => {
  try {
    if (!window.ethereum) throw new Error("MetaMask not installed");
    
    // Request account access
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    
    // Check if we're on the right network
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    if (chainId !== network.chainId) {
      // Switch to the correct network
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: network.chainId }],
        });
      } catch (error) {
        throw new Error(`Please switch to ${network.name} in MetaMask`);
      }
    }
    
    // Upload metadata to IPFS (mock)
    const metadataUri = await uploadToIPFS(metadata);
    
    // Setup provider and signer
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    
    // Setup contract instance
    const contract = new ethers.Contract(
      network.contractAddress,
      SpaceBabiesABI,
      signer
    );
    
    // Calculate price in wei
    const price = ethers.utils.parseEther(NFT_PRICE_ETH.toString());
    
    // Mint NFT - adjust this based on your actual contract function
    const transaction = await contract.mint(metadataUri, {
      value: price
    });
    
    // Wait for transaction confirmation
    const receipt = await transaction.wait();
    
    return {
      transactionHash: receipt.transactionHash,
      tokenId: receipt.events.find(e => e.event === 'Transfer').args.tokenId.toString(),
      tokenURI: metadataUri
    };
  } catch (error) {
    console.error("Error minting Ethereum NFT:", error);
    throw error;
  }
};

/**
 * Get NFTs owned by a wallet
 * @param {string} address - Wallet address
 * @param {Object} network - Ethereum network configuration
 * @returns {Promise<Array>} - Array of owned NFTs
 */
export const getOwnedNFTs = async (address, network) => {
  try {
    const provider = new ethers.providers.JsonRpcProvider(network.rpcUrl);
    
    // Setup contract instance
    const contract = new ethers.Contract(
      network.contractAddress,
      SpaceBabiesABI,
      provider
    );
    
    // Get balance of address
    const balance = await contract.balanceOf(address);
    const ownedNFTs = [];
    
    // Fetch each token
    for (let i = 0; i < balance; i++) {
      const tokenId = await contract.tokenOfOwnerByIndex(address, i);
      const tokenURI = await contract.tokenURI(tokenId);
      
      // Fetch metadata if token URI is available
      let metadata = null;
      if (tokenURI) {
        // Convert IPFS URI to HTTP URL if necessary
        const metadataURL = tokenURI.replace('ipfs://', IPFS_GATEWAY);
        
        // Fetch metadata
        try {
          const response = await fetch(metadataURL);
          metadata = await response.json();
        } catch (error) {
          console.warn(`Error fetching metadata for token ${tokenId}:`, error);
        }
      }
      
      ownedNFTs.push({
        tokenId: tokenId.toString(),
        tokenURI,
        metadata
      });
    }
    
    return ownedNFTs;
  } catch (error) {
    console.error("Error getting owned NFTs:", error);
    return [];
  }
};
