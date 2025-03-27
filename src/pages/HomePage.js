import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { useUserAuth } from '../context/UserAuthContext';
import { connectPhantomWallet, connectMetaMaskWallet } from '../utils/walletUtils';

// Marketing Components
import Navigation from "../components/Navigation";
import About from "../components/sections/About";
import Rm from "../components/sections/Rm";
import Home from "../components/sections/Home";
import Team from "../components/sections/Team";
import Footer from "../components/Footer";
import Showcase from "../components/sections/Showcase";
import Faq from "../components/sections/Faq";
import Oath from "../components/sections/Oath";
import Navbar from '../components/Navbar';

// Background and animations
const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
`;

const glowAnimation = keyframes`
  0% { box-shadow: 0 0 10px rgba(174, 255, 0, 0.5); }
  50% { box-shadow: 0 0 20px rgba(174, 255, 0, 0.8), 0 0 30px rgba(174, 255, 0, 0.6); }
  100% { box-shadow: 0 0 10px rgba(174, 255, 0, 0.5); }
`;

const pulseAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

// Styled components
const HomeContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(180deg, #000000 0%, #0A0A0A 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  padding-top: 5rem; /* Added padding to account for navbar */
  position: relative;
  overflow: hidden;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url('https://i.postimg.cc/L8ZN3HS2/etherland-bg.jpg');
    background-size: cover;
    opacity: 0.2;
    z-index: 0;
  }
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 1;
  max-width: 1200px;
  width: 100%;
  text-align: center;
`;

const Title = styled.h1`
  color: #AEFF00;
  font-size: 3.5rem;
  margin-bottom: 1rem;
  font-family: 'flegrei', sans-serif;
  text-transform: uppercase;
  letter-spacing: 2px;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const SubTitle = styled.p`
  color: #FFFFFF;
  font-size: 1.2rem;
  margin-bottom: 2rem;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
  font-family: 'DIN Condensed', sans-serif;
`;

const BabyImageContainer = styled.div`
  margin: 2rem 0;
  position: relative;
  width: 300px;
  height: 300px;
  margin-left: auto;
  margin-right: auto;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: ${floatAnimation} 6s ease-in-out infinite;
  
  &:after {
    content: '';
    position: absolute;
    width: 320px;
    height: 320px;
    border-radius: 50%;
    border: 2px solid #AEFF00;
    animation: ${glowAnimation} 3s ease-in-out infinite;
  }
`;

const BabyImage = styled.img`
  width: 80%;
  height: 80%;
  object-fit: contain;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.7);
  padding: 20px;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 2rem;
  align-items: center;
`;

// Update the Button component to use HTML button for actions
const Button = styled.button`
  background: ${props => props.$primary ? 'linear-gradient(90deg, #AEFF00 0%, #5CFF85 100%)' : 'transparent'};
  color: ${props => props.$primary ? '#000000' : '#AEFF00'};
  border: ${props => props.$primary ? 'none' : '2px solid #AEFF00'};
  border-radius: 50px;
  padding: 1rem 2.5rem;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  min-width: 250px;
  font-family: 'flegrei', sans-serif;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(174, 255, 0, 0.3);
    animation: ${props => props.$primary ? pulseAnimation : 'none'} 1s infinite;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

// Add a NavButton for navigation
const NavButton = styled(Link)`
  background: ${props => props.$primary ? 'linear-gradient(90deg, #AEFF00 0%, #5CFF85 100%)' : 'transparent'};
  color: ${props => props.$primary ? '#000000' : '#AEFF00'};
  border: ${props => props.$primary ? 'none' : '2px solid #AEFF00'};
  border-radius: 50px;
  padding: 1rem 2.5rem;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  min-width: 250px;
  font-family: 'flegrei', sans-serif;
  text-decoration: none;
  display: inline-block;
  text-align: center;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(174, 255, 0, 0.3);
    animation: ${props => props.$primary ? pulseAnimation : 'none'} 1s infinite;
  }
`;

