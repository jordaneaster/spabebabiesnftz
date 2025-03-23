import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import bgr from '../assets/media/BGR3.png';
import Logo from '../components/Logo';
import Button from '../components/Button';

// Import component for navbar
const Navigation = styled.nav`
  width: 100%;
  background: rgba(36, 37, 38, 0.8);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
  backdrop-filter: blur(4px);
`;

const Menu = styled.ul`
  display: flex;
  justify-content: space-between;
  align-items: center;
  list-style: none;
  
  @media (max-width: 64em) {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100vw;
    height: 100vh;
    z-index: 100;
    background-color: ${props => `rgba(${props.theme.bodyRgba},0.85)`};
    backdrop-filter: blur(10px);
    transform: ${props => props.click ? 'translateY(0)' : 'translateY(1000%)'};
    transition: all 0.3s ease;
    flex-direction: column;
    justify-content: center;
  }
`;

const MenuItem = styled.li`
  margin: 0 1rem;
  color: ${props => props.theme.text};
  cursor: pointer;
  font-size: ${props => props.theme.fontmd};
  
  &::after {
    content: '';
    display: block;
    width: 0%;
    height: 2px;
    background: ${props => props.theme.text};
    transition: width 0.3s ease;
  }
  
  &:hover::after {
    width: 100%;
  }
  
  @media (max-width: 64em) {
    margin: 1rem 0;
    font-size: ${props => props.theme.fontlg};
  }
`;

const HamburgerMenu = styled.span`
  width: ${props => props.click ? '2rem' : '1.5rem'};
  height: 2px;
  background: ${props => props.theme.text};
  position: absolute;
  top: 2rem;
  right: 2rem;
  transform: ${props => props.click ? 'translateX(-50%) rotate(90deg)' : 'translateX(0) rotate(0)'};
  display: none;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  
  @media (max-width: 64em) {
    display: flex;
  }
  
  &::after, &::before {
    content: '';
    width: ${props => props.click ? '1rem' : '1.5rem'};
    height: 2px;
    right: ${props => props.click ? '-2px' : '0'};
    background: ${props => props.theme.text};
    position: absolute;
    transition: all 0.3s ease;
  }
  
  &::after {
    top: ${props => props.click ? '0.3rem' : '0.5rem'};
    transform: ${props => props.click ? 'rotate(-40deg)' : 'rotate(0)'};
  }
  
  &::before {
    bottom: ${props => props.click ? '0.3rem' : '0.5rem'};
    transform: ${props => props.click ? 'rotate(40deg)' : 'rotate(0)'};
  }
`;

// Enhanced styling for the existing components
const Section = styled.section`
  min-height: 100vh;
  width: 100%;
  background-color: ${props => props.theme.body};
  background-image: url(${bgr});
  background-size: cover;
  background-repeat: no-repeat;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 6rem 2rem 2rem; /* Added top padding for navbar */
`;

const Container = styled.div`
  width: 80%;
  max-width: 1200px;
  background-color: rgba(36, 37, 38, 0.9);
  border-radius: 20px;
  padding: 3rem;
  margin-top: 2rem;
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
  margin-bottom: 1.5rem;
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
  margin-bottom: 2rem;
  text-align: center;
  max-width: 800px;
  line-height: 1.8;
  
  @media (max-width: 48em) {
    font-size: ${props => props.theme.fontsm};
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

// Enhanced space baby display components
const SpaceBabyDisplay = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 2rem 0;
  padding: 2rem;
  border-radius: 20px;
  background: rgba(155, 81, 224, 0.1);
  border: 1px solid #9b51e0;
  max-width: 600px;
  width: 100%;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: -10px;
    left: -10px;
    right: -10px;
    bottom: -10px;
    background: linear-gradient(45deg, rgba(155, 81, 224, 0.2) 0%, rgba(48, 129, 237, 0.2) 100%);
    border-radius: 30px;
    z-index: -1;
    filter: blur(15px);
    pointer-events: none;
  }
`;

const glowing = keyframes`
  0% { box-shadow: 0 0 10px rgba(155, 81, 224, 0.5); }
  50% { box-shadow: 0 0 20px rgba(155, 81, 224, 0.8), 0 0 40px rgba(48, 129, 237, 0.4); }
  100% { box-shadow: 0 0 10px rgba(155, 81, 224, 0.5); }
`;

