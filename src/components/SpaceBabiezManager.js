import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { ethers } from 'ethers';
import { useUserAuth } from '../context/UserAuthContext';
import ContractInteraction from './ContractInteraction';
import { useNavigate } from 'react-router-dom';
import { generateSpaceBaby, saveSpaceBaby, getUserSpaceBabies } from '../utils/spaceBabyGenerator';
import { 
  isWalletConnected, 
  getWalletAddress, 
  connectPhantomWallet,
  autoConnectPhantomWallet
} from '../utils/walletStateManager';

// Animations
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

// Styled Components
const ManagerContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  color: ${props => props.theme.text};
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  
  h1 {
    font-size: ${props => props.theme.fontxxl};
    margin-bottom: 1rem;
    
    @media (max-width: 768px) {
      font-size: ${props => props.theme.fontxl};
    }
  }
  
  p {
    font-size: ${props => props.theme.fontmd};
    color: ${props => `rgba(${props.theme.textRgba}, 0.8)`};
    max-width: 800px;
    margin: 0 auto;
    
    @media (max-width: 768px) {
      font-size: ${props => props.theme.fontsm};
    }
  }
`;

const TabsContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-wrap: wrap;
    gap: 0.5rem;
  }
`;

const Tab = styled.button`
  padding: 0.8rem 1.5rem;
  background: ${props => props.active 
    ? 'linear-gradient(90deg, #3081ed, #9b51e0)' 
    : 'rgba(36, 37, 38, 0.8)'};
  color: white;
  border: none;
  font-size: ${props => props.theme.fontsm};
  font-weight: ${props => props.active ? '600' : '400'};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:first-child {
    border-top-left-radius: 30px;
    border-bottom-left-radius: 30px;
  }
  
  &:last-child {
    border-top-right-radius: 30px;
    border-bottom-right-radius: 30px;
  }
  
  &:hover {
    background: ${props => props.active 
      ? 'linear-gradient(90deg, #3081ed, #9b51e0)' 
      : 'rgba(48, 129, 237, 0.3)'};
  }
  
  @media (max-width: 768px) {
    font-size: ${props => props.theme.fontxs};
    padding: 0.6rem 1rem;
    flex-grow: 1;
    border-radius: 30px;
    margin: 0.2rem;
  }
`;

const Card = styled.div`
  background: rgba(36, 37, 38, 0.8);
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  margin-bottom: 2rem;
  
  h2 {
    color: #aeff00;
    margin-bottom: 1.5rem;
    text-align: center;
    font-size: ${props => props.theme.fontxl};
    
    @media (max-width: 768px) {
      font-size: ${props => props.theme.fontlg};
    }
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
`;

const BabyCard = styled.div`
  background: rgba(0, 0, 0, 0.3);
  border-radius: 15px;
  overflow: hidden;
  transition: transform 0.3s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 10px 20px rgba(48, 129, 237, 0.3);
  }
`;

const BabyImage = styled.div`
  width: 100%;
  aspect-ratio: 1;
  overflow: hidden;
  position: relative;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }
  
  &:hover img {
    transform: scale(1.1);
  }
`;

const BabyContent = styled.div`
  padding: 1.5rem;
`;

const BabyName = styled.h3`
  font-size: ${props => props.theme.fontmd};
  margin-bottom: 0.5rem;
  color: #3081ed;
`;

