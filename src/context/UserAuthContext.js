import React, { createContext, useState, useContext, useEffect } from 'react';
import supabase from '../utils/supabaseConfig';
import TABLES from '../utils/supabaseSchema';

const UserAuthContext = createContext();

export function UserAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [walletAddress, setWalletAddress] = useState(null);
  const [walletType, setWalletType] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedAddress = sessionStorage.getItem('walletAddress');
    const savedType = sessionStorage.getItem('walletType');
    
    if (savedAddress) {
      setWalletAddress(savedAddress);
      setWalletType(savedType || 'phantom');
      fetchUserProfile(savedAddress);
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchUserProfile = async (address) => {
    try {
      setIsLoading(true);
      
      // Check if user exists in database
      const { data, error } = await supabase
        .from(TABLES.USERS)
        .select('*')
        .eq('wallet_address', address)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user profile:', error);
      }
      
      if (data) {
        setUser(data);
      } else {
        // Create new user profile if first time connecting
        const newUser = {
          wallet_address: address,
          username: `Guardian_${address.substring(2, 6)}`,
          created_at: new Date()
        };
        
        const { data: createdUser, error: createError } = await supabase
          .from(TABLES.USERS)
          .insert([newUser])
          .select()
          .single();
          
        if (createError) {
          console.error('Error creating user profile:', createError);
        } else {
          setUser(createdUser);
        }
      }
      
    } catch (err) {
      console.error('Failed to fetch or create user profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Connect to Phantom Wallet
  const connectPhantomWallet = async () => {
    try {
      if (window.solana && window.solana.isPhantom) {
        const response = await window.solana.connect();
        const address = response.publicKey.toString();
        
        sessionStorage.setItem('walletAddress', address);
        sessionStorage.setItem('walletType', 'phantom');
        
        setWalletAddress(address);
        setWalletType('phantom');
        
        await fetchUserProfile(address);
        return true;
      } else {
        alert('Phantom wallet not found. Please install it from https://phantom.app/');
        return false;
      }
    } catch (error) {
      console.error('Error connecting to Phantom wallet:', error);
      return false;
    }
  };

  // Connect to MetaMask for Polygon
  const connectMetaMask = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ 
          method: 'eth_requestAccounts' 
        });
        
        const address = accounts[0];
        
        // Request switch to Polygon network
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x89' }], // Polygon Mainnet
          });
        } catch (switchError) {
          // If Polygon is not added, add it
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: '0x89',
                chainName: 'Polygon Mainnet',
                nativeCurrency: {
                  name: 'MATIC',
                  symbol: 'MATIC',
                  decimals: 18
                },
                rpcUrls: ['https://polygon-rpc.com/'],
                blockExplorerUrls: ['https://polygonscan.com/']
              }]
            });
          } else {
            throw switchError;
          }
        }
        
        sessionStorage.setItem('walletAddress', address);
        sessionStorage.setItem('walletType', 'metamask');
        
        setWalletAddress(address);
        setWalletType('metamask');
        
        await fetchUserProfile(address);
        return true;
      } else {
        alert('MetaMask not found. Please install it from https://metamask.io/');
        return false;
      }
    } catch (error) {
      console.error('Error connecting to MetaMask:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      if (walletType === 'phantom' && window.solana) {
        await window.solana.disconnect();
      }
      
      sessionStorage.removeItem('walletAddress');
      sessionStorage.removeItem('walletType');
      sessionStorage.removeItem('currentSpaceBaby');
      
      setWalletAddress(null);
      setWalletType(null);
      setUser(null);
      
      return true;
    } catch (error) {
      console.error('Error during logout:', error);
      return false;
    }
  };

  const value = {
    user,
    walletAddress,
    walletType,
    isLoading,
    connectPhantomWallet,
    connectMetaMask,
    logout
  };

  return (
    <UserAuthContext.Provider value={value}>
      {children}
    </UserAuthContext.Provider>
  );
}

export const useUserAuth = () => {
  return useContext(UserAuthContext);
};