const ProfileCircle = styled.div`
  width: 250px;
  height: 250px;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid #9b51e0;
  margin-bottom: 2rem;
  animation: ${float} 6s ease-in-out infinite, ${glowing} 3s infinite;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const BabyName = styled.h3`
  font-size: ${props => props.theme.fontlg};
  color: #9b51e0;
  margin-bottom: 1rem;
  text-align: center;
`;

const AttributeDisplay = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin: 1.5rem 0;
  justify-content: center;
`;

const AttributeBadge = styled.div`
  background: rgba(48, 129, 237, 0.1);
  border: 1px solid #3081ed;
  border-radius: 50px;
  padding: 0.5rem 1rem;
  font-size: ${props => props.theme.fontsm};
  
  span {
    font-weight: bold;
    color: #9b51e0;
    margin-left: 0.5rem;
  }
`;

const ComingSoonSection = styled.div`
  margin-top: 3rem;
  padding: 2rem;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 20px;
  text-align: center;
  max-width: 800px;
  width: 100%;
  border: 2px dashed rgba(155, 81, 224, 0.5);
`;

const ComingSoonLabel = styled.div`
  display: inline-block;
  background: linear-gradient(90deg, #9b51e0 0%, #3081ed 100%);
  padding: 0.5rem 1.5rem;
  border-radius: 50px;
  margin-bottom: 1rem;
  font-weight: bold;
  font-size: ${props => props.theme.fontmd};
  letter-spacing: 2px;
`;

const UnderConstructionBanner = styled.div`
  position: relative;
  background: repeating-linear-gradient(
    45deg,
    rgba(0, 0, 0, 0.8),
    rgba(0, 0, 0, 0.8) 10px,
    rgba(155, 81, 224, 0.8) 10px,
    rgba(155, 81, 224, 0.8) 20px
  );
  padding: 0.5rem;
  margin-top: -1rem;
  margin-bottom: 1rem;
  text-align: center;
  transform: rotate(-2deg);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
  
  h3 {
    color: white;
    font-size: ${props => props.theme.fontlg};
    text-transform: uppercase;
    margin: 0;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
  }
`;

const BackButton = styled.button`
  margin-top: 3rem;
  padding: 0.8rem 2rem;
  background: rgba(48, 129, 237, 0.3);
  border: 1px solid #3081ed;
  border-radius: 50px;
  color: white;
  font-size: ${props => props.theme.fontsm};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(48, 129, 237, 0.5);
  }
`;

