import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const NavContainer = styled.nav`
  width: 100%;
  padding: 1rem 3rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 10;
  background: rgba(36, 37, 38, 0.9);
  backdrop-filter: blur(15px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);

  @media (max-width: 64em) {
    padding: 1rem 2rem;
  }

  @media (max-width: 48em) {
    flex-wrap: wrap;
  }
`;

const LogoContainer = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
  color: ${props => props.theme.text};
  font-size: ${props => props.theme.fontlg};
  font-weight: 700;
  
  span {
    background: linear-gradient(90deg, #9b51e0 0%, #3081ed 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-left: 0.5rem;
  }
`;

const MenuItems = styled.ul`
  display: flex;
  justify-content: space-between;
  align-items: center;
  list-style: none;
  
  @media (max-width: 48em) {
    width: 100%;
    justify-content: center;
    margin-top: ${props => props.mobileMenuOpen ? '1rem' : 0};
    height: ${props => props.mobileMenuOpen ? 'auto' : 0};
    overflow: ${props => props.mobileMenuOpen ? 'visible' : 'hidden'};
    transition: all 0.3s ease;
  }
`;

const MenuItem = styled.li`
  margin: 0 1rem;
  color: ${props => props.theme.text};
  
  @media (max-width: 48em) {
    margin: 0.5rem;
  }
`;

const MenuLink = styled(Link)`
  text-decoration: none;
  color: ${props => props.active ? '#9b51e0' : 'inherit'};
  font-size: ${props => props.theme.fontmd};
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  
  &:hover {
    color: #9b51e0;
  }
  
  @media (max-width: 48em) {
    font-size: ${props => props.theme.fontmd};
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: transparent;
  border: none;
  color: ${props => props.theme.text};
  font-size: 1.5rem;
  cursor: pointer;
  
  @media (max-width: 48em) {
    display: block;
  }
`;

const WalletButton = styled.button`
  background: linear-gradient(90deg, #9b51e0 0%, #3081ed 100%);
  color: white;
  padding: 0.5rem 1.5rem;
  border-radius: 50px;
  border: none;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 10px rgba(155, 81, 224, 0.3);
  }
  
  @media (max-width: 48em) {
    display: ${props => props.mobileMenuOpen ? 'block' : 'none'};
    margin-top: 1rem;
  }
`;

const Navbar = () => {
  const [currentPath, setCurrentPath] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  
  useEffect(() => {
    // Set current path for active link styling
    setCurrentPath(window.location.pathname);
    
    // Check if wallet is connected (from session storage or browser)
    const checkWalletConnection = async () => {
      const storedWallet = sessionStorage.getItem('walletAddress');
      
      if (storedWallet) {
        setWalletConnected(true);
        setWalletAddress(storedWallet);
        return;
      }
      
      // Check browser wallets
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            setWalletConnected(true);
            setWalletAddress(accounts[0]);
          }
        } catch (error) {
          console.error("Error checking wallet connection:", error);
        }
      }
      
      if (window.solana && window.solana.isPhantom) {
        try {
          const resp = await window.solana.connect({ onlyIfTrusted: true });
          if (resp.publicKey) {
            setWalletConnected(true);
            setWalletAddress(resp.publicKey.toString());
          }
        } catch (error) {
          // User hasn't connected before
        }
      }
    };
    
    checkWalletConnection();
  }, []);
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  const formatWalletAddress = (address) => {
    if (!address) return "";
    return `${address.substring(0, 4)}...${address.substring(address.length - 4)}`;
  };
  
  return (
    <NavContainer>
      <LogoContainer to="/">
        <span>🚀 Space Babiez</span>
      </LogoContainer>
      
      <MobileMenuButton onClick={toggleMobileMenu}>
        ☰
      </MobileMenuButton>
      
      <MenuItems mobileMenuOpen={mobileMenuOpen}>
        <MenuItem>
          <MenuLink to="/" active={currentPath === '/'}>
            🏠 Home
          </MenuLink>
        </MenuItem>
        <MenuItem>
          <MenuLink to="/gallery" active={currentPath === '/gallery'}>
            🖼️ Gallery
          </MenuLink>
        </MenuItem>
        <MenuItem>
          <MenuLink to="/profile" active={currentPath === '/profile'}>
            👤 My Profile
          </MenuLink>
        </MenuItem>
        <MenuItem>
          <MenuLink to="/etherland" active={currentPath === '/etherland'}>
            🚀 Generate Baby
          </MenuLink>
        </MenuItem>
      </MenuItems>
      
      {walletConnected ? (
        <WalletButton mobileMenuOpen={mobileMenuOpen}>
          {formatWalletAddress(walletAddress)}
        </WalletButton>
      ) : (
        <WalletButton 
          mobileMenuOpen={mobileMenuOpen}
          onClick={() => window.location.href = '/etherland'}
        >
          Connect Wallet
        </WalletButton>
      )}
    </NavContainer>
  );
};

export default Navbar;
