import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useUserAuth } from '../context/UserAuthContext';

const NavbarContainer = styled.nav`
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 2rem;
  z-index: 1000;
  border-bottom: 1px solid rgba(174, 255, 0, 0.3);
`;

const Logo = styled(Link)`
  color: #AEFF00;
  font-size: 1.5rem;
  font-weight: bold;
  text-decoration: none;
  font-family: 'flegrei', sans-serif;
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  
  @media (max-width: 768px) {
    display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
    flex-direction: column;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.9);
    padding: 1rem;
    gap: 1rem;
  }
`;

const NavLink = styled(Link)`
  color: #FFFFFF;
  text-decoration: none;
  margin: 0 1rem;
  transition: color 0.3s ease;
  white-space: nowrap;
  
  &:hover {
    color: #AEFF00;
  }
  
  @media (max-width: 768px) {
    margin: 0.5rem 0;
  }
`;

const ProfileLink = styled(NavLink)`
  color: #AEFF00;
  border: 1px solid #AEFF00;
  border-radius: 20px;
  padding: 0.3rem 1rem;
  
  &:hover {
    background: rgba(174, 255, 0, 0.1);
  }
`;

const MenuButton = styled.button`
  display: none;
  background: transparent;
  border: none;
  color: #AEFF00;
  font-size: 1.5rem;
  cursor: pointer;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

// Add a styled disconnect button
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
    margin-top: 10px;
    margin-left: 0;
  }
`;

// Add wallet indicator
const WalletIndicator = styled.div`
  display: flex;
  align-items: center;
  margin-right: 10px;
  
  @media (max-width: 768px) {
    margin-right: 0;
    margin-bottom: 10px;
  }
`;

const WalletBadge = styled.span`
  background: ${props => props.type === 'phantom' ? '#8A2BE2' : '#F6851B'};
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
  const { logout, walletType } = useUserAuth();
  const navigate = useNavigate();
  
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = async () => {
    const success = await logout();
    if (success) {
      // Redirect to home page after logout
      navigate('/');
      // Reload to refresh state completely
      window.location.reload();
    } else {
      alert("There was an issue logging out. Please try again.");
    }
  };
  
  return (
    <NavbarContainer>
      <Logo to="/">Space Babiez</Logo>
      
      <MenuButton onClick={toggleMenu}>
        {menuOpen ? '✕' : '☰'}
      </MenuButton>
      
      <NavLinks isOpen={menuOpen}>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/etherland">Etherland</NavLink>
        <NavLink to="/marketplace">Marketplace</NavLink>
        <ProfileLink to="/profile">Profile</ProfileLink>
        <NavLink to="/settings">Settings</NavLink>
      </NavLinks>

      <WalletIndicator>
        <WalletBadge type={walletType || 'phantom'} />
        <WalletText>{walletType || 'Phantom'}</WalletText>
      </WalletIndicator>
      <DisconnectButton onClick={handleLogout}>
        Disconnect
      </DisconnectButton>
    </NavbarContainer>
  );
};

export default Navbar;
