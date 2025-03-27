import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const NavBar = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  padding: 0.5rem 1rem;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(10px);
  z-index: 100;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
  
  @media (min-width: 768px) {
    padding: 0.5rem 2rem;
  }
`;

const Logo = styled(Link)`
  color: #aeff00;
  font-size: 1.2rem;
  font-weight: bold;
  text-decoration: none;
  font-family: 'flegrei', sans-serif;
  text-shadow: 0 0 10px rgba(174, 255, 0, 0.5);
  white-space: nowrap;
  
  @media (min-width: 768px) {
    font-size: 1.5rem;
  }
`;

const NavLinksDesktop = styled.div`
  display: none;
  gap: 1.5rem;
  
  @media (min-width: 768px) {
    display: flex;
  }
`;

const NavLink = styled(Link)`
  color: ${props => props.$active ? '#aeff00' : 'white'};
  text-decoration: none;
  font-size: 1rem;
  transition: all 0.3s ease;
  padding: 0.3rem 0.5rem;
  border-radius: 4px;
  background: ${props => props.$active ? 'rgba(174, 255, 0, 0.1)' : 'transparent'};
  
  &:hover {
    color: #aeff00;
    background: rgba(174, 255, 0, 0.05);
  }
`;

const MobileMenuButton = styled.button`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 2rem;
  height: 2rem;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 10;
  
  &:focus {
    outline: none;
  }
  
  div {
    width: 2rem;
    height: 0.25rem;
    background: ${props => props.open ? '#aeff00' : 'white'};
    border-radius: 10px;
    transition: all 0.3s linear;
    position: relative;
    transform-origin: 1px;
    
    &:first-child {
      transform: ${props => props.open ? 'rotate(45deg)' : 'rotate(0)'};
    }
    
    &:nth-child(2) {
      opacity: ${props => props.open ? '0' : '1'};
      transform: ${props => props.open ? 'translateX(20px)' : 'translateX(0)'};
    }
    
    &:nth-child(3) {
      transform: ${props => props.open ? 'rotate(-45deg)' : 'rotate(0)'};
    }
  }
  
  @media (min-width: 768px) {
    display: none;
  }
`;

const MobileMenu = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  height: 100vh;
  width: 100%;
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(5px);
  position: fixed;
  top: 0;
  left: 0;
  transform: ${({ open }) => open ? 'translateY(0)' : 'translateY(-100%)'};
  transition: transform 0.3s ease-in-out;
  z-index: 9;
  
  @media (min-width: 768px) {
    display: none;
  }
`;

const MobileLink = styled(Link)`
  color: ${props => props.$active ? '#aeff00' : 'white'};
  text-decoration: none;
  font-size: 1.5rem;
  padding: 1rem;
  margin: 0.5rem 0;
  transition: all 0.3s ease;
  
  &:hover {
    color: #aeff00;
  }
`;

const Content = styled.main`
  padding-top: 60px; /* Height of navbar plus some extra space */
`;

const AnimatedParticleArea = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: -1;
`;

const Particle = styled.div`
  position: absolute;
  width: 3px;
  height: 3px;
  background-color: rgba(174, 255, 0, ${props => props.opacity});
  box-shadow: 0 0 10px rgba(174, 255, 0, ${props => props.opacity});
  border-radius: 50%;
  top: ${props => props.top}%;
  left: ${props => props.left}%;
  animation: float ${props => props.duration}s linear infinite;
  
  @keyframes float {
    0% {
      transform: translateY(0) translateX(0);
    }
    100% {
      transform: translateY(-100px) translateX(${props => props.drift}px);
      opacity: 0;
    }
  }
`;

const Layout = ({ children }) => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [particles, setParticles] = useState([]);
  
  // Generate particles for the navbar background effect
  useEffect(() => {
    const newParticles = [];
    for (let i = 0; i < 20; i++) {
      newParticles.push({
        id: i,
        top: Math.random() * 100,
        left: Math.random() * 100,
        opacity: Math.random() * 0.5 + 0.1,
        duration: Math.random() * 5 + 3,
        drift: Math.random() * 50 - 25
      });
    }
    setParticles(newParticles);
  }, []);
  
  // Close mobile menu when clicking a link or when route changes
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);
  
  return (
    <>
      <NavBar>
        <Logo to="/">SPACE BABIEZ</Logo>
        
        <NavLinksDesktop>
          <NavLink to="/" $active={location.pathname === '/'}>Home</NavLink>
          <NavLink to="/etherland" $active={location.pathname === '/etherland'}>Etherland</NavLink>
          <NavLink to="/astroverse" $active={location.pathname === '/astroverse'}>Astroverse</NavLink>
          <NavLink to="/profile" $active={location.pathname === '/profile'}>Profile</NavLink>
        </NavLinksDesktop>
        
        <MobileMenuButton open={open} onClick={() => setOpen(!open)}>
          <div />
          <div />
          <div />
        </MobileMenuButton>
        
        <AnimatedParticleArea>
          {particles.map(particle => (
            <Particle 
              key={particle.id}
              top={particle.top}
              left={particle.left}
              opacity={particle.opacity}
              duration={particle.duration}
              drift={particle.drift}
            />
          ))}
        </AnimatedParticleArea>
      </NavBar>
      
      <MobileMenu open={open}>
        <MobileLink to="/" $active={location.pathname === '/'}>Home</MobileLink>
        <MobileLink to="/etherland" $active={location.pathname === '/etherland'}>Etherland</MobileLink>
        <MobileLink to="/astroverse" $active={location.pathname === '/astroverse'}>Astroverse</MobileLink>
        <MobileLink to="/profile" $active={location.pathname === '/profile'}>Profile</MobileLink>
      </MobileMenu>
      
      <Content>{children}</Content>
    </>
  );
};

export default Layout;
