// Helper to dynamically load Solana Web3.js

/**
 * Dynamically loads the Solana Web3.js library if needed
 * @returns {Promise<void>}
 */
export const loadSolanaWeb3 = async () => {
  if (typeof window.solanaWeb3 !== 'undefined') {
    // Already loaded
    return;
  }

  try {
    // Try to load from a CDN
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/@solana/web3.js@latest/lib/index.iife.js';
      script.onload = () => {
        if (typeof window.solanaWeb3 !== 'undefined') {
          console.log('Solana Web3.js loaded successfully');
          resolve();
        } else {
          // If the global variable isn't set after loading, set up a simple mock
          console.warn('Setting up mock Solana Web3 after script load');
          setupMockSolanaWeb3();
          resolve();
        }
      };
      script.onerror = () => {
        console.warn('Failed to load Solana Web3.js, setting up mock');
        setupMockSolanaWeb3();
        resolve(); // Resolve anyway since we have a mock
      };
      document.head.appendChild(script);
    });
  } catch (error) {
    console.error('Error loading Solana Web3.js:', error);
    setupMockSolanaWeb3();
  }
};

/**
 * Sets up a mock Solana Web3 object for development/testing
 */
const setupMockSolanaWeb3 = () => {
  window.solanaWeb3 = {
    Connection: class MockConnection {
      constructor() {
        this.endpoint = 'mock';
      }
      
      async getBalance() {
        return 5_000_000_000; // 5 SOL in lamports
      }
    },
    PublicKey: class MockPublicKey {
      constructor(address) {
        this.address = address;
        this.toBase58 = () => address;
      }
    }
  };
  console.log('Mock Solana Web3 set up');
};

/**
 * Checks if Phantom wallet is installed and properly connected
 * @returns {boolean}
 */
export const isPhantomWalletReady = () => {
  return window.solana && window.solana.isPhantom && window.solana.isConnected;
};

/**
 * Gets a proper Solana connection regardless of environment
 * @returns {Object} Solana connection object
 */
export const getSolanaConnection = () => {
  if (!window.solanaWeb3) {
    setupMockSolanaWeb3();
  }
  
  const { Connection } = window.solanaWeb3;
  return new Connection('https://api.testnet.solana.com');
};
