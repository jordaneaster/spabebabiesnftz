/**
 * Wallet State Manager
 * 
 * This utility provides centralized wallet state management for Phantom wallet connections.
 * It helps maintain consistent wallet state across all components in the application.
 */

// Storage keys
const WALLET_CONNECTED_KEY = 'walletConnected';
const WALLET_ADDRESS_KEY = 'walletAddress';
const WALLET_DISCONNECTED_KEY = 'walletDisconnected';

/**
 * Check if the wallet is connected based on local storage state
 * @returns {boolean} true if wallet is connected, false otherwise
 */
export const isWalletConnected = () => {
  // First check if the user has explicitly disconnected
  if (localStorage.getItem(WALLET_DISCONNECTED_KEY) === 'true') {
    return false;
  }
  
  // Then check if we have a wallet connection stored
  return localStorage.getItem(WALLET_CONNECTED_KEY) === 'true' && 
    !!localStorage.getItem(WALLET_ADDRESS_KEY);
};

/**
 * Get the connected wallet address from local storage
 * @returns {string|null} The wallet address or null if not connected
 */
export const getWalletAddress = () => {
  if (isWalletConnected()) {
    return localStorage.getItem(WALLET_ADDRESS_KEY);
  }
  return null;
};

/**
 * Save wallet connection state to local storage
 * @param {string} address The wallet address
 */
export const saveWalletConnection = (address) => {
  if (address) {
    localStorage.setItem(WALLET_CONNECTED_KEY, 'true');
    localStorage.setItem(WALLET_ADDRESS_KEY, address);
    localStorage.removeItem(WALLET_DISCONNECTED_KEY);
    
    // Also dispatch a custom event that other components can listen for
    window.dispatchEvent(new CustomEvent('walletConnected', { 
      detail: { address } 
    }));
  }
};

/**
 * Clear wallet connection state from local storage
 */
export const clearWalletConnection = () => {
  localStorage.setItem(WALLET_DISCONNECTED_KEY, 'true');
  localStorage.removeItem(WALLET_CONNECTED_KEY);
  localStorage.removeItem(WALLET_ADDRESS_KEY);
  
  // Dispatch a custom event for wallet disconnection
  window.dispatchEvent(new CustomEvent('walletDisconnected'));
};

/**
 * Connect to Phantom wallet and save connection state
 * @returns {Promise<{address: string}|null>} Wallet info or null if failed
 */
export const connectPhantomWallet = async () => {
  // Check if Phantom is installed
  if (!window.solana || !window.solana.isPhantom) {
    throw new Error("Phantom wallet not found! Please install the extension.");
  }
  
  try {
    // Make sure any previous disconnection flag is removed
    localStorage.removeItem(WALLET_DISCONNECTED_KEY);
    
    // Connect to Phantom
    const response = await window.solana.connect();
    
    if (response.publicKey) {
      const address = response.publicKey.toString();
      
      // Save wallet info
      saveWalletConnection(address);
      
      return { address };
    }
    
    return null;
  } catch (error) {
    console.error("Error connecting to Phantom wallet:", error);
    throw error;
  }
};

/**
 * Disconnect from Phantom wallet and clear connection state
 */
export const disconnectPhantomWallet = async () => {
  try {
    // Disconnect from Phantom if it exists
    if (window.solana && window.solana.isPhantom) {
      await window.solana.disconnect();
    }
    
    // Clear the connection state
    clearWalletConnection();
    
    return true;
  } catch (error) {
    console.error("Error disconnecting from Phantom wallet:", error);
    throw error;
  }
};

/**
 * Try to auto-connect to a previously authorized Phantom wallet
 * @returns {Promise<{address: string}|null>} Wallet info or null if not connected
 */
export const autoConnectPhantomWallet = async () => {
  // Check if user has explicitly disconnected
  if (localStorage.getItem(WALLET_DISCONNECTED_KEY) === 'true') {
    return null;
  }
  
  // Check if Phantom is installed
  if (!window.solana || !window.solana.isPhantom) {
    return null;
  }
  
  try {
    // Try to connect to a trusted (previously connected) wallet
    const response = await window.solana.connect({ onlyIfTrusted: true }).catch(() => null);
    
    if (response && response.publicKey) {
      const address = response.publicKey.toString();
      
      // Save wallet info
      saveWalletConnection(address);
      
      return { address };
    }
  } catch (error) {
    // Silent fail is expected for auto-connect
    console.log("Auto-connect failed (expected if not previously authorized)");
  }
  
  return null;
};

// Listen for Phantom's own connection events
if (window.solana) {
  window.solana.on('accountChanged', () => {
    // When account changes, check if we still have a connection
    if (window.solana.isConnected && window.solana.publicKey) {
      saveWalletConnection(window.solana.publicKey.toString());
    } else {
      clearWalletConnection();
    }
  });
  
  window.solana.on('disconnect', () => {
    clearWalletConnection();
  });
}
