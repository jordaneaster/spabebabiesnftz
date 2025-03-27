import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import gsap from 'gsap';
import { Link } from 'react-router-dom';

// Animations
const float = keyframes`
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(3deg); }
  100% { transform: translateY(0px) rotate(0deg); }
`;

const rotate = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.05); opacity: 1; }
  100% { transform: scale(1); opacity: 0.8; }
`;

const starTwinkle = keyframes`
  0% { opacity: 0.4; }
  50% { opacity: 1; }
  100% { opacity: 0.4; }
`;

const Section = styled.section`
  min-height: 100vh;
  width: 100vw;
  background-color: #000000;
  background-image: 
    radial-gradient(circle at 10% 20%, rgba(40, 0, 80, 0.4) 0%, transparent 50%),
    radial-gradient(circle at 90% 80%, rgba(0, 80, 120, 0.4) 0%, transparent 50%);
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding-top: 3rem;
`;

const StarsContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  pointer-events: none;
`;

const Star = styled.div`
  position: absolute;
  width: ${props => props.size || 3}px;
  height: ${props => props.size || 3}px;
  background-color: #ffffff;
  border-radius: 50%;
  opacity: 0.8;
  animation: ${starTwinkle} ${props => props.duration || 3}s infinite ease-in-out;
  animation-delay: ${props => props.delay || 0}s;
  top: ${props => props.top || 0}%;
  left: ${props => props.left || 0}%;
`;

const NebulaNFT = styled.div`
  position: relative;
  z-index: 2;
  width: 90%;
  max-width: 1200px;
  border-radius: 20px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(5, 5, 15, 0.6);
  border: 1px solid rgba(174, 255, 0, 0.2);
  backdrop-filter: blur(10px);
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #aeff00;
  margin-bottom: 1.5rem;
  text-align: center;
  font-family: 'flegrei', sans-serif;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const NFTShowcase = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 2rem 0;
`;

const NFTDisplayContainer = styled.div`
  position: relative;
  width: 300px;
  height: 300px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    width: 250px;
    height: 250px;
  }
`;

const NFTOrbitalRing = styled.div`
  position: absolute;
  width: 340px;
  height: 340px;
  border: 1px solid rgba(174, 255, 0, 0.6);
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: ${rotate} 20s linear infinite;
  
  &:before {
    content: '';
    position: absolute;
    width: 15px;
    height: 15px;
    background: #aeff00;
    border-radius: 50%;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    box-shadow: 0 0 10px #aeff00, 0 0 20px #aeff00;
  }
  
  @media (max-width: 768px) {
    width: 290px;
    height: 290px;
  }
`;

const NFTSecondRing = styled.div`
  position: absolute;
  width: 400px;
  height: 400px;
  border: 1px dashed rgba(108, 0, 255, 0.4);
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: ${rotate} 30s linear infinite reverse;
  
  &:before {
    content: '';
    position: absolute;
    width: 12px;
    height: 12px;
    background: #6c00ff;
    border-radius: 50%;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    box-shadow: 0 0 10px #6c00ff, 0 0 15px #6c00ff;
  }
  
  @media (max-width: 768px) {
    width: 330px;
    height: 330px;
  }
`;

const NFTImage = styled.div`
  position: relative;
  width: 250px;
  height: 250px;
  border-radius: 50%;
  overflow: hidden;
  background: radial-gradient(circle, #1a002a 0%, #000000 100%);
  animation: ${float} 6s ease-in-out infinite;
  box-shadow: 0 5px 25px rgba(108, 0, 255, 0.5);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  
  img {
    width: 90%;
    height: 90%;
    object-fit: contain;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  
  &:before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, rgba(108, 0, 255, 0.2), rgba(174, 255, 0, 0.2));
    mix-blend-mode: screen;
    animation: ${pulse} 4s infinite ease-in-out;
  }
  
  @media (max-width: 768px) {
    width: 200px;
    height: 200px;
  }
`;

const NFTInfo = styled.div`
  width: 100%;
  max-width: 600px;
  margin-top: 2rem;
  padding: 1.5rem;
  border-radius: 15px;
  background: rgba(20, 20, 40, 0.7);
  border: 1px solid rgba(174, 255, 0, 0.3);
`;

const NFTName = styled.h2`
  color: #aeff00;
  font-size: 1.8rem;
  margin-bottom: 1rem;
  text-align: center;
`;

const AttributesTitle = styled.h3`
  color: #ffffff;
  font-size: 1.2rem;
  margin: 1rem 0;
  text-align: center;
`;

const AttributesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  margin-top: 1rem;
`;

const AttributeTag = styled.div`
  background: rgba(174, 255, 0, 0.1);
  border: 1px solid rgba(174, 255, 0, 0.3);
  border-radius: 20px;
  padding: 0.5rem 1rem;
  
  span {
    display: block;
    text-align: center;
    
    &:first-child {
      color: #aeff00;
      font-size: 0.9rem;
      margin-bottom: 0.2rem;
    }
    
    &:last-child {
      color: white;
      font-size: 1rem;
    }
  }
