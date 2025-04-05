import { loadSolanaWeb3 } from './solanaWeb3Helper';

/**
 * Connect to Phantom wallet
 * @returns {Promise<{address: string, type: string}>}
 */
export const connectPhantomWallet = async () => {
  if (!window.solana || !window.solana.isPhantom) {
    throw new Error("Phantom wallet not found. Please install the Phantom extension.");
  }

  try {
    // Check if Phantom is connected, if not, connect
    if (!window.solana.isConnected) {
      const response = await window.solana.connect();
      if (!response.publicKey) {
        throw new Error("No public key returned from Phantom.");
      }
      
      return {
        address: response.publicKey.toString(),
        type: 'phantom'
      };
    } else {
      // If already connected, just get the public key
      const publicKey = window.solana.publicKey;
      if (!publicKey) {
        throw new Error("No public key available from Phantom.");
      }
      
      return {
        address: publicKey.toString(),
        type: 'phantom'
      };
    }
  } catch (error) {
    console.error("Error in connectPhantomWallet:", error);
    throw new Error(error.message || "Failed to connect to Phantom wallet");
  }
};

/**
 * Connect to MetaMask wallet
 * @returns {Promise<{address: string, type: string}>}
 */
export const connectMetaMaskWallet = async () => {
  if (!window.ethereum || !window.ethereum.isMetaMask) {
    throw new Error("MetaMask not found. Please install the MetaMask extension.");
  }
  
  try {
    // Request account access
    const accounts = await window.ethereum.request({ 
      method: 'eth_requestAccounts' 
    });
    
    if (!accounts || accounts.length === 0) {
      throw new Error("No accounts found in MetaMask.");
    }
    
    return {
      address: accounts[0],
      type: 'metamask'
    };
  } catch (error) {
    console.error("Error in connectMetaMaskWallet:", error);
    throw new Error(error.message || "Failed to connect to MetaMask");
  }
};

/**
 * Check if a wallet is connected
 * @returns {Promise<{connected: boolean, address: string|null, type: string|null}>}
 */
export const checkWalletConnection = async () => {
  // Check Phantom
  if (window.solana && window.solana.isPhantom) {
    try {
      if (window.solana.isConnected && window.solana.publicKey) {
        return {
          connected: true,
          address: window.solana.publicKey.toString(),
          type: 'phantom'
        };
      }
    } catch (error) {
      console.error("Error checking Phantom connection:", error);
    }
  }
  
  // Check MetaMask
  if (window.ethereum && window.ethereum.isMetaMask) {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts && accounts.length > 0) {
        return {
          connected: true,
          address: accounts[0],
          type: 'metamask'
        };
      }
    } catch (error) {
      console.error("Error checking MetaMask connection:", error);
    }
  }
  
  return {
    connected: false,
    address: null,
    type: null
  };
};
