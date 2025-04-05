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

const glowPulse = keyframes`
  0% { box-shadow: 0 0 5px rgba(174, 255, 0, 0.5); }
  50% { box-shadow: 0 0 20px rgba(174, 255, 0, 0.8); }
  100% { box-shadow: 0 0 5px rgba(174, 255, 0, 0.5); }
`;

const fadeSlideIn = keyframes`
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
`;

const Section = styled.section`
  min-height: 100vh;
  width: 100vw;
  background-color: #000000;
  background-image: 
    radial-gradient(circle at 10% 20%, rgba(40, 0, 80, 0.4) 0%, transparent 50%),
    radial-gradient(circle at 90% 80%, rgba(0, 80, 120, 0.4) 0%, transparent 50%);
  position: relative;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 3rem 1rem;
`;

const GalaxyNav = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  max-width: 800px;
  margin-bottom: 2rem;
  background: rgba(5, 5, 15, 0.4);
  border-radius: 50px;
  padding: 0.5rem;
  position: relative;
  z-index: 5;
`;

const GalaxyLink = styled(Link)`
  padding: 0.8rem 1.5rem;
  text-decoration: none;
  color: ${props => props.active ? '#000' : '#aeff00'};
  background: ${props => props.active ? '#aeff00' : 'transparent'};
  border-radius: 30px;
  transition: all 0.3s ease;
  font-weight: 600;
  
  &:hover {
    background: ${props => props.active ? '#aeff00' : 'rgba(174, 255, 0, 0.2)'};
  }
`;

const CitizenDashboard = styled.div`
  width: 100%;
  max-width: 1200px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  margin-top: 1rem;
  
  @media (min-width: 992px) {
    grid-template-columns: 360px 1fr;
  }
`;

const CitizenBadge = styled.div`
  background: rgba(5, 5, 15, 0.6);
  border: 1px solid rgba(174, 255, 0, 0.3);
  border-radius: 20px;
  padding: 1.5rem;
  animation: ${fadeSlideIn} 0.8s ease-out forwards;
  backdrop-filter: blur(10px);
  
  h3 {
    color: #aeff00;
    font-size: 1.3rem;
    margin-bottom: 1rem;
    text-align: center;
  }
`;

const CitizenshipInfo = styled.div`
  background: rgba(5, 5, 15, 0.5);
  border-radius: 15px;
  padding: 1rem;
  margin-top: 1.5rem;
  border: 1px solid rgba(108, 0, 255, 0.3);
  
  p {
    color: #fff;
    margin-bottom: 0.5rem;
    font-size: 0.95rem;
  }
  
  .info-row {
    display: flex;
    justify-content: space-between;
    padding: 0.5rem 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    
    &:last-child {
      border-bottom: none;
    }
    
    span:first-child {
      color: rgba(255, 255, 255, 0.8);
    }
    
    span:last-child {
      color: #aeff00;
      font-weight: 600;
    }
  }
`;

const ContentSection = styled.div`
  background: rgba(5, 5, 15, 0.6);
  border: 1px solid rgba(174, 255, 0, 0.3);
  border-radius: 20px;
  padding: 1.5rem;
  animation: ${fadeSlideIn} 0.8s ease-out forwards;
  animation-delay: ${props => props.delay || '0s'};
  opacity: 0;
  backdrop-filter: blur(10px);
  
  h2 {
    color: #aeff00;
    font-size: 1.5rem;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    
    svg {
      margin-right: 0.8rem;
    }
  }
`;

const TabMenu = styled.div`
  display: flex;
  overflow-x: auto;
  padding-bottom: 0.5rem;
  margin-bottom: 1.5rem;
  
  &::-webkit-scrollbar {
    height: 3px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
  }
  
  &::-webkit-scrollbar-thumb {
    background: #aeff00;
    border-radius: 10px;
  }
`;

const TabButton = styled.button`
  background: ${props => props.active ? 'rgba(174, 255, 0, 0.2)' : 'transparent'};
  border: 1px solid ${props => props.active ? '#aeff00' : 'rgba(255, 255, 255, 0.3)'};
  color: ${props => props.active ? '#aeff00' : '#ffffff'};
  padding: 0.6rem 1.2rem;
  border-radius: 20px;
  margin-right: 0.8rem;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(174, 255, 0, 0.1);
  }
`;

const BenefitCard = styled.div`
  background: rgba(20, 20, 40, 0.5);
  border: 1px solid rgba(108, 0, 255, 0.3);
  border-radius: 15px;
  padding: 1.2rem;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(108, 0, 255, 0.3);
  }
  
  h4 {
    color: #aeff00;
    margin-bottom: 0.8rem;
    display: flex;
    align-items: center;
    
    svg {
      margin-right: 0.5rem;
    }
  }
  
  p {
    color: #ffffff;
    line-height: 1.5;
  }
