import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useUserAuth } from '../context/UserAuthContext';
import { NavRight } from '../styles/GlobalStyles';

const NavbarContainer = styled.nav`
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.5rem 1rem;
  z-index: 1000;
  border-bottom: 1px solid rgba(174, 255, 0, 0.3);
  
  @media (min-width: 1200px) {
    padding: 0.5rem 2rem;
  }
`;

const NavbarInner = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const LogoContainer = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
  margin-bottom: 0.5rem;
  
  @media (min-width: 768px) {
    margin-bottom: 1rem;
  }
`;

const LogoImage = styled.img`
  height: 40px;
  transition: all 0.3s ease;
  
  @media (min-width: 768px) {
    height: 50px;
  }
  
  &:hover {
    transform: scale(1.05);
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  width: 100%;
  
  @media (max-width: 768px) {
    flex-direction: column;
    max-height: ${({ isOpen }) => (isOpen ? '1000px' : '0')};
    overflow: hidden;
    opacity: ${({ isOpen }) => (isOpen ? '1' : '0')};
    transition: all 0.3s ease-in-out;
  }
`;

const NavLinksRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
  }
`;

const NavLink = styled(Link)`
  color: ${props => props.$active ? '#AEFF00' : '#FFFFFF'};
  text-decoration: none;
  margin: 0.5rem 1rem;
  transition: color 0.3s ease;
  white-space: nowrap;
  padding: 0.5rem 0;
  background: ${props => props.$active ? 'rgba(174, 255, 0, 0.1)' : 'transparent'};
  padding: ${props => props.$active ? '0.3rem 0.8rem' : '0.3rem 0'};
  border-radius: 4px;
  
  &:hover {
    color: #AEFF00;
  }
  
  @media (max-width: 768px) {
    margin: 0.5rem 0;
    width: 100%;
    text-align: center;
  }
`;

const ProfileLink = styled(NavLink)`
  color: ${props => props.$active ? '#AEFF00' : '#FFFFFF'};
  border: 1px solid #AEFF00;
  border-radius: 20px;
  padding: 0.3rem 1rem;
  
  &:hover {
    background: rgba(174, 255, 0, 0.1);
    color: #AEFF00;
  }
`;

const MenuButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: transparent;
  border: none;
  color: #AEFF00;
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 1001;
  display: none;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const UserSection = styled(NavRight)`
  display: flex;
  align-items: center;
  margin-left: 1rem;
  
  @media (max-width: 768px) {
    margin-left: 0;
    margin-top: 1rem;
    flex-direction: column;
    width: 100%;
  }
`;

const DisconnectButton = styled.button`
  background: transparent;
  color: #FF5252;
  border: 2px solid #FF5252;
  border-radius: 50px;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-family: 'flegrei', sans-serif;
  margin-left: 15px;
  
  &:hover {
    background: rgba(255, 82, 82, 0.1);
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    margin: 0.5rem 0;
    width: 100%;
  }
`;

const WalletIndicator = styled.div`
  display: flex;
  align-items: center;
  margin-right: 10px;
  
  @media (max-width: 768px) {
    margin-right: 0;
    margin-bottom: 10px;
    justify-content: center;
    width: 100%;
  }
`;

const WalletBadge = styled.span`
  background: #8A2BE2; // Phantom purple color
  color: white;
  border-radius: 50%;
  width: 10px;
  height: 10px;
  display: inline-block;
  margin-right: 5px;
`;

const WalletText = styled.span`
  color: #AEFF00;
  font-size: 0.8rem;
`;

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { logout, walletType, currentUser } = useUserAuth();
  const [localWalletConnected, setLocalWalletConnected] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if wallet is connected on mount
  useEffect(() => {
    const checkWalletConnection = async () => {
      // Check for Phantom connection
      if (window.solana && window.solana.isPhantom) {
        try {
          // More reliable check for Phantom connection
          const response = await window.solana.connect({ onlyIfTrusted: true }).catch(() => null);
          setLocalWalletConnected(!!response);
        } catch (error) {
          console.error("Error checking Phantom connection:", error);
        }
      }
    };
    
    checkWalletConnection();
    
    // Also set connected if we have a currentUser
    if (currentUser && currentUser.wallet_address) {
      setLocalWalletConnected(true);
    }
  }, [currentUser]);
  
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = async () => {
    // Set a flag to prevent auto-reconnection
    localStorage.setItem('walletDisconnected', 'true');
    
    // Disconnect from Phantom wallet if it exists
    if (window.solana && window.solana.isPhantom) {
      try {
        await window.solana.disconnect();
        console.log("Disconnected from Phantom wallet");
      } catch (error) {
        console.error("Error disconnecting from Phantom:", error);
      }
    }
    
    setLocalWalletConnected(false);
    
    const success = await logout();
    if (success) {
      navigate('/');
      window.location.reload();
    } else {
      alert("There was an issue logging out. Please try again.");
    }
  };
  
  // Check if a user is connected with a wallet (using both methods)
  const isWalletConnected = localWalletConnected || (!!currentUser && !!currentUser.wallet_address);
  
  return (
    <NavbarContainer>
      <NavbarInner>
        <LogoContainer to="/">
          <LogoImage src="https://i.ibb.co/tLMmTqG/White-Trans.png" alt="Space Babiez Logo" />
        </LogoContainer>
        
        <MenuButton onClick={toggleMenu}>
          {menuOpen ? '✕' : '☰'}
        </MenuButton>
        
        <NavLinks isOpen={menuOpen}>
          <NavLinksRow>
            <NavLink to="/" $active={location.pathname === '/'}>
              Home
            </NavLink>
            <NavLink to="/etherland" $active={location.pathname === '/etherland'}>
              Etherland
            </NavLink>
            <NavLink to="/astroverse" $active={location.pathname === '/astroverse'}>
              Astroverse
            </NavLink>
            <NavLink to="/marketplace" $active={location.pathname === '/marketplace'}>
              Marketplace
            </NavLink>
            <NavLink to="/manager" $active={location.pathname === '/manager'}>
              Manager
            </NavLink>
            <NavLink to="/contracts" $active={location.pathname === '/contracts'}>
              Contracts
            </NavLink>
            <ProfileLink to="/profile" $active={location.pathname === '/profile'}>
              Profile
            </ProfileLink>
            
            {/* Always show the User Section with conditional wallet info */}
            <UserSection>
              {isWalletConnected && (
                <WalletIndicator>
                  <WalletBadge />
                  <WalletText>Phantom</WalletText>
                </WalletIndicator>
              )}
              {isWalletConnected && (
                <DisconnectButton onClick={handleLogout}>
                  Disconnect
                </DisconnectButton>
              )}
              {!isWalletConnected && window.solana?.isConnected && (
                <DisconnectButton onClick={handleLogout}>
                  Disconnect Wallet
                </DisconnectButton>
              )}
            </UserSection>
          </NavLinksRow>
        </NavLinks>
      </NavbarInner>
    </NavbarContainer>
  );
};

export default Navbar;
