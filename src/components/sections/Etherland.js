import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import gsap from 'gsap';
import { useNavigate } from 'react-router-dom';
// Add import for soul generator image
import soulGeneratorImg from '../../assets/soul-generator.png'; // Adjust path as needed

// Background image
const etherlandBg = 'https://i.postimg.cc/L8ZN3HS2/etherland-bg.jpg'; // placeholder URL - replace with actual image

// Animations
const pulse = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
`;

const float = keyframes`
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
  100% { transform: translateY(0px) rotate(0deg); }
`;

const glowingText = keyframes`
  0% { text-shadow: 0 0 5px #aeff00, 0 0 10px #aeff00; }
  50% { text-shadow: 0 0 20px #aeff00, 0 0 30px #aeff00; }
  100% { text-shadow: 0 0 5px #aeff00, 0 0 10px #aeff00; }
`;

const rotate = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const particleFloat = keyframes`
  0% { transform: translateY(0) translateX(0); opacity: 1; }
  100% { transform: translateY(-100px) translateX(${props => Math.random() * 100 - 50}px); opacity: 0; }
`;

const breathe = keyframes`
  0% { transform: scale(0.95); box-shadow: 0 0 10px rgba(174, 255, 0, 0.3); }
  50% { transform: scale(1.05); box-shadow: 0 0 20px rgba(174, 255, 0, 0.6); }
  100% { transform: scale(0.95); box-shadow: 0 0 10px rgba(174, 255, 0, 0.3); }
`;

// Styled Components
const Section = styled.section`
  min-height: 100vh;
  width: 100vw;
  background-color: ${props => props.theme.body};
  background-image: url(${etherlandBg});
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
    background: rgba(0, 0, 0, 0.7);
    z-index: 1;
  }
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
  animation: ${glowingText} 3s infinite;
  
  @media (max-width: 64em) {
    font-size: ${(props) => props.theme.fontxl};
  }
  
  @media (max-width: 48em) {
    font-size: ${(props) => props.theme.fontlg};
  }
`;

const Description = styled.p`
  font-size: ${(props) => props.theme.fontmd};
  color: ${(props) => props.theme.text};
  margin-bottom: 3rem;
  font-family: 'DIN Condensed', sans-serif;
  text-align: center;
  max-width: 800px;
  line-height: 1.5;
  
  @media (max-width: 48em) {
    font-size: ${(props) => props.theme.fontsm};
  }
`;

const SoulGenerationContainer = styled.div`
  background: rgba(36, 37, 38, 0.8);
  border: 2px solid #aeff00;
  border-radius: 20px;
  padding: 2rem;
  width: 100%;
  max-width: 900px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const BabyContainer = styled.div`
  width: 300px;
  height: 300px;
  margin: 1rem auto;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  
  @media (max-width: 48em) {
    width: 200px;
    height: 200px;
  }
`;

const BabyImage = styled.div`
  width: 220px;
  height: 220px;
  background-color: #242526;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: ${float} 6s ease-in-out infinite;
  position: relative;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, #6c00ff, #aeff00);
    opacity: ${props => props.soulProgress / 100 * 0.8};
    mix-blend-mode: overlay;
  }
  
  img {
    width: 90%;
    height: 90%;
    object-fit: contain;
  }
  
  @media (max-width: 48em) {
    width: 180px;
    height: 180px;
  }
`;

const SoulOrb = styled.div`
  position: absolute;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  background: radial-gradient(circle, ${props => props.color} 0%, rgba(0,0,0,0) 70%);
  border-radius: 50%;
  animation: ${pulse} 2s infinite;
  opacity: 0.8;
  z-index: 5;
  pointer-events: none;
`;

const TraitContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
  margin: 2rem 0;
  width: 100%;
`;

const TraitCard = styled.div`
  background: rgba(36, 37, 38, 0.8);
  border: 1px solid ${props => props.selected ? '#aeff00' : props.theme.text};
  border-radius: 10px;
  padding: 1rem;
  width: calc(25% - 1rem);
  min-width: 150px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  
  &:hover {
    transform: translateY(-5px);
    border-color: #aeff00;
  }
  
  @media (max-width: 64em) {
    width: calc(33.33% - 1rem);
  }
  
  @media (max-width: 48em) {
    width: calc(50% - 1rem);
  }
`;

const TraitTitle = styled.h3`
  font-size: ${(props) => props.theme.fontmd};
  color: ${props => props.selected ? '#aeff00' : props.theme.text};
  margin-bottom: 0.5rem;
`;

const TraitDescription = styled.p`
  font-size: ${(props) => props.theme.fontsm};
  color: ${props => props.theme.text};
`;

const ProgressContainer = styled.div`
  width: 100%;
  margin: 2rem 0;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 20px;
  background-color: rgba(36, 37, 38, 0.8);
  border-radius: 10px;
  overflow: hidden;
`;

const Progress = styled.div`
  height: 100%;
  width: ${props => props.progress}%;
  background: linear-gradient(90deg, #6c00ff, #aeff00);
  transition: width 0.5s ease;
`;

const Button = styled.button`
  background-color: transparent;
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
  
  &:hover {
    background-color: #aeff00;
    color: ${props => props.theme.body};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const CompletionMessage = styled.div`
  opacity: ${props => props.show ? 1 : 0};
  transition: opacity 1s ease;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.8);
  border-radius: 20px;
  padding: 2rem;
  text-align: center;
  z-index: 100;
  
  h2 {
    font-size: ${(props) => props.theme.fontxl};
    color: #aeff00;
    margin-bottom: 1rem;
  }
  
  p {
    font-size: ${(props) => props.theme.fontmd};
    color: ${props => props.theme.text};
  }
`;

const SoulLoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.9);
  display: ${props => props.isLoading ? 'flex' : 'none'};
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  transition: opacity 0.5s ease;
  opacity: ${props => props.fadeOut ? 0 : 1};
`;

const LoadingTitle = styled.h2`
  color: #aeff00;
  font-size: 2.5rem;
  margin-bottom: 2rem;
  text-align: center;
  animation: ${glowingText} 3s infinite;
  font-family: 'flegrei', sans-serif;
`;

const LoadingSubtitle = styled.h3`
  color: white;
  font-size: 1.5rem;
  margin-top: 2rem;
  text-align: center;
  font-family: 'DIN Condensed', sans-serif;
`;

const SoulGenerationCircle = styled.div`
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: radial-gradient(circle, #6c00ff 0%, transparent 70%);
  position: relative;
  animation: ${breathe} 3s infinite ease-in-out;
  display: flex;
  justify-content: center;
  align-items: center;
  
  &:before {
    content: '';
    position: absolute;
    width: 330px;
    height: 330px;
    border-radius: 50%;
    border: 2px solid #aeff00;
    animation: ${rotate} 8s linear infinite;
  }
  
  &:after {
    content: '';
    position: absolute;
    width: 360px;
    height: 360px;
    border-radius: 50%;
    border: 1px dashed rgba(174, 255, 0, 0.5);
    animation: ${rotate} 12s linear infinite reverse;
  }
`;

const SoulBabyImage = styled.div`
  width: 180px;
  height: 180px;
  border-radius: 50%;
  overflow: hidden;
  background: #000;
  z-index: 2;
  box-shadow: 0 0 30px rgba(108, 0, 255, 0.8);
  
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

const SoulParticle = styled.div`
  position: absolute;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  background: ${props => props.color};
  border-radius: 50%;
  animation: ${particleFloat} ${props => 2 + Math.random() * 3}s ease-out forwards;
  opacity: 0.7;
  top: ${props => props.posY}%;
  left: ${props => props.posX}%;
`;

const ProgressText = styled.div`
  color: white;
  font-size: 1.5rem;
  margin-top: 1rem;
  font-family: 'DIN Condensed', sans-serif;
`;

const TransitionPortal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: radial-gradient(circle, #6c00ff 0%, #000 70%);
  display: ${props => props.show ? 'flex' : 'none'};
  justify-content: center;
  align-items: center;
  z-index: 2000;
  opacity: ${props => props.fadeIn ? 1 : 0};
  transition: opacity 1s ease;
  
  h2 {
    color: #aeff00;
    font-size: 3rem;
    text-align: center;
    font-family: 'flegrei', sans-serif;
    animation: ${glowingText} 3s infinite;
  }
`;

// Add this new styled component for integrated loading animation
const IntegratedLoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.95);
  display: ${props => props.show ? 'flex' : 'none'};
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  opacity: ${props => props.fadeOut ? 0 : 1};
  transition: opacity 0.5s ease;
`;

const GeneratorTitle = styled.h1`
  font-size: 2.5rem;
  text-transform: uppercase;
  color: ${props => props.theme.text};
  margin: 1rem auto;
  border-bottom: 2px solid ${props => props.theme.text};
  width: fit-content;
  text-align: center;
`;

const GeneratorImage = styled.img`
  width: 50%; /* Reduced size */
  max-width: 400px; /* Limit maximum size */
  height: auto;
  animation: pulse 2s infinite;
  margin: 0 auto;
  display: block;

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

const GeneratorProgressBar = styled.div`
  width: 50%;
  max-width: 400px;
  height: 20px;
  background-color: #1a1a1a;
  border-radius: 10px;
  margin: 2rem auto;
  overflow: hidden;
  
  @media (max-width: 768px) {
    width: 70%;
  }
`;

// Replace the GeneratorProgress styled component with a more reliable implementation
const GeneratorProgress = styled.div`
  height: 100%;
  width: ${props => Math.max(props.width, 1)}%;
  background-color: #00ff9d;
  border-radius: 10px;
  transition: width 0.3s ease-in-out;
  position: relative;
  display: block !important;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, #00ff9d, #23ff6c);
    border-radius: 10px;
    opacity: 1;
  }
`;

const GeneratorText = styled.p`
  font-size: 1.2rem;
  color: ${props => props.theme.text};
  margin: 1rem 0;
  text-align: center;
`;

const Etherland = () => {
  const [soulProgress, setSoulProgress] = useState(0);
  const [selectedTraits, setSelectedTraits] = useState([]);
  const [orbs, setOrbs] = useState([]);
  const [showCompletion, setShowCompletion] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingStage, setLoadingStage] = useState('');
  const [fadeOutLoading, setFadeOutLoading] = useState(false);
  const [showPortal, setShowPortal] = useState(false);
  const [portalFadeIn, setPortalFadeIn] = useState(false);
  const [particles, setParticles] = useState([]);
  const sectionRef = useRef(null);
  const [showGenerator, setShowGenerator] = useState(false);
  const [generatorProgress, setGeneratorProgress] = useState(0);
  const [generatorText, setGeneratorText] = useState('Initializing Cryptonic Soul Generator...');
  const [generatorFadeOut, setGeneratorFadeOut] = useState(false);
  
  const navigate = useNavigate();
  
  // Generate random particles for loading animation
  const generateParticles = () => {
    const newParticles = [];
    const colors = ['#aeff00', '#6c00ff', '#ff33a8', '#33fff5', '#fff033'];
    
    for (let i = 0; i < 30; i++) {
      newParticles.push({
        id: i,
        size: 5 + Math.random() * 10,
        color: colors[Math.floor(Math.random() * colors.length)],
        posX: 30 + Math.random() * 40, // position around the center
        posY: 30 + Math.random() * 40
      });
    }
    
    setParticles(newParticles);
  };
  
  // Available traits for Space Babies
  const traits = [
    { id: 1, name: "Curious", description: "An explorer at heart", color: "#FF5733" },
    { id: 2, name: "Creative", description: "Born to innovate", color: "#33FF57" },
    { id: 3, name: "Resilient", description: "Bounces back from setbacks", color: "#3357FF" },
    { id: 4, name: "Empathetic", description: "Feels deeply for others", color: "#F033FF" },
    { id: 5, name: "Logical", description: "Analyzes with precision", color: "#FF33A8" },
    { id: 6, name: "Adventurous", description: "Never fears the unknown", color: "#33FFF5" },
    { id: 7, name: "Harmonious", description: "Brings balance to chaos", color: "#FFF033" },
    { id: 8, name: "Determined", description: "Unstoppable force", color: "#FF8333" }
  ];
  
  // Handle trait selection
  const toggleTrait = (trait) => {
    if (selectedTraits.find(t => t.id === trait.id)) {
      setSelectedTraits(selectedTraits.filter(t => t.id !== trait.id));
    } else if (selectedTraits.length < 3) {
      setSelectedTraits([...selectedTraits, trait]);
      
      // Add soul orb effect
      const randomPosition = {
        x: Math.random() * 300 - 150,
        y: Math.random() * 300 - 150,
        size: Math.random() * 30 + 20,
        color: trait.color
      };
      
      setOrbs([...orbs, randomPosition]);
      
      // Increase soul progress
      setSoulProgress(Math.min(soulProgress + 33, 99));
    }
  };
  
  // Soul generation loading animation
  const runLoadingAnimation = () => {
    let progress = 0;
    const stages = [
      'Entering Etherland...',
      'Analyzing traits...',
      'Gathering soul particles...',
      'Weaving soul essence...',
      'Binding soul to Space Baby...',
      'Finalizing soul signature...',
      'Preparing for Astroverse...'
    ];
    
    setIsLoading(true);
    generateParticles();
    
    const interval = setInterval(() => {
      progress += 10; // Increase by 2 instead of 1 to make it faster
      setLoadingProgress(progress);
      
      // Update loading stage text
      if (progress % 14 === 0) {
        const stageIndex = Math.floor(progress / 14);
        if (stageIndex < stages.length) {
          setLoadingStage(stages[stageIndex]);
          generateParticles(); // Generate new particles at each stage
        }
      }
      
      if (progress >= 100) {
        clearInterval(interval);
        
        // Fade out loading screen
        setFadeOutLoading(true);
        
        setTimeout(() => {
          setIsLoading(false);
          
          // Instead of showing portal, show integrated generator
          setShowGenerator(true);
          runGeneratorAnimation();
        }, 500); // Reduced from 1000ms to 500ms
      }
    }, 30); // Reduced from 60ms to 30ms - this makes the animation twice as fast
  };
  
  // New function for the integrated generator animation
  const runGeneratorAnimation = () => {
    const generatorTexts = [
      'Initializing Cryptonic Soul Generator...',
      'Analyzing Guardian Data...',
      'Assigning Cryptonic Attributes...',
      'Generating Soul Encryption...',
      'Calculating Power Levels...',
      'Transforming 2D to 3D...',
      'Finalizing Soul Generation...',
      'Soul Generation Complete! Entering Astroverse...'
    ];
    
    let progress = 5; // Start at 5 instead of 1 to make the progress more visible initially
    
    // Set an initial progress immediately before the interval
    setGeneratorProgress(5);
    
    const interval = setInterval(() => {
      progress += 3;
      
      // Ensure progress never exceeds 100% and use whole numbers for visual consistency
      const cappedProgress = Math.min(Math.max(Math.floor(progress), 1), 100);
      setGeneratorProgress(cappedProgress);
      
      // Update text at certain progress points
      const textIndex = Math.floor((cappedProgress / 100) * (generatorTexts.length - 1));
      setGeneratorText(generatorTexts[textIndex]);
      
      if (cappedProgress >= 100) {
        clearInterval(interval);
        // Set final state for consistency
        setGeneratorProgress(100);
        setGeneratorText('Soul Generation Complete! Entering Astroverse...');
        
        setTimeout(() => {
          setGeneratorFadeOut(true);
          
          setTimeout(() => {
            setShowGenerator(false);
            setShowPortal(true);
            setPortalFadeIn(true);
            
            // Ensure this timeout is sufficient for the portal animation to be visible
            setTimeout(() => {
              try {
                // Navigate with a try-catch to handle any navigation errors
                navigate('/astroverse');
              } catch (error) {
                console.error('Navigation error:', error);
                // Fallback direct navigation if React Router navigation fails
                window.location.href = '/astroverse';
              }
            }, 1500); // Increased from 1000ms to 1500ms for better visibility
          }, 500);
        }, 800); // Increased from 500ms to 800ms for better readability
      }
    }, 80);
  };
  
  // Complete soul generation
  const completeSoulGeneration = () => {
    setSoulProgress(100);
    
    // Run loading animation
    runLoadingAnimation();
  };
  
  useEffect(() => {
    // Animation for the section when it's loaded
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
  
  // Add this effect to preload the Astroverse component
  useEffect(() => {
    // Preload the Astroverse component to ensure faster rendering when navigating
    const preloadAstroverse = async () => {
      try {
        // Dynamic import to preload the component
        await import('../sections/Astroverse');
      } catch (error) {
        console.error('Error preloading Astroverse:', error);
      }
    };
    
    preloadAstroverse();
  }, []);
  
  return (
    <>
      <Section id="etherland" ref={sectionRef}>
        <Content className="content">
          <Title>Welcome to Etherland</Title>
          <Description>
            They say the eyes are the window to the soul. Etherland is the essence in which Space Baby is conceived. 
            Here as a guardian, you bestow upon Space Baby its identity. The deliverance of a soul to your creation 
            is the first step in actualizing Space Baby, allowing entry into the Metroverse.
          </Description>
          
          <SoulGenerationContainer>
            <BabyContainer>
              {orbs.map((orb, index) => (
                <SoulOrb 
                  key={index}
                  size={orb.size}
                  color={orb.color}
                  style={{
                    left: `calc(50% + ${orb.x}px)`,
                    top: `calc(50% + ${orb.y}px)`
                  }}
                />
              ))}
              <BabyImage soulProgress={soulProgress}>
                <img src="https://i.postimg.cc/GmQ6XVFR/image-Team-Dez.png" alt="Space Baby" />
              </BabyImage>
            </BabyContainer>
            
            <ProgressContainer>
              <h3 style={{ color: '#aeff00', marginBottom: '0.5rem', textAlign: 'center' }}>Soul Generation Progress</h3>
              <ProgressBar>
                <Progress progress={soulProgress} />
              </ProgressBar>
            </ProgressContainer>
            
            <h3 style={{ color: '#aeff00', marginBottom: '1rem', textAlign: 'center' }}>Select up to 3 traits for your Space Baby's soul</h3>
            
            <TraitContainer>
              {traits.map(trait => (
                <TraitCard 
                  key={trait.id} 
                  selected={selectedTraits.find(t => t.id === trait.id)}
                  onClick={() => toggleTrait(trait)}
                >
                  <TraitTitle selected={selectedTraits.find(t => t.id === trait.id)}>{trait.name}</TraitTitle>
                  <TraitDescription>{trait.description}</TraitDescription>
                </TraitCard>
              ))}
            </TraitContainer>
            
            <Button 
              onClick={completeSoulGeneration}
              disabled={selectedTraits.length < 3 || soulProgress >= 100}
            >
              {soulProgress >= 100 ? "Soul Generated" : "Generate Soul"}
            </Button>
          </SoulGenerationContainer>
        </Content>
        
        <CompletionMessage show={showCompletion}>
          <h2>Soul Genesis Complete!</h2>
          <p>Your Space Baby's identity has been forged in Etherland.</p>
          <p>Preparing for journey to the Metroverse...</p>
        </CompletionMessage>
      </Section>
      
      {/* Soul Generation Loading Animation */}
      <SoulLoadingOverlay isLoading={isLoading} fadeOut={fadeOutLoading}>
        <LoadingTitle>Soul Generation in Progress</LoadingTitle>
        
        <SoulGenerationCircle>
          <SoulBabyImage>
            <img src="https://i.postimg.cc/GmQ6XVFR/image-Team-Dez.png" alt="Space Baby" />
          </SoulBabyImage>
          
          {/* Soul particles animation */}
          {particles.map(particle => (
            <SoulParticle
              key={particle.id}
              size={particle.size}
              color={particle.color}
              posX={particle.posX}
              posY={particle.posY}
            />
          ))}
        </SoulGenerationCircle>
        
        <LoadingSubtitle>{loadingStage}</LoadingSubtitle>
        <ProgressText>{loadingProgress}%</ProgressText>
      </SoulLoadingOverlay>
      
      {/* Integrated Cryptonic Soul Generator */}
      <IntegratedLoadingOverlay show={showGenerator} fadeOut={generatorFadeOut}>
        <GeneratorTitle>3D CRYPTONIC SOUL GENERATOR</GeneratorTitle>
        <GeneratorImage src={soulGeneratorImg} alt="Soul Generator" /> {/* Use imported image */}
        <GeneratorText>{generatorText}</GeneratorText>
        <GeneratorProgressBar>
          <GeneratorProgress width={generatorProgress} />
        </GeneratorProgressBar>
        <GeneratorText>{generatorProgress}% Complete</GeneratorText>
      </IntegratedLoadingOverlay>
      
      {/* Portal Transition to Astroverse */}
      <TransitionPortal show={showPortal} fadeIn={portalFadeIn}>
        <h2>Entering the Astroverse</h2>
      </TransitionPortal>
    </>
  );
};

export default Etherland;
