import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Navbar from './Navbar';

const Content = styled.main`
  padding-top: 120px; /* Increased to accommodate the centered navbar */
  
  @media (max-width: 768px) {
    padding-top: 160px; /* More space for mobile navbar layout */
  }
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
  const [particles, setParticles] = useState([]);
  
  // Generate particles for the background effect
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
  
  return (
    <>
      <Navbar />
      
      <Content>{children}</Content>
      
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
    </>
  );
};

export default Layout;
