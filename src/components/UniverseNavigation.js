import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { Link, useLocation } from 'react-router-dom';

// Animations
const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(155, 81, 224, 0.7); }
  70% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(155, 81, 224, 0); }
  100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(155, 81, 224, 0); }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const galaxyApproach = keyframes`
  0% { transform: scale(0.9); opacity: 0.5; }
  100% { transform: scale(1); opacity: 1; }
`;

// Styled Components
const NavigationContainer = styled.div`
  width: 100%;
  padding: 2rem 0;
  position: relative;
  z-index: 10;
`;

const GalaxyMap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
  position: relative;
  margin: 0 auto;
  max-width: 1000px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 2.5rem;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 10%;
    right: 10%;
    height: 3px;
    background: linear-gradient(90deg, 
      rgba(155, 81, 224, 0.3), 
      rgba(155, 81, 224, 0.7) 20%, 
      rgba(48, 129, 237, 0.7) 80%, 
      rgba(48, 129, 237, 0.3)
    );
    z-index: -1;
    
    @media (max-width: 768px) {
      top: 0;
      bottom: 0;
      left: 50%;
      right: auto;
      width: 3px;
      height: auto;
      background: linear-gradient(180deg, 
        rgba(155, 81, 224, 0.3), 
        rgba(155, 81, 224, 0.7) 20%, 
        rgba(48, 129, 237, 0.7) 80%, 
        rgba(48, 129, 237, 0.3)
      );
    }
  }
`;

const GalaxyNode = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: ${props => props.theme.text};
  position: relative;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    
    .galaxy-icon {
      animation: ${pulse} 1.5s infinite ease-in-out;
    }
    
    .galaxy-name {
      color: ${props => props.color || '#9b51e0'};
    }
  }
  
  ${props => props.active && `
    .galaxy-icon {
      animation: ${pulse} 1.5s infinite ease-in-out;
      transform: scale(1.15);
    }
    
    .galaxy-name {
      color: ${props.color || '#9b51e0'};
      font-weight: bold;
    }
  `}
`;

const GalaxyIcon = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.bg || 'linear-gradient(45deg, #3081ed, #9b51e0)'};
  font-size: 2.5rem;
  color: white;
  position: relative;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
  cursor: pointer;
  
  &::before {
    content: '';
    position: absolute;
    top: -5px;
    left: -5px;
    right: -5px;
    bottom: -5px;
    border-radius: 50%;
    border: 2px solid ${props => props.active ? props.bgColor || '#9b51e0' : 'transparent'};
    opacity: 0.7;
    transition: all 0.3s ease;
  }
  
  @media (max-width: 768px) {
    width: 80px;
    height: 80px;
    font-size: 2rem;
  }
`;

const GalaxyIconInner = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    right: -50%;
    bottom: -50%;
    background: radial-gradient(circle, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 30%, rgba(255,255,255,0) 70%);
    animation: ${rotate} 10s linear infinite;
  }
`;

const GalaxyName = styled.div`
  font-size: ${props => props.theme.fontmd};
  font-weight: 500;
  margin-bottom: 0.5rem;
  transition: color 0.3s ease;
  
  @media (max-width: 768px) {
    font-size: ${props => props.theme.fontsm};
  }
`;

const GalaxyDescription = styled.div`
  font-size: ${props => props.theme.fontsm};
  text-align: center;
  max-width: 200px;
  color: ${props => `rgba(${props.theme.textRgba}, 0.7)`};
  
  @media (max-width: 768px) {
    font-size: ${props => props.theme.fontxs};
    max-width: 160px;
  }
`;

const DetailedView = styled.div`
  background: rgba(36, 37, 38, 0.8);
  border-radius: 15px;
  padding: 2rem;
  margin-top: 2rem;
  display: ${props => props.visible ? 'block' : 'none'};
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
  animation: ${galaxyApproach} 0.5s ease forwards;
`;

const DetailHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const DetailIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: ${props => props.bg || 'linear-gradient(45deg, #3081ed, #9b51e0)'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
  flex-shrink: 0;
`;

const DetailTitle = styled.div`
  h2 {
    font-size: ${props => props.theme.fontxl};
    color: ${props => props.color || '#9b51e0'};
    margin-bottom: 0.5rem;
    
    @media (max-width: 768px) {
      font-size: ${props => props.theme.fontlg};
    }
  }
  
  p {
    color: ${props => `rgba(${props.theme.textRgba}, 0.8)`};
    font-size: ${props => props.theme.fontmd};
    
    @media (max-width: 768px) {
      font-size: ${props => props.theme.fontsm};
    }
  }
`;

const DetailContent = styled.div`
  display: flex;
  gap: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const FeaturesColumn = styled.div`
  flex: 1;
`;

const FeaturesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const FeatureItem = styled.li`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  font-size: ${props => props.theme.fontsm};
  
  &::before {
    content: '';
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: ${props => props.color || '#9b51e0'};
    margin-right: 10px;
    flex-shrink: 0;
  }
`;

const ActionButton = styled(Link)`
  display: inline-block;
  padding: 0.8rem 2rem;
  background: ${props => props.bg || 'linear-gradient(90deg, #3081ed, #9b51e0)'};
  background-size: 200% auto;
  color: white;
  text-decoration: none;
  border-radius: 30px;
  font-weight: 600;
  margin-top: 2rem;
  transition: all 0.3s ease;
  animation: ${shimmer} 3s infinite linear;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 7px 15px rgba(155, 81, 224, 0.4);
  }
`;

// Galaxy data
const galaxies = [
  {
    id: 'etherland',
    name: 'ETHERLand',
    path: '/etherland',
    icon: 'ETH',
    description: 'Generate new Space Babiez and explore the cosmic origin',
    color: '#9b51e0',
    bg: 'linear-gradient(45deg, #9b51e0, #3081ed)',
    features: [
      'Generate unique Space Baby NFTs',
      'Connect your wallet and verify ownership',
      'Discover rare attributes and powers',
      'Mint your very own Space Baby',
      'Explore the origins of the Space Babiez universe'
    ],
    longDescription: 'ETHERLand is the cosmic origin of all Space Babiez. Here you can generate your unique Space Baby NFT, connect your wallet, and become a Guardian in the Space Babiez Universe.'
  },
  {
    id: 'metroverse',
    name: 'METROVerse',
    path: '/metroverse',
    icon: 'MET',
    description: 'Level up your Babiez and compete in cosmic challenges',
    color: '#11998e',
    bg: 'linear-gradient(45deg, #11998e, #38ef7d)',
    features: [
      'Level up your Space Babiez',
      'Enhance attributes and powers',
      'Collect cosmic resources',
      'Compete in cosmic challenges',
      'Earn rewards and rare upgrades'
    ],
    longDescription: 'METROVerse is where Space Babiez grow and evolve. Level up your collectibles, enhance their attributes, and compete in cosmic challenges to earn valuable rewards.'
  },
  {
    id: 'astroverse',
    name: 'ASTROVerse',
    path: '/astroverse',
    icon: 'AST',
    description: 'Join the Guardian community and earn rewards',
    color: '#f5af19',
    bg: 'linear-gradient(45deg, #f12711, #f5af19)',
    features: [
      'Engage with the Guardian community',
      'Participate in governance decisions',
      'Vote on charity initiatives',
      'Access exclusive Guardian events',
      'Trade and showcase your collection'
    ],
    longDescription: 'ASTROVerse is the social hub of the Space Babiez Universe. Connect with other Guardians, participate in community governance, and showcase your collection.'
  }
];

const UniverseNavigation = ({ showDetails = true }) => {
  const location = useLocation();
  const [activeGalaxy, setActiveGalaxy] = useState(null);
  
  useEffect(() => {
    // Determine active galaxy based on current path
    const currentPath = location.pathname;
    const current = galaxies.find(galaxy => 
      currentPath.includes(galaxy.id) || 
      (galaxy.id === 'etherland' && currentPath === '/')
    );
    
    if (current) {
      setActiveGalaxy(current.id);
    }
  }, [location]);
  
  return (
    <NavigationContainer>
      <GalaxyMap>
        {galaxies.map((galaxy) => (
          <GalaxyNode
            key={galaxy.id}
            to={galaxy.path}
            active={activeGalaxy === galaxy.id}
            color={galaxy.color}
          >
            <GalaxyIcon 
              className="galaxy-icon" 
              bg={galaxy.bg} 
              active={activeGalaxy === galaxy.id}
              bgColor={galaxy.color}
            >
              <GalaxyIconInner />
              {galaxy.icon}
            </GalaxyIcon>
            <GalaxyName className="galaxy-name">{galaxy.name}</GalaxyName>
            <GalaxyDescription>{galaxy.description}</GalaxyDescription>
          </GalaxyNode>
        ))}
      </GalaxyMap>
      
      {showDetails && activeGalaxy && (
        <DetailedView visible={!!activeGalaxy}>
          {galaxies.map(galaxy => (
            galaxy.id === activeGalaxy && (
              <div key={galaxy.id}>
                <DetailHeader>
                  <DetailIcon bg={galaxy.bg}>{galaxy.icon}</DetailIcon>
                  <DetailTitle color={galaxy.color}>
                    <h2>{galaxy.name}</h2>
                    <p>{galaxy.longDescription}</p>
                  </DetailTitle>
                </DetailHeader>
                
                <DetailContent>
                  <FeaturesColumn>
                    <h3>Key Features:</h3>
                    <FeaturesList>
                      {galaxy.features.map((feature, index) => (
                        <FeatureItem key={index} color={galaxy.color}>
                          {feature}
                        </FeatureItem>
                      ))}
                    </FeaturesList>
                    
                    <ActionButton to={galaxy.path} bg={galaxy.bg}>
                      Enter {galaxy.name}
                    </ActionButton>
                  </FeaturesColumn>
                </DetailContent>
              </div>
            )
          ))}
        </DetailedView>
      )}
    </NavigationContainer>
  );
};

export default UniverseNavigation;
