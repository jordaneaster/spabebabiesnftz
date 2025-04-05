import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import gsap from 'gsap';
import { useNavigate } from 'react-router-dom';
// Import only Solana-related utilities
import { mintSolanaNFT, getSolanaBalance } from '../utils/solanaUtils';
import { loadSolanaWeb3 } from '../utils/solanaWeb3Helper';
import { 
  SOLANA_TESTNET, 
  NFT_PRICE_SOL 
} from '../utils/constants';
import soulGeneratorImg from '../assets/soul-generator.png';
// Import the new Space Baby service
import SpaceBabyService from '../services/SpaceBabyService';
import supabase from '../utils/supabaseConfig';
// Import the wallet state manager utilities
import { 
  isWalletConnected, 
  getWalletAddress, 
  connectPhantomWallet,
  disconnectPhantomWallet 
} from '../utils/walletStateManager';

// Update background image to a valid URL or import directly from assets
import etherlandBg from '../assets/BGR5.png'; 
// As fallback, define a solid color background
const fallbackBgColor = '#0a0a1a';

// Animations
const pulse = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
`;

const float = keyframes`
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
  100% { transform: translateY(0px) rotate(0deg); }
`;

const glowingText = keyframes`
  0% { text-shadow: 0 0 5px #aeff00, 0 0 10px #aeff00; }
  50% { text-shadow: 0 0 20px #aeff00, 0 0 30px #aeff00; }
  100% { text-shadow: 0 0 5px #aeff00, 0 0 10px #aeff00; }
`;

const rotate = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const particleFloat = keyframes`
  0% { transform: translateY(0) translateX(0); opacity: 1; }
  100% { transform: translateY(-100px) translateX(${props => Math.random() * 100 - 50}px); opacity: 0; }
`;

const breathe = keyframes`
  0% { transform: scale(0.95); box-shadow: 0 0 10px rgba(174, 255, 0, 0.3); }
  50% { transform: scale(1.05); box-shadow: 0 0 20px rgba(174, 255, 0, 0.6); }
  100% { transform: scale(0.95); box-shadow: 0 0 10px rgba(174, 255, 0, 0.3); }
`;

// Styled Components
const Section = styled.section`
  min-height: 100vh;
  width: 100vw;
  background-color: ${fallbackBgColor}; /* Fallback background color */
  background-image: url(${etherlandBg});
  background-size: cover;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    z-index: 1;
  }
`;

const Content = styled.div`
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80%;
  max-width: 1200px;
  @media (max-width: 64em) {
    width: 90%;
  }
`;

const Title = styled.h1`
  font-size: ${(props) => props.theme.fontxxl};
  text-transform: uppercase;
  color: #aeff00;
  margin-bottom: 2rem;
  font-family: 'flegrei', sans-serif;
  font-weight: 400;
  letter-spacing: 2px;
  text-align: center;
  animation: ${glowingText} 3s infinite;
  @media (max-width: 64em) {
    font-size: ${(props) => props.theme.fontxl};
  }
  @media (max-width: 48em) {
    font-size: ${(props) => props.theme.fontlg};
  }
`;

const Description = styled.p`
  font-size: ${(props) => props.theme.fontmd};
  color: ${(props) => props.theme.text};
  margin-bottom: 3rem;
  font-family: 'DIN Condensed', sans-serif;
  text-align: center;
  max-width: 800px;
  line-height: 1.5;
  @media (max-width: 48em) {
    font-size: ${(props) => props.theme.fontsm};
  }
`;

const SoulGenerationContainer = styled.div`
  background: rgba(36, 37, 38, 0.8);
  border: 2px solid #aeff00;
  border-radius: 20px;
  padding: 2rem;
  width: 100%;
  max-width: 900px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const BabyContainer = styled.div`
  width: 300px;
  height: 300px;
  margin: 1rem auto;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  @media (max-width: 48em) {
    width: 200px;
    height: 200px;
  }
`;

const BabyImage = styled.div`
  width: 220px;
  height: 220px;
  background-color: #242526;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: ${float} 6s ease-in-out infinite;
  position: relative;
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, #6c00ff, #aeff00);
    opacity: ${props => props.soulProgress / 100 * 0.8};
    mix-blend-mode: overlay;
  }
  img {
    width: 90%;
    height: 90%;
    object-fit: contain;
  }
  @media (max-width: 48em) {
    width: 180px;
    height: 180px;
  }
`;

const SoulOrb = styled.div`
  position: absolute;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  background: radial-gradient(circle, ${props => props.color} 0%, rgba(0,0,0,0) 70%);
  border-radius: 50%;
  animation: ${pulse} 2s infinite;
  opacity: 0.8;
  z-index: 5;
  pointer-events: none;
`;

// Update TraitContainer styling for better spacing
const TraitContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1.5rem; // Increased gap between cards
  margin: 2rem 0;
  width: 100%;
`;

// Enhanced TraitCard styling for better visibility
const TraitCard = styled.div`
  background: ${props => props.selected ? 'rgba(36, 50, 10, 0.9)' : 'rgba(20, 25, 30, 0.9)'};
  border: ${props => props.selected ? '2px solid #aeff00' : '1px solid rgba(174, 255, 0, 0.4)'};
  border-radius: 12px;
  padding: 1.2rem 1rem;
  width: calc(25% - 1.5rem);
  min-width: 150px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  box-shadow: ${props => props.selected ? 
    '0 0 15px rgba(174, 255, 0, 0.3), inset 0 0 10px rgba(174, 255, 0, 0.1)' : 
    '0 4px 8px rgba(0, 0, 0, 0.2)'};
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-5px);
    border-color: #aeff00;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3), 0 0 10px rgba(174, 255, 0, 0.4);
  }
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${props => props.selected ? 
      'linear-gradient(90deg, #6c00ff, #aeff00)' : 'transparent'};
  }
  
  @media (max-width: 64em) {
    width: calc(33.33% - 1.5rem);
  }
  @media (max-width: 48em) {
    width: calc(50% - 1.5rem);
  }
