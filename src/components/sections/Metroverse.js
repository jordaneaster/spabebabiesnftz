import React, { useRef, useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import gsap from 'gsap';

// Background image for Metroverse - cosmic/nebula background
const metroverseBg = 'https://i.postimg.cc/7ZJj8VD2/metroverse-bg.jpg'; // replace with actual image

// Animations
const float = keyframes`
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(3deg); }
  100% { transform: translateY(0px) rotate(0deg); }
`;

const shimmer = keyframes`
  0% { background-position: -100% 0; }
  100% { background-position: 200% 0; }
`;

const glow = keyframes`
  0% { box-shadow: 0 0 10px rgba(174, 255, 0, 0.5); }
  50% { box-shadow: 0 0 25px rgba(174, 255, 0, 0.8); }
  100% { box-shadow: 0 0 10px rgba(174, 255, 0, 0.5); }
`;

const pulse = keyframes`
  0% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.05); opacity: 1; }
  100% { transform: scale(1); opacity: 0.8; }
`;

const starTwinkle = keyframes`
  0% { opacity: 0.2; }
  50% { opacity: 1; }
  100% { opacity: 0.2; }
`;

const orbit = keyframes`
  0% { transform: rotate(0deg) translateX(150px) rotate(0deg); }
  100% { transform: rotate(360deg) translateX(150px) rotate(-360deg); }
`;

// Styled Components
const Section = styled.section`
  min-height: 100vh;
  width: 100vw;
  background-color: ${props => props.theme.body};
  background-image: url(${metroverseBg});
  background-size: cover;
  background-position: center;
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
    background: rgba(0, 0, 0, 0.3);
    z-index: 1;
  }
`;

const Stars = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 1;
`;

const Star = styled.div`
  position: absolute;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  background-color: white;
  border-radius: 50%;
  top: ${props => props.top}%;
  left: ${props => props.left}%;
  opacity: ${props => props.opacity};
  animation: ${starTwinkle} ${props => 2 + Math.random() * 3}s ease-in-out infinite;
  animation-delay: ${props => Math.random() * 2}s;
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
  background: linear-gradient(90deg, #6c00ff, #aeff00, #6c00ff);
  background-size: 200% auto;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: ${shimmer} 4s linear infinite;
  
  @media (max-width: 64em) {
    font-size: ${(props) => props.theme.fontxl};
  }
  
  @media (max-width: 48em) {
    font-size: ${(props) => props.theme.fontlg};
  }
`;

const Description = styled.p`
  font-size: ${(props) => props.theme.fontlg};
  color: white;
  margin-bottom: 3rem;
  font-family: 'DIN Condensed', sans-serif;
  text-align: center;
  max-width: 800px;
  line-height: 1.6;
  background: rgba(0, 0, 0, 0.6);
  padding: 2rem;
  border-radius: 20px;
  border: 1px solid rgba(174, 255, 0, 0.3);
  
  @media (max-width: 48em) {
    font-size: ${(props) => props.theme.fontmd};
    padding: 1.5rem;
  }
`;

const MetroverseContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 1000px;
  height: 500px;
  margin: 2rem 0;
  display: flex;
  justify-content: center;
  
  @media (max-width: 48em) {
    height: 400px;
  }
  
  @media (max-width: 30em) {
    height: 300px;
  }
`;

const PlanetCore = styled.div`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: radial-gradient(circle, #aeff00 0%, #6c00ff 100%);
  animation: ${pulse} 4s ease-in-out infinite;
  position: relative;
  z-index: 2;
  box-shadow: 0 0 50px rgba(174, 255, 0, 0.5);
  
  @media (max-width: 48em) {
    width: 150px;
    height: 150px;
  }
`;

const BabyContainer = styled.div`
  position: absolute;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  animation: ${orbit} ${props => 10 + Math.random() * 10}s linear infinite;
  animation-delay: ${props => Math.random() * 2}s;
  z-index: 3;
  box-shadow: 0 0 20px rgba(108, 0, 255, 0.7);
  
  &:nth-child(1) { animation-duration: 15s; }
  &:nth-child(2) { animation-duration: 20s; animation-direction: reverse; }
  &:nth-child(3) { animation-duration: 25s; }
  
  img {
    width: 90%;
    height: 90%;
    object-fit: contain;
    animation: ${float} 6s ease-in-out infinite;
  }
  
  @media (max-width: 48em) {
    width: 60px;
    height: 60px;
  }
`;

const FloatingIsland = styled.div`
  position: absolute;
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  background: linear-gradient(to bottom, #6c00ff, #242526);
  border-radius: 50% 50% 10px 10px;
  top: ${props => props.top}%;
  left: ${props => props.left}%;
  animation: ${float} ${props => 8 + Math.random() * 4}s ease-in-out infinite;
  animation-delay: ${props => Math.random() * 2}s;
  transform: rotate(${props => props.rotate}deg);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.7);
  z-index: ${props => props.zIndex || 2};
  overflow: hidden;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 20%;
    background: #aeff00;
    border-radius: 50% 50% 0 0;
    opacity: 0.7;
  }
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 10%;
    width: 80%;
    height: 10px;
    background: rgba(174, 255, 0, 0.5);
    border-radius: 50%;
    filter: blur(5px);
  }
`;

const InteractionButton = styled.button`
  background: transparent;
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
  animation: ${glow} 2s infinite;
  
  &:hover {
    background-color: rgba(174, 255, 0, 0.2);
    transform: translateY(-5px);
  }
`;

const FeatureCard = styled.div`
  background: rgba(36, 37, 38, 0.8);
  border: 1px solid #aeff00;
  border-radius: 15px;
  padding: 1.5rem;
  width: calc(33.33% - 2rem);
  min-width: 250px;
  margin: 1rem;
  transition: all 0.3s ease;
  text-align: center;
  backdrop-filter: blur(10px);
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 10px 20px rgba(174, 255, 0, 0.3);
  }
  
  h3 {
    color: #aeff00;
    font-size: ${(props) => props.theme.fontlg};
    margin-bottom: 1rem;
  }
  
  p {
    color: ${props => props.theme.text};
    font-size: ${(props) => props.theme.fontsm};
  }
  
  @media (max-width: 64em) {
    width: calc(50% - 2rem);
  }
  
  @media (max-width: 48em) {
    width: 100%;
    min-width: auto;
  }
`;

const FeaturesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin: 2rem 0;
  width: 100%;
`;

const Metroverse = () => {
  const [stars, setStars] = useState([]);
  const [floatingIslands, setFloatingIslands] = useState([]);
  const sectionRef = useRef(null);
  
  useEffect(() => {
    // Generate stars
    const starArray = [];
    for (let i = 0; i < 100; i++) {
      starArray.push({
        id: i,
        size: Math.random() * 3 + 1, // star size
        top: Math.random() * 100,
        left: Math.random() * 100,
        opacity: Math.random() * 0.5 + 0.3
      });
    }
    setStars(starArray);
    
    // Generate floating islands
    const islandArray = [];
    for (let i = 0; i < 5; i++) {
      islandArray.push({
        id: i,
        width: 80 + Math.random() * 120,
        height: 60 + Math.random() * 80,
        top: 20 + Math.random() * 60,
        left: 10 + Math.random() * 80,
        rotate: Math.random() * 30 - 15,
        zIndex: Math.floor(Math.random() * 3) + 1
      });
    }
    setFloatingIslands(islandArray);
    
    // Animation for the section when loaded
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
  
  return (
    <Section id="metroverse" ref={sectionRef}>
      <Stars>
        {stars.map(star => (
          <Star 
            key={star.id} 
            size={star.size} 
            top={star.top} 
            left={star.left} 
            opacity={star.opacity} 
          />
        ))}
      </Stars>
      
      <Content className="content">
        <Title>Welcome to the Metroverse</Title>
        <Description>
          The Metroverse is home to Space Baby. This is where Space Baby materializes once a soul has been created and assigned. 
          Free from the material constraints of the physical realm, Space Baby has supreme control over their emotional self. 
          Here is a universe to express omniscient virtue over the span of the life of Space Baby. 
          Space Baby is able to interact with other Space Babiez, share experiences, and gain knowledge in efforts to upgrade 
          and gain access to the Astroverse!
        </Description>
        
        <MetroverseContainer>
          {/* Floating islands in the background */}
          {floatingIslands.map(island => (
            <FloatingIsland 
              key={island.id}
              width={island.width}
              height={island.height}
              top={island.top}
              left={island.left}
              rotate={island.rotate}
              zIndex={island.zIndex}
            />
          ))}
          
          {/* Central planet/hub */}
          <PlanetCore />
          
          {/* Orbiting Space Babies */}
          <BabyContainer style={{ top: '30%', left: '30%' }}>
            <img src="https://i.postimg.cc/gcVLd4Sw/image-Team-Bazil.png" alt="Space Baby 1" />
          </BabyContainer>
          
          <BabyContainer style={{ top: '50%', left: '60%' }}>
            <img src="https://i.postimg.cc/QtBPxMRN/image-Team-Jordan.png" alt="Space Baby 2" />
          </BabyContainer>
          
          <BabyContainer style={{ top: '70%', left: '40%' }}>
            <img src="https://i.postimg.cc/1RVhyWQ0/image-Team-Brenton.png" alt="Space Baby 3" />
          </BabyContainer>
        </MetroverseContainer>
        
        <FeaturesContainer>
          <FeatureCard>
            <h3>Emotional Control</h3>
            <p>Space Babiez have supreme control over their emotional self, allowing them to express pure virtue.</p>
          </FeatureCard>
          
          <FeatureCard>
            <h3>Social Interactions</h3>
            <p>Connect with other Space Babiez to share unique experiences and forge cosmic bonds.</p>
          </FeatureCard>
          
          <FeatureCard>
            <h3>Knowledge Acquisition</h3>
            <p>Gain cosmic wisdom and upgrade your abilities to prepare for the Astroverse.</p>
          </FeatureCard>
        </FeaturesContainer>
        
        <InteractionButton>Begin Your Metroverse Journey</InteractionButton>
      </Content>
    </Section>
  );
};

export default Metroverse;