`;

const LoadingBar = styled.div`
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  position: relative;
  overflow: hidden;
  margin: 1rem 0;
  
  &:after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: ${props => props.progress || '0%'};
    background: linear-gradient(90deg, #6c00ff 0%, #aeff00 100%);
    border-radius: 10px;
    transition: width 1s ease;
  }
`;

const InitiativeGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-top: 1rem;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const InitiativeCard = styled.div`
  background: rgba(20, 20, 40, 0.5);
  border: 1px solid rgba(174, 255, 0, 0.3);
  border-radius: 15px;
  padding: 1.2rem;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(174, 255, 0, 0.2);
  }
  
  h4 {
    color: #aeff00;
    margin-bottom: 0.8rem;
  }
  
  p {
    color: #ffffff;
    font-size: 0.95rem;
    margin-bottom: 1rem;
    line-height: 1.5;
  }
`;

const VoteButtons = styled.div`
  display: flex;
  gap: 0.8rem;
  margin-top: 1rem;
`;

const VoteButton = styled.button`
  background: ${props => props.voted ? 'rgba(174, 255, 0, 0.8)' : 'transparent'};
  color: ${props => props.voted ? '#000' : '#aeff00'};
  border: 1px solid #aeff00;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  
  svg {
    margin-right: 0.5rem;
  }
  
  &:hover {
    background: ${props => props.voted ? 'rgba(174, 255, 0, 0.8)' : 'rgba(174, 255, 0, 0.2)'};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const RoadmapSection = styled.div`
  position: relative;
  padding-left: 2rem;
  margin-top: 1rem;
  
  &:before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background: linear-gradient(to bottom, #aeff00, #6c00ff);
    border-radius: 3px;
  }
`;

const RoadmapItem = styled.div`
  position: relative;
  margin-bottom: 2rem;
  padding-left: 1.5rem;
  
  &:before {
    content: '';
    position: absolute;
    left: -1.5rem;
    top: 0;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background: ${props => props.unlocked ? '#aeff00' : props.current ? '#6c00ff' : 'rgba(255, 255, 255, 0.2)'};
    border: 2px solid ${props => props.unlocked ? '#aeff00' : props.current ? '#6c00ff' : 'rgba(255, 255, 255, 0.2)'};
    animation: ${props => props.current ? glowPulse : 'none'} 2s infinite;
  }
  
  h4 {
    color: ${props => props.unlocked ? '#aeff00' : props.current ? '#6c00ff' : '#ffffff'};
    margin-bottom: 0.5rem;
  }
  
  p {
    color: ${props => props.unlocked || props.current ? '#ffffff' : 'rgba(255, 255, 255, 0.6)'};
    font-size: 0.95rem;
    line-height: 1.5;
  }
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

const Title = styled.h1`
  font-size: 2.5rem;
  color: #aeff00;
  margin-bottom: 1rem;
  text-align: center;
  font-family: 'flegrei', sans-serif;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.p`
  color: #ffffff;
  font-size: 1.1rem;
  text-align: center;
  max-width: 800px;
  margin-bottom: 2rem;
  opacity: 0.9;
`;

const NFTDisplayContainer = styled.div`
  position: relative;
  width: 280px;
  height: 280px;
  margin: 0 auto;
  margin-bottom: 2rem;
  overflow: visible;
  left: 0%;
  @media (max-width: 768px) {
    width: 240px;
    height: 240px;
  }
`;

const NFTOrbitalRing = styled.div`
  position: absolute;
  width: 320px;
  height: 320px;
  border: 1px solid rgba(174, 255, 0, 0.6);
  border-radius: 50%;
  top: -5%;
  left: -5%;
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
    width: 280px;
    height: 280px;
  }
`;

const NFTSecondRing = styled.div`
  position: absolute;
  width: 370px;
  height: 370px;
  border: 1px dashed rgba(108, 0, 255, 0.4);
  border-radius: 50%;
  top: -9%;
  left: -5%;
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
  position: absolute;
  width: 220px;
  height: 220px;
  border-radius: 50%;
  overflow: hidden;
  background: radial-gradient(circle, #1a002a 0%, #000000 100%);
  animation: ${float} 6s ease-in-out infinite;
  box-shadow: 0 5px 25px rgba(108, 0, 255, 0.5);
  top: 20%;
  left: 13%;
  transform: translate(-50%, -50%);
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%; /* Ensures the image itself is rounded */
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
    width: 180px;
    height: 180px;
  }
`;

const AttributesTitle = styled.h3`
  color: #ffffff;
  font-size: 1.2rem;
  margin-top: 2rem; /* Reduced from 4rem to 2rem since we moved image up */
  margin-bottom: 1rem;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  clear: both;
  
  svg {
    margin-right: 0.5rem;
    color: #aeff00;
  }
`;

const AttributesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
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

const ActionButton = styled.button`
  background: ${props => props.$secondary ? 'transparent' : 'linear-gradient(90deg, #6c00ff 0%, #aeff00 100%)'};
  border: ${props => props.$secondary ? '1px solid #aeff00' : 'none'};
  color: ${props => props.$secondary ? '#aeff00' : '#000000'};
  padding: 0.7rem 1.5rem;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  
  svg {
    margin-right: 0.5rem;
  }
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(108, 0, 255, 0.4);
  }
`;

const Astroverse = () => {
  const [spaceBaby, setSpaceBaby] = useState(null);
  const [stars, setStars] = useState([]);
  const [activeTab, setActiveTab] = useState('benefits');
  const [votes, setVotes] = useState({});
  const [loadingProgress, setLoadingProgress] = useState(35);
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
    
    // Simulate loading progress
    const loadingInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(loadingInterval);
          return 100;
        }
        return prev + 5;
      });
    }, 300);
    
    return () => clearInterval(loadingInterval);
  }, []);
  
  // Animation when component mounts
  useEffect(() => {
    if (sectionRef.current) {
      tlRef.current = gsap.timeline();
      
      // Animate the header elements
      tlRef.current.fromTo(
        '.header-content',
        {
          opacity: 0,
          y: -30
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out'
        }
      );
      
      // Animate the galaxy navigation
      tlRef.current.fromTo(
        '.galaxy-nav',
        {
          opacity: 0,
          y: 20
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out'
        },
        '-=0.5'
      );
      
      // Animate the dashboard elements with staggered timing
      tlRef.current.fromTo(
        '.dashboard-item',
        {
          opacity: 0,
          y: 30
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: 'power2.out'
        },
        '-=0.3'
      );
    }
  }, [spaceBaby]);
  
  const handleVote = (initiativeId, vote) => {
    setVotes(prev => ({
      ...prev,
      [initiativeId]: vote
    }));
    
    // Here you would typically send the vote to your backend
    console.log(`Voted ${vote} for initiative ${initiativeId}`);
  };
  
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
      
      <div className="header-content">
        <Title>Welcome to the Astroverse</Title>
        <Subtitle>
          As a guardian of a Space Baby, you have citizenship in the Astroverse galaxy. 
          Access exclusive content, participate in community initiatives, and help shape the future of SBU.
        </Subtitle>
      </div>
      
      <GalaxyNav className="galaxy-nav">
        <GalaxyLink to="/etherland">ETHERLand</GalaxyLink>
        <GalaxyLink to="/metroverse">METROVerse</GalaxyLink>
        <GalaxyLink to="/astroverse" active="true">ASTROVerse</GalaxyLink>
      </GalaxyNav>
      
      {spaceBaby ? (
        <CitizenDashboard>
          <CitizenBadge className="dashboard-item">
            <h3>Your Astroverse Citizen</h3>
            <NFTDisplayContainer>
              <NFTOrbitalRing />
              <NFTSecondRing />
              <NFTImage>
                <img src={spaceBaby.image} alt={spaceBaby.name} />
              </NFTImage>
            </NFTDisplayContainer>
            
            <CitizenshipInfo>
              <div className="info-row">
                <span>Name:</span>
                <span>{spaceBaby.name}</span>
              </div>
              <div className="info-row">
                <span>Citizenship ID:</span>
                <span>#{spaceBaby.id || Math.floor(Math.random() * 4000) + 1}</span>
              </div>
              <div className="info-row">
                <span>Status:</span>
                <span>Active Guardian</span>
              </div>
              <div className="info-row">
                <span>Joined:</span>
                <span>{new Date().toLocaleDateString()}</span>
              </div>
            </CitizenshipInfo>
            
            <AttributesTitle>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
              </svg>
              Soul Attributes
            </AttributesTitle>
            <AttributesContainer>
              {spaceBaby.attributes && spaceBaby.attributes.map((attr, index) => (
                <AttributeTag key={index}>
                  <span>{attr.trait_type}</span>
                  <span>{attr.value}</span>
                </AttributeTag>
              ))}
            </AttributesContainer>
          </CitizenBadge>
          
          <div>
            <ContentSection className="dashboard-item">
              <h2>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                  <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                </svg>
                Astroverse Hub
              </h2>
              
              <TabMenu>
                <TabButton active={activeTab === 'benefits'} onClick={() => setActiveTab('benefits')}>
                  Guardian Benefits
                </TabButton>
                <TabButton active={activeTab === 'community'} onClick={() => setActiveTab('community')}>
                  Community Initiatives
                </TabButton>
                <TabButton active={activeTab === 'roadmap'} onClick={() => setActiveTab('roadmap')}>
                  Future Roadmap
                </TabButton>
                <TabButton active={activeTab === 'income'} onClick={() => setActiveTab('income')}>
                  Passive Income
                </TabButton>
              </TabMenu>
              
              {activeTab === 'benefits' && (
                <>
                  <BenefitCard>
                    <h4>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zm.995-14.901a1 1 0 1 0-1.99 0A5.002 5.002 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901z"/>
                      </svg>
                      Member-Only Content Access
                    </h4>
                    <p>Exclusive access to art drops, digital experiences, and special content curated for Astroverse citizens only.</p>
                    <ActionButton>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
                      </svg>
                      Access Content Hub
                    </ActionButton>
                  </BenefitCard>
                  
                  <BenefitCard>
                    <h4>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                        <path d="M8 3a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 3zm4 8a4 4 0 0 1-8 0V5a4 4 0 0 1 8 0v6z"/>
                      </svg>
                      Interactive Platforms
                    </h4>
                    <p>Access to members-only interactive platforms including DAO voting systems, community chat channels, and metaverse integration experiences.</p>
                    <ActionButton>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5z"/>
                      </svg>
                      Join Platforms
                    </ActionButton>
                  </BenefitCard>
                  
                  <BenefitCard>
                    <h4>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M13.442 2.558a.625.625 0 0 1 0 .884l-10 10a.625.625 0 1 1-.884-.884l10-10a.625.625 0 0 1 .884 0zM4.5 6a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm0 1a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zm7 6a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm0 1a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"/>
                      </svg>
                      Early Access to New Features
                    </h4>
                    <p>Be the first to experience new Space Babiez features, collaborations, and expansions into new galaxies.</p>
                    <ActionButton>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"/>
                      </svg>
                      Check Beta Features
                    </ActionButton>
                  </BenefitCard>
                </>
              )}
              
              {activeTab === 'community' && (
                <>
                  <InitiativeGrid>
                    <InitiativeCard>
                      <h4>Astroverse Expansion Proposal</h4>
                      <p>Vote on the next area of expansion for the Astroverse. Options include gaming partnerships, AR experiences, or interactive storytelling.</p>
                      <LoadingBar progress="68%" />
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                        <span style={{ color: '#aeff00' }}>254 votes</span>
                        <span style={{ color: '#ffffff' }}>3 days left</span>
                      </div>
                      <VoteButtons>
                        <VoteButton 
                          voted={votes['expansion'] === 'games'} 
                          onClick={() => handleVote('expansion', 'games')}
                          disabled={votes['expansion'] && votes['expansion'] !== 'games'}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                            <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                          </svg>
                          Gaming
                        </VoteButton>
                        <VoteButton 
                          voted={votes['expansion'] === 'ar'} 
                          onClick={() => handleVote('expansion', 'ar')}
                          disabled={votes['expansion'] && votes['expansion'] !== 'ar'}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm3.646 10.646a.5.5 0 0 1-.708 0L8 8.707l-2.938 2.939a.5.5 0 0 1-.707-.708L7.293 8 4.354 5.061a.5.5 0 1 1 .707-.708L8 7.293l2.938-2.939a.5.5 0 0 1 .708.707L8.707 8l2.939 2.938a.5.5 0 0 1 0 .708z"/>
                          </svg>
                          AR Tech
                        </VoteButton>
                        <VoteButton 
                          voted={votes['expansion'] === 'story'} 
                          onClick={() => handleVote('expansion', 'story')}
                          disabled={votes['expansion'] && votes['expansion'] !== 'story'}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M8.93 6.588-2.29.287-.082.38 7.68 3.687l.177-.235c.236-.332.475-.662.808-1.283a13.57 13.57 0 0 0-1.13-.824l-.012-.008a2.12 2.12 0 0 1-.241-.176l-.008-.007c-.149-.129-.348-.226-.554-.226-.631 0-1.477.892-1.929 1.519-.452.627-1.233 1.28-1.729 2.031l-.009.013a.35.35 0 0 0-.009.375c.464-.084 1.607.979 1.869 1.269a2.24 2.24 0 0 0-.082.858c.067.431.339.723.594.826.256.103.587.066.915-.287.323-.353.666-.899.924-1.512.216-.544.395-.898.466-1.223L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                          </svg>
                          Story
                        </VoteButton>
                      </VoteButtons>
                    </InitiativeCard>
                    
                    <InitiativeCard>
                      <h4>Charity Selection</h4>
                      <p>Help select which charitable cause 5% of the next collection's proceeds will benefit.</p>
                      <LoadingBar progress="42%" />
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                        <span style={{ color: '#aeff00' }}>178 votes</span>
                        <span style={{ color: '#ffffff' }}>5 days left</span>
                      </div>
                      <VoteButtons>
                        <VoteButton 
                          voted={votes['charity'] === 'environment'} 
                          onClick={() => handleVote('charity', 'environment')}
                          disabled={votes['charity'] && votes['charity'] !== 'environment'}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm3 4.3c0 .4-.2.7-.5 1-.4.4-.7.9-.8 1.4-.2.6-.1 1.4.5 2.4.6 1 .3 1.9-.2 2.4-.5.5-1.3.7-2.1.1-.9-.6-1.5-.3-1.9.2-.4.4-.4 1.2 0 2 .2.5-.1 1-.6 1.2-.5.2-1.1 0-1.3-.5-.3-1-.8-1.4-1.3-1.5-.7-.1-1.3.3-1.6.9-.2.5-.7.7-1.1.5-.5-.2-.7-.8-.5-1.3.5-1 .2-1.9-.5-2.4s-.7-1.4-.2-2.4c.6-1 .6-1.7.4-2.2-.2-.5-.6-1-1.2-1.1-.6-.1-.8-.8-.7-1.3.2-.5.6-.8 1.2-.6.9.2 1.7-.1 2.1-.7.4-.6.4-1.5-.1-2.3-.3-.5-.3-1.1.3-1.3.5-.2 1.1 0 1.3.5.7 1.3 2 1.3 2.8.1.3-.5.9-.7 1.3-.4.5.3.6.9.3 1.4-.8 1.3-.6 2.3.5 2.8.5.2.9.7.6 1.3z"/>
                          </svg>
                          Environment
                        </VoteButton>
                        <VoteButton 
                          voted={votes['charity'] === 'education'} 
                          onClick={() => handleVote('charity', 'education')}
                          disabled={votes['charity'] && votes['charity'] !== 'education'}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M8 0a.5.5 0 0 1 .473.337L9.046 2H14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h4.954L7.527.337A.5.5 0 0 1 8 0zM1 6v-.5a.5.5 0 0 1 1 0V6h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0V9h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0v.5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1z"/>
                          </svg>
                          Education
                        </VoteButton>
                        <VoteButton 
                          voted={votes['charity'] === 'health'} 
                          onClick={() => handleVote('charity', 'health')}
                          disabled={votes['charity'] && votes['charity'] !== 'health'}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"/>
                            <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z"/>
                          </svg>
                          Healthcare
                        </VoteButton>
                      </VoteButtons>
                    </InitiativeCard>
                    
                    <InitiativeCard>
                      <h4>Next Collection Theme</h4>
                      <p>Share your input on the creative direction for the next Space Babiez collection.</p>
                      <LoadingBar progress="87%" />
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                        <span style={{ color: '#aeff00' }}>412 votes</span>
                        <span style={{ color: '#ffffff' }}>1 day left</span>
                      </div>
                      <VoteButtons>
                        <VoteButton 
                          voted={votes['theme'] === 'cosmic'} 
                          onClick={() => handleVote('theme', 'cosmic')}
                          disabled={votes['theme'] && votes['theme'] !== 'cosmic'}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0ZM5.78 8.75a9.64 9.64 0 0 0 1.363 4.177c.255.426.542.832.857 1.215.245-.296.551-.705.857-1.215A9.64 9.64 0 0 0 10.22 8.75Zm4.44-1.5a9.64 9.64 0 0 0-1.363-4.177c-.307-.51-.612-.919-.857-1.215a9.927 9.927 0 0 0-.857 1.215A9.64 9.64 0 0 0 5.78 7.25Zm-5.944 1.5H1.543a6.507 6.507 0 0 0 4.666 5.5c-.123-.181-.24-.365-.352-.552-.715-1.192-1.437-2.874-1.581-4.948Zm-2.733-1.5h2.733c.144-2.074.866-3.756 1.58-4.948.12-.197.237-.381.353-.552a6.507 6.507 0 0 0-4.666 5.5Zm10.181 1.5c-.144 2.074-.866 3.756-1.58 4.948-.12.197-.237.381-.353.552a6.507 6.507 0 0 0 4.666-5.5Zm2.733-1.5a6.507 6.507 0 0 0-4.666-5.5c.123.181.24.365.353.552.714 1.192 1.437 2.874 1.58 4.948Z"/>
                          </svg>
                          Cosmic
                        </VoteButton>
                        <VoteButton 
                          voted={votes['theme'] === 'elemental'} 
                          onClick={() => handleVote('theme', 'elemental')}
                          disabled={votes['theme'] && votes['theme'] !== 'elemental'}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M2 6a6 6 0 1 1 10.174 4.31c-.203.196-.359.4-.453.619l-.762 1.769A.5.5 0 0 1 10.5 13h-5a.5.5 0 0 1-.46-.302l-.761-1.77a1.964 1.964 0 0 0-.453-.618A5.984 5.984 0 0 1 2 6zm10.356 4.695C14.066 8.159 16 8.4 16 8.4c0-.059-.1-.3-.978-.932C13.144 6.1 9.357 6 8 6c-1.357 0-5.144.1-7.022 1.468C.022 8.1 0 8.41 0 8.4c0 0 1.934-.24 3.644 2.295C4.679 11.768 5.501 13 8 13s3.321-1.232 4.356-2.305z"/>
                          </svg>
                          Elemental
                        </VoteButton>
                        <VoteButton 
                          voted={votes['theme'] === 'cyber'} 
                          onClick={() => handleVote('theme', 'cyber')}
                          disabled={votes['theme'] && votes['theme'] !== 'cyber'}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M6 12.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5ZM3 8.062C3 6.76 4.235 5.765 5.53 5.886a26.58 26.58 0 0 0 4.94 0C11.765 5.765 13 6.76 13 8.062v1.157a.933.933 0 0 1-.765.935c-.845.147-2.34.346-4.235.346-1.895 0-3.39-.2-4.235-.346A.933.933 0 0 1 3 9.219V8.062Zm4.542-.827a.25.25 0 0 0-.217.068l-.92.9a24.767 24.767 0 0 1-1.871-.183.25.25 0 0 0-.068.495c.55.076 1.232.149 2.02.193a.25.25 0 0 0 .189-.071l.754-.736.847 1.71a.25.25 0 0 0 .404.062l.932-.97a25.286 25.286 0 0 0 1.922-.188.25.25 0 0 0-.068-.495c-.538.074-1.207.145-1.98.189a.25.25 0 0 0-.166.076l-.754.785-.842-1.7a.25.25 0 0 0-.182-.135Z"/>
                            <path d="M8.5 1.866a1 1 0 1 0-1 0V3h-2A4.5 4.5 0 0 0 1 7.5V8a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1v1a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1v-.5A4.5 4.5 0 0 0 10.5 3h-2V1.866ZM14 7.5V13a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7.5A3.5 3.5 0 0 1 5.5 4h5A3.5 3.5 0 0 1 14 7.5Z"/>
                          </svg>
                          Cyber
                        </VoteButton>
                      </VoteButtons>
                    </InitiativeCard>
                    
                    <InitiativeCard>
                      <h4>Community Events</h4>
                      <p>Select which type of community event you'd prefer to attend in the next quarter.</p>
                      <LoadingBar progress="54%" />
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                        <span style={{ color: '#aeff00' }}>198 votes</span>
                        <span style={{ color: '#ffffff' }}>4 days left</span>
                      </div>
                      <VoteButtons>
                        <VoteButton 
                          voted={votes['event'] === 'virtual'} 
                          onClick={() => handleVote('event', 'virtual')}
                          disabled={votes['event'] && votes['event'] !== 'virtual'}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M0 3a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3zm9.5 5.5h-3a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1zm-6.354-.354a.5.5 0 1 0 .708.708l2-2a.5.5 0 0 0 0-.708l-2-2a.5.5 0 1 0-.708.708L4.793 6.5 3.146 8.146z"/>
                          </svg>
                          Virtual
                        </VoteButton>
                        <VoteButton 
                          voted={votes['event'] === 'in-person'} 
                          onClick={() => handleVote('event', 'in-person')}
                          disabled={votes['event'] && votes['event'] !== 'in-person'}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M14 9.5a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm-6 5.7c0 .8.8.8.8.8h6.4s.8 0 .8-.8-.8-3.2-4-3.2-4 2.4-4 3.2Z"/>
                            <path d="M2 2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h5.243c.122-.326.295-.668.526-1H2a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v7.81c.353.23.656.496.91.783.059-.187.09-.386.09-.593V4a2 2 0 0 0-2-2H2Z"/>
                          </svg>
                          In-Person
                        </VoteButton>
                        <VoteButton 
                          voted={votes['event'] === 'hybrid'} 
                          onClick={() => handleVote('event', 'hybrid')}
                          disabled={votes['event'] && votes['event'] !== 'hybrid'}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                            <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z"/>
                          </svg>
                          Hybrid
                        </VoteButton>
                      </VoteButtons>
                    </InitiativeCard>
                  </InitiativeGrid>
                  
                  <Message>
                    <h3>Community Governance</h3>
                    <p>As a Space Baby guardian, your voice matters in the Astroverse. Participation in community votes grants you AstroPoints which can be redeemed for exclusive perks and NFTs.</p>
                    <ActionButton $secondary style={{ marginTop: '1rem' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                        <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                      </svg>
                      View Governance Guidelines
                    </ActionButton>
                  </Message>
                </>
              )}
              
              {activeTab === 'roadmap' && (
                <>
                  <p style={{ color: '#ffffff', marginBottom: '2rem' }}>
                    Track the Astroverse expansion and see what's coming next for Space Babiez citizens. 
                    Phases are unlocked as community milestones are reached.
                  </p>
                  
                  <RoadmapSection>
                    <RoadmapItem unlocked>
                      <h4>Phase 1: Astroverse Citizenship</h4>
                      <p>Establishment of the Astroverse community hub, citizen benefits program, and governance platform.</p>
                      <div style={{ color: '#aeff00', fontSize: '0.9rem', marginTop: '0.5rem' }}>✓ Completed</div>
                    </RoadmapItem>
                    
                    <RoadmapItem current>
                      <h4>Phase 2: Expansion of Benefits</h4>
                      <p>Introduction of passive income opportunities, cross-platform integration, and advanced community governance tools.</p>
                      <div style={{ color: '#6c00ff', fontSize: '0.9rem', marginTop: '0.5rem' }}>◉ In Progress</div>
                      <LoadingBar progress="65%" />
                    </RoadmapItem>
                    
                    <RoadmapItem>
                      <h4>Phase 3: Metaverse Integration</h4>
                      <p>Launch of Space Babiez virtual environments, interactive 3D avatars, and metaverse citizenship privileges.</p>
                    </RoadmapItem>
                    
                    <RoadmapItem>
                      <h4>Phase 4: Cross-Chain Expansion</h4>
                      <p>Space Babiez will expand to multiple blockchains, creating interoperable assets and unified citizenship across platforms.</p>
                    </RoadmapItem>
                    
                    <RoadmapItem>
                      <h4>Phase 5: Real-world Utility</h4>
                      <p>Implementation of real-world benefits and utilities for Space Baby guardians, including exclusive merchandise, event access, and brand partnerships.</p>
                    </RoadmapItem>
                  </RoadmapSection>
                  
                  <Message>
                    <h3>Community-Driven Development</h3>
                    <p>The roadmap evolves based on community input. New phases and initiatives are added as the Astroverse grows. Stay engaged to influence our direction!</p>
                    <ActionButton $secondary style={{ marginTop: '1rem' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                      </svg>
                      Suggest New Features
                    </ActionButton>
                  </Message>
                </>
              )}
              
              {activeTab === 'income' && (
                <>
                  <p style={{ color: '#ffffff', marginBottom: '2rem' }}>
                    Your Space Baby can generate passive income through multiple streams in the Astroverse. 
                    Explore the opportunities available to guardian citizens.
                  </p>
                  
                  <InitiativeGrid>
                    <InitiativeCard>
                      <h4>NFT Staking</h4>
                      <p>Stake your Space Baby to earn AstroTokens that can be exchanged for crypto or used within the ecosystem.</p>
                      <div style={{ background: 'rgba(108, 0, 255, 0.2)', padding: '1rem', borderRadius: '10px', marginTop: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                          <span style={{ color: '#ffffff' }}>Daily Rate:</span>
                          <span style={{ color: '#aeff00' }}>5-15 AT</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#ffffff' }}>Status:</span>
                          <span style={{ color: '#ff5500' }}>Coming Soon</span>
                        </div>
                      </div>
                      <ActionButton $secondary style={{ marginTop: '1rem', width: '100%' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M8 0a1 1 0 0 1 1 1v5.268l4.562-2.634a1 1 0 1 1 1 1.732L10 8l4.562 2.634a1 1 0 1 1-1 1.732L9 9.732V15a1 1 0 1 1-2 0V9.732l-4.562 2.634a1 1 0 1 1-1-1.732L6 8 1.438 5.366a1 1 0 0 1 1-1.732L7 6.268V1a1 1 0 0 1 1-1z"/>
                        </svg>
                        Join Waitlist
                      </ActionButton>
                    </InitiativeCard>
                    
                    <InitiativeCard>
                      <h4>Commercial Rights</h4>
                      <p>Use your Space Baby's image for commercial projects and merchandise, subject to community guidelines.</p>
                      <div style={{ background: 'rgba(108, 0, 255, 0.2)', padding: '1rem', borderRadius: '10px', marginTop: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                          <span style={{ color: '#ffffff' }}>License Type:</span>
                          <span style={{ color: '#aeff00' }}>Commercial Use</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#ffffff' }}>Status:</span>
                          <span style={{ color: '#aeff00' }}>Active</span>
                        </div>
                      </div>
                      <ActionButton style={{ marginTop: '1rem', width: '100%' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0zM9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1zm1.354 4.354-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708.708z"/>
                        </svg>
                        View License Terms
                      </ActionButton>
                    </InitiativeCard>
                    
                    <InitiativeCard>
                      <h4>Revenue Sharing</h4>
                      <p>Earn a share of future collection revenues and ecosystem transactions as an early citizen.</p>
                      <div style={{ background: 'rgba(108, 0, 255, 0.2)', padding: '1rem', borderRadius: '10px', marginTop: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                          <span style={{ color: '#ffffff' }}>Share Rate:</span>
                          <span style={{ color: '#aeff00' }}>0.5% - 2%</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#ffffff' }}>Status:</span>
                          <span style={{ color: '#ff5500' }}>Coming Q3</span>
                        </div>
                      </div>
                      <ActionButton $secondary style={{ marginTop: '1rem', width: '100%' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M5.5 9.511c.076.954.83 1.697 2.182 1.785V12h.6v-.709c1.4-.098 2.218-.846 2.218-1.932 0-.987-.626-1.496-1.745-1.76l-.473-.112V5.57c.6.068.982.396 1.074.85h1.052c-.076-.919-.864-1.638-2.126-1.716V4h-.6v.719c-1.195.117-2.01.836-2.01 1.853 0 .9.606 1.472 1.613 1.707l.397.098v2.034c-.615-.093-1.022-.43-1.114-.9H5.5zm2.177-2.166c-.59-.137-.91-.416-.91-.836 0-.47.345-.822.915-.925v1.76h-.005zm.692 1.193c.717.166 1.048.435 1.048.91 0 .542-.412.914-1.135.982V8.518l.087.02z"/>
                          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                          <path d="M8 13.5a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11zm0 .5A6 6 0 1 0 8 2a6 6 0 0 0 0 12z"/>
                        </svg>
                        Program Details
                      </ActionButton>
                    </InitiativeCard>
                    
                    <InitiativeCard>
                      <h4>Play-to-Earn</h4>
                      <p>Use your Space Baby as a character in upcoming SBU games and experiences to earn rewards.</p>
                      <div style={{ background: 'rgba(108, 0, 255, 0.2)', padding: '1rem', borderRadius: '10px', marginTop: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                          <span style={{ color: '#ffffff' }}>Game Status:</span>
                          <span style={{ color: '#aeff00' }}>In Development</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#ffffff' }}>Launch:</span>
                          <span style={{ color: '#ff5500' }}>Q4 2023</span>
                        </div>
                      </div>
                      <ActionButton $secondary style={{ marginTop: '1rem', width: '100%' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M11.5 6.027a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zm-1.5 1.5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1zm2.5-.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zm-1.5 1.5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1zm-6.5-3h1v1h1v1h-1v1h-1v-1h-1v-1h1v-1z"/>
                          <path d="M3.051 3.26a.5.5 0 0 1 .354-.613l1.932-.518a.5.5 0 0 1 .62.39c.655-.079 1.35-.117 2.043-.117.72 0 1.443.041 2.12.126a.5.5 0 0 1 .622-.399l1.932.518a.5.5 0 0 1 .306.729c.14.09.266.19.373.297.408.408.78 1.05 1.095 1.772.32.733.599 1.591.805 2.466.206.875.34 1.78.364 2.606.024.816-.059 1.602-.328 2.21a1.42 1.42 0 0 1-1.445.83c-.636-.067-1.115-.394-1.513-.773-.245-.232-.496-.526-.739-.808-.126-.148-.25-.292-.368-.423-.728-.804-1.597-1.527-3.224-1.527-1.627 0-2.496.723-3.224 1.527-.119.131-.242.275-.368.423-.243.282-.494.575-.739.808-.398.38-.877.706-1.513.773a1.42 1.42 0 0 1-1.445-.83c-.27-.608-.352-1.395-.329-2.21.024-.826.16-1.73.365-2.606.206-.875.486-1.733.805-2.466.315-.722.687-1.364 1.094-1.772a2.34 2.34 0 0 1 .433-.335.504.504 0 0 1-.028-.079zm2.036.412c-.877.185-1.469.443-1.733.708-.276.276-.587.783-.885 1.465a13.748 13.748 0 0 0-.748 2.295 12.351 12.351 0 0 0-.339 2.406c-.022.755.062 1.368.243 1.776a.42.42 0 0 0 .426.24c.327-.034.61-.199.929-.502.212-.202.4-.423.615-.674.133-.156.276-.323.44-.504C4.861 9.969 5.978 9.027 8 9.027s3.139.942 3.965 1.855c.164.181.307.348.44.504.214.251.403.472.615.674.318.303.601.468.929.503a.42.42 0 0 0 .426-.241c.18-.408.265-1.02.243-1.776a12.354 12.354 0 0 0-.339-2.406 13.753 13.753 0 0 0-.748-2.295c-.298-.682-.61-1.19-.885-1.465-.264-.265-.856-.523-1.733-.708-.85-.179-1.877-.27-2.913-.27-1.036 0-2.063.091-2.913.27z"/>
                        </svg>
                        Game Preview
                      </ActionButton>
                    </InitiativeCard>
                  </InitiativeGrid>
                  
                  <Message>
                    <h3>Passive Income Disclaimer</h3>
                    <p>All passive income opportunities are subject to market conditions and ecosystem growth. Returns are not guaranteed. Always conduct your own research and understand the risks involved.</p>
                    <ActionButton $secondary style={{ marginTop: '1rem' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                        <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z"/>
                      </svg>
                      Income FAQs
                    </ActionButton>
                  </Message>
                </>
              )}
            </ContentSection>
            
            <NavOptions className="dashboard-item" style={{ animationDelay: '0.4s' }}>
              <NavButton to="/mint" $primary>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" style={{ marginRight: '0.5rem' }}>
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                  <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                </svg>
                Mint Another Space Baby
              </NavButton>
              
              <NavButton to="/collection">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" style={{ marginRight: '0.5rem' }}>
                  <path fillRule="evenodd" d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2 3.5H1.5a.5.5 0 0 1-.5-.5zM3.678 8.116 4.169 11H12.5l1.5-8H3.678 8.5a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1Z"/>
                </svg>
                View My Collection
              </NavButton>
            </NavOptions>
          </div>
        </CitizenDashboard>
      ) : (
        <Message>
          <h3>No Space Baby Found</h3>
          <p>You don't appear to have a Space Baby NFT yet. Citizenship in the Astroverse is granted to Space Baby guardians.</p>
          <NavOptions style={{ marginTop: '1.5rem' }}>
            <NavButton to="/mint" $primary>Mint Your Space Baby</NavButton>
          </NavOptions>
        </Message>
      )}
    </Section>
  );
};

export default Astroverse;