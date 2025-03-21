import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import bgr from '../assets/media/BGR3.png';
import soulGeneratorImg from '../assets/soul-generator.png';

const Section = styled.section`
  min-height: 100vh;
  width: 100vw;
  background-color: ${props => props.theme.body};
  background-image: url(${bgr});
  background-size: cover;
  background-repeat: no-repeat;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const Container = styled.div`
  width: 80%;
  max-width: 1200px;
  background-color: rgba(36, 37, 38, 0.9);
  border-radius: 20px;
  padding: 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.7);
  
  @media (max-width: 64em) {
    width: 90%;
    padding: 2rem;
  }
  
  @media (max-width: 30em) {
    width: 95%;
    padding: 1.5rem;
  }
`;

const Title = styled.h1`
  font-size: ${props => props.theme.fontxxl};
  text-transform: uppercase;
  color: ${props => props.theme.text};
  margin-bottom: 2rem;
  text-align: center;
  letter-spacing: 3px;
  
  @media (max-width: 48em) {
    font-size: ${props => props.theme.fontxl};
  }
  
  @media (max-width: 30em) {
    font-size: ${props => props.theme.fontlg};
  }
`;

const Subtitle = styled.h2`
  font-size: ${props => props.theme.fontlg};
  color: ${props => props.theme.text};
  margin-bottom: 1.5rem;
  text-align: center;
  
  @media (max-width: 48em) {
    font-size: ${props => props.theme.fontmd};
  }
`;

const Description = styled.p`
  font-size: ${props => props.theme.fontmd};
  color: ${props => `rgba(${props.theme.textRgba}, 0.9)`};
  margin-bottom: 2.5rem;
  text-align: center;
  max-width: 800px;
  line-height: 1.8;
  
  @media (max-width: 48em) {
    font-size: ${props => props.theme.fontsm};
  }