`;

// Enhanced TraitTitle for better visibility
const TraitTitle = styled.h3`
  font-size: ${(props) => props.theme.fontmd};
  color: ${props => props.selected ? '#aeff00' : '#ffffff'};
  margin-bottom: 0.8rem;
  font-weight: ${props => props.selected ? '700' : '600'};
  letter-spacing: 1px;
  text-shadow: ${props => props.selected ? '0 0 5px rgba(174, 255, 0, 0.5)' : 'none'};
`;

// Enhanced TraitDescription for better contrast
const TraitDescription = styled.p`
  font-size: ${(props) => props.theme.fontsm};
  color: ${props => props.selected ? '#e0e0e0' : '#aaaaaa'};
  font-weight: ${props => props.selected ? '500' : '400'};
`;

const ProgressContainer = styled.div`
  width: 100%;
  margin: 2rem 0;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 20px;
  background-color: rgba(36, 37, 38, 0.8);
  border-radius: 10px;
  overflow: hidden;
`;

const Progress = styled.div`
  height: 100%;
  width: ${props => props.progress}%;
  background: linear-gradient(90deg, #6c00ff, #aeff00);
  transition: width 0.5s ease;
`;

const Button = styled.button`
  background-color: transparent;
  border: 2px solid #aeff00;
  border-radius: 50px;
  padding: 1rem 2rem;
  color: #aeff00;
  font-size: ${(props) => props.theme.fontmd};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 2rem;
  font-family: 'flegrei', sans-serif;
  letter-spacing: 1px;
  &:hover {
    background-color: #aeff00;
    color: ${props => props.theme.body};
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const CompletionMessage = styled.div`
  opacity: ${props => props.show ? 1 : 0};
  transition: opacity 1s ease;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.8);
  border-radius: 20px;
  padding: 2rem;
  text-align: center;
  z-index: 100;
  h2 {
    font-size: ${(props) => props.theme.fontxl};
    color: #aeff00;
    margin-bottom: 1rem;
  }
  p {
    font-size: ${(props) => props.theme.fontmd};
    color: ${props => props.theme.text};
  }
`;

const SoulLoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.9);
  display: ${props => props.isLoading ? 'flex' : 'none'};
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  transition: opacity 0.5s ease;
  opacity: ${props => props.fadeOut ? 0 : 1};
`;

const LoadingTitle = styled.h2`
  color: #aeff00;
  font-size: 2.5rem;
  margin-bottom: 2rem;
  text-align: center;
  animation: ${glowingText} 3s infinite;
  font-family: 'flegrei', sans-serif;
`;

const LoadingSubtitle = styled.h3`
  color: white;
  font-size: 1.5rem;
  margin-top: 2rem;
  text-align: center;
  font-family: 'DIN Condensed', sans-serif;
`;

const SoulGenerationCircle = styled.div`
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: radial-gradient(circle, #6c00ff 0%, transparent 70%);
  position: relative;
  animation: ${breathe} 3s infinite ease-in-out;
  display: flex;
  justify-content: center;
  align-items: center;
  &:before {
    content: '';
    position: absolute;
    width: 330px;
    height: 330px;
    border-radius: 50%;
    border: 2px solid #aeff00;
    animation: ${rotate} 8s linear infinite;
  }
  &:after {
    content: '';
    position: absolute;
    width: 360px;
    height: 360px;
    border-radius: 50%;
    border: 1px dashed rgba(174, 255, 0, 0.5);
    animation: ${rotate} 12s linear infinite reverse;
  }
`;

const SoulBabyImage = styled.div`
  width: 180px;
  height: 180px;
  border-radius: 50%;
  overflow: hidden;
  background: #000;
  z-index: 2;
  box-shadow: 0 0 30px rgba(108, 0, 255, 0.8);
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

const SoulParticle = styled.div`
  position: absolute;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  background: ${props => props.color};
  border-radius: 50%;
  animation: ${particleFloat} ${props => 2 + Math.random() * 3}s ease-out forwards;
  opacity: 0.7;
  top: ${props => props.posY}%;
  left: ${props => props.posX}%;
`;

const ProgressText = styled.div`
  color: white;
  font-size: 1.5rem;
  margin-top: 1rem;
  font-family: 'DIN Condensed', sans-serif;
`;

const TransitionPortal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: radial-gradient(circle, #6c00ff 0%, #000 70%);
  display: ${props => props.show ? 'flex' : 'none'};
  justify-content: center;
  align-items: center;
  z-index: 2000;
  opacity: ${props => props.fadeIn ? 1 : 0};
  transition: opacity 1s ease;
  h2 {
    color: #aeff00;
    font-size: 3rem;
    text-align: center;
    font-family: 'flegrei', sans-serif;
    animation: ${glowingText} 3s infinite;
  }
`;

// Add this new styled component for integrated loading animation
const IntegratedLoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.95);
  display: ${props => props.show ? 'flex' : 'none'};
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  opacity: ${props => props.fadeOut ? 0 : 1};
  transition: opacity 0.5s ease;
`;

const GeneratorTitle = styled.h1`
  font-size: 2.5rem;
  text-transform: uppercase;
  color: ${props => props.theme.text};
  margin: 1rem auto;
  border-bottom: 2px solid ${props => props.theme.text};
  width: fit-content;
  text-align: center;
`;

const GeneratorImage = styled.img`
  width: 50%; /* Reduced size */
  max-width: 400px; /* Limit maximum size */
  height: auto;
  animation: pulse 2s infinite;
  margin: 0 auto;
  display: block;
  @keyframes pulse {
    0% {
      opacity: 0.6;
      transform: scale(0.98);
    }
    50% {
      opacity: 1;
      transform: scale(1.02);
    }
    100% {
      opacity: 0.6;
      transform: scale(0.98);
    }
  }
  @media (max-width: 768px) {
    width: 70%;
  }
`;

const GeneratorProgressBar = styled.div`
  width: 50%;
  max-width: 400px;
  height: 20px;
  background-color: #1a1a1a;
  border-radius: 10px;
  margin: 2rem auto;
  overflow: hidden;
  @media (max-width: 768px) {
    width: 70%;
  }
`;

// Replace the GeneratorProgress styled component with a more reliable implementation
const GeneratorProgress = styled.div`
  height: 100%;
  width: ${props => Math.max(props.width, 1)}%;
  background-color: #00ff9d;
  border-radius: 10px;
  transition: width 0.3s ease-in-out;
  position: relative;
  display: block !important;
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, #00ff9d, #23ff6c);
    border-radius: 10px;
    opacity: 1;
  }
`;

const GeneratorText = styled.p`
  font-size: 1.2rem;
  color: ${props => props.theme.text};
  margin: 1rem 0;
  text-align: center;
`;

// Add new styled components for Web3 integration
const WalletInfoContainer = styled.div`
  background: rgba(36, 37, 38, 0.9);
  border-radius: 10px;
  padding: 1rem;
  margin: 1rem 0;
  text-align: center;
  border: 1px solid ${props => props.error ? '#ff4242' : '#aeff00'};
`;

const WalletAddressDisplay = styled.p`
  color: #aeff00;
  font-size: ${props => props.theme.fontsm};
  margin: 0.5rem 0;
`;

const BalanceDisplay = styled.p`
  color: white;
  font-size: ${props => props.theme.fontsm};
  margin: 0.5rem 0;
  span {
    color: #aeff00;
    font-weight: bold;
  }
`;

const TransactionLink = styled.a`
  color: #aeff00;
  text-decoration: underline;
  margin-top: 0.8rem;
  display: inline-block;
  &:hover {
    color: white;
  }
`;

const MintingIndicator = styled.div`
  margin: 1rem auto;
  padding: 0.8rem;
  background: rgba(174, 255, 0, 0.15);
  border-radius: 8px;
  color: #aeff00;
  max-width: 80%;
  text-align: center;
  animation: pulse 2s infinite;
`;

const ErrorMessage = styled.div`
  margin: 1rem auto;
  padding: 0.8rem;
  background: rgba(255, 66, 66, 0.15);
  border-radius: 8px;
  color: #ff4242;
  max-width: 80%;
  text-align: center;
`;

// Add this new styled component near the other styled components
const SimulatedNFTInfo = styled.div`
  background: rgba(36, 37, 38, 0.9);
  border: 1px solid #aeff00;
  border-radius: 10px;
  padding: 1rem;
  margin: 1rem 0;
  text-align: center;
`;

const ViewMockNFTButton = styled(Button)`
  margin-top: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
`;

const Etherland = () => {
  const [soulProgress, setSoulProgress] = useState(0);
  const [selectedTraits, setSelectedTraits] = useState([]);
  const [orbs, setOrbs] = useState([]);
  const [showCompletion, setShowCompletion] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingStage, setLoadingStage] = useState('');
  const [fadeOutLoading, setFadeOutLoading] = useState(false);
  const [showPortal, setShowPortal] = useState(false);
  const [portalFadeIn, setPortalFadeIn] = useState(false);
  const [particles, setParticles] = useState([]);
  const sectionRef = useRef(null);
  const [showGenerator, setShowGenerator] = useState(false);
  const [generatorProgress, setGeneratorProgress] = useState(0);
  const [generatorText, setGeneratorText] = useState('Initializing Cryptonic Soul Generator...');
  const [generatorFadeOut, setGeneratorFadeOut] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [transactionHash, setTransactionHash] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStage, setGenerationStage] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [nftAttributes, setNftAttributes] = useState(null);
  const [mintingError, setMintingError] = useState('');
  const [isMinting, setIsMinting] = useState(false);
  const [mintStatus, setMintStatus] = useState('');
  const [networkName, setNetworkName] = useState(SOLANA_TESTNET.name);
  const [currentPrice, setCurrentPrice] = useState(NFT_PRICE_SOL);
  const [sufficientFunds, setSufficientFunds] = useState(true);
  const [nftMinted, setNftMinted] = useState(false);
  const [mintedNFT, setMintedNFT] = useState(null);
  const [generatedSpaceBaby, setGeneratedSpaceBaby] = useState(null);
  const [userId, setUserId] = useState(null);
  const [spaceUserId, setSpaceUserId] = useState(null);
  
  const navigate = useNavigate();

  // Get user ID on component mount
  useEffect(() => {
    const getUserProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUserId(session.user.id);
        
        // Specifically look for the user in the space_baby_users table
        const { data: spaceUserData, error: spaceUserError } = await supabase
          .from('space_baby_users')
          .select('id, wallet_address')
          .eq('auth_user_id', session.user.id)
          .single();
        
        if (!spaceUserError && spaceUserData) {
          console.log('Found user in space_baby_users table:', spaceUserData);
          setSpaceUserId(spaceUserData.id);
          setWalletAddress(spaceUserData.wallet_address || '');
        } else {
          console.warn('User not found in space_baby_users table:', spaceUserError);
          
          // Fallback: Check if the wallet address is already associated with the user
          if (walletAddress) {
            // Try to find or create a space_baby_user with this wallet
            const { data: userData, error: userError } = await supabase
              .from('space_baby_users')
              .select('*')
              .eq('wallet_address', walletAddress)
              .single();
              
            if (!userError && userData) {
              setSpaceUserId(userData.id);
            } else {
              // Create a new space_baby_user
              const { data: newUser, error: newUserError } = await supabase
                .from('space_baby_users')
                .insert({
                  auth_user_id: session.user.id,
                  wallet_address: walletAddress,
                  created_at: new Date().toISOString()
                })
                .select()
                .single();
                
              if (!newUserError && newUser) {
                setSpaceUserId(newUser.id);
              } else {
                console.error('Failed to create space_baby_user:', newUserError);
              }
            }
          }
        }
      }
    };
    
    getUserProfile();
  }, [walletAddress]); // Add walletAddress as dependency to update when connected

  // Ensure proper authentication when component loads
  useEffect(() => {
    const ensureAuthentication = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // Try to create an anonymous session for API access
        try {
          const { data: { session: anonSession }, error: authError } = await supabase.auth.signInAnonymously();
          
          if (authError) {
            console.warn("Could not create anonymous session:", authError);
          } else {
            console.log("Anonymous session created for API access");
          }
        } catch (error) {
          console.error("Authentication error:", error);
        }
      } else {
        console.log("User already authenticated");
      }
    };
    
    ensureAuthentication();
  }, []);

  // Update the component's useEffect to check wallet state on load
  useEffect(() => {
    const checkWalletState = async () => {
      try {
        // Check if wallet is already connected via our state manager
        if (isWalletConnected()) {
          const storedAddress = getWalletAddress();
          setWalletConnected(true);
          setWalletAddress(storedAddress);
          
          // Check balance
          try {
            const balance = await getSolanaBalance(storedAddress);
            setSufficientFunds(balance >= NFT_PRICE_SOL);
            
            if (balance < NFT_PRICE_SOL) {
              setMintingError(`Insufficient funds. You need at least ${NFT_PRICE_SOL} SOL to mint.`);
            } else {
              setMintingError(''); // Clear any previous errors
            }
          } catch (error) {
            console.error("Error checking balance:", error);
            // Assume sufficient funds if we can't check
            setSufficientFunds(true);
          }
          
          // Check if wallet is still connected in Phantom
          if (window.solana && window.solana.isPhantom) {
            try {
              // Just check if it's connected, don't try to reconnect
              if (window.solana.isConnected) {
                console.log("Phantom wallet is still connected");
              } else {
                console.log("Phantom says wallet is disconnected, but we have stored connection");
                // If the wallet is no longer connected in Phantom but we have a stored connection,
                // we'll keep our state and let the user reconnect if needed
              }
            } catch (error) {
              console.error("Error checking Phantom connection:", error);
            }
          }
        } else {
          // If wallet state says not connected, ensure our component state reflects that
          setWalletConnected(false);
          setWalletAddress('');
        }
      } catch (error) {
        console.error("Error checking wallet state:", error);
      }
    };
    
    checkWalletState();
    
    // Listen for wallet connection/disconnection events
    const handleWalletConnected = (event) => {
      setWalletConnected(true);
      setWalletAddress(event.detail.address);
    };
    
    const handleWalletDisconnected = () => {
      setWalletConnected(false);
      setWalletAddress('');
    };
    
    window.addEventListener('walletConnected', handleWalletConnected);
    window.addEventListener('walletDisconnected', handleWalletDisconnected);
    
    return () => {
      window.removeEventListener('walletConnected', handleWalletConnected);
      window.removeEventListener('walletDisconnected', handleWalletDisconnected);
    };
  }, []); // Empty dependency array to run only once on mount

  // Keep the updateProgress function
  const updateProgress = (start, end, duration) => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(start + (elapsed / duration) * (end - start), end);
      setGeneratorProgress(progress);
      if (progress >= end) {
        clearInterval(interval);
      }
    }, 50);
  };

  // Keep the requestWalletSignature function
  const requestWalletSignature = async () => {
    try {
      setStatusMessage("Requesting signature to verify wallet ownership...");
      updateProgress(15, 30, 2000);
      // Convert selected traits to NFT attributes
      const traitAttributes = {};
      selectedTraits.forEach(trait => {
        traitAttributes[trait.name] = trait.description;
      });
      setNftAttributes(traitAttributes);
      // This would be where you implement actual signature verification
      // For now, we'll just simulate it
      setTimeout(() => {
        setStatusMessage("Wallet ownership verified!");
        updateProgress(30, 60, 1500);
        // Move to next stage
        setTimeout(() => {
          setGenerationStage(3);
          prepareForMinting();
        }, 2000);
      }, 2000);
    } catch (error) {
      console.error("Error requesting signature:", error);
      setStatusMessage("Failed to verify wallet ownership: " + error.message);
      setIsGenerating(false);
      setMintingError(error.message || 'Failed to verify wallet ownership');
    }
  };

  // Keep the generateParticles function
  const generateParticles = () => {
    const newParticles = [];
    const colors = ['#aeff00', '#6c00ff', '#ff33a8', '#33fff5', '#fff033'];
    for (let i = 0; i < 30; i++) {
      newParticles.push({
        id: i,
        size: 5 + Math.random() * 10,
        color: colors[Math.floor(Math.random() * colors.length)],
        posX: 30 + Math.random() * 40, // position around the center
        posY: 30 + Math.random() * 40, // position around the center
      });
    }
    setParticles(newParticles);
  };

  // Keep the traits array
  const traits = [
    { id: 1, name: "Curious", description: "An explorer at heart", color: "#FF5733" },
    { id: 2, name: "Creative", description: "Born to innovate", color: "#33FF57" },
    { id: 3, name: "Resilient", description: "Bounces back from setbacks", color: "#3357FF" },
    { id: 4, name: "Empathetic", description: "Feels deeply for others", color: "#F033FF" },
    { id: 5, name: "Logical", description: "Analyzes with precision", color: "#FF33A8" },
    { id: 6, name: "Adventurous", description: "Never fears the unknown", color: "#33FFF5" },
    { id: 7, name: "Harmonious", description: "Brings balance to chaos", color: "#FFF033" },
    { id: 8, name: "Determined", description: "Unstoppable force", color: "#FF8333" }
  ];

  // Keep the toggleTrait function
  const toggleTrait = (trait) => {
    if (selectedTraits.find(t => t.id === trait.id)) {
      setSelectedTraits(selectedTraits.filter(t => t.id !== trait.id));
    } else if (selectedTraits.length < 3) {
      setSelectedTraits([...selectedTraits, trait]);
      // Add soul orb effect with enhanced size and colors
      const randomPosition = {
        x: Math.random() * 300 - 150,
        y: Math.random() * 300 - 150,
        size: Math.random() * 40 + 25, // Larger orbs
        color: trait.color
      };
      setOrbs([...orbs, randomPosition]);
      // Increase soul progress
      setSoulProgress(Math.min(soulProgress + 33, 99));
      // Clear any previous errors
      setMintingError('');
    }
  };

  // Keep the runLoadingAnimation function
  const runLoadingAnimation = () => {
    let progress = 0;
    const stages = [
      'Entering Etherland...',
      'Analyzing traits...',
      'Gathering soul particles...',
      'Weaving soul essence...',
      'Binding soul to Space Baby...',
      'Finalizing soul signature...',
      'Preparing for Astroverse...'
    ];
    setIsLoading(true);
    generateParticles();
    const interval = setInterval(() => {
      progress += 10; // Increase by 2 instead of 1 to make it faster
      setLoadingProgress(progress);
      // Update loading stage text
      if (progress % 14 === 0) {
        const stageIndex = Math.floor(progress / 14);
        if (stageIndex < stages.length) {
          setLoadingStage(stages[stageIndex]);
          generateParticles(); // Generate new particles at each stage
        }
      }
      if (progress >= 100) {
        clearInterval(interval);
        // Fade out loading screen
        setFadeOutLoading(true);
        setTimeout(() => {
          setIsLoading(false);
          // Instead of showing portal, show integrated generator
          setShowGenerator(true);
          runGeneratorAnimation();
        }, 500); // Reduced from 1000ms to 500ms
      }
    }, 30); // Reduced from 60ms to 30ms - this makes the animation twice as fast
  };

  // Keep the runGeneratorAnimation function
  const runGeneratorAnimation = () => {
    const generatorTexts = [
      'Initializing Cryptonic Soul Generator...',
      'Analyzing Guardian Data...',
      'Assigning Cryptonic Attributes...',
      'Generating Soul Encryption...',
      'Calculating Power Levels...',
      'Preparing NFT Metadata...',
      'Finalizing Soul Generation...',
      'Soul Generation Complete! Entering Astroverse...'
    ];
    let progress = 5; // Start at 5 instead of 1 to make the progress more visible initially
    // Set an initial progress immediately before the interval
    setGeneratorProgress(5);
    const interval = setInterval(() => {
      progress += 13;
      // Ensure progress never exceeds 100% and use whole numbers for visual consistency
      const cappedProgress = Math.min(Math.max(Math.floor(progress), 1), 100);
      setGeneratorProgress(cappedProgress);
      // Update text at certain progress points
      const textIndex = Math.floor((cappedProgress / 100) * (generatorTexts.length - 1));
      setGeneratorText(generatorTexts[textIndex]);
      if (cappedProgress >= 100) {
        clearInterval(interval);
        // Set final state for consistency
        setGeneratorProgress(100);
        setGeneratorText('Soul Generation Complete! Entering Astroverse...');
        setTimeout(() => {
          setGeneratorFadeOut(true);
          setTimeout(() => {
            setShowGenerator(false);
            setShowPortal(true);
            setPortalFadeIn(true);
            // Ensure this timeout is sufficient for the portal animation to be visible
            setTimeout(() => {
              try {
                // Navigate with a try-catch to handle any navigation errors
                navigate('/astroverse');
              } catch (error) {
                console.error('Navigation error:', error);
                // Fallback direct navigation if React Router navigation fails
                window.location.href = '/astroverse';
              }
            }, 1500); // Increased from 1000ms to 1500ms for better visibility
          }, 500);
        }, 800); // Increased from 500ms to 800ms for better readability
      }
    }, 80);
  };

  // Updated prepareForMinting function to use the remote service
  const prepareForMinting = async () => {
    setStatusMessage("Preparing your Space Baby for minting...");
    updateProgress(75, 85, 2000);
    
    try {
      if (!walletConnected) {
        throw new Error("Wallet not connected. Please connect your wallet to mint.");
      }
      
      if (!sufficientFunds) {
        throw new Error(`Insufficient funds. You need at least ${NFT_PRICE_SOL} SOL to mint.`);
      }
      
      setStatusMessage("Beginning minting process...");
      setIsMinting(true);
      
      // Use the selected traits to generate a Space Baby
      const traits = selectedTraits.map(trait => ({
        name: trait.name,
        description: trait.description
      }));
      
      // Generate Space Baby using the remote service
      setMintStatus('Generating your Space Baby...');
      const spaceBaby = await SpaceBabyService.generateRemoteSpaceBaby({
        traits: traits,
        species: 'random'
      });
      
      // Store the generated space baby
      setGeneratedSpaceBaby(spaceBaby);
      
      // Mint the NFT on Solana
      setMintStatus('Minting your Space Baby on Solana...');
      const result = await mintSolanaNFT(walletAddress, spaceBaby.metadata, SOLANA_TESTNET);
      setTransactionHash(result.signature);
      
      // Add transaction hash to the space baby
      spaceBaby.transactionHash = result.signature;
      
      // Save the minted NFT info
      const mintedNFTData = {
        id: result.mint || spaceBaby.id,
        name: spaceBaby.metadata?.name || spaceBaby.name,
        image: spaceBaby.image,
        attributes: spaceBaby.attributes,
        mintedAt: new Date().toISOString(),
        network: 'solana',
        transactionHash: result.signature
      };
      setMintedNFT(mintedNFTData);
      
      // Try to save to database, but don't let errors block progression
      try {
        // Save to database using the remote service
        setMintStatus('Saving your Space Baby to the database...');
        await SpaceBabyService.saveSpaceBabyToDb(spaceBaby, {
          walletAddress: walletAddress,
          transactionHash: result.signature
        });
        setMintStatus('Space Baby saved successfully!');
      } catch (saveError) {
        console.error("Error saving to database:", saveError);
        setMintStatus("NFT minted, but there was an issue saving to database. Your NFT is still safe!");
        
        // Save to local storage as backup
        try {
          const backupBabies = JSON.parse(localStorage.getItem('spaceBabiesBackup') || '[]');
          backupBabies.push({
            ...spaceBaby,
            walletAddress,
            transactionHash: result.signature,
            error: saveError.message,
            timestamp: new Date().toISOString()
          });
          localStorage.setItem('spaceBabiesBackup', JSON.stringify(backupBabies));
          console.log('Space baby saved to local backup');
        } catch (backupError) {
          console.error('Failed to save backup:', backupError);
        }
      }
      
      // Save to session storage for viewing in Astroverse
      try {
        // Save to the collection
        const savedNFTs = JSON.parse(sessionStorage.getItem('spaceBabiesNFTs') || '[]');
        savedNFTs.push(mintedNFTData);
        sessionStorage.setItem('spaceBabiesNFTs', JSON.stringify(savedNFTs));
        
        // Save as current NFT for immediate reference
        sessionStorage.setItem('currentSpaceBaby', JSON.stringify(mintedNFTData));
        
        // Also save wallet address for reference in other pages
        sessionStorage.setItem('walletAddress', walletAddress);
      } catch (err) {
        console.warn('Error saving NFT to sessionStorage:', err);
      }
      
      setNftMinted(true);
      setMintStatus('NFT minted successfully!');
      updateProgress(85, 95, 1000);
      
      // Move to final stage
      setTimeout(() => {
        setGenerationStage(5);
        completeSoulGeneration();
      }, 1000);
    } catch (error) {
      console.error("Error preparing for minting:", error);
      setStatusMessage("Failed to mint: " + (error.message || 'Unknown error'));
      setMintingError(error.message || 'Failed to mint your NFT');
      setIsGenerating(false);
      setIsMinting(false);
    }
  };

  // Updated completeSoulGeneration function
  const completeSoulGeneration = () => {
    setSoulProgress(100);
    
    // Save NFT data to session storage for Astroverse display
    if (mintedNFT) {
      sessionStorage.setItem('currentSpaceBaby', JSON.stringify(mintedNFT));
      
      // Also save locally for Profile page
      const storedNFTs = JSON.parse(localStorage.getItem('mintedSolanaNFTs') || '[]');
      storedNFTs.push({
        ...mintedNFT,
        timestamp: new Date().toISOString(),
        signature: mintedNFT.transactionHash,
        metadata: mintedNFT
      });
      localStorage.setItem('mintedSolanaNFTs', JSON.stringify(storedNFTs));
    }
    
    // Run loading animation
    runLoadingAnimation();
  };

  // Section animations
  useEffect(() => {
    // Animation for the section when it's loaded
    if (sectionRef.current) {
      gsap.fromTo(
        sectionRef.current.querySelector('.content'),
        {
          opacity: 0,
          y: 100
        },
        {
          opacity: 1,
          y: 0,
          duration: 1.5,
          ease: 'power3.out'
        }
      );
    }
  }, []);

  // Preload Astroverse
  useEffect(() => {
    // Preload the Astroverse component to ensure faster rendering when navigating
    const preloadAstroverse = async () => {
      try {
        // Update the path to the correct location - assuming Astroverse is in pages directory
        await import('./Astroverse');
      } catch (error) {
        console.error('Error preloading Astroverse:', error);
        // Silent failure - don't block rendering if preload fails
      }
    };
    preloadAstroverse();
  }, []);

  // Simplified connectWallet - only for Phantom
  const connectPhantom = async () => {
    try {
      setIsGenerating(true);
      setGenerationStage(0);
      setStatusMessage("Requesting Phantom connection...");
      updateProgress(0, 10, 2000);
      
      // Connect using our centralized function
      const wallet = await connectPhantomWallet();
      
      if (wallet && wallet.address) {
        setWalletConnected(true);
        setWalletAddress(wallet.address);
        setStatusMessage("Connected to Phantom: " + wallet.address.substring(0, 6) + '...');
        
        // Check wallet balance
        try {
          const balance = await getSolanaBalance(wallet.address);
          setSufficientFunds(balance >= NFT_PRICE_SOL);
          if (balance < NFT_PRICE_SOL) {
            setMintingError(`Insufficient funds. You need at least ${NFT_PRICE_SOL} SOL to mint.`);
          } else {
            setMintingError(''); // Clear any previous errors
          }
        } catch (error) {
          console.error("Error checking balance:", error);
          // Assume sufficient funds for testing
          setSufficientFunds(true);
        }
        
        updateProgress(10, 15, 1000);
        
        // Move to next stage
        setTimeout(() => {
          setGenerationStage(1);
          setIsGenerating(false);
        }, 1500);
      } else {
        throw new Error("Failed to get public key from Phantom wallet");
      }
    } catch (error) {
      console.error("Error connecting to Phantom:", error);
      setStatusMessage("Failed to connect to Phantom: " + error.message);
      setIsGenerating(false);
      setMintingError(error.message || 'Failed to connect to Phantom');
    }
  };

  // Updated NFTSimulationNotice component to display generated space baby
  const NFTSimulationNotice = ({ transactionHash }) => {
    const viewMockNFTs = () => {
      const mintedNFTs = JSON.parse(localStorage.getItem('spaceBabiesBackup') || '[]');
      alert(`You have ${mintedNFTs.length} Space Babies. In a production environment, these would appear in your Phantom wallet.`);
      console.table(mintedNFTs);
    };
    
    return (
      <SimulatedNFTInfo>
        <h4 style={{ color: '#aeff00', margin: '0 0 0.5rem 0' }}>Space Baby Generated!</h4>
        {generatedSpaceBaby && (
          <div style={{ marginBottom: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
              <img 
                src={generatedSpaceBaby.image} 
                alt="Generated Space Baby" 
                style={{ 
                  maxWidth: '150px', 
                  maxHeight: '150px', 
                  borderRadius: '10px',
                  border: '2px solid #aeff00'
                }} 
              />
            </div>
            <p style={{ fontSize: '1rem', margin: '0.5rem 0', color: '#aeff00' }}>
              {generatedSpaceBaby.metadata?.name || 'Space Baby'}
            </p>
            <p style={{ fontSize: '0.8rem', margin: '0.5rem 0', color: '#fff' }}>
              Species: {generatedSpaceBaby.species}
            </p>
          </div>
        )}
        <p style={{ fontSize: '0.9rem', margin: '0.5rem 0' }}>
          Your Space Baby has been minted and added to your collection.
        </p>
        {transactionHash && (
          <p style={{ fontSize: '0.9rem', margin: '0.5rem 0', color: '#aeff00' }}>
            Transaction ID: {transactionHash.substring(0, 10)}...
          </p>
        )}
        <ViewMockNFTButton onClick={viewMockNFTs}>
          View My Collection
        </ViewMockNFTButton>
      </SimulatedNFTInfo>
    );
  };

  return (
    <>
      <Section id="etherland" ref={sectionRef}>
        <Content className="content">
          <Title>Welcome to Etherland</Title>
          <Description style={{ color: 'white' }}>
            They say the eyes are the window to the soul. Etherland is the essence in which Space Baby is conceived. 
            Here as a guardian, you bestow upon Space Baby its identity. The deliverance of a soul to your creation 
            is the first step in actualizing Space Baby, allowing entry into the Astroverse.
          </Description>
          
          <SoulGenerationContainer>
            <BabyContainer>
              {orbs.map((orb, index) => (
                <SoulOrb 
                  key={index}
                  size={orb.size}
                  color={orb.color}
                  style={{
                    left: `calc(50% + ${orb.x}px)`,
                    top: `calc(50% + ${orb.y}px)`
                  }}
                />
              ))}
              <BabyImage soulProgress={soulProgress}>
                <img src="https://i.postimg.cc/GmQ6XVFR/image-Team-Dez.png" alt="Space Baby" />
              </BabyImage>
            </BabyContainer>

            {walletConnected && (
              <WalletInfoContainer error={!sufficientFunds}>
                <h4 style={{ color: '#aeff00', margin: 0 }}>Phantom Wallet Connected</h4>
                <WalletAddressDisplay>
                  Address: {walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 4)}
                </WalletAddressDisplay>
                <BalanceDisplay>
                  Network: <span>{networkName}</span>
                </BalanceDisplay>
                <BalanceDisplay>
                  Mint Price: <span>{NFT_PRICE_SOL} SOL</span>
                </BalanceDisplay>
                {transactionHash && (
                  <TransactionLink 
                    href={`${SOLANA_TESTNET.blockExplorer}/tx/${transactionHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Transaction
                  </TransactionLink>
                )}
              </WalletInfoContainer>
            )}

            {/* Show NFT info if minted */}
            {nftMinted && (
              <NFTSimulationNotice 
                transactionHash={transactionHash} 
              />
            )}

            {/* Show minting status or errors */}
            <div style={{ textAlign: 'center', margin: '1rem 0' }}>
              {isMinting && mintStatus && (
                <MintingIndicator>{mintStatus}</MintingIndicator>
              )}
              {mintingError && (
                <ErrorMessage>{mintingError}</ErrorMessage>
              )}
            </div>
            
            {/* Soul progress bar */}
            <ProgressContainer>
              <h3 style={{ color: 'white', marginBottom: '0.5rem', textAlign: 'center' }}>Soul Generation Progress</h3>
              <ProgressBar>
                <Progress progress={soulProgress} />
              </ProgressBar>
            </ProgressContainer>
            
            {/* Connect wallet button - only if not connected */}
            {!walletConnected && (
              <div style={{ textAlign: 'center', margin: '1rem 0' }}>
                <h3 style={{ color: 'white', marginBottom: '1rem' }}>Connect Your Phantom Wallet to Begin</h3>
                <Button onClick={connectPhantom}>Connect Phantom Wallet</Button>
              </div>
            )}
            
            <h3 style={{ 
              color: 'white', 
              marginBottom: '0.5rem', 
              textAlign: 'center',
              textShadow: '0 0 10px rgba(174, 255, 0, 0.5)'
            }}>
              Select up to 3 traits for your Space Baby's soul
            </h3>
            <p style={{ 
              color: 'white', 
              marginBottom: '1.5rem', 
              textAlign: 'center',
              fontSize: '0.9rem' 
            }}>
              Click on traits below to define your Space Baby's personality
            </p>
            
            {/* Trait selection */}
            <TraitContainer>
              {traits.map(trait => (
                <TraitCard 
                  key={trait.id} 
                  selected={selectedTraits.find(t => t.id === trait.id)}
                  onClick={() => toggleTrait(trait)}
                >
                  <TraitTitle selected={selectedTraits.find(t => t.id === trait.id)}>{trait.name}</TraitTitle>
                  <TraitDescription>{trait.description}</TraitDescription>
                </TraitCard>
              ))}
            </TraitContainer>
            
            {/* Generate Soul button */}
            <Button 
              onClick={prepareForMinting}
              disabled={
                selectedTraits.length < 3 || 
                soulProgress >= 100 || 
                !walletConnected || 
                !sufficientFunds || 
                isMinting || 
                nftMinted
              }
            >
              {nftMinted ? "Soul Generated" : 
               !walletConnected ? "Connect Wallet First" :
               !sufficientFunds ? "Insufficient Funds" : 
               isMinting ? "Minting..." : 
               selectedTraits.length < 3 ? `Select ${3-selectedTraits.length} More Traits` :
               "Generate Soul & Mint NFT"}
            </Button>
          </SoulGenerationContainer>
        </Content>
      </Section>
      
      {/* Rest of the animation components */}
      {/* Soul Generation Loading Animation */}
      <SoulLoadingOverlay isLoading={isLoading} fadeOut={fadeOutLoading}>
        <LoadingTitle>Soul Generation in Progress</LoadingTitle>
        
        <SoulGenerationCircle>
          <SoulBabyImage>
            <img src="https://i.postimg.cc/GmQ6XVFR/image-Team-Dez.png" alt="Space Baby" />
          </SoulBabyImage>
          
          {/* Soul particles animation */}
          {particles.map(particle => (
            <SoulParticle 
              key={particle.id}
              size={particle.size}
              color={particle.color}
              posX={particle.posX}
              posY={particle.posY}
            />
          ))}
        </SoulGenerationCircle>
        
        <LoadingSubtitle>{loadingStage}</LoadingSubtitle>
        <ProgressText>{loadingProgress}%</ProgressText>
      </SoulLoadingOverlay>
      
      {/* Integrated Cryptonic Soul Generator */}
      <IntegratedLoadingOverlay show={showGenerator} fadeOut={generatorFadeOut}>
        <GeneratorTitle>3D CRYPTONIC SOUL GENERATOR</GeneratorTitle>
        <GeneratorImage src={soulGeneratorImg} alt="Soul Generator" />
        <GeneratorText>{generatorText}</GeneratorText>
        <GeneratorProgressBar>
          <GeneratorProgress width={generatorProgress} />
        </GeneratorProgressBar>
        <GeneratorText>{generatorProgress}% Complete</GeneratorText>
      </IntegratedLoadingOverlay>
      
      {/* Portal Transition to Astroverse */}
      <TransitionPortal show={showPortal} fadeIn={portalFadeIn}>
        <h2>Entering the Astroverse</h2>
      </TransitionPortal>
    </>
  );
};

export default Etherland;