const WalletStatus = styled.div`
  background: rgba(10, 10, 10, 0.8);
  border: 1px solid ${props => props.connected ? '#AEFF00' : '#666'};
  border-radius: 10px;
  padding: 1rem;
  margin: 1.5rem auto;
  max-width: 450px;
  
  h3 {
    color: ${props => props.connected ? '#AEFF00' : '#FFF'};
    margin-bottom: 0.5rem;
    font-size: 1.2rem;
  }
  
  p {
    color: #CCC;
    margin: 0.3rem 0;
    font-size: 0.9rem;
  }
`;

const Address = styled.span`
  color: #AEFF00;
  background: rgba(174, 255, 0, 0.1);
  padding: 0.2rem 0.5rem;
  border-radius: 5px;
  font-family: monospace;
`;

// Add a new styled component for the marketing sections container
const MarketingSectionsContainer = styled.div`
  width: 100%;
`;

// Add a new styled component for the personalized welcome message
const WelcomeMessage = styled.div`
  margin-top: 1rem;
  color: #AEFF00;
  font-size: 1.5rem;
  font-family: 'flegrei', sans-serif;
`;

// Add a styled component for baby info
const BabyInfo = styled.div`
  background: rgba(10, 10, 10, 0.8);
  border: 1px solid #AEFF00;
  border-radius: 10px;
  padding: 1.5rem;
  margin: 2rem auto;
  max-width: 500px;
  text-align: left;
  
  h3 {
    color: #AEFF00;
    text-align: center;
    margin-bottom: 1rem;
  }
  
  .attribute {
    display: flex;
    justify-content: space-between;
    margin: 0.5rem 0;
    border-bottom: 1px solid rgba(174, 255, 0, 0.3);
    padding-bottom: 0.5rem;
  }
  
  .label {
    color: #CCC;
    font-weight: bold;
  }
  
  .value {
    color: #FFFFFF;
  }
`;

// Add a new styled component for the wallet buttons container
const WalletButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
  
  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

// Add a new styled component for the logout button
const LogoutButton = styled.button`
  background: transparent;
  color: #FF5252;
  border: 2px solid #FF5252;
  border-radius: 50px;
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-family: 'flegrei', sans-serif;
  position: absolute;
  top: 1rem;
  right: 1rem;
  
  &:hover {
    background: rgba(255, 82, 82, 0.1);
    transform: translateY(-2px);
  }
`;

