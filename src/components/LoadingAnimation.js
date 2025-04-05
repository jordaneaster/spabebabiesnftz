import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import soulGeneratorImg from '../assets/soul-generator.png'; // Adjust path as needed

const Section = styled.section`
  min-height: 100vh;
  width: 100%;
  background-color: ${props => props.theme.body};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const Title = styled.h1`
  font-size: ${props => props.theme.fontxxl};
  text-transform: uppercase;
  color: ${props => props.theme.text};
  margin: 1rem auto;
  border-bottom: 2px solid ${props => props.theme.text};
  width: fit-content;
`;

const Container = styled.div`
  width: 70%;
  max-width: 800px;
  margin: 2rem auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const LoadingText = styled.p`
  font-size: ${props => props.theme.fontlg};
  color: ${props => props.theme.text};
  margin: 2rem 0;
  text-align: center;
`;

const Image = styled.img`
  width: 50%;
  max-width: 400px;
  height: auto;
  animation: pulse 2s infinite;

  @keyframes pulse {
    0% {
      opacity: 0.6;
      transform: scale(0.98);
    }
    50% {
      opacity: 1;
      transform: scale(1.02);
    }
    100% {
      opacity: 0.6;
      transform: scale(0.98);
    }
  }
  
  @media (max-width: 768px) {
    width: 70%;
  }
`;

const ProgressBar = styled.div`
  width: 70%;
  max-width: 500px;
  height: 20px;
  background-color: #1a1a1a;
  border-radius: 10px;
  margin: 2rem 0;
  overflow: hidden;
`;

const Progress = styled.div`
  height: 100%;
  width: ${props => props.width}%;
  background-color: #00ff9d;
  border-radius: 10px;
  transition: width 0.5s ease-in-out;
`;

const LoadingAnimation = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Initializing Cryptonic Soul Generator...');

  useEffect(() => {
    const loadingTexts = [
      'Initializing Cryptonic Soul Generator...',
      'Analyzing Guardian Data...',
      'Assigning Cryptonic Attributes...',
      'Generating Soul Encryption...',
      'Calculating Power Levels...',
      'Transforming 2D to 3D...',
      'Finalizing Soul Generation...',
      'Soul Generation Complete! Entering Astroverse...'
    ];

    const interval = setInterval(() => {
      setProgress(prevProgress => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            navigate('/astroverse');
          }, 800); // Reduced from 1500ms to 800ms
          return 100;
        }
        
        // Update loading text at certain progress points
        const textIndex = Math.floor((prevProgress / 100) * (loadingTexts.length - 1));
        setLoadingText(loadingTexts[textIndex]);
        
        return prevProgress + 7; // Increased from 1.5 to 3 to make it faster
      });
    }, 80); // Reduced from 150ms to 80ms to make it faster

    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <Section id="loading">
      <Title>3D CRYPTONIC SOUL GENERATOR</Title>
      <Container>
        <Image src={soulGeneratorImg} alt="Soul Generator" />
        <LoadingText>{loadingText}</LoadingText>
        <ProgressBar>
          <Progress width={progress} />
        </ProgressBar>
        <LoadingText>{Math.round(progress)}% Complete</LoadingText>
      </Container>
    </Section>
  );
};

export default LoadingAnimation;
