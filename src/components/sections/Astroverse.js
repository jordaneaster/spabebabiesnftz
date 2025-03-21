import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import Button from '../Button';

// Add fade-in animation
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const floatAnimation = keyframes`
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0);
  }
`;

const pulseAnimation = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
`;

const Section = styled.section`
  min-height: 100vh;
  width: 100%;
  background-color: ${props => props.theme.body};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  opacity: ${props => props.loaded ? 1 : 0};
  transition: opacity 0.5s ease;
`;

const Title = styled.h1`
  font-size: ${props => props.theme.fontxxl};
  text-transform: uppercase;
  color: ${props => props.theme.text};
  margin: 1rem auto;
  border-bottom: 2px solid ${props => props.theme.text};
  width: fit-content;
  animation: ${fadeIn} 0.8s ease forwards;
`;

const SubTitle = styled.h2`
  font-size: ${props => props.theme.fontxl};
  text-transform: capitalize;
  color: ${props => props.theme.text};
  margin: 1rem auto;
  width: fit-content;
  animation: ${fadeIn} 0.8s ease forwards;
  animation-delay: 0.2s;
  opacity: 0;
  animation-fill-mode: forwards;
`;

const Container = styled.div`
  width: 80%;
  margin: 2rem auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  animation: ${fadeIn} 0.8s ease forwards;
  animation-delay: 0.4s;
  opacity: 0;
  animation-fill-mode: forwards;
`;

const ContentBox = styled.div`
  width: 80%;
  margin: 2rem auto;
  background-color: rgba(255, 255, 255, 0.05);
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 0 20px rgba(0, 255, 157, 0.2);
`;

const Text = styled.p`
  font-size: ${props => props.theme.fontlg};
  color: ${props => props.theme.text};
  margin: 1rem 0;
  text-align: center;
`;

const FratzSection = styled.div`
  margin-top: 4rem;
  width: 80%;
  background-color: rgba(0, 255, 157, 0.1);
  padding: 2rem;
  border-radius: 20px;
`;

const Center = styled.div`
  display: flex;
  justify-content: center;
  margin: 2rem 0;
`;

const SpaceBabyContainer = styled.div`
  width: 250px;
  height: 250px;
  margin: 2rem auto;
  position: relative;
  animation: ${fadeIn} 1s ease forwards, ${floatAnimation} 4s ease-in-out infinite;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    border-radius: 50%;
    box-shadow: 0 10px 30px rgba(0, 255, 157, 0.3);
  }
  
  &::after {
    content: '';
    position: absolute;
    top: -10px;
    left: -10px;
    right: -10px;
    bottom: -10px;
    border-radius: 50%;
    border: 2px solid rgba(0, 255, 157, 0.5);
    animation: ${pulseAnimation} 2s infinite;
  }
`;

const Astroverse = () => {
  const [loaded, setLoaded] = useState(false);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);
  const [spaceBabyImage, setSpaceBabyImage] = useState(null);
  
  useEffect(() => {
    // Set a small timeout to ensure the component is mounted before animation starts
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
    // Check if coming from soul generation
    const fromSoulGeneration = sessionStorage.getItem('fromSoulGeneration');
    
    if (fromSoulGeneration === 'true') {
      // Get the Space Baby image from sessionStorage
      const babyImage = sessionStorage.getItem('spaceBabyImage');
      
      // Show welcome message and Space Baby image
      setShowWelcomeMessage(true);
      setSpaceBabyImage(babyImage);
      
      // Clear the flags
      sessionStorage.removeItem('fromSoulGeneration');
      sessionStorage.removeItem('spaceBabyImage');
    }
  }, []);
  
  return (
    <Section id="astroverse" loaded={loaded}>
      <Title>ASTROVERSE | PORTAL</Title>
      <SubTitle>RELEASE JOURNEY 2.0</SubTitle>
      
      {showWelcomeMessage && (
        <>
          <Text>Welcome to the Astroverse! Your soul generation was successful.</Text>
          {spaceBabyImage && (
            <SpaceBabyContainer>
              <img src={spaceBabyImage} alt="Your Space Baby" />
            </SpaceBabyContainer>
          )}
          <Text>Your Space Baby is now ready to explore the Astroverse!</Text>
        </>
      )}
      
      <Container>
        <ContentBox>
          <SubTitle>3D CRYPTONIC SOUL GENERATOR</SubTitle>
          <Text>
            Your Space Babie's soul has been successfully generated! This process has jumpstarted the "soul" 
            of your baby by revealing useful encryptions and transforming the 2D character into a 3D version.
          </Text>
          <Text>
            These encryptions have assigned unique attributes, power, and roles to your NFT that can be accessed 
            once minted. As a Guardian, you completed an interactive story builder that assigned these unique 
            encryptions to your baby, solidifying its fate within the universe.
          </Text>
          <Text>
            These encryptions become important as the University develops and how it will ultimately operate.
          </Text>
        </ContentBox>
        
        <ContentBox>
          <SubTitle>SPACE BABIEZ UNIVERZITY</SubTitle>
          <Text>
            Independent whitepaper coming! Join the Discord for exclusive updates.
          </Text>
          <Center>
            <Button text="Join Discord" link="#" />
          </Center>
        </ContentBox>
        
        <FratzSection>
          <SubTitle>FRATZ</SubTitle>
          <Text>
            Through the Cryptonic Soul Generator, Guardianz are randomly separated into distinct groups to create 
            fraternity style clubs within the university, which will have specific roles within our DAO.
          </Text>
          <Text>
            Each Frat will set their own guidelines and create an identity to build pride within the university. 
            Fratz will create an emblem in the essence of modern day fraternities and will have full commercial rights.
          </Text>
          <Text>
            Guardianz will have the opportunity to create their own NFT collections depending on the accolades 
            achieved with their NFT. These collections will expand the Space Babiez Univerze.
          </Text>
          <Text>
            More information will be available in the Space Babiez Univerzity whitepaper.
          </Text>
        </FratzSection>
      </Container>
    </Section>
  );
};

export default Astroverse;
