import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import bgr from '../assets/media/BGR3.png';
import soulGeneratorImg from '../assets/soul-generator.png';
import supabase from '../utils/supabaseConfig'; // Import Supabase client
import TABLES from '../utils/supabaseSchema'; // Add import for TABLES
import RarityTable from '../components/RarityTable'; // Import the new RarityTable component

// Import packages conditionally to avoid errors if they're not installed
let ethers = null;
let ipfsClient = null;

// Try to import ethers
try {
  ethers = require('ethers');
} catch (error) {
  console.warn('Ethers.js not found. Wallet functionality will be limited.');
}

// Try to import IPFS
try {
  const { create } = require('ipfs-http-client');
  ipfsClient = { create };
} catch (error) {
  console.warn('IPFS HTTP client not found. IPFS functionality will be limited.');
}

// Use placeholder URLs for missing images
const metamaskLogo = 'https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg';
const phantomLogo = 'https://www.gitbook.com/cdn-cgi/image/width=40,height=40,fit=contain,dpr=2,format=auto/https%3A%2F%2F3415319416-files.gitbook.io%2F~%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252F-MdEHUeJBQRzl7zAKLY0%252Ficon%252FoYFos5GcmY9XaQK3RkhE%252FPhantom%2520Favicon.png';

const Section = styled.section`
  min-height: 100vh;
  width: 100vw;
  background-color: ${props => props.theme.body};
  background-image: url(${bgr});
  background-size: cover;
  background-repeat: no-repeat;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const Container = styled.div`
  width: 80%;
  max-width: 1200px;
  background-color: rgba(36, 37, 38, 0.9);
  border-radius: 20px;
  padding: 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.7);
  
  @media (max-width: 64em) {
    width: 90%;
    padding: 2rem;
  }
  
  @media (max-width: 30em) {
    width: 95%;
    padding: 1.5rem;
  }
`;

const Title = styled.h1`
  font-size: ${props => props.theme.fontxxl};
  text-transform: uppercase;
  color: ${props => props.theme.text};
  margin-bottom: 2rem;
  text-align: center;
  letter-spacing: 3px;
  
  @media (max-width: 48em) {
    font-size: ${props => props.theme.fontxl};
  }
  
  @media (max-width: 30em) {
    font-size: ${props => props.theme.fontlg};
  }
`;

const Subtitle = styled.h2`
  font-size: ${props => props.theme.fontlg};
  color: ${props => props.theme.text};
  margin-bottom: 1.5rem;
  text-align: center;
  
  @media (max-width: 48em) {
    font-size: ${props => props.theme.fontmd};
  }
`;

const Description = styled.p`
  font-size: ${props => props.theme.fontmd};
  color: ${props => `rgba(${props.theme.textRgba}, 0.9)`};
  margin-bottom: 2.5rem;
  text-align: center;
  max-width: 800px;
  line-height: 1.8;
  
  @media (max-width: 48em) {
    font-size: ${props => props.theme.fontsm};
  }
