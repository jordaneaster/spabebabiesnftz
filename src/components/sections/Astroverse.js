import React, { useEffect, useState, useRef, useCallback } from 'react';
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

// Game animations
const sparkleEffect = keyframes`
  0% { transform: scale(1) rotate(0deg); opacity: 0.7; filter: hue-rotate(0deg); }
  25% { transform: scale(1.2) rotate(90deg); opacity: 0.9; filter: hue-rotate(90deg); }
  50% { transform: scale(1.5) rotate(180deg); opacity: 1; filter: hue-rotate(180deg); }
  75% { transform: scale(1.2) rotate(270deg); opacity: 0.9; filter: hue-rotate(270deg); }
  100% { transform: scale(1) rotate(360deg); opacity: 0.7; filter: hue-rotate(360deg); }
`;

const hoverEffect = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
  100% { transform: translateY(0px); }
`;

const glowEffect = keyframes`
  0% { box-shadow: 0 0 10px rgba(0, 255, 157, 0.5); }
  50% { box-shadow: 0 0 25px rgba(0, 255, 157, 0.8); }
  100% { box-shadow: 0 0 10px rgba(0, 255, 157, 0.5); }
`;

// Add motion trail animation for smoother movement
const trailFade = keyframes`
  0% { opacity: 0.7; transform: scale(0.9); }
  100% { opacity: 0; transform: scale(0.5); }
`;

// Add 3D rotation animation
const rotateY = keyframes`
  0% { transform: rotateY(0deg); }
  100% { transform: rotateY(360deg); }
`;

const float3D = keyframes`
  0% { transform: translateY(0) translateZ(0) rotateX(0deg); }
  25% { transform: translateY(-5px) translateZ(5px) rotateX(5deg); }
  50% { transform: translateY(-10px) translateZ(10px) rotateX(10deg); }
  75% { transform: translateY(-5px) translateZ(5px) rotateX(5deg); }
  100% { transform: translateY(0) translateZ(0) rotateX(0deg); }
`;

// Define fallback images with inline base64 or simple gradients
const FALLBACK_BG = "linear-gradient(to bottom, #000033, #000066)";
const FALLBACK_COSMIC_DUST = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='50' height='50' viewBox='0 0 50 50'%3E%3Ccircle cx='25' cy='25' r='15' fill='%2300ff9d' opacity='0.8'/%3E%3C/svg%3E";
const FALLBACK_REWARD = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cpolygon points='50,10 61,35 90,35 65,55 75,80 50,65 25,80 35,55 10,35 39,35' fill='gold'/%3E%3C/svg%3E";

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

// Game UI Components
const GameWrapper = styled.div`
  width: 90%;
  max-width: 900px;
  margin: 3rem auto;
  animation: ${fadeIn} 0.8s ease forwards;
  animation-delay: 0.5s;
  opacity: 0;
  animation-fill-mode: forwards;
`;

const GameTitle = styled.h2`
  font-size: ${props => props.theme.fontxl};
  color: ${props => props.theme.text};
  text-align: center;
  margin-bottom: 1.5rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-shadow: 0 0 10px rgba(0, 255, 157, 0.7);
`;

const GameContainer = styled.div`
  background-color: rgba(0, 0, 0, 0.7);
  border-radius: 20px;
  border: 2px solid rgba(0, 255, 157, 0.5);
  box-shadow: 0 0 30px rgba(0, 255, 157, 0.3);
  overflow: hidden;
  position: relative;
  height: 500px;
  animation: ${glowEffect} 4s infinite ease-in-out;
`;

const GameCanvas = styled.div`
  width: 100%;
  height: 100%;
  background: ${props => props.background || FALLBACK_BG};
  background-size: cover;
  position: relative;
  overflow: hidden;
`;

// Make the cosmic dust particles more visible and interactive
const CosmicDust = styled.div`
  position: absolute;
  width: 40px;
  height: 40px;
  background-image: url("${FALLBACK_COSMIC_DUST}");
  background-size: contain;
  background-repeat: no-repeat;
  animation: ${sparkleEffect} 3s infinite;
  pointer-events: all;
  z-index: 5;
  cursor: pointer;
  filter: drop-shadow(0 0 8px rgba(0, 255, 157, 0.8));
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.4);
    filter: drop-shadow(0 0 15px rgba(0, 255, 157, 1));
  }