const Astroverse = () => {
  const [spaceBabyData, setSpaceBabyData] = useState(null);
  const [fromSoulGeneration, setFromSoulGeneration] = useState(false);
  const [click, setClick] = useState(false);
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();

  // Default fallback image - update this path to a valid image in your project
  const defaultImage = 'https://i.postimg.cc/HswdNhLx/image-10.png';

  useEffect(() => {
    // Check if user came from soul generation
    const fromGeneration = sessionStorage.getItem('fromSoulGeneration') === 'true';
    setFromSoulGeneration(fromGeneration);

    // Get Space Baby data from sessionStorage
    try {
      const image = sessionStorage.getItem('spaceBabyImage');
      const walletAddress = sessionStorage.getItem('walletAddress');
      const metadataUri = sessionStorage.getItem('metadataUri');
      const metadataString = sessionStorage.getItem('spaceBabyMetadata');
      
      console.log("Retrieved image from sessionStorage:", image);
      
      let metadata = null;
      if (metadataString) {
        try {
          metadata = JSON.parse(metadataString);
        } catch (e) {
          console.error('Error parsing metadata JSON:', e);
        }
      }
      
      let validImageUrl = image;
      
      // Validate image URL format
      if (image) {
        // If it's a base64 image but missing the prefix
        if (image.startsWith('/9j/') || image.startsWith('iVBOR')) {
          validImageUrl = `data:image/jpeg;base64,${image}`;
          console.log("Added data:image prefix to base64 string");
        }
        // If it's a relative path (missing http)
        else if (!image.startsWith('data:') && !image.startsWith('http') && !image.startsWith('/')) {
          validImageUrl = `/${image}`;
          console.log("Converted to relative path:", validImageUrl);
        }
      } else {
        validImageUrl = defaultImage;
        console.warn("No Space Baby image found in sessionStorage, using default");
      }
      
      setSpaceBabyData({
        image: validImageUrl,
        walletAddress,
        metadataUri,
        metadata,
        name: metadata?.name || `Space Baby #${Math.floor(Math.random() * 10000)}`,
        attributes: metadata?.attributes || [],
      });
        
    } catch (error) {
      console.error('Error retrieving Space Baby data from sessionStorage:', error);
      // Set default data on error
      setSpaceBabyData({
        image: defaultImage,
        name: `Space Baby #${Math.floor(Math.random() * 10000)}`,
        attributes: [],
      });
    }
    
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  const handleBack = () => {
    navigate('/');
  };

  return (
    <>
      <Navigation>
        <Logo />
        <HamburgerMenu click={click} onClick={() => setClick(!click)} />
        <Menu click={click}>
          <MenuItem onClick={() => navigate('/')}>Home</MenuItem>
          <MenuItem onClick={() => navigate('/etherland')}>Soul Generator</MenuItem>
          <MenuItem onClick={() => navigate('/about')}>About</MenuItem>
          <MenuItem onClick={() => navigate('/roadmap')}>Roadmap</MenuItem>
        </Menu>
      </Navigation>
      
      <Section>
        <Container>
          <Title>Welcome to Astroverse</Title>
          
          {fromSoulGeneration && (
            <Subtitle>Your Space Baby Has Arrived!</Subtitle>
          )}
          
          <Description>
            Explore the cosmic universe with your newly generated Space Baby. 
            Your digital companion will guide you through the wonders of the Astroverse.
          </Description>
          
          {spaceBabyData && (
            <SpaceBabyDisplay>
              <BabyName>{spaceBabyData.name}</BabyName>
              <ProfileCircle>
                {imageError ? (
                  <div style={{ 
                    width: '100%', 
                    height: '100%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    background: '#1a1a1a',
                    color: '#9b51e0',
                    textAlign: 'center',
                    padding: '1rem'
                  }}>
                    Space Baby<br/>Image Loading Error
                  </div>
                ) : (
                  <img 
                    src={spaceBabyData.image} 
                    alt="Your Space Baby"
                    onError={(e) => {
                      console.error("Error loading image:", e, "URL was:", spaceBabyData.image);
                      // Try fallback image
                      if (spaceBabyData.image !== defaultImage) {
                        e.target.src = defaultImage;
                      } else {
                        // If even the fallback fails, show an error message
                        setImageError(true);
                      }
                    }}
                    style={{ objectFit: 'contain' }}
                  />
                )}
              </ProfileCircle>
              
              {/* Debug info - remove in production */}
              {process.env.NODE_ENV === 'development' && (
                <div style={{ 
                  padding: '0.5rem', 
                  background: 'rgba(0,0,0,0.5)', 
                  color: 'white', 
                  fontSize: '0.8rem',
                  marginBottom: '1rem',
                  maxWidth: '100%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  Image path: {spaceBabyData.image?.substring(0, 50)}{spaceBabyData.image?.length > 50 ? '...' : ''}
                </div>
              )}
              
              {spaceBabyData.metadata?.attributes && (
                <AttributeDisplay>
                  {Object.entries(spaceBabyData.metadata.attributes).map(([key, value], index) => (
                    <AttributeBadge key={index}>
                      {key}: <span>{value}</span>
                    </AttributeBadge>
                  ))}
                </AttributeDisplay>
              )}
              
              {spaceBabyData.walletAddress && (
                <Description>
                  Connected Wallet: {spaceBabyData.walletAddress.substring(0, 6)}...
                  {spaceBabyData.walletAddress.substring(spaceBabyData.walletAddress.length - 4)}
                </Description>
              )}
            </SpaceBabyDisplay>
          )}
          
          <ComingSoonSection>
            <UnderConstructionBanner>
              <h3>Under Construction</h3>
            </UnderConstructionBanner>
            <ComingSoonLabel>COMING SOON</ComingSoonLabel>
            <Subtitle>Astroverse Explorer</Subtitle>
            <Description>
              The Astroverse Explorer is currently under development. Soon you'll be able to navigate 
              the cosmic realms, discover new planets, and interact with other Space Babies in our 
              expanding universe. Our development team is working hard to bring this exciting feature to life!
            </Description>
          </ComingSoonSection>
          
          <BackButton onClick={handleBack}>
            Return to Home
          </BackButton>
        </Container>
      </Section>
    </>
  );
};

export default Astroverse;