const WalletTypeTag = styled.span`
  position: absolute;
  top: -10px;
  right: 10px;
  background: ${props => props.type === 'phantom' ? '#8A2BE2' : '#F6851B'};
  color: white;
  font-size: 0.7rem;
  padding: 0.2rem 0.5rem;
  border-radius: 10px;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const HomePage = () => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [connecting, setConnecting] = useState(false);
  const navigate = useNavigate();
  const { currentUser, spaceBaby, loading, saveUserToDatabase, walletType, logout } = useUserAuth();

  // Check if wallet is already connected on page load
  useEffect(() => {
    if (currentUser && currentUser.wallet_address) {
      setWalletConnected(true);
      setWalletAddress(currentUser.wallet_address);
    }
  }, [currentUser]);

  // Connect to Phantom wallet
  const handleConnectPhantom = async () => {
    setConnecting(true);
    
    try {
      const wallet = await connectPhantomWallet();
      setWalletConnected(true);
      setWalletAddress(wallet.address);
      
      // Register or update user in database
      await saveUserToDatabase(wallet.address, wallet.type);
    } catch (error) {
      console.error("Error connecting to Phantom:", error);
      alert(error.message || "Failed to connect to Phantom wallet.");
    } finally {
      setConnecting(false);
    }
  };
  
  // Connect to MetaMask wallet
  const handleConnectMetaMask = async () => {
    setConnecting(true);
    
    try {
      const wallet = await connectMetaMaskWallet();
      setWalletConnected(true);
      setWalletAddress(wallet.address);
      
      // Register or update user in database
      await saveUserToDatabase(wallet.address, wallet.type);
    } catch (error) {
      console.error("Error connecting to MetaMask:", error);
      alert(error.message || "Failed to connect to MetaMask.");
    } finally {
      setConnecting(false);
    }
  };
  
  // Handle logout
  const handleLogout = async () => {
    const success = await logout();
    if (success) {
      setWalletConnected(false);
      setWalletAddress('');
      // Reload the page to refresh the state completely
      window.location.reload();
    } else {
      alert("There was an issue logging out. Please try again.");
    }
  };
  
  // Render the personalized experience for returning users
  const renderPersonalizedContent = () => {
    return (
      <ContentWrapper>
        <Title>Welcome Back to Space Babiez</Title>
        
        {currentUser && (
          <WelcomeMessage>
            Welcome back, Space Explorer!
          </WelcomeMessage>
        )}

        <BabyImageContainer>
          {spaceBaby ? (
            <BabyImage 
              src={spaceBaby.image_url || "https://i.postimg.cc/GmQ6XVFR/image-Team-Dez.png"} 
              alt="Your Space Baby" 
            />
          ) : (
            <BabyImage 
              src="https://i.postimg.cc/GmQ6XVFR/image-Team-Dez.png" 
              alt="Space Baby" 
            />
          )}
        </BabyImageContainer>
        
        {spaceBaby && (
          <BabyInfo>
            <h3>{spaceBaby.name || "Your Space Baby"}</h3>
            
            {spaceBaby.attributes && Object.entries(spaceBaby.attributes).map(([key, value]) => (
              <div className="attribute" key={key}>
                <span className="label">{key}:</span>
                <span className="value">{value}</span>
              </div>
            ))}
          </BabyInfo>
        )}
        
        <WalletStatus connected={true}>
          <h3>Wallet Connected</h3>
          <WalletTypeTag type={walletType || 'phantom'}>
            {walletType || 'Phantom'}
          </WalletTypeTag>
          <p>Address: <Address>
            {walletAddress.substring(0, 8)}...{walletAddress.substring(walletAddress.length - 8)}
          </Address></p>
          <p>You're ready to continue your cosmic journey!</p>
        </WalletStatus>
        
        <ButtonContainer>
          <NavButton to="/etherland" $primary>
            Enter Etherland
          </NavButton>
          
          {!spaceBaby && (
            <NavButton to="/profile" $primary={false}>
              Visit Your Collection
            </NavButton>
          )}
        </ButtonContainer>
      </ContentWrapper>
    );
  };
  
  // Render the marketing content for new users
  const renderMarketingContent = () => {
    return (
      <>
        <ContentWrapper>
          <Title>Space Babiez NFTs</Title>
          <SubTitle>
            Begin your cosmic journey and create your unique Space Baby guardian. 
            Connect your wallet to get started and bring your digital companion to life.
          </SubTitle>
          
          <BabyImageContainer>
            <BabyImage src="https://i.postimg.cc/GmQ6XVFR/image-Team-Dez.png" alt="Space Baby" />
          </BabyImageContainer>
          
          <WalletStatus connected={false}>
            <h3>Wallet Not Connected</h3>
            <p>Connect your wallet to get started</p>
          </WalletStatus>
          
          <WalletButtonsContainer>
            <Button 
              $primary 
              onClick={handleConnectPhantom} 
              disabled={connecting}
              style={{ background: connecting ? 'gray' : 'linear-gradient(90deg, #9945FF, #14F195)' }}
            >
              {connecting ? "Connecting..." : "Connect Phantom Wallet"}
            </Button>
            
            <Button 
              $primary={false}
              onClick={handleConnectMetaMask} 
              disabled={connecting}
              style={{ borderColor: '#F6851B', color: '#F6851B' }}
            >
              {connecting ? "Connecting..." : "Connect MetaMask"}
            </Button>
          </WalletButtonsContainer>
        </ContentWrapper>
        
        <MarketingSectionsContainer>
          <About />
          <Showcase />
          <Rm />
          <Team />
          <Oath />
          <Faq />
          <Footer />
        </MarketingSectionsContainer>
      </>
    );
  };
  
  // Main render logic based on user status
  if (loading) {
    return (
      <HomeContainer>
        <ContentWrapper>
          <Title>Loading...</Title>
        </ContentWrapper>
      </HomeContainer>
    );
  }

  return (
    <>
      {currentUser ? <Navbar /> : <Navigation />}
      <HomeContainer>
        {currentUser ? renderPersonalizedContent() : renderMarketingContent()}
      </HomeContainer>
    </>
  );
};

export default HomePage;