`;

// Add a collection animation
const collectAnimation = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.8); opacity: 0.8; filter: hue-rotate(180deg); }
  100% { transform: scale(2.5); opacity: 0; }
`;

const CollectionEffect = styled.div`
  position: absolute;
  width: 40px;
  height: 40px;
  background-image: url("${FALLBACK_COSMIC_DUST}");
  background-size: contain;
  background-repeat: no-repeat;
  animation: ${collectAnimation} 0.5s forwards;
  pointer-events: none;
  z-index: 6;
`;

// Enhanced 3D Baby Avatar
const BabyAvatar = styled.div`
  width: 100px;
  height: 100px;
  position: absolute;
  transition: all 0.3s ease;
  z-index: 10;
  cursor: pointer;
  perspective: 1000px;
  transform-style: preserve-3d;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    border-radius: 50%;
    box-shadow: 0 10px 25px rgba(0, 255, 157, 0.6);
    transition: transform 0.3s ease;
  }
`;

// Create 3D Avatar container
const Avatar3DContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  animation: ${float3D} 4s infinite ease-in-out;
  
  /* Create pseudo-elements for 3D effect layers */
  &::before, &::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    background-image: ${props => `url(${props.imageUrl})`};
    background-color: transparent;
  }
  
  /* Back layer with shadow for depth */
  &::before {
    transform: translateZ(-5px) scale(0.95);
    filter: blur(3px) brightness(0.7);
    opacity: 0.7;
  }
  
  /* Front layer with glow effect */
  &::after {
    transform: translateZ(5px) scale(1.05);
    filter: drop-shadow(0 0 10px rgba(0, 255, 157, 0.8));
  }
`;

// Create a component for the 3D avatar face
const Avatar3DFace = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  border-radius: 50%;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  background-image: ${props => `url(${props.imageUrl})`};
  transform: ${props => `translateZ(${props.z}px)`};
  backface-visibility: hidden;
`;

const MotionTrail = styled.div`
  position: absolute;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: rgba(0, 255, 157, 0.2);
  animation: ${trailFade} 0.6s forwards;
  z-index: 9;
`;

const GameControls = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 15px;
  background-color: rgba(0, 0, 0, 0.8);
  border-top: 1px solid rgba(0, 255, 157, 0.5);
`;

const ControlButton = styled.button`
  background-color: rgba(0, 255, 157, 0.2);
  border: 1px solid rgba(0, 255, 157, 0.8);
  color: white;
  padding: 8px 15px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: bold;
  
  &:hover {
    background-color: rgba(0, 255, 157, 0.4);
    transform: translateY(-3px);
  }
`;

const GameStats = styled.div`
  position: absolute;
  top: 15px;
  left: 15px;
  background-color: rgba(0, 0, 0, 0.7);
  padding: 10px 15px;
  border-radius: 10px;
  color: white;
  border: 1px solid rgba(0, 255, 157, 0.5);
  z-index: 20;
`;

const MissionPanel = styled.div`
  position: absolute;
  top: 15px;
  right: 15px;
  background-color: rgba(0, 0, 0, 0.7);
  padding: 10px 15px;
  border-radius: 10px;
  width: 220px;
  color: white;
  border: 1px solid rgba(0, 255, 157, 0.5);
  z-index: 20;
`;

const GameOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 30;
  padding: 20px;
  
  h3 {
    color: rgba(0, 255, 157, 1);
    font-size: 2rem;
    margin-bottom: 20px;
  }
  
  p {
    color: white;
    text-align: center;
    margin-bottom: 20px;
    max-width: 80%;
  }
`;

