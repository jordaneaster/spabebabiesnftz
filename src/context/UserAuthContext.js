import React, { createContext, useContext, useState, useEffect } from 'react';
import supabase from '../utils/supabaseConfig';
import { ethers } from 'ethers';

const UserAuthContext = createContext();

export const UserAuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [walletAddress, setWalletAddress] = useState('');
  const [walletConnected, setWalletConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    // Check if user is logged in via Supabase
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          setUser(session.user);
        } else {
          setUser(null);
        }
      }
    );
    
    // Check if wallet is connected in session storage
    const savedWalletAddress = sessionStorage.getItem('walletAddress');
    if (savedWalletAddress) {
      setWalletAddress(savedWalletAddress);
      setWalletConnected(true);
    }
    
    return () => {
      authListener.unsubscribe(); // Fixed: Added parentheses to call the function
    };
  }, []);
  
  // Connect wallet function
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        setLoading(true);
        // Request account access
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        const address = accounts[0];
        setWalletAddress(address);
        setWalletConnected(true);
        
        // Save to session storage
        sessionStorage.setItem('walletAddress', address);
        
        return address;
      } catch (error) {
        console.error("Error connecting wallet:", error);
        throw error;
      } finally {
        setLoading(false);
      }
    } else {
      window.alert('Please install MetaMask or another Ethereum wallet to connect');
      throw new Error('No Ethereum wallet detected');
    }
  };
  
  // Disconnect wallet function
  const disconnectWallet = () => {
    setWalletAddress('');
    setWalletConnected(false);
    sessionStorage.removeItem('walletAddress');
  };
  
  // Sign in with email and password
  const logIn = async (email, password) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Sign up with email and password
  const signUp = async (email, password) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Log out user
  const logOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      // Also disconnect wallet when logging out
      disconnectWallet();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  // Connect to contract - Updated for ethers v6
  const connectToContract = async (contractAddress, contractABI) => {
    if (!walletConnected) {
      throw new Error('Wallet not connected');
    }
    
    try {
      // Updated for ethers v6
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      return new ethers.Contract(contractAddress, contractABI, signer);
    } catch (error) {
      console.error('Error connecting to contract:', error);
      throw error;
    }
  };
  
  const value = {
    user,
    walletAddress,
    walletConnected,
    loading,
    connectWallet,
    disconnectWallet,
    logIn,
    signUp,
    logOut,
    connectToContract
  };
  
  return (
    <UserAuthContext.Provider value={value}>
      {children}
    </UserAuthContext.Provider>
  );
};

export const useUserAuth = () => {
  return useContext(UserAuthContext);
};
