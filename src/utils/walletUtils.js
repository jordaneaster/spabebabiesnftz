import { loadSolanaWeb3 } from './solanaWeb3Helper';

// Connect to Phantom wallet
export const connectPhantomWallet = async () => {
  if (!window.solana || !window.solana.isPhantom) {
    throw new Error("Phantom wallet not detected! Please install Phantom extension first.");
  }
  
  // Make sure Solana Web3 is loaded
  await loadSolanaWeb3();
  
  // Connect to Phantom
  const response = await window.solana.connect();
  
  if (response.publicKey) {
    const publicKeyStr = response.publicKey.toString();
    
    // Store wallet info in localStorage
    localStorage.setItem('phantomWalletAddress', publicKeyStr);
    localStorage.setItem('walletType', 'phantom');
    
    return {
      address: publicKeyStr,
      type: 'phantom'
    };
  }
  
  throw new Error("Failed to connect to Phantom wallet.");
};

// Connect to MetaMask wallet
export const connectMetaMaskWallet = async () => {
  if (!window.ethereum || !window.ethereum.isMetaMask) {
    throw new Error("MetaMask not detected! Please install MetaMask extension first.");
  }
  
  try {
    // Request account access
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    
    if (accounts && accounts.length > 0) {
      const address = accounts[0];
      
      // Store wallet info in localStorage
      localStorage.setItem('metamaskWalletAddress', address);
      localStorage.setItem('walletType', 'metamask');
      
      return {
        address: address,
        type: 'metamask'
      };
    } else {
      throw new Error("No accounts found.");
    }
  } catch (error) {
    console.error("Error connecting to MetaMask:", error);
    throw new Error("Failed to connect to MetaMask: " + error.message);
  }
};

// Get the active wallet type and address
export const getActiveWallet = () => {
  const phantomAddress = localStorage.getItem('phantomWalletAddress');
  const metamaskAddress = localStorage.getItem('metamaskWalletAddress');
  const walletType = localStorage.getItem('walletType');
  
  if (walletType === 'phantom' && phantomAddress) {
    return {
      address: phantomAddress,
      type: 'phantom'
    };
  }
  
  if (walletType === 'metamask' && metamaskAddress) {
    return {
      address: metamaskAddress,
      type: 'metamask'
    };
  }
  
  return null;
};
