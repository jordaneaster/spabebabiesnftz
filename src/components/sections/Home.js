import React, { useEffect, useState, lazy, Suspense } from 'react';
import styled, { keyframes } from 'styled-components';
import TypeWriterText from '../TypeWriterText';
import HeroTypeWriterText from '../HeroTypeWriterText';
import RoundTextBlack from '../../assets/Rounded-Text-White.png';
import Loading from '../Loading';

const CoverVideo = lazy(() => import('../CoverVideo'));

// Animations
const float = keyframes`
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
  100% { transform: translateY(0px) rotate(0deg); }
`;

const floatReverse = keyframes`
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(-5deg); }
  100% { transform: translateY(0px) rotate(0deg); }
`;

const twinkle = keyframes`
  0% { opacity: 0.3; }
  50% { opacity: 1; }
  100% { opacity: 0.3; }
`;

const glow = keyframes`
  0% { text-shadow: 0 0 10px #9b51e0, 0 0 20px #9b51e0, 0 0 30px #9b51e0; }
  50% { text-shadow: 0 0 20px #9b51e0, 0 0 30px #9b51e0, 0 0 40px #9b51e0; }
  100% { text-shadow: 0 0 10px #9b51e0, 0 0 20px #9b51e0, 0 0 30px #9b51e0; }
`;

// Styled Components
const Section = styled.section`
  min-height: 100vh;
  width: 100vw;
  position: relative;
  background: linear-gradient(180deg, #070b19 0%, #0e1b31 100%);
  overflow: hidden;
`;

const StarField = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 0;
`;

const Star = styled.div`
  position: absolute;
  background-color: white;
  border-radius: 50%;
  animation: ${twinkle} ${props => props.duration}s ease-in-out infinite;
  opacity: ${props => props.opacity};
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  top: ${props => props.top}%;
  left: ${props => props.left}%;
`;

const Container = styled.div`
  width: 75%;
  min-height: 90vh;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  z-index: 1;
  
  @media (max-width: 64em) {
    width: 85%;
  }
  @media (max-width: 48em) {
    width: 95%;
  }
`;

const TitleContainer = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 5rem;
  text-transform: uppercase;
  font-weight: 900;
  background: linear-gradient(90deg, #9b51e0, #3081ed, #aeff00);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: ${glow} 3s ease-in-out infinite;
  margin-bottom: 1rem;
  letter-spacing: 0.2rem;
  font-family: 'flegrei', sans-serif;
  
  @media (max-width: 64em) {
    font-size: 4rem;
  }
  @media (max-width: 48em) {
    font-size: 3rem;
  }
  @media (max-width: 30em) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.h3`
  font-size: 1.5rem;
  color: ${props => props.theme.text};
  width: 70%;
  margin: 0 auto;
  margin-bottom: 2rem;
  
  @media (max-width: 64em) {
    width: 80%;
    font-size: 1.2rem;
  }
  @media (max-width: 48em) {
    width: 95%;
    font-size: 1rem;
  }
`;

const ButtonContainer = styled.div`
  margin-top: 2rem;
  display: flex;
  gap: 2rem;
  
  @media (max-width: 48em) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const Button = styled.button`
  padding: 1.2rem 2.5rem;
  background: ${props => props.primary ? 
    'linear-gradient(90deg, #9b51e0 0%, #3081ed 100%)' : 
    'transparent'};
  color: ${props => props.primary ? 'white' : props.theme.text};
  font-size: ${props => props.theme.fontmd};
  font-weight: 700;
  border: ${props => props.primary ? 'none' : `2px solid ${props.theme.text}`};
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  z-index: 5;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: ${props => props.primary ? 
      '0 7px 15px rgba(155, 81, 224, 0.4)' : 
      '0 7px 15px rgba(255, 255, 255, 0.2)'};
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const NftContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 0;
`;

const NftImage = styled.img`
  position: absolute;
  height: 20vh;
  animation: ${props => props.reverse ? floatReverse : float} 5s ease-in-out infinite;
  opacity: 0.9;
  filter: drop-shadow(0 0 15px rgba(174, 255, 0, 0.2));
  border-radius: 50%;
  
  @media (max-width: 48em) {
    height: 15vh;
  }
  @media (max-width: 30em) {
    height: 10vh;
  }
`;

// Add Box styled component definition
const Box = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 2rem 0;
`;

const Hero = () => {
  const [stars, setStars] = useState([]);
  
  useEffect(() => {
    // Generate random stars
    const newStars = [];
    for (let i = 0; i < 100; i++) {
      newStars.push({
        id: i,
        size: Math.random() * 3 + 1,
        top: Math.random() * 100,
        left: Math.random() * 100,
        opacity: Math.random() * 0.7 + 0.3,
        duration: Math.random() * 5 + 2
      });
    }
    setStars(newStars);
  }, []);

  const scrollToShowcase = () => {
    document.getElementById('showcase')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Section id="home">
      <StarField>
        {stars.map(star => (
          <Star 
            key={star.id}
            size={star.size}
            top={star.top}
            left={star.left}
            opacity={star.opacity}
            duration={star.duration}
          />
        ))}
      </StarField>
      
      <Container>
        <TitleContainer>
          <Title>Space Babiez</Title>
          <Subtitle>
            Join the interstellar journey through the NFT cosmos with your own unique Space Baby. 
            Born in the stars, each baby possesses cosmic traits and abilities waiting to be discovered.
          </Subtitle>
          <HeroTypeWriterText />
        </TitleContainer>
        
        <ButtonContainer>
          <Button primary onClick={scrollToShowcase}>Explore Collection</Button>
          <Button onClick={() => window.location.href = '/etherland'}>Enter Etherland</Button>
        </ButtonContainer>
      </Container>
      
      <NftContainer>
        <NftImage 
          src="https://i.postimg.cc/HswdNhLx/image-10.png" 
          style={{ top: '15%', left: '10%' }}
        />
        <NftImage 
          src="https://i.postimg.cc/pTmP1V9b/image-11.png" 
          style={{ top: '60%', left: '5%' }}
          reverse
        />
        <NftImage 
          src="https://i.postimg.cc/cLTZxtwG/image-12.png" 
          style={{ top: '20%', right: '10%' }}
          reverse
        />
        <NftImage 
          src="https://i.postimg.cc/15hyJQs2/image-13.png" 
          style={{ top: '65%', right: '5%' }}
        />
      </NftContainer>
    </Section>
  );
};

const Home = () => {
  return (
    <>
      <Hero />
      <Section id="home">
        <Container>
          <Box>
            <img src='https://i.postimg.cc/XJ2H7rVc/7a.png' width={'30%'}></img>
          </Box>
        </Container>
      </Section>
    </>
  )
}

export default Home;