`;

const NavOptions = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const NavButton = styled(Link)`
  background-color: ${props => props.$primary ? 'rgba(174, 255, 0, 0.8)' : 'transparent'};
  color: ${props => props.$primary ? '#000000' : '#aeff00'};
  border: ${props => props.$primary ? 'none' : '2px solid #aeff00'};
  padding: 0.8rem 1.5rem;
  border-radius: 30px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-block;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(174, 255, 0, 0.3);
  }
`;

const Message = styled.div`
  color: #ffffff;
  background: rgba(108, 0, 255, 0.2);
  border: 1px solid rgba(108, 0, 255, 0.4);
  border-radius: 10px;
  padding: 1rem;
  max-width: 600px;
  margin: 2rem auto;
  text-align: center;
  
  h3 {
    color: #aeff00;
    margin-bottom: 0.5rem;
  }
  
  p {
    line-height: 1.6;
  }
`;

const Astroverse = () => {
  const [spaceBaby, setSpaceBaby] = useState(null);
  const [stars, setStars] = useState([]);
  const sectionRef = useRef(null);
  const tlRef = useRef(null);
  
  // Generate stars for the background
  useEffect(() => {
    const generatedStars = [];
    for (let i = 0; i < 100; i++) {
      generatedStars.push({
        id: i,
        size: Math.random() * 3 + 1,
        top: Math.random() * 100,
        left: Math.random() * 100,
        duration: Math.random() * 3 + 2,
        delay: Math.random() * 5
      });
    }
    setStars(generatedStars);
  }, []);
  
  // Load the minted Space Baby from session storage
  useEffect(() => {
    const loadSpaceBaby = () => {
      try {
        const currentBaby = sessionStorage.getItem('currentSpaceBaby');
        if (currentBaby) {
          setSpaceBaby(JSON.parse(currentBaby));
        } else {
          // If no specific baby, try to get the most recent from the collection
          const savedNFTs = JSON.parse(sessionStorage.getItem('spaceBabiesNFTs') || '[]');
          if (savedNFTs.length > 0) {
            // Get the most recent minted NFT
            setSpaceBaby(savedNFTs[savedNFTs.length - 1]);
          }
        }
      } catch (error) {
        console.error('Error loading Space Baby data:', error);
      }
    };
    
    loadSpaceBaby();
  }, []);
  
  // Animation when component mounts
  useEffect(() => {
    if (sectionRef.current) {
      tlRef.current = gsap.timeline();
      
      // Animate the NFT elements
      tlRef.current.fromTo(
        '.nft-showcase',
        {
          opacity: 0,
          y: 50
        },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: 'power3.out'
        }
      );
      
      // Animate the NFT info
      tlRef.current.fromTo(
        '.nft-info',
        {
          opacity: 0,
          y: 30
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out'
        },
        '-=0.5' // Start a bit before the previous animation ends
      );
      
      // Animate the navigation buttons
      tlRef.current.fromTo(
        '.nav-options',
        {
          opacity: 0,
          y: 20
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out'
        },
        '-=0.3'
      );
    }
  }, [spaceBaby]);
  
  return (
    <Section ref={sectionRef}>
      <StarsContainer>
        {stars.map(star => (
          <Star 
            key={star.id}
            size={star.size}
            top={star.top}
            left={star.left}
            duration={star.duration}
            delay={star.delay}
          />
        ))}
      </StarsContainer>
      
      <Title>Welcome to the Astroverse</Title>
      
      <NebulaNFT>
        {spaceBaby ? (
          <>
            <NFTShowcase className="nft-showcase">
              <NFTDisplayContainer>
                <NFTOrbitalRing />
                <NFTSecondRing />
                <NFTImage>
                  <img src={spaceBaby.image} alt={spaceBaby.name} />
                </NFTImage>
              </NFTDisplayContainer>
            </NFTShowcase>
            
            <NFTInfo className="nft-info">
              <NFTName>{spaceBaby.name}</NFTName>
              
              <AttributesTitle>Soul Attributes</AttributesTitle>
              <AttributesContainer>
                {spaceBaby.attributes && spaceBaby.attributes.map((attr, index) => (
                  <AttributeTag key={index}>
                    <span>{attr.trait_type}</span>
                    <span>{attr.value}</span>
                  </AttributeTag>
                ))}
              </AttributesContainer>
            </NFTInfo>
          </>
        ) : (
          <Message>
            <h3>No Space Baby Found</h3>
            <p>You haven't created a Space Baby yet. Visit Etherland to generate your cosmic companion!</p>
          </Message>
        )}
        
        <NavOptions className="nav-options">
          <NavButton to="/etherland">Back to Etherland</NavButton>
          <NavButton to="/profile" $primary>View Your Collection</NavButton>
        </NavOptions>
      </NebulaNFT>
    </Section>
  );
};

export default Astroverse;