const BabyInfo = styled.div`
  font-size: ${props => props.theme.fontsm};
  color: ${props => `rgba(${props.theme.textRgba}, 0.8)`};
  
  p {
    margin: 0.3rem 0;
  }
  
  .rarity {
    color: #9b51e0;
    font-weight: bold;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const Button = styled.button`
  background: linear-gradient(90deg, #aeff00, #3081ed);
  background-size: 200% auto;
  color: black;
  border: none;
  padding: 0.75rem 1rem;
  border-radius: 50px;
  font-size: ${props => props.theme.fontxs};
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s;
  flex: 1;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 10px rgba(174, 255, 0, 0.3);
    background-position: right center;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 500px;
  margin: 0 auto;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  
  label {
    font-size: ${props => props.theme.fontsm};
    color: ${props => `rgba(${props.theme.textRgba}, 0.9)`};
  }
  
  input, select {
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(174, 255, 0, 0.3);
    border-radius: 8px;
    padding: 0.75rem;
    color: white;
    font-size: ${props => props.theme.fontmd};
    
    &:focus {
      outline: none;
      border-color: #aeff00;
    }
  }
`;

const WalletButton = styled.button`
  background: linear-gradient(90deg, #aeff00, #3081ed);
  background-size: 200% auto;
  color: black;
  border: none;
  padding: 1rem 2rem;
  border-radius: 50px;
  font-size: ${props => props.theme.fontmd};
  font-weight: bold;
  cursor: pointer;
  margin: 2rem auto;
  display: block;
  transition: 0.3s;
  animation: ${shimmer} 3s infinite linear;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(174, 255, 0, 0.2);
  }
`;

const LoadingOverlay = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 2rem;
  
  .spinner {
    width: 50px;
    height: 50px;
    border: 4px solid rgba(174, 255, 0, 0.1);
    border-radius: 50%;
    border-left-color: #aeff00;
    animation: ${rotate} 1s linear infinite;
    margin-bottom: 1rem;
  }
`;

const NoWalletMessage = styled.div`
  text-align: center;
  padding: 3rem;
  
  h3 {
    color: #aeff00;
    margin-bottom: 1rem;
  }
  
  p {
    color: ${props => `rgba(${props.theme.textRgba}, 0.8)`};
    margin-bottom: 2rem;
  }
`;

function SpaceBabiezManager() {
  const { user, walletAddress: contextWalletAddress, walletConnected: contextWalletConnected, connectWallet } = useUserAuth();
  const [activeTab, setActiveTab] = useState('collection');
  const [myBabies, setMyBabies] = useState([]);
  const [astroMilkBalance, setAstroMilkBalance] = useState('0');
  const [loading, setLoading] = useState(true);
  const [selectedBaby, setSelectedBaby] = useState(null);
  const [autoConnectAttempted, setAutoConnectAttempted] = useState(false);
  const [localWalletConnected, setLocalWalletConnected] = useState(false);
  const [localWalletAddress, setLocalWalletAddress] = useState('');
  
  // For breeding - these declarations were missing
  const [parent1Id, setParent1Id] = useState('');
  const [parent2Id, setParent2Id] = useState('');
  
  // For marketplace - these declarations were missing
  const [listingPrice, setListingPrice] = useState('');
  const [selectedBabyId, setSelectedBabyId] = useState('');
  
  // Check if wallet is truly connected using all available sources
  const isWalletReady = 
    (contextWalletConnected && contextWalletAddress) || // Check context first
    (localWalletConnected && localWalletAddress) ||    // Then check local state
    isWalletConnected();                               // Finally check central state
  
  // Get the most reliable wallet address from all sources
  const effectiveWalletAddress = 
    contextWalletAddress || 
    localWalletAddress || 
    getWalletAddress() || 
    '';
  
  // Auto-connect wallet if not already connected
  useEffect(() => {
    const attemptAutoConnect = async () => {
      // Skip if already attempted
      if (autoConnectAttempted) return;
      
      setAutoConnectAttempted(true);
      
      // Skip if wallet is already connected
      if (isWalletReady) return;
      
      try {
        // Check central state first
        if (isWalletConnected()) {
          const address = getWalletAddress();
          setLocalWalletConnected(true);
          setLocalWalletAddress(address);
          
          // Also update context if available
          if (typeof connectWallet === 'function') {
            await connectWallet('phantom', address);
          }
          return;
        }
        
        // Try auto-connect
        const result = await autoConnectPhantomWallet();
        if (result && result.address) {
          setLocalWalletConnected(true);
          setLocalWalletAddress(result.address);
          
          // Also update context if available
          if (typeof connectWallet === 'function') {
            await connectWallet('phantom', result.address);
          }
        }
      } catch (error) {
        console.error("Error in auto-connect:", error);
      }
    };
    
    attemptAutoConnect();
    
    // Listen for wallet connection/disconnection events
    const handleWalletConnected = (event) => {
      setLocalWalletConnected(true);
      setLocalWalletAddress(event.detail.address);
    };
    
    const handleWalletDisconnected = () => {
      setLocalWalletConnected(false);
      setLocalWalletAddress('');
    };
    
    window.addEventListener('walletConnected', handleWalletConnected);
    window.addEventListener('walletDisconnected', handleWalletDisconnected);
    
    return () => {
      window.removeEventListener('walletConnected', handleWalletConnected);
      window.removeEventListener('walletDisconnected', handleWalletDisconnected);
    };
  }, [isWalletReady, connectWallet, autoConnectAttempted]);
  
  // Load user's babies and balance when wallet is connected
  useEffect(() => {
    // Only attempt to load data if we have a connected wallet with an address
    if (isWalletReady && effectiveWalletAddress) {
      console.log("Wallet is ready, loading data with address:", effectiveWalletAddress);
      loadUserData();
    } else {
      // If not ready yet, set loading to false to show connect wallet UI
      console.log("Wallet not ready yet:", { contextWalletConnected, contextWalletAddress, localWalletConnected, localWalletAddress });
      setLoading(false);
    }
  }, [contextWalletConnected, contextWalletAddress, localWalletConnected, localWalletAddress, user]);
  
  // Handle explicit wallet connection using our centralized method
  const handleConnectWallet = async () => {
    setLoading(true);
    
    try {
      const result = await connectPhantomWallet();
      if (result && result.address) {
        setLocalWalletConnected(true);
        setLocalWalletAddress(result.address);
        
        // Also update context if available
        if (typeof connectWallet === 'function') {
          await connectWallet('phantom', result.address);
        }
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
      alert(`Failed to connect wallet: ${error.message || "Unknown error"}`);
      setLoading(false);
    }
  };
  
  // Load user's babies and balance
  const loadUserData = async () => {
    try {
      setLoading(true);
      
      // Fetch Space Babies associated with the wallet address
      // Make sure we have a valid identifier (user ID or wallet address)
      const identifier = user?.id || effectiveWalletAddress;
      
      console.log("Loading user data with identifier:", identifier);
      
      if (!identifier) {
        console.warn('No user ID or wallet address available');
        setMyBabies([]);
        setLoading(false);
        return;
      }
      
      // Add a little delay to ensure wallet connection is fully established
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const userBabies = await getUserSpaceBabies(identifier);
      
      if (userBabies && userBabies.length > 0) {
        setMyBabies(userBabies);
      } else {
        setMyBabies([]);
      }
      
      // Set mock ASTROMILK balance for demonstration
      setAstroMilkBalance('1000');
    } catch (error) {
      console.error('Error loading user data:', error);
      setMyBabies([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };
  
  // Handle NFT minting
  const handleMintBaby = async () => {
    try {
      setLoading(true);
      
      // Generate a unique ID for the new Space Baby
      const babyId = `baby_${Date.now()}`;
      
      // Generate a new Space Baby
      const newBaby = await generateSpaceBaby(babyId, {
        // Add any options for generation here
        species: 'Cosmic',
        rarity: 'Common'
      });
      
      if (newBaby) {
        // Save the Space Baby to the database
        await saveSpaceBaby(user?.id || effectiveWalletAddress, newBaby);
        
        // Refresh the user's collection
        await loadUserData();
        
        alert('Space Baby minted successfully!');
      }
    } catch (error) {
      console.error('Error minting Space Baby:', error);
      alert(`Minting failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle baby level up
  const handleGrowUp = async (tokenId) => {
    try {
      setLoading(true);
      
      // Find the baby to level up
      const baby = myBabies.find(b => b.id === tokenId);
      if (!baby) {
        throw new Error('Space Baby not found');
      }
      
      // Simulate level up process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update the baby's level (this would be done through the blockchain in a real app)
      const updatedBabies = myBabies.map(b => {
        if (b.id === tokenId) {
          return {
            ...b,
            level: (b.level || 1) + 1
          };
        }
        return b;
      });
      
      setMyBabies(updatedBabies);
      alert(`Space Baby #${tokenId} leveled up successfully!`);
    } catch (error) {
      console.error('Error leveling up Space Baby:', error);
      alert(`Level up failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle breeding
  const handleBreed = async () => {
    try {
      if (!parent1Id || !parent2Id) {
        alert('Please select two parent Space Babies');
        return;
      }
      
      if (parent1Id === parent2Id) {
        alert('Please select two different Space Babies');
        return;
      }
      
      setLoading(true);
      
      // Find the parent babies
      const parent1 = myBabies.find(b => b.id === parent1Id);
      const parent2 = myBabies.find(b => b.id === parent2Id);
      
      if (!parent1 || !parent2) {
        throw new Error('One or both parent Space Babies not found');
      }
      
      // Simulate breeding process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Generate a unique ID for the new Space Baby
      const babyId = `baby_${Date.now()}`;
      
      // Generate a new Space Baby from breeding
      const newBaby = await generateSpaceBaby(babyId, {
        // Use parent attributes to influence the child
        species: parent1.species || 'Cosmic',
        parent1: parent1Id,
        parent2: parent2Id,
        rarity: Math.random() < 0.3 ? 'Rare' : 'Common'
      });
      
      if (newBaby) {
        // Save the Space Baby to the database
        await saveSpaceBaby(user?.id || effectiveWalletAddress, newBaby);
        
        // Refresh the user's collection
        await loadUserData();
        
        alert('Space Baby bred successfully!');
      }
    } catch (error) {
      console.error('Error breeding Space Babies:', error);
      alert(`Breeding failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle staking
  const handleStake = async (tokenId) => {
    try {
      setLoading(true);
      
      // Find the baby to stake
      const baby = myBabies.find(b => b.id === tokenId);
      if (!baby) {
        throw new Error('Space Baby not found');
      }
      
      // Simulate staking process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update the baby's staking status (this would be done through the blockchain in a real app)
      const updatedBabies = myBabies.map(b => {
        if (b.id === tokenId) {
          return {
            ...b,
            staked: true,
            stakedAt: new Date().toISOString()
          };
        }
        return b;
      });
      
      setMyBabies(updatedBabies);
      alert(`Space Baby #${tokenId} staked successfully!`);
    } catch (error) {
      console.error('Error staking Space Baby:', error);
      alert(`Staking failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle listing NFT for sale
  const handleListForSale = async () => {
    try {
      if (!selectedBabyId || !listingPrice) {
        alert('Please select a Space Baby and set a price');
        return;
      }
      
      setLoading(true);
      
      // Find the baby to list
      const baby = myBabies.find(b => b.id === selectedBabyId);
      if (!baby) {
        throw new Error('Space Baby not found');
      }
      
      // Simulate listing process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update the baby's listing status (this would be done through the blockchain in a real app)
      const updatedBabies = myBabies.map(b => {
        if (b.id === selectedBabyId) {
          return {
            ...b,
            listed: true,
            listPrice: listingPrice,
            listedAt: new Date().toISOString()
          };
        }
        return b;
      });
      
      setMyBabies(updatedBabies);
      alert(`Space Baby #${selectedBabyId} listed for ${listingPrice} ETH!`);
      
      // Reset form fields
      setSelectedBabyId('');
      setListingPrice('');
    } catch (error) {
      console.error('Error listing Space Baby for sale:', error);
      alert(`Listing failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle baby card click
  const handleBabyClick = (baby) => {
    setSelectedBaby(baby);
    // Navigate to baby detail page or show modal
  };
  
  // Render the collection tab
  const renderCollection = () => {
    if (myBabies.length === 0) {
      return (
        <Card>
          <h3 style={{ textAlign: 'center' }}>No Space Babiez found in your collection</h3>
          <p style={{ textAlign: 'center', marginBottom: '2rem' }}>Mint your first Space Baby to start your collection!</p>
          <Button onClick={handleMintBaby} style={{ maxWidth: '300px', margin: '0 auto', display: 'block' }}>
            Mint First Space Baby
          </Button>
        </Card>
      );
    }
    
    return (
      <Card>
        <h2>Your Space Babiez Collection</h2>
        <Grid>
          {myBabies.map(baby => (
            <BabyCard key={baby.id} onClick={() => handleBabyClick(baby)}>
              <BabyImage>
                <img 
                  src={baby.image || baby.image_url || 'https://i.postimg.cc/HswdNhLx/image-10.png'} 
                  alt={baby.name || `Space Baby #${baby.id}`} 
                />
              </BabyImage>
              <BabyContent>
                <BabyName>{baby.name || `Space Baby #${baby.id}`}</BabyName>
                <BabyInfo>
                  <p><span className="rarity">{baby.rarity || 'Common'}</span></p>
                  <p>Level: {baby.level || 1}</p>
                  {baby.staked && <p>Staked: Yes</p>}
                </BabyInfo>
                <ButtonGroup>
                  <Button onClick={(e) => { e.stopPropagation(); handleGrowUp(baby.id); }}>
                    Level Up
                  </Button>
                  {!baby.staked && (
                    <Button onClick={(e) => { e.stopPropagation(); handleStake(baby.id); }}>
                      Stake
                    </Button>
                  )}
                </ButtonGroup>
              </BabyContent>
            </BabyCard>
          ))}
        </Grid>
      </Card>
    );
  };
  
  // Render the mint tab
  const renderMint = () => (
    <Card>
      <h2>Mint Space Baby</h2>
      <p style={{ textAlign: 'center', marginBottom: '2rem' }}>
        Create a new Space Baby NFT and add it to your collection
      </p>
      
      <Button 
        onClick={handleMintBaby} 
        style={{ maxWidth: '300px', margin: '0 auto', display: 'block' }}
      >
        Mint Space Baby
      </Button>
    </Card>
  );
  
  // Render the breed tab
  const renderBreed = () => (
    <Card>
      <h2>Breed Space Babiez</h2>
      <p style={{ textAlign: 'center', marginBottom: '2rem' }}>
        Combine two Space Babiez to create a new one with inherited traits
      </p>
      
      <Form>
        <InputGroup>
          <label>Parent 1:</label>
          <select 
            value={parent1Id} 
            onChange={(e) => setParent1Id(e.target.value)}
            disabled={myBabies.length < 2}
          >
            <option value="">Select Space Baby</option>
            {myBabies.map(baby => (
              <option key={baby.id} value={baby.id}>
                {baby.name || `Space Baby #${baby.id}`}
              </option>
            ))}
          </select>
        </InputGroup>
        
        <InputGroup>
          <label>Parent 2:</label>
          <select 
            value={parent2Id} 
            onChange={(e) => setParent2Id(e.target.value)}
            disabled={myBabies.length < 2}
          >
            <option value="">Select Space Baby</option>
            {myBabies.map(baby => (
              <option key={baby.id} value={baby.id}>
                {baby.name || `Space Baby #${baby.id}`}
              </option>
            ))}
          </select>
        </InputGroup>
        
        <Button 
          onClick={handleBreed} 
          disabled={!parent1Id || !parent2Id || parent1Id === parent2Id || myBabies.length < 2}
        >
          {myBabies.length < 2 ? 'Need at least 2 Space Babiez' : 'Breed Space Babiez'}
        </Button>
      </Form>
    </Card>
  );
  
  // Render the marketplace tab
  const renderMarketplace = () => (
    <Card>
      <h2>List Space Baby for Sale</h2>
      <p style={{ textAlign: 'center', marginBottom: '2rem' }}>
        List your Space Baby on the marketplace for other guardians to purchase
      </p>
      
      <Form>
        <InputGroup>
          <label>Select Space Baby:</label>
          <select 
            value={selectedBabyId} 
            onChange={(e) => setSelectedBabyId(e.target.value)}
            disabled={myBabies.length === 0}
          >
            <option value="">Select Space Baby</option>
            {myBabies.filter(baby => !baby.listed && !baby.staked).map(baby => (
              <option key={baby.id} value={baby.id}>
                {baby.name || `Space Baby #${baby.id}`} ({baby.rarity || 'Common'})
              </option>
            ))}
          </select>
        </InputGroup>
        
        <InputGroup>
          <label>Price (ETH):</label>
          <input 
            type="number" 
            step="0.01" 
            min="0.01"
            placeholder="Enter price in ETH" 
            value={listingPrice} 
            onChange={(e) => setListingPrice(e.target.value)}
            disabled={!selectedBabyId}
          />
        </InputGroup>
        
        <Button 
          onClick={handleListForSale} 
          disabled={!selectedBabyId || !listingPrice || myBabies.length === 0}
        >
          List for Sale
        </Button>
      </Form>
    </Card>
  );
  
  // Render the contract interaction tab
  const renderContractInteraction = () => (
    <ContractInteraction />
  );
  
  // Modify the wallet not connected view to use our improved connect function
  if (!isWalletReady) {
    return (
      <ManagerContainer>
        <Header>
          <h1>Space Babiez Manager</h1>
          <p>Connect your wallet to manage your Space Babiez collection</p>
        </Header>
        
        <NoWalletMessage>
          <h3>Wallet Not Connected</h3>
          <p>To access your Space Babiez collection and interact with the contracts, please connect your wallet first.</p>
          <p>Status: {contextWalletConnected || localWalletConnected ? "Connected but waiting for address" : "Not connected"}</p>
          <WalletButton onClick={handleConnectWallet}>
            Connect Wallet
          </WalletButton>
        </NoWalletMessage>
      </ManagerContainer>
    );
  }
  
  return (
    <ManagerContainer>
      <Header>
        <h1>Space Babiez Manager</h1>
        <p>Manage your Space Babiez collection, mint new NFTs, breed, stake, and more</p>
        
        {isWalletReady && effectiveWalletAddress && (
          <div style={{ marginTop: '1rem' }}>
            <p>Connected Wallet: {effectiveWalletAddress.substring(0, 6)}...{effectiveWalletAddress.substring(effectiveWalletAddress.length - 4)}</p>
            <p>ASTROMILK Balance: {astroMilkBalance}</p>
          </div>
        )}
      </Header>
      
      <TabsContainer>
        <Tab active={activeTab === 'collection'} onClick={() => setActiveTab('collection')}>
          My Collection
        </Tab>
        <Tab active={activeTab === 'mint'} onClick={() => setActiveTab('mint')}>
          Mint
        </Tab>
        <Tab active={activeTab === 'breed'} onClick={() => setActiveTab('breed')}>
          Breed
        </Tab>
        <Tab active={activeTab === 'marketplace'} onClick={() => setActiveTab('marketplace')}>
          Marketplace
        </Tab>
        <Tab active={activeTab === 'contracts'} onClick={() => setActiveTab('contracts')}>
          Contracts
        </Tab>
      </TabsContainer>
      
      {loading ? (
        <LoadingOverlay>
          <div className="spinner"></div>
          <p>Loading...</p>
        </LoadingOverlay>
      ) : (
        <>
          {activeTab === 'collection' && renderCollection()}
          {activeTab === 'mint' && renderMint()}
          {activeTab === 'breed' && renderBreed()}
          {activeTab === 'marketplace' && renderMarketplace()}
          {activeTab === 'contracts' && renderContractInteraction()}
        </>
      )}
    </ManagerContainer>
  );
}

export default SpaceBabiezManager;