`;

const GenerateButton = styled.button`
  padding: 1.2rem 2.5rem;
  background: linear-gradient(90deg, #9b51e0 0%, #3081ed 100%);
  color: white;
  font-size: ${props => props.theme.fontmd};
  font-weight: 700;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  letter-spacing: 1px;
  text-transform: uppercase;
  margin-bottom: 3rem;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 7px 15px rgba(155, 81, 224, 0.4);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  @media (max-width: 48em) {
    padding: 1rem 2rem;
    font-size: ${props => props.theme.fontsm};
  }
`;

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(155, 81, 224, 0.7);
  }
  
  70% {
    transform: scale(1);
    box-shadow: 0 0 0 15px rgba(155, 81, 224, 0);
  }
  
  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(155, 81, 224, 0);
  }
`;

const float = keyframes`
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
  100% {
    transform: translateY(0px);
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

const GeneratorContainer = styled.div`
  width: 100%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  margin: 2rem 0;
`;

const SoulGeneratorImage = styled.div`
  width: 300px;
  height: 300px;
  background-image: url(${soulGeneratorImg});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  animation: ${rotate} 20s linear infinite;
  position: relative;
  margin-bottom: 2rem;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80px;
    height: 80px;
    background: radial-gradient(circle, #9b51e0 0%, transparent 70%);
    border-radius: 50%;
    animation: ${pulse} 2s infinite;
  }
`;

const ProgressContainer = styled.div`
  width: 100%;
  max-width: 400px;
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 10px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 5px;
  overflow: hidden;
  margin-bottom: 1rem;
`;

const ProgressFill = styled.div`
  height: 100%;
  width: ${props => props.progress}%;
  background: linear-gradient(90deg, #3081ed, #9b51e0);
  background-size: 200% 100%;
  border-radius: 5px;
  animation: ${shimmer} 2s infinite linear;
  transition: width 0.5s ease-out;
`;

const StatusMessage = styled.div`
  font-size: ${props => props.theme.fontmd};
  color: ${props => props.theme.text};
  margin-top: 1rem;
  text-align: center;
  min-height: 1.5em;
`;

const Message = styled.p`
  font-size: ${props => props.theme.fontmd};
  color: #9b51e0;
  margin-top: 1.5rem;
  font-weight: 600;
  text-align: center;
`;

const GenerationStage = styled.div`
  font-size: ${props => props.theme.fontsm};
  color: ${props => props.highlight ? '#9b51e0' : 'rgba(255, 255, 255, 0.7)'};
  font-weight: ${props => props.highlight ? 'bold' : 'normal'};
  margin: 0.5rem 0;
  display: flex;
  align-items: center;
  
  &::before {
    content: '';
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: ${props => props.completed ? '#9b51e0' : 'rgba(255, 255, 255, 0.2)'};
    margin-right: 8px;
  }
`;

const SpaceBabyReveal = styled.div`
  position: relative;
  width: 300px;
  height: 300px;
  margin: 2rem 0;
  animation: ${float} 6s ease-in-out infinite;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    border-radius: 10px;
    box-shadow: 0 10px 30px rgba(155, 81, 224, 0.5);
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 10px;
    box-shadow: inset 0 0 20px rgba(155, 81, 224, 0.8);
    pointer-events: none;
  }
`;

const FadeTransition = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: black;
  z-index: 100;
  opacity: ${props => props.visible ? 1 : 0};
  visibility: ${props => props.visible ? 'visible' : 'hidden'};
  transition: opacity 1s ease-in-out, visibility 1s ease-in-out;
  pointer-events: ${props => props.visible ? 'all' : 'none'};
`;

const Etherland = () => {
  const [generationStage, setGenerationStage] = useState(0);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [isSoulGenerated, setIsSoulGenerated] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showTransition, setShowTransition] = useState(false);
  const [soulImage, setSoulImage] = useState(null);
  const progressInterval = useRef(null);
  const stageTimeout = useRef(null);
  
  const navigate = useNavigate();
  
  // Generate random Space Baby image
  const generateRandomBabyImage = () => {
    const images = [
      'https://i.postimg.cc/HswdNhLx/image-10.png',
      'https://i.postimg.cc/pTmP1V9b/image-11.png',
      'https://i.postimg.cc/cLTZxtwG/image-12.png',
      'https://i.postimg.cc/15hyJQs2/image-13.png',
      'https://i.postimg.cc/tRVX3TQF/image-14.png'
    ];
    return images[Math.floor(Math.random() * images.length)];
  };

  // Animation stages and messages
  const generationStages = [
    { name: "Connecting to blockchain", duration: 3000, progressStart: 0, progressEnd: 15 },
    { name: "Analyzing wallet signature", duration: 4000, progressStart: 15, progressEnd: 35 },
    { name: "Generating quantum energy patterns", duration: 3000, progressStart: 35, progressEnd: 50 },
    { name: "Synthesizing cosmic attributes", duration: 4000, progressStart: 50, progressEnd: 75 },
    { name: "Finalizing soul encryption", duration: 3000, progressStart: 75, progressEnd: 95 },
    { name: "Soul creation complete", duration: 2000, progressStart: 95, progressEnd: 100 }
  ];

  useEffect(() => {
    // If animation is complete and we're transitioning, navigate to Astroverse
    let timer;
    if (showTransition) {
      // Store data for Astroverse page
      sessionStorage.setItem('fromSoulGeneration', 'true');
      sessionStorage.setItem('spaceBabyImage', soulImage);
      
      timer = setTimeout(() => {
        navigate('/astroverse');
      }, 2000);
    }
    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval.current);
      clearTimeout(stageTimeout.current);
    };
  }, [showTransition, navigate, soulImage]);

  const updateProgress = (start, end, duration) => {
    const stepTime = 50; // update every 50ms
    const steps = duration / stepTime;
    const increment = (end - start) / steps;
    let currentProgress = start;
    
    clearInterval(progressInterval.current);
    
    progressInterval.current = setInterval(() => {
      currentProgress += increment;
      if (currentProgress >= end) {
        currentProgress = end;
        clearInterval(progressInterval.current);
      }
      setProgress(currentProgress);
    }, stepTime);
  };

  const runGenerationSequence = () => {
    setIsGenerating(true);
    let currentStage = 0;
    
    const processStage = () => {
      if (currentStage >= generationStages.length) {
        // All stages complete
        finalizeSoulGeneration();
        return;
      }
      
      const stage = generationStages[currentStage];
      setGenerationStage(currentStage);
      setStatusMessage(stage.name);
      updateProgress(stage.progressStart, stage.progressEnd, stage.duration);
      
      stageTimeout.current = setTimeout(() => {
        currentStage++;
        processStage();
      }, stage.duration);
    };
    
    processStage();
  };
  
  const finalizeSoulGeneration = () => {
    const generatedImage = generateRandomBabyImage();
    setSoulImage(generatedImage);
    setStatusMessage("Your Space Baby's soul is now ready!");
    setIsSoulGenerated(true);
    setIsGenerating(false);
    
    // Delay before showing the transition to Astroverse
    setTimeout(() => {
      setShowTransition(true);
    }, 3000);
  };

  const generateSoul = () => {
    runGenerationSequence();
  };

  return (
    <Section>
      <FadeTransition visible={showTransition} />
      
      <Container>
        <Title>The Etherland Soul Generator</Title>
        <Subtitle>Your Gateway to the Cosmic NFT Universe</Subtitle>
        <Description>
          Welcome to the Soul Generation Chamber. Here, the cosmic algorithms will analyze your wallet's signature 
          and create a unique Space Baby Soul perfectly attuned to your digital essence. Each generated Soul has unique attributes, 
          powers, and rarity that will determine your role in the Etherland metaverse.
        </Description>
        
        {!isGenerating && !isSoulGenerated && (
          <GenerateButton onClick={generateSoul}>
            Begin Soul Generation
          </GenerateButton>
        )}
        
        {isGenerating && (
          <GeneratorContainer>
            <SoulGeneratorImage />
            <ProgressContainer>
              <ProgressBar>
                <ProgressFill progress={progress} />
              </ProgressBar>
              <StatusMessage>{statusMessage}</StatusMessage>
              
              {generationStages.map((stage, index) => (
                <GenerationStage 
                  key={index}
                  completed={index < generationStage}
                  highlight={index === generationStage}
                >
                  {stage.name}
                </GenerationStage>
              ))}
            </ProgressContainer>
          </GeneratorContainer>
        )}
        
        {isSoulGenerated && !showTransition && (
          <>
            <SpaceBabyReveal>
              <img src={soulImage} alt="Your Space Baby" />
            </SpaceBabyReveal>
            <Message>Soul creation successful! Transferring to the Astroverse...</Message>
          </>
        )}
      </Container>
    </Section>
  );
};

export default Etherland;