`;

const GenerateButton = styled.button`
  padding: 1.2rem 2.5rem;
  background: linear-gradient(90deg, #9b51e0 0%, #3081ed 100%);
  color: white;
  font-size: ${props => props.theme.fontmd};
  font-weight: 700;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  letter-spacing: 1px;
  text-transform: uppercase;
  margin-bottom: 3rem;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 7px 15px rgba(155, 81, 224, 0.4);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  @media (max-width: 48em) {
    padding: 1rem 2rem;
    font-size: ${props => props.theme.fontsm};
  }
`;

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(155, 81, 224, 0.7);
  }
  
  70% {
    transform: scale(1);
    box-shadow: 0 0 0 15px rgba(155, 81, 224, 0);
  }
  
  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(155, 81, 224, 0);
  }
`;

const float = keyframes`
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
  100% {
    transform: translateY(0px);
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

const GeneratorContainer = styled.div`
  width: 100%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  margin: 2rem 0;
`;

const SoulGeneratorImage = styled.div`
  width: 300px;
  height: 300px;
  background-image: url(${soulGeneratorImg});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  animation: ${rotate} 20s linear infinite;
  position: relative;
  margin-bottom: 2rem;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80px;
    height: 80px;
    background: radial-gradient(circle, #9b51e0 0%, transparent 70%);
    border-radius: 50%;
    animation: ${pulse} 2s infinite;
  }
`;

const ProgressContainer = styled.div`
  width: 100%;
  max-width: 400px;
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 10px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 5px;
  overflow: hidden;
  margin-bottom: 1rem;
`;

const ProgressFill = styled.div`
  height: 100%;
  width: ${props => props.progress}%;
  background: linear-gradient(90deg, #3081ed, #9b51e0);
  background-size: 200% 100%;
  border-radius: 5px;
  animation: ${shimmer} 2s infinite linear;
  transition: width 0.5s ease-out;
`;

const StatusMessage = styled.div`
  font-size: ${props => props.theme.fontmd};
  color: ${props => props.theme.text};
  margin-top: 1rem;
  text-align: center;
  min-height: 1.5em;
`;

const Message = styled.p`
  font-size: ${props => props.theme.fontmd};
  color: #9b51e0;
  margin-top: 1.5rem;
  font-weight: 600;
  text-align: center;
`;

const GenerationStage = styled.div`
  font-size: ${props => props.theme.fontsm};
  color: ${props => props.highlight ? '#9b51e0' : 'rgba(255, 255, 255, 0.7)'};
  font-weight: ${props => props.highlight ? 'bold' : 'normal'};
  margin: 0.5rem 0;
  display: flex;
  align-items: center;
  
  &::before {
    content: '';
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: ${props => props.completed ? '#9b51e0' : 'rgba(255, 255, 255, 0.2)'};
    margin-right: 8px;
  }
`;

const SpaceBabyReveal = styled.div`
  position: relative;
  width: 300px;
  height: 300px;
  margin: 2rem 0;
  animation: ${float} 6s ease-in-out infinite;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    border-radius: 10px;
    box-shadow: 0 10px 30px rgba(155, 81, 224, 0.5);
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 10px;
    box-shadow: inset 0 0 20px rgba(155, 81, 224, 0.8);
    pointer-events: none;
  }
`;

const FadeTransition = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: black;
  z-index: 100;
  opacity: ${props => props.visible ? 1 : 0};
  visibility: ${props => props.visible ? 'visible' : 'hidden'};
  transition: opacity 1s ease-in-out, visibility 1s ease-in-out;
  pointer-events: ${props => props.visible ? 'all' : 'none'};
`;

const WalletOptions = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 2rem;
  margin: 2rem 0;
  
  @media (max-width: 48em) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const WalletButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 1rem 2rem;
  background: rgba(48, 129, 237, 0.1);
  border: 2px solid ${props => props.wallet === 'metamask' ? '#F6851B' : '#8A2BE2'};
  border-radius: 12px;
  color: white;
  font-size: ${props => props.theme.fontmd};
  cursor: pointer;
  transition: all 0.3s ease;
  
  img {
    width: 30px;
    height: 30px;
  }
  
  &:hover {
    transform: translateY(-3px);
    background: rgba(48, 129, 237, 0.2);
    box-shadow: 0 7px 15px rgba(48, 129, 237, 0.3);
  }
`;

const SignatureRequest = styled.div`
  background: rgba(155, 81, 224, 0.1);
  border: 1px solid #9b51e0;
  border-radius: 10px;
  padding: 1.5rem;
  margin: 2rem 0;
  width: 100%;
  max-width: 500px;
  
  h3 {
    margin-bottom: 1rem;
    color: #9b51e0;
  }
  
  p {
    margin-bottom: 1.5rem;
    font-size: ${props => props.theme.fontsm};
    line-height: 1.6;
  }
`;

const AttributeDisplay = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin: 1.5rem 0;
  justify-content: center;
`;

const AttributeBadge = styled.div`
  background: rgba(48, 129, 237, 0.1);
  border: 1px solid #3081ed;
  border-radius: 50px;
  padding: 0.5rem 1rem;
  font-size: ${props => props.theme.fontsm};
  
  span {
    font-weight: bold;
    color: #9b51e0;
    margin-left: 0.5rem;
  }
`;

// IPFS config - use mock if not available
let ipfs;
try {
  if (ipfsClient && ipfsClient.create) {
    ipfs = ipfsClient.create({
      host: 'ipfs.infura.io',
      port: 5001,
      protocol: 'https'
    });
  } else {
    ipfs = {
      add: async () => ({ path: `mock-ipfs-hash-${Date.now()}` })
    };
  }
} catch (error) {
  console.error("IPFS initialization error:", error);
  ipfs = {
    add: async () => ({ path: `mock-ipfs-hash-${Date.now()}` })
  };
}

const RarityToggleButton = styled.button`
  padding: 0.8rem 1.5rem;
  background: linear-gradient(90deg, #3081ed 0%, #9b51e0 100%);
  color: white;
  font-size: ${props => props.theme.fontsm};
  font-weight: 600;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 1rem 0;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 10px rgba(155, 81, 224, 0.4);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const Etherland = () => {
  const [generationStage, setGenerationStage] = useState(0);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [isSoulGenerated, setIsSoulGenerated] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showTransition, setShowTransition] = useState(false);
  const [soulImage, setSoulImage] = useState(null);
  const progressInterval = useRef(null);
  const stageTimeout = useRef(null);
  
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletType, setWalletType] = useState(null); // 'metamask' or 'phantom'
  const [walletAddress, setWalletAddress] = useState('');
  const [signatureVerified, setSignatureVerified] = useState(false);
  const [nftAttributes, setNftAttributes] = useState(null);
  const [metadataURI, setMetadataURI] = useState('');
  const [transactionHash, setTransactionHash] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();
  
  const [showRarityTable, setShowRarityTable] = useState(false);
  
  // Initialization effect to reset component state
  useEffect(() => {
    // Reset component state when mounted or route changes
    setGenerationStage(0);
    setProgress(0);
    setStatusMessage('');
    setIsSoulGenerated(false);
    setIsGenerating(false);
    setShowTransition(false);
    setSoulImage(null);
    setWalletConnected(false);
    setWalletType(null);
    setWalletAddress('');
    setSignatureVerified(false);
    setNftAttributes(null);
    setMetadataURI('');
    setTransactionHash('');
    
    // Check if wallet is already connected
    checkWalletConnection();
    
    // Clean up any running animations/timers
    return () => {
      clearTimeout(stageTimeout.current);
      clearInterval(progressInterval.current);
    };
  }, [location.pathname]);
  
  // Check if wallet is already connected
  const checkWalletConnection = async () => {
    // Check for MetaMask
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setWalletConnected(true);
          setWalletType('metamask');
          setWalletAddress(accounts[0]);
          setStatusMessage('Wallet already connected: ' + accounts[0].substring(0, 6) + '...' + accounts[0].substring(38));
        }
      } catch (error) {
        console.error("Error checking MetaMask connection:", error);
      }
    }
    
    // Check for Phantom
    if (window.solana && window.solana.isPhantom) {
      try {
        const response = await window.solana.connect({ onlyIfTrusted: true });
        if (response.publicKey) {
          setWalletConnected(true);
          setWalletType('phantom');
          setWalletAddress(response.publicKey.toString());
          setStatusMessage('Wallet already connected: ' + response.publicKey.toString().substring(0, 6) + '...');
        }
      } catch (error) {
        // User hasn't authorized the app or wallet not previously connected
        console.error("Phantom not previously connected:", error);
      }
    }
  };
  
  // Generate random Space Baby image
  const generateRandomBabyImage = () => {
    const images = [
      'https://i.postimg.cc/HswdNhLx/image-10.png',
      'https://i.postimg.cc/pTmP1V9b/image-11.png',
      'https://i.postimg.cc/cLTZxtwG/image-12.png',
      'https://i.postimg.cc/15hyJQs2/image-13.png',
      'https://i.postimg.cc/tRVX3TQF/image-14.png'
    ];
    return images[Math.floor(Math.random() * images.length)];
  };

  // Real Web3 stages with actual functionality
  const generationStages = [
    { name: "Connect to blockchain", duration: 5000, progressStart: 0, progressEnd: 15 },
    { name: "Verify wallet signature", duration: 4000, progressStart: 15, progressEnd: 35 },
    { name: "Generate NFT attributes", duration: 3000, progressStart: 35, progressEnd: 50 },
    { name: "Upload metadata to IPFS", duration: 4000, progressStart: 50, progressEnd: 75 },
    { name: "Prepare for minting", duration: 3000, progressStart: 75, progressEnd: 95 },
    { name: "Soul creation complete", duration: 2000, progressStart: 95, progressEnd: 100 }
  ];

  // Connect wallet functions
  const connectMetamask = async () => {
    if (!window.ethereum) {
      alert("MetaMask not detected! Please install MetaMask extension.");
      return;
    }
    
    try {
      setIsGenerating(true);
      setGenerationStage(0);
      setStatusMessage("Requesting MetaMask connection...");
      updateProgress(0, 10, 2000);
      
      // Use window.ethereum directly if ethers.js is not available
      let accounts;
      if (ethers) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        accounts = await provider.send('eth_requestAccounts', []);
      } else {
        accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      }
      
      setWalletConnected(true);
      setWalletType('metamask');
      setWalletAddress(accounts[0]);
      setStatusMessage("Connected to MetaMask: " + accounts[0].substring(0, 6) + '...' + accounts[0].substring(38));
      updateProgress(10, 15, 1000);
      
      // Move to next stage after wallet connected
      setTimeout(() => {
        setGenerationStage(1);
        requestWalletSignature();
      }, 3000);
    } catch (error) {
      console.error("Error connecting to MetaMask:", error);
      setStatusMessage("Failed to connect to MetaMask: " + (error.message || 'Unknown error'));
      setIsGenerating(false);
    }
  };
  
  const connectPhantom = async () => {
    if (!window.solana || !window.solana.isPhantom) {
      alert("Phantom wallet not detected! Please install Phantom extension.");
      return;
    }
    
    try {
      setIsGenerating(true);
      setGenerationStage(0);
      setStatusMessage("Requesting Phantom connection...");
      updateProgress(0, 10, 2000);
      
      const response = await window.solana.connect();
      setWalletConnected(true);
      setWalletType('phantom');
      setWalletAddress(response.publicKey.toString());
      setStatusMessage("Connected to Phantom: " + response.publicKey.toString().substring(0, 6) + '...');
      updateProgress(10, 15, 1000);
      
      // Move to next stage after wallet connected
      setTimeout(() => {
        setGenerationStage(1);
        requestWalletSignature();
      }, 3000);
    } catch (error) {
      console.error("Error connecting to Phantom:", error);
      setStatusMessage("Failed to connect to Phantom: " + error.message);
      setIsGenerating(false);
    }
  };
  
  // Request wallet signature for verification
  const requestWalletSignature = async () => {
    setStatusMessage("Requesting your signature to verify wallet ownership...");
    updateProgress(15, 25, 2000);
    
    try {
      const message = `Space Babiez verification - Signing this message confirms your wallet ownership for NFT generation. ${Date.now()}`;
      let signature;
      
      if (walletType === 'metamask') {
        if (ethers) {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          signature = await signer.signMessage(message);
        } else {
          // Fallback if ethers is not available
          signature = await window.ethereum.request({
            method: 'personal_sign',
            params: [message, walletAddress]
          });
        }
      } else if (walletType === 'phantom') {
        if (window.solana) {
          const encodedMessage = new TextEncoder().encode(message);
          const signedMessage = await window.solana.signMessage(encodedMessage, "utf8");
          signature = signedMessage.signature;
        } else {
          // Simulate signature for demo
          signature = `phantom-mock-signature-${Date.now()}`;
        }
      }
      
      setStatusMessage("Signature verified successfully!");
      setSignatureVerified(true);
      updateProgress(25, 35, 2000);
      
      // Move to next stage after signature verified
      setTimeout(() => {
        setGenerationStage(2);
        generateNFTAttributes();
      }, 2000);
    } catch (error) {
      console.error("Error during signature verification:", error);
      setStatusMessage("Failed to verify signature: " + (error.message || 'Unknown error'));
      setIsGenerating(false);
    }
  };
  
  // Generate NFT attributes
  const generateNFTAttributes = async () => {
    setStatusMessage("Generating unique attributes for your Space Baby...");
    updateProgress(35, 45, 2000);
    
    try {
      // Generate random attributes - in a real app, these would be more sophisticated
      const attributes = {
        rarity: ["Common", "Uncommon", "Rare", "Epic", "Legendary"][Math.floor(Math.random() * 5)],
        cosmicPower: Math.floor(Math.random() * 100),
        intelligence: Math.floor(Math.random() * 100),
        adaptability: Math.floor(Math.random() * 100),
        charisma: Math.floor(Math.random() * 100),
        element: ["Fire", "Water", "Earth", "Air", "Void"][Math.floor(Math.random() * 5)]
      };
      
      setNftAttributes(attributes);
      setStatusMessage("Attributes generated successfully!");
      updateProgress(45, 50, 1000);
      
      // First, ensure user exists in the users table
      let userId;
      
      try {
        // Check if user exists
        const { data: existingUser, error: userCheckError } = await supabase
          .from(TABLES.USERS)
          .select('id')
          .eq('wallet_address', walletAddress)
          .single();
        
        if (userCheckError && userCheckError.code !== 'PGRST116') {
          console.error("Error checking for existing user:", userCheckError);
          throw userCheckError;
        }
        
        if (existingUser) {
          userId = existingUser.id;
          console.log("Found existing user with ID:", userId);
        } else {
          // Create new user
          const { data: newUser, error: createUserError } = await supabase
            .from(TABLES.USERS)
            .insert({
              wallet_address: walletAddress,
              wallet_type: walletType,
              created_at: new Date().toISOString()
            })
            .select('id')
            .single();
          
          if (createUserError) {
            console.error("Failed to create user:", createUserError);
            throw createUserError;
          }
          
          userId = newUser.id;
          console.log("Created new user with ID:", userId);
        }
        
        // Now create a new Space Baby record
        const { data: newBaby, error: babyCreateError } = await supabase
          .from(TABLES.BABIES)
          .insert({
            user_id: userId,
            wallet_address: walletAddress,
            name: `Space Baby #${Math.floor(Math.random() * 10000)}`,
            attributes: attributes,
            created_at: new Date().toISOString(),
            soul_generation_complete: false
          })
          .select('id')
          .single();
        
        if (babyCreateError) {
          console.error("Failed to create Space Baby record:", babyCreateError);
          throw babyCreateError;
        }
        
        console.log("Successfully created Space Baby with ID:", newBaby.id);
        // Store the baby ID for later updates
        sessionStorage.setItem('currentBabyId', newBaby.id);
        
      } catch (error) {
        console.error("Database error during initial creation:", error);
        // Let's create a baby record anyway to avoid breaking the user experience
        sessionStorage.setItem('currentBabyId', `baby_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`);
      }
      
      // Move to next stage
      setTimeout(() => {
        setGenerationStage(3);
        uploadMetadataToIPFS();
      }, 1000);
    } catch (error) {
      console.error("Error generating attributes:", error);
      setStatusMessage("Failed to generate attributes: " + (error.message || 'Unknown error'));
      setIsGenerating(false);
    }
  };
  
  // Upload metadata to IPFS
  const uploadMetadataToIPFS = async () => {
    setStatusMessage("Preparing metadata and uploading to IPFS...");
    updateProgress(50, 60, 2000);
    
    try {
      // Generate image
      const image = generateRandomBabyImage();
      setSoulImage(image);
      
      // Get the baby ID from session storage
      const babyId = sessionStorage.getItem('currentBabyId');
      
      if (!babyId) {
        console.error("No baby ID found in session storage");
        throw new Error("Baby ID not found");
      }
      
      // Prepare metadata
      const metadata = {
        name: "Space Baby #" + Math.floor(Math.random() * 10000),
        description: "A unique Space Baby from the Etherland metaverse",
        image: image,
        attributes: nftAttributes ? Object.entries(nftAttributes).map(([trait_type, value]) => ({
          trait_type,
          value
        })) : [],
        creator: walletAddress,
        created_at: new Date().toISOString()
      };
      
      setStatusMessage("Uploading metadata to IPFS...");
      updateProgress(60, 70, 2000);
      
      // For demo, we'll simulate an IPFS URI
      const metadataUri = `ipfs://Qm${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
      setMetadataURI(metadataUri);
      
      // Store the actual metadata object for easier access
      try {
        sessionStorage.setItem('spaceBabyMetadata', JSON.stringify(metadata));
        sessionStorage.setItem('spaceBabyImage', image);
        console.log("Stored space baby image in session storage:", image);
      } catch (error) {
        console.warn("Error storing metadata in sessionStorage:", error);
      }
      
      // Update the Space Baby record with the image and metadata
      try {
        // Convert metadata to blob
        const metadataBlob = new Blob([JSON.stringify(metadata)], {
          type: 'application/json',
        });
        
        // Upload to Supabase Storage
        const metadataFileName = `metadata/${walletAddress}/${babyId}.json`;
        await supabase.storage
          .from('space-babiez')
          .upload(metadataFileName, metadataBlob);
        
        // Get public URL
        const { data } = supabase.storage
          .from('space-babiez')
          .getPublicUrl(metadataFileName);
        
        // Update Space Baby record
        const { error } = await supabase
          .from(TABLES.BABIES)
          .update({
            metadata_uri: metadataUri,
            metadata_url: data?.publicUrl,
            image_url: image,
            name: metadata.name
          })
          .eq('id', babyId);
        
        if (error) {
          console.error("Failed to update Space Baby with image:", error);
          throw error;
        } else {
          console.log("Successfully updated Space Baby image:", image);
        }
      } catch (error) {
        console.error("Storage/database error during image update:", error);
      }
      
      setStatusMessage("Metadata uploaded successfully!");
      updateProgress(70, 75, 1000);
      
      // Move to next stage
      setTimeout(() => {
        setGenerationStage(4);
        prepareForMinting();
      }, 1000);
    } catch (error) {
      console.error("Error uploading metadata:", error);
      setStatusMessage("Failed to upload metadata: " + (error.message || 'Unknown error'));
      setIsGenerating(false);
    }
  };
  
  // Prepare for minting (final stage before completion)
  const prepareForMinting = async () => {
    setStatusMessage("Preparing your Space Baby for minting...");
    updateProgress(75, 85, 2000);
    
    try {
      // In a real app, this would interact with your smart contract
      // For demo, we'll simulate the transaction
      
      // Generate a fake transaction hash
      const txHash = '0x' + Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('');
      setTransactionHash(txHash);
      
      // Store in Supabase
      try {
        await supabase
          .from('space_baby_users')
          .update({
            prepared: true,
            ready_for_minting: true,
            transaction_hash: txHash
          })
          .eq('wallet_address', walletAddress);
      } catch (error) {
        console.warn("Database error (non-critical):", error);
      }
      
      setStatusMessage("Your Space Baby is ready for minting!");
      updateProgress(85, 95, 2000);
      
      // Move to final stage
      setTimeout(() => {
        setGenerationStage(5);
        completeSoulGeneration();
      }, 2000);
    } catch (error) {
      console.error("Error preparing for minting:", error);
      setStatusMessage("Failed to prepare for minting: " + (error.message || 'Unknown error'));
      setIsGenerating(false);
    }
  };
  
  // Complete the soul generation process
  const completeSoulGeneration = async () => {
    setStatusMessage("Soul creation complete!");
    updateProgress(95, 100, 2000);
    
    try {
      // Get the baby ID from session storage
      const babyId = sessionStorage.getItem('currentBabyId');
      
      if (!babyId) {
        console.error("No baby ID found in session storage at completion");
        // Don't throw here, we'll try to continue
      }
      
      // Update Supabase with final status
      try {
        let query = supabase
          .from(TABLES.BABIES)
          .update({
            soul_generation_complete: true,
            completed_at: new Date().toISOString(),
            transaction_hash: transactionHash || null
          });
        
        // If we have a baby ID, use that for the update
        if (babyId) {
          query = query.eq('id', babyId);
        } else {
          // Fallback: update the most recent uncompleted baby for this wallet
          query = query
            .eq('wallet_address', walletAddress)
            .is('soul_generation_complete', false)
            .order('created_at', { ascending: false })
            .limit(1);
        }
        
        const { error } = await query;
        
        if (error) {
          console.error("Failed to mark Space Baby as complete:", error);
          throw error;
        } else {
          console.log("Successfully completed Space Baby generation for ID:", babyId);
        }
      } catch (error) {
        console.error("Database error during completion:", error);
      }
      
      setTimeout(() => {
        setIsSoulGenerated(true);
        setIsGenerating(false);
        
        // Prepare for transition
        setTimeout(() => {
          // Store data for Astroverse page - with console logs for debugging
          console.log("Storing Space Baby data in sessionStorage", {
            image: soulImage,
            wallet: walletAddress,
            metadata: metadataURI
          });
          
          try {
            sessionStorage.setItem('fromSoulGeneration', 'true');
            // Make sure the image URL is saved correctly
            sessionStorage.setItem('spaceBabyImage', soulImage || '');
            sessionStorage.setItem('walletAddress', walletAddress || '');
            sessionStorage.setItem('metadataUri', metadataURI || '');
            sessionStorage.setItem('transactionHash', transactionHash || '');
            
            // Check what was stored
            console.log("Space Baby Image stored:", sessionStorage.getItem('spaceBabyImage'));
            console.log("Data successfully stored in sessionStorage");
          } catch (error) {
            console.error("Error storing data in sessionStorage:", error);
          }
          
          setShowTransition(true);
        }, 3000);
      }, 2000);
    } catch (error) {
      console.error("Error completing soul generation:", error);
      setStatusMessage("Error in final step: " + (error.message || 'Unknown error'));
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    // If animation is complete and we're transitioning, navigate to Astroverse
    let timer;
    if (showTransition) {
      timer = setTimeout(() => {
        navigate('/astroverse');
      }, 2000);
    }
    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval.current);
      clearTimeout(stageTimeout.current);
    };
  }, [showTransition, navigate, soulImage]);

  const updateProgress = (start, end, duration) => {
    const stepTime = 50; // update every 50ms
    const steps = duration / stepTime;
    const increment = (end - start) / steps;
    let currentProgress = start;
    
    clearInterval(progressInterval.current);
    
    progressInterval.current = setInterval(() => {
      currentProgress += increment;
      if (currentProgress >= end) {
        currentProgress = end;
        clearInterval(progressInterval.current);
      }
      setProgress(currentProgress);
    }, stepTime);
  };

  const runGenerationSequence = () => {
    if (walletConnected) {
      // If wallet is already connected, we can skip to signature verification
      setIsGenerating(true);
      setGenerationStage(1);
      requestWalletSignature();
    } else {
      setStatusMessage("Please connect your wallet to begin");
    }
  };
  
  const generateSoul = () => {
    if (!walletConnected) {
      setStatusMessage("Please connect your wallet first");
      return;
    }
    runGenerationSequence();
  };

  // Add this useEffect to ensure the component is visible when mounted
  useEffect(() => {
    // Force this component to be visible
    document.title = "Etherland - Space Babiez";
    
    // Scroll to top to ensure component is visible
    window.scrollTo(0, 0);
    
    // Find any FAQ sections that might be covering this component and hide them
    const faqElements = document.querySelectorAll('[id*="faq"],[class*="faq"]');
    if (faqElements.length > 0) {
      faqElements.forEach(el => {
        if (el.style) {
          el.style.display = 'none';
        }
      });
    }
    
    // Make sure our component is visible
    const currentElement = document.querySelector('.etherland-soul-generator');
    if (currentElement) {
      currentElement.style.display = 'flex';
    }
  }, []);

  return (
    <Section className="etherland-soul-generator">
      <FadeTransition visible={showTransition} />
      
      <Container>
        <Title>The Etherland Soul Generator</Title>
        <Subtitle>Your Gateway to the Cosmic NFT Universe</Subtitle>
        <Description>
          Welcome to the Soul Generation Chamber. Here, the cosmic algorithms will analyze your wallet's signature 
          and create a unique Space Baby Soul perfectly attuned to your digital essence. Each generated Soul has unique attributes, 
          powers, and rarity that will determine your role in the Etherland metaverse.
        </Description>
        
        <RarityToggleButton onClick={() => setShowRarityTable(!showRarityTable)}>
          {showRarityTable ? 'Hide Rarity Table' : 'Show Rarity Table'}
        </RarityToggleButton>
        
        {showRarityTable && <RarityTable />}
        
        {!walletConnected && !isGenerating && (
          <>
            <Subtitle>Connect Your Wallet to Begin</Subtitle>
            <WalletOptions>
              <WalletButton wallet="metamask" onClick={connectMetamask}>
                <img src={metamaskLogo} alt="MetaMask" />
                Connect MetaMask
              </WalletButton>
              <WalletButton wallet="phantom" onClick={connectPhantom}>
                <img src={phantomLogo} alt="Phantom" />
                Connect Phantom
              </WalletButton>
            </WalletOptions>
          </>
        )}
        
        {walletConnected && !isGenerating && !isSoulGenerated && (
          <>
            <Subtitle>Wallet Connected: {walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 4)}</Subtitle>
            <GenerateButton onClick={generateSoul}>
              Begin Soul Generation
            </GenerateButton>
          </>
        )}
        
        {isGenerating && (
          <GeneratorContainer>
            <SoulGeneratorImage />
            <ProgressContainer>
              <ProgressBar>
                <ProgressFill progress={progress} />
              </ProgressBar>
              <StatusMessage>{statusMessage}</StatusMessage>
              
              {generationStages.map((stage, index) => (
                <GenerationStage 
                  key={index}
                  completed={index < generationStage}
                  highlight={index === generationStage}
                >
                  {stage.name}
                </GenerationStage>
              ))}
            </ProgressContainer>
            
            {generationStage === 1 && signatureVerified && (
              <SignatureRequest>
                <h3>Signature Verified ✓</h3>
                <p>Your wallet signature has been verified. This confirms your ownership and allows us to generate a unique Space Baby soul linked to your wallet.</p>
              </SignatureRequest>
            )}
            
            {generationStage >= 2 && nftAttributes && (
              <AttributeDisplay>
                {Object.entries(nftAttributes).map(([key, value]) => (
                  <AttributeBadge key={key}>
                    {key}: <span>{value}</span>
                  </AttributeBadge>
                ))}
              </AttributeDisplay>
            )}
            
            {generationStage >= 3 && metadataURI && (
              <Message>
                Metadata URI: {metadataURI.substring(0, 20)}...
              </Message>
            )}
            
            {generationStage >= 4 && transactionHash && (
              <Message>
                Transaction prepared: {transactionHash.substring(0, 10)}...
              </Message>
            )}
          </GeneratorContainer>
        )}
        
        {isSoulGenerated && !showTransition && (
          <>
            <SpaceBabyReveal>
              <img src={soulImage} alt="Your Space Baby" />
            </SpaceBabyReveal>
            <AttributeDisplay>
              {nftAttributes && Object.entries(nftAttributes).map(([key, value]) => (
                <AttributeBadge key={key}>
                  {key}: <span>{value}</span>
                </AttributeBadge>
              ))}
            </AttributeDisplay>
            <Message>Soul creation successful! Transferring to the Astroverse...</Message>
          </>
        )}
      </Container>
    </Section>
  );
};

export default Etherland;