const Reward = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  animation: ${fadeIn} 0.5s ease forwards;
  
  img {
    width: 100px;
    height: 100px;
    object-fit: contain;
    animation: ${sparkleEffect} 2s infinite;
  }
  
  p {
    color: gold;
    font-weight: bold;
    margin-top: 10px;
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 20px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  overflow: hidden;
  margin-top: 10px;
  
  .progress {
    height: 100%;
    background-color: rgba(0, 255, 157, 0.7);
    width: ${props => props.progress}%;
    transition: width 0.5s ease;
  }
`;

const KeyboardControls = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 15px;
`;

const KeyCap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  background-color: rgba(0, 0, 0, 0.7);
  border: 1px solid rgba(0, 255, 157, 0.8);
  border-radius: 5px;
  color: white;
  font-weight: bold;
  box-shadow: 0 0 10px rgba(0, 255, 157, 0.3);
`;

// Optimize game component to reduce lag
const GameComponent = React.memo(({ 
  zones, 
  currentZone, 
  babyPosition,
  cosmicDust,
  dustParticles,
  motionTrails,
  collectionEffects,
  abilities,
  currentMission,
  spaceBabyImage,
  handleDustClick,
  showTutorial,
  showReward,
  gameCompleted,
  setShowTutorial,
  setGameStarted,
  lastDirection
}) => {
  return (
    <GameCanvas background={zones[currentZone].background}>
      {/* Optimize motion trails rendering */}
      {motionTrails.slice(-3).map(trail => (
        <MotionTrail
          key={trail.id}
          style={{left: `${trail.x}%`, top: `${trail.y}%`}}
        />
      ))}
      
      {/* Render cosmic dust particles with click handler */}
      {dustParticles.map(dust => !dust.collected && (
        <CosmicDust 
          key={dust.id} 
          style={{left: `${dust.x}%`, top: `${dust.y}%`}}
          onClick={() => handleDustClick(dust.id)}
        />
      ))}
      
      {/* Optimize collection effects rendering */}
      {collectionEffects.slice(-5).map(effect => (
        <CollectionEffect
          key={effect.id}
          style={{left: `${effect.x}%`, top: `${effect.y}%`}}
        />
      ))}
      
      {/* Add direction-based styling for the baby avatar */}
      <BabyAvatar 
        style={{
          left: `${babyPosition.x}%`, 
          top: `${babyPosition.y}%`,
          transform: `${lastDirection === 'left' ? 'scaleX(-1)' : 'scaleX(1)'} rotateY(${lastDirection === 'left' || lastDirection === 'right' ? '15deg' : '0'}) rotateX(${lastDirection === 'up' ? '-15deg' : lastDirection === 'down' ? '15deg' : '0'})`,
        }}
      >
        <Avatar3DContainer 
          imageUrl={spaceBabyImage || '/assets/default-baby.png'}
        >
          {/* Create multiple layers for 3D depth effect */}
          <Avatar3DFace 
            imageUrl={spaceBabyImage || '/assets/default-baby.png'} 
            z="0"
            onError={(e) => {
              e.target.style.backgroundImage = "url('data:image/svg+xml,%3Csvg xmlns=\"http://www.w3.org/2000/svg\" width=\"100\" height=\"100\" viewBox=\"0 0 100 100\"%3E%3Ccircle cx=\"50\" cy=\"50\" r=\"40\" fill=\"%2300ff9d\"%3E%3C/circle%3E%3Ccircle cx=\"35\" cy=\"40\" r=\"5\" fill=\"white\"%3E%3C/circle%3E%3Ccircle cx=\"65\" cy=\"40\" r=\"5\" fill=\"white\"%3E%3C/circle%3E%3Cpath d=\"M 30 60 Q 50 70 70 60\" stroke=\"white\" fill=\"transparent\" stroke-width=\"3\"%3E%3C/path%3E%3C/svg%3E')";
            }}
          />
        </Avatar3DContainer>
      </BabyAvatar>
      
      {/* Enhanced game stats panel */}
      <GameStats>
        <p>Zone: {zones[currentZone].name}</p>
        <p>Cosmic Dust: {cosmicDust} / {currentMission?.dustRequired || 0}</p>
        <p>Abilities: {abilities.join(', ') || 'None yet'}</p>
      </GameStats>
      
      {/* Enhanced mission panel */}
      <MissionPanel>
        <h4>Current Mission</h4>
        <p><strong>{currentMission?.title}</strong></p>
        <p>{currentMission?.description}</p>
        <ProgressBar progress={(cosmicDust / (currentMission?.dustRequired || 1)) * 100}>
          <div className="progress"></div>
        </ProgressBar>
      </MissionPanel>
      
      {/* Enhanced tutorial overlay */}
      {showTutorial && (
        <GameOverlay>
          <h3>Welcome to Astroverse Explorer!</h3>
          <p>Guide your Space Baby through the Astroverse to collect cosmic dust and complete missions.</p>
          <p>Use WASD or arrow keys to move around. You can also use the on-screen buttons.</p>
          <p>Click directly on cosmic dust particles to collect them faster!</p>
          <p>Complete missions to unlock special abilities and learn more about the Univerzity!</p>
          <div onClick={() => setShowTutorial(false)}>
            <Button text="Start Exploring" />
          </div>
        </GameOverlay>
      )}
      
      {showReward && (
        <GameOverlay>
          <h3>Mission Complete!</h3>
          <Reward>
            <img 
              src="/assets/reward-star.png" 
              alt="Reward"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = FALLBACK_REWARD;
              }}
            />
            <p>New Ability: {currentMission?.reward}</p>
          </Reward>
          <p>Your Space Baby is growing stronger in the Astroverse!</p>
        </GameOverlay>
      )}
      
      {gameCompleted && (
        <GameOverlay>
          <h3>Congratulations!</h3>
          <p>You've completed all the Astroverse Explorer missions!</p>
          <p>Your Space Baby is now a full-fledged member of the Univerzity.</p>
          <p>Continue exploring to find hidden secrets or join your Fratz community!</p>
          <div onClick={() => setGameStarted(false)}>
            <Button text="Return to Astroverse" />
          </div>
        </GameOverlay>
      )}
    </GameCanvas>
  );
});

const Astroverse = () => {
  const [loaded, setLoaded] = useState(false);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);
  const [spaceBabyImage, setSpaceBabyImage] = useState(null);
  
  // Game state
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [currentZone, setCurrentZone] = useState(0);
  const [showTutorial, setShowTutorial] = useState(false);
  const [babyPosition, setBabyPosition] = useState({ x: 50, y: 50 });
  const [cosmicDust, setCosmicDust] = useState(0);
  const [currentMission, setCurrentMission] = useState(null);
  const [missionProgress, setMissionProgress] = useState(0);
  const [showReward, setShowReward] = useState(false);
  const [abilities, setAbilities] = useState([]);
  
  const gameCanvas = useRef(null);
  
  // Add state for cosmic dust particles and image loading
  const [dustParticles, setDustParticles] = useState([]);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [zoneBackgrounds, setZoneBackgrounds] = useState([
    FALLBACK_BG,
    FALLBACK_BG,
    FALLBACK_BG,
    FALLBACK_BG
  ]);
  
  // Add state for collection effects
  const [collectionEffects, setCollectionEffects] = useState([]);
  
  // Add state for keyboard controls and motion trails
  const [keyboardEnabled, setKeyboardEnabled] = useState(true);
  const [motionTrails, setMotionTrails] = useState([]);
  const [lastDirection, setLastDirection] = useState(null);
  const [isMissionTransitioning, setIsMissionTransitioning] = useState(false);
  
  // Add debounce for smoother keyboard controls
  const [lastKeyPress, setLastKeyPress] = useState(0);
  const keyDebounceTime = 100; // ms between key presses
  
  // Track mission corners visited
  const [cornersVisited, setCornersVisited] = useState({
    topLeft: false,
    topRight: false,
    bottomLeft: false,
    bottomRight: false
  });
  
  // Update zones with fallback backgrounds
  const zones = [
    { name: "Cosmic Nursery", background: zoneBackgrounds[0], description: "Where Space Babiez begin their journey" },
    { name: "Stardust Academy", background: zoneBackgrounds[1], description: "Learn the ways of the Astroverse" },
    { name: "Nebula Gardens", background: zoneBackgrounds[2], description: "Discover rare cosmic flora and fauna" },
    { name: "Univerzity Campus", background: zoneBackgrounds[3], description: "The heart of Space Babiez education" },
  ];

  const missions = [
    { id: 1, title: "First Steps", description: "Move your Space Baby around to collect 5 cosmic dust particles", reward: "Cosmic Radar Ability", dustRequired: 5 },
    { id: 2, title: "Meet the Fratz", description: "Visit the Fratz emblem and learn about your fraternity", reward: "Frat Emblem Badge", dustRequired: 0 },
    { id: 3, title: "Star Navigation", description: "Navigate to all four corners of the current zone", reward: "Zone Teleporter", dustRequired: 10 },
    { id: 4, title: "Univerzity Tour", description: "Explore all zones of the Astroverse", reward: "Graduation Cap", dustRequired: 20 },
  ];
  
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
  
  // Check if images exist and load them
  useEffect(() => {
    // Try to load zone background images
    const zoneImagePaths = [
      '/assets/cosmic-nursery.jpg',
      '/assets/stardust-academy.jpg',
      '/assets/nebula-gardens.jpg',
      '/assets/univerzity-campus.jpg'
    ];

    // Function to check if image exists
    const checkImage = (imageSrc) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(imageSrc);
        img.onerror = () => resolve(FALLBACK_BG);
        img.src = imageSrc;
      });
    };

    // Check all zone images
    const loadImages = async () => {
      const loadedBackgrounds = await Promise.all(
        zoneImagePaths.map(path => checkImage(path))
      );
      setZoneBackgrounds(loadedBackgrounds);
      setImagesLoaded(true);
    };

    loadImages();
  }, []);

  // Generate cosmic dust particles - only when needed
  useEffect(() => {
    if (gameStarted && !showTutorial && !showReward && !gameCompleted) {
      // Create some random dust particles but ensure they're not too close together
      const particles = [];
      const minDistance = 15; // Minimum distance between particles
      
      const attemptToAddParticle = (attempts = 0) => {
        if (attempts > 20 || particles.length >= 10) return;
        
        const newX = Math.random() * 80 + 10;
        const newY = Math.random() * 80 + 10;
        
        // Check if this position is too close to existing particles
        const isTooClose = particles.some(p => {
          const distance = Math.sqrt(
            Math.pow(p.x - newX, 2) + Math.pow(p.y - newY, 2)
          );
          return distance < minDistance;
        });
        
        if (!isTooClose) {
          particles.push({
            id: particles.length,
            x: newX,
            y: newY,
            collected: false
          });
        }
        
        attemptToAddParticle(attempts + 1);
      };
      
      // Try to add 10 particles
      while (particles.length < 10) {
        attemptToAddParticle();
      }
      
      setDustParticles(particles);
    }
  }, [gameStarted, showTutorial, currentZone, showReward, gameCompleted]);

  // Optimize keyboard controls with debounce
  useEffect(() => {
    if (gameStarted && !showTutorial && !showReward && !gameCompleted) {
      const handleKeyDown = (e) => {
        const now = Date.now();
        if (now - lastKeyPress < keyDebounceTime) return;
        
        setLastKeyPress(now);
        
        switch(e.key) {
          case 'ArrowUp':
          case 'w':
          case 'W':
            moveBaby('up');
            e.preventDefault();
            break;
          case 'ArrowDown':
          case 's':
          case 'S':
            moveBaby('down');
            e.preventDefault();
            break;
          case 'ArrowLeft':
          case 'a':
          case 'A':
            moveBaby('left');
            e.preventDefault();
            break;
          case 'ArrowRight':
          case 'd':
          case 'D':
            moveBaby('right');
            e.preventDefault();
            break;
          default:
            break;
        }
      };
      
      window.addEventListener('keydown', handleKeyDown);
      
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [gameStarted, showTutorial, lastKeyPress, showReward, gameCompleted]);

  // Initialize game with proper initial state
  const handleStartGame = useCallback(() => {
    console.log("Starting game...");
    setGameStarted(true);
    setShowTutorial(true);
    setCurrentMission(missions[0]);
    setCosmicDust(0);
    setAbilities([]);
    setBabyPosition({ x: 50, y: 50 });
    setCurrentZone(0);
    setGameCompleted(false);
    setIsMissionTransitioning(false);
    setCornersVisited({
      topLeft: false,
      topRight: false,
      bottomLeft: false,
      bottomRight: false
    });
    
    // Force welcome message to be shown if not already
    if (!showWelcomeMessage) {
      setShowWelcomeMessage(true);
      
      // Use placeholder baby image if none exists
      if (!spaceBabyImage) {
        setSpaceBabyImage('/assets/default-baby.png');
      }
    }
  }, [missions, showWelcomeMessage, spaceBabyImage]);
  
  // Add motion trail effect with optimization
  const addMotionTrail = useCallback((x, y) => {
    const trailId = Date.now();
    
    // Limit number of trails to reduce rendering load
    setMotionTrails(prev => {
      const updated = [...prev, { id: trailId, x, y }];
      return updated.slice(-5); // Only keep the 5 most recent trails
    });
    
    // Remove trail after animation completes to reduce memory usage
    setTimeout(() => {
      setMotionTrails(prev => prev.filter(trail => trail.id !== trailId));
    }, 600);
  }, []);
  
  // Optimize baby movement
  const moveBaby = useCallback((direction) => {
    if (showTutorial || showReward || gameCompleted || isMissionTransitioning) return;
    
    // Save current position for trail effect
    setBabyPosition(prev => {
      const currentPos = {...prev};
      let newX = prev.x;
      let newY = prev.y;
      
      // Increase movement amount for better control
      const moveAmount = 8;
      
      switch(direction) {
        case 'up':
          newY = Math.max(0, prev.y - moveAmount);
          setLastDirection('up');
          break;
        case 'down':
          newY = Math.min(90, prev.y + moveAmount);
          setLastDirection('down');
          break;
        case 'left':
          newX = Math.max(0, prev.x - moveAmount);
          setLastDirection('left');
          break;
        case 'right':
          newX = Math.min(90, prev.x + moveAmount);
          setLastDirection('right');
          break;
        default:
          break;
      }
      
      // Add motion trail if position changed
      if (newX !== prev.x || newY !== prev.y) {
        addMotionTrail(currentPos.x, currentPos.y);
        
        // Check if we're in a corner for mission 3
        if (currentMission?.id === 3) {
          checkCornersVisited(newX, newY);
        }
      }
      
      return { x: newX, y: newY };
    });
    
    // Check if the baby is near collectable items
    requestAnimationFrame(() => checkCollisions());
  }, [showTutorial, showReward, gameCompleted, isMissionTransitioning, addMotionTrail, currentMission]);
  
  // Track corners visited for mission 3
  const checkCornersVisited = useCallback((x, y) => {
    const newCornersVisited = {...cornersVisited};
    const threshold = 15; // How close to the edge to count as visiting a corner
    
    if (x <= threshold && y <= threshold) {
      newCornersVisited.topLeft = true;
    }
    if (x >= 90 - threshold && y <= threshold) {
      newCornersVisited.topRight = true;
    }
    if (x <= threshold && y >= 90 - threshold) {
      newCornersVisited.bottomLeft = true;
    }
    if (x >= 90 - threshold && y >= 90 - threshold) {
      newCornersVisited.bottomRight = true;
    }
    
    setCornersVisited(newCornersVisited);
  }, [cornersVisited]);
  
  // Optimize dust click handler
  const handleDustClick = useCallback((dustId) => {
    if (showTutorial || showReward || gameCompleted || isMissionTransitioning) return;
    
    setDustParticles(prev => {
      const updatedDust = prev.map(dust => {
        if (dust.id === dustId && !dust.collected) {
          // Add collection effect
          const effectId = Date.now();
          setCollectionEffects(effects => [...effects, { id: effectId, x: dust.x, y: dust.y }]);
          
          // Clean up effect after animation
          setTimeout(() => {
            setCollectionEffects(effects => effects.filter(effect => effect.id !== effectId));
          }, 500);
          
          // Increment dust counter with a slight delay to avoid race conditions
          setTimeout(() => {
            setCosmicDust(count => count + 1);
            
            // Check mission progress after incrementing
            setTimeout(() => updateMissionProgress(), 100);
          }, 50);
          
          return { ...dust, collected: true };
        }
        return dust;
      });
      
      return updatedDust;
    });
  }, [showTutorial, showReward, gameCompleted, isMissionTransitioning]);
  
  // Improved collision detection with particle collision validation
  const checkCollisions = useCallback(() => {
    if (showTutorial || showReward || gameCompleted || isMissionTransitioning) return;
    
    // Check collision with dust particles
    setDustParticles(prev => {
      let dustCollected = false;
      
      const updatedDust = prev.map(dust => {
        if (dust.collected) return dust;
        
        // Calculate distance between baby and dust
        const babyX = babyPosition.x;
        const babyY = babyPosition.y;
        const distance = Math.sqrt(
          Math.pow(babyX - dust.x, 2) + 
          Math.pow(babyY - dust.y, 2)
        );
        
        // If close enough, collect the dust
        if (distance < 15) {
          dustCollected = true;
          
          // Add collection effect
          const effectId = Date.now();
          setCollectionEffects(effects => [...effects, { id: effectId, x: dust.x, y: dust.y }]);
          
          // Clean up effect after animation
          setTimeout(() => {
            setCollectionEffects(effects => effects.filter(effect => effect.id !== effectId));
          }, 500);
          
          return { ...dust, collected: true };
        }
        return dust;
      });
      
      // Only increment dust counter if something was actually collected
      if (dustCollected) {
        setTimeout(() => {
          setCosmicDust(count => count + 1);
          
          // Check mission progress after incrementing
          setTimeout(() => updateMissionProgress(), 100);
        }, 50);
      }
      
      return updatedDust;
    });
  }, [babyPosition, showTutorial, showReward, gameCompleted, isMissionTransitioning]);
  
  // Update mission progress with fixed logic
  const updateMissionProgress = useCallback(() => {
    if (!currentMission || isMissionTransitioning || showReward) return;
    
    switch (currentMission.id) {
      case 1:
        // First Steps - collect 5 cosmic dust
        if (cosmicDust >= currentMission.dustRequired) {
          completeMission();
        }
        break;
      
      case 2:
        // Meet the Fratz - go to the center
        const centerX = Math.abs(babyPosition.x - 50) < 10;
        const centerY = Math.abs(babyPosition.y - 50) < 10;
        
        if (centerX && centerY) {
          completeMission();
        }
        break;
      
      case 3:
        // Star Navigation - visit all four corners
        if (cornersVisited.topLeft && 
            cornersVisited.topRight && 
            cornersVisited.bottomLeft && 
            cornersVisited.bottomRight) {
          completeMission();
        }
        break;
      
      case 4:
        // Univerzity Tour - collect 20 cosmic dust
        if (cosmicDust >= currentMission.dustRequired) {
          completeMission();
        }
        break;
        
      default:
        break;
    }
  }, [currentMission, isMissionTransitioning, cosmicDust, babyPosition, cornersVisited, showReward]);
  
  // Fixed mission completion logic
  const completeMission = useCallback(() => {
    // Prevent multiple mission completions
    if (isMissionTransitioning || showReward) return;
    
    console.log(`Completing mission ${currentMission?.id}`);
    
    setIsMissionTransitioning(true);
    setShowReward(true);
    
    // Add the ability
    setAbilities(prev => {
      if (!prev.includes(currentMission.reward)) {
        return [...prev, currentMission.reward];
      }
      return prev;
    });
    
    // Prepare for next mission
    setTimeout(() => {
      setShowReward(false);
      
      const nextMissionIndex = currentMission.id;
      
      // Reset game state for new mission
      setCosmicDust(0);
      setCornersVisited({
        topLeft: false,
        topRight: false,
        bottomLeft: false,
        bottomRight: false
      });
      
      // Update to the next mission after a brief delay
      setTimeout(() => {
        if (nextMissionIndex < missions.length) {
          setCurrentMission(missions[nextMissionIndex]);
          
          // Change zone if needed
          if (nextMissionIndex >= 1 && currentZone !== nextMissionIndex - 1) {
            setCurrentZone(nextMissionIndex - 1);
          }
        } else {
          setGameCompleted(true);
        }
        
        setIsMissionTransitioning(false);
      }, 500);
    }, 3000);
  }, [currentMission, isMissionTransitioning, missions, currentZone, showReward]);
  
  // Change zone with proper state reset
  const changeZone = useCallback((zoneIndex) => {
    if (zoneIndex >= 0 && zoneIndex < zones.length && !isMissionTransitioning && !showReward) {
      setCurrentZone(zoneIndex);
      setBabyPosition({ x: 50, y: 50 });
      
      // Reset corners visited when changing zones
      setCornersVisited({
        topLeft: false,
        topRight: false,
        bottomLeft: false,
        bottomRight: false
      });
    }
  }, [zones, isMissionTransitioning, showReward]);
  
  return (
    <Section id="astroverse" loaded={loaded}>
      <Title>ASTROVERSE | PORTAL</Title>
      <SubTitle>RELEASE JOURNEY 2.0</SubTitle>
      
      {showWelcomeMessage && (
        <>
          <Text>Welcome to the Astroverse! Your soul generation was successful.</Text>
          {spaceBabyImage && (
            <SpaceBabyContainer>
              <Avatar3DContainer imageUrl={spaceBabyImage}>
                <Avatar3DFace 
                  imageUrl={spaceBabyImage} 
                  z="0"
                  onError={(e) => {
                    e.target.style.backgroundImage = "url('data:image/svg+xml,%3Csvg xmlns=\"http://www.w3.org/2000/svg\" width=\"100\" height=\"100\" viewBox=\"0 0 100 100\"%3E%3Ccircle cx=\"50\" cy=\"50\" r=\"40\" fill=\"%2300ff9d\"%3E%3C/circle%3E%3Ccircle cx=\"35\" cy=\"40\" r=\"5\" fill=\"white\"%3E%3C/circle%3E%3Ccircle cx=\"65\" cy=\"40\" r=\"5\" fill=\"white\"%3E%3C/circle%3E%3Cpath d=\"M 30 60 Q 50 70 70 60\" stroke=\"white\" fill=\"transparent\" stroke-width=\"3\"%3E%3C/path%3E%3C/svg%3E')";
                  }}
                />
              </Avatar3DContainer>
            </SpaceBabyContainer>
          )}
          <Text>Your Space Baby is now ready to explore the Astroverse!</Text>
          
          {!gameStarted && (
            <Center>
              <div onClick={handleStartGame}>
                <Button text="Start Astroverse Explorer" />
              </div>
            </Center>
          )}
        </>
      )}
      
      {gameStarted && (
        <GameWrapper>
          <GameTitle>Astroverse Explorer</GameTitle>
          
          <KeyboardControls>
            <div>
              <KeyCap>W</KeyCap>
              <KeyCap>A</KeyCap>
              <KeyCap>S</KeyCap>
              <KeyCap>D</KeyCap>
            </div>
            <Text style={{marginLeft: '15px', marginTop: '5px'}}>
              or Arrow Keys to move
            </Text>
          </KeyboardControls>
          
          <GameContainer>
            {/* Use the memoized game component for better performance */}
            <GameComponent
              zones={zones}
              currentZone={currentZone}
              babyPosition={babyPosition}
              cosmicDust={cosmicDust}
              dustParticles={dustParticles}
              motionTrails={motionTrails}
              collectionEffects={collectionEffects}
              abilities={abilities}
              currentMission={currentMission}
              spaceBabyImage={spaceBabyImage}
              handleDustClick={handleDustClick}
              showTutorial={showTutorial}
              showReward={showReward}
              gameCompleted={gameCompleted}
              setShowTutorial={setShowTutorial}
              setGameStarted={setGameStarted}
              lastDirection={lastDirection}
            />
            
            <GameControls>
              <ControlButton onClick={() => moveBaby('left')}>←</ControlButton>
              <ControlButton onClick={() => moveBaby('up')}>↑</ControlButton>
              <ControlButton onClick={() => moveBaby('down')}>↓</ControlButton>
              <ControlButton onClick={() => moveBaby('right')}>→</ControlButton>
              <ControlButton onClick={() => changeZone(currentZone - 1)}>Prev Zone</ControlButton>
              <ControlButton onClick={() => changeZone(currentZone + 1)}>Next Zone</ControlButton>
            </GameControls>
            
            <Text style={{marginTop: '20px'}}>
              Use WASD keys, arrow keys, or buttons to move your Space Baby.
              Click directly on cosmic dust to collect it faster!
              {currentMission?.id === 3 && (
                <span style={{display: 'block', marginTop: '10px', color: 'rgba(0, 255, 157, 1)'}}>
                  Mission Hint: Visit all four corners of the screen!
                </span>
              )}
            </Text>
          </GameContainer>
        </GameWrapper>
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
