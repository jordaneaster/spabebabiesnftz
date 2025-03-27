import React, { createContext, useContext, useState, useEffect } from 'react';
import supabase from '../utils/supabaseConfig';

const UserAuthContext = createContext(null);

export const UserAuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [spaceBaby, setSpaceBaby] = useState(null);
  const [walletType, setWalletType] = useState(null); // Track wallet type (phantom or metamask)

  // Check for stored wallet on app load
  useEffect(() => {
    const checkUser = async () => {
      const storedWallet = localStorage.getItem('phantomWalletAddress') || localStorage.getItem('metamaskWalletAddress');
      const storedWalletType = localStorage.getItem('walletType');
      
      if (storedWallet) {
        try {
          // Get user from database
          const { data: user, error } = await supabase
            .from('space_baby_users')
            .select('*')
            .eq('wallet_address', storedWallet)
            .single();

          if (user) {
            setCurrentUser(user);
            setWalletType(storedWalletType || 'phantom'); // Default to phantom if not specified
            
            // Get associated space baby if exists
            const { data: baby } = await supabase
              .from('space_babies')
              .select('*')
              .eq('wallet_address', storedWallet)
              .single();
              
            if (baby) setSpaceBaby(baby);
          }
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      }
      setLoading(false);
    };

    checkUser();
  }, []);

  // Register or update user in database
  const saveUserToDatabase = async (walletAddress, walletType = 'phantom') => {
    try {
      // Check if user exists
      const { data: existingUser } = await supabase
        .from('space_baby_users')
        .select('*')
        .eq('wallet_address', walletAddress)
        .single();

      if (existingUser) {
        // Update existing user
        const { data, error } = await supabase
          .from('space_baby_users')
          .update({ updated_at: new Date().toISOString() })
          .eq('wallet_address', walletAddress)
          .select();
          
        if (error) throw error;
        setCurrentUser(data[0]);
        setWalletType(walletType);
        localStorage.setItem('walletType', walletType);
        return data[0];
      } else {
        // Create new user
        const { data, error } = await supabase
          .from('space_baby_users')
          .insert([
            { 
              wallet_address: walletAddress, 
              wallet_type: walletType,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          ])
          .select();
          
        if (error) throw error;
        setCurrentUser(data[0]);
        setWalletType(walletType);
        localStorage.setItem('walletType', walletType);
        return data[0];
      }
    } catch (error) {
      console.error("Error saving user to database:", error);
      throw error;
    }
  };

  // Logout function - handles both Phantom and MetaMask
  const logout = async () => {
    try {
      // Disconnect from Phantom wallet if present
      if (window.solana && window.solana.isConnected) {
        try {
          await window.solana.disconnect();
          console.log("Disconnected from Phantom wallet");
        } catch (err) {
          console.error("Error disconnecting from Phantom:", err);
        }
      }

      // Disconnect from MetaMask if present (Note: MetaMask doesn't have a direct disconnect method)
      if (window.ethereum && window.ethereum.isMetaMask) {
        console.log("Note: MetaMask doesn't support programmatic disconnect");
        // We can still clear our app's connection records
      }

      // Clear local storage
      localStorage.removeItem('phantomWalletAddress');
      localStorage.removeItem('metamaskWalletAddress');
      localStorage.removeItem('walletType');

      // Clear context state
      setCurrentUser(null);
      setSpaceBaby(null);
      setWalletType(null);

      return true;
    } catch (error) {
      console.error("Error during logout:", error);
      return false;
    }
  };

  return (
    <UserAuthContext.Provider value={{ 
      currentUser, 
      setCurrentUser, 
      loading, 
      spaceBaby, 
      setSpaceBaby, 
      saveUserToDatabase,
      walletType,
      logout
    }}>
      {children}
    </UserAuthContext.Provider>
  );
};

export const useUserAuth = () => useContext(UserAuthContext);

export default UserAuthContext;
