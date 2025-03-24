import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router-dom';
import supabase from '../utils/supabaseConfig';
import TABLES from '../utils/supabaseSchema';

// Animations
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

// Styled Components
const DashboardContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  color: ${props => props.theme.text};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const WelcomeMessage = styled.div`
  h2 {
    font-size: ${props => props.theme.fontxl};
    margin-bottom: 0.5rem;
  }
  
  p {
    font-size: ${props => props.theme.fontmd};
    color: ${props => `rgba(${props.theme.textRgba}, 0.8)`};
  }
`;

const StatsCard = styled.div`
  background: rgba(36, 37, 38, 0.8);
  border-radius: 15px;
  padding: 1.5rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const StatRow = styled.div`
  display: flex;
  justify-content: space-between;
  
  span:first-child {
    color: ${props => `rgba(${props.theme.textRgba}, 0.7)`};
  }
  
  span:last-child {
    font-weight: bold;
    color: #9b51e0;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: rgba(36, 37, 38, 0.8);
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-10px);
  }
`;

const CardImage = styled.div`
  width: 100%;
  aspect-ratio: 1;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }
  
  &:hover img {
    transform: scale(1.1);
  }
`;

const CardContent = styled.div`
  padding: 1.5rem;
`;

const CardTitle = styled.h3`
  font-size: ${props => props.theme.fontlg};
  margin-bottom: 0.5rem;
  color: #3081ed;
`;

const CardMeta = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 1rem 0;
  font-size: ${props => props.theme.fontsm};
  color: ${props => `rgba(${props.theme.textRgba}, 0.8)`};
`;

const AttributeTag = styled.span`
  display: inline-block;
  background: rgba(155, 81, 224, 0.2);
  color: #9b51e0;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: ${props => props.theme.fontxs};
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
`;

const ActionButton = styled.button`
  background: linear-gradient(90deg, #3081ed, #9b51e0);
  background-size: 200% auto;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 30px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 1rem;
  transition: 0.3s;
  animation: ${shimmer} 3s infinite linear;
  
  &:hover {
    background-position: right center;
    transform: translateY(-2px);
  }
`;

const NavSection = styled.div`
  margin-top: 3rem;
`;

const NavGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const NavCard = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(36, 37, 38, 0.8);
  border-radius: 15px;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  animation: ${float} 6s ease-in-out infinite;
  
  &:nth-child(2) {
    animation-delay: 1s;
  }
  
  &:nth-child(3) {
    animation-delay: 2s;
  }
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 30px rgba(155, 81, 224, 0.3);
  }
  
  h3 {
    color: #3081ed;
    margin: 1.5rem 0 0.5rem;
  }
  
  p {
    color: ${props => `rgba(${props.theme.textRgba}, 0.8)`};
  }
`;

const GalaxyIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.bg || 'linear-gradient(45deg, #3081ed, #9b51e0)'};
  font-size: 2rem;
  color: white;
  animation: ${pulse} 3s infinite;
`;

// Placeholder data for demonstration
const mockBabies = [
  {
    id: '1',
    name: 'Space Baby #3217',
    image: 'https://i.postimg.cc/HswdNhLx/image-10.png',
    rarity: 'Epic',
    level: 3,
    element: 'Fire',
    attributes: {
      cosmicPower: 78,
      intelligence: 92,
      adaptability: 65
    }
  },
  {
    id: '2',
    name: 'Space Baby #4582',
    image: 'https://i.postimg.cc/pTmP1V9b/image-11.png',
    rarity: 'Rare',
    level: 2,
    element: 'Water',
    attributes: {
      cosmicPower: 62,
      intelligence: 75,
      adaptability: 88
    }
  },
  {
    id: '3',
    name: 'Space Baby #1045',
    image: 'https://i.postimg.cc/cLTZxtwG/image-12.png',
    rarity: 'Legendary',
    level: 5,
    element: 'Void',
    attributes: {
      cosmicPower: 95,
      intelligence: 87,
      adaptability: 91
    }
  }
];

const GuardianDashboard = () => {
  const [babyCollection, setBabyCollection] = useState([]);
  const [guardianData, setGuardianData] = useState({
    name: 'Guardian',
    totalBabies: 0,
    rareCount: 0,
    communityPoints: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Check for wallet address in session
    const walletAddress = sessionStorage.getItem('walletAddress');
    
    const loadGuardianData = async () => {
      setIsLoading(true);
      
      try {
        // In a real implementation, fetch data from Supabase
        // For now, we'll use mock data
        setTimeout(() => {
          setBabyCollection(mockBabies);
          setGuardianData({
            name: 'Guardian',
            totalBabies: mockBabies.length,
            rareCount: mockBabies.filter(baby => 
              baby.rarity === 'Rare' || baby.rarity === 'Epic' || baby.rarity === 'Legendary'
            ).length,
            communityPoints: 245
          });
          setIsLoading(false);
        }, 1500);
        
      } catch (error) {
        console.error("Error loading guardian data:", error);
        setIsLoading(false);
      }
    };
    
    loadGuardianData();
  }, []);
  
  const getRarityColor = (rarity) => {
    switch(rarity) {
      case 'Common': return '#bdbdbd';
      case 'Uncommon': return '#00c853';
      case 'Rare': return '#2196f3';
      case 'Epic': return '#9c27b0';
      case 'Legendary': return '#ffc107';
      default: return '#bdbdbd';
    }
  };
  
  return (
    <DashboardContainer>
      <Header>
        <WelcomeMessage>
          <h2>Welcome, {guardianData.name}!</h2>
          <p>Explore your Space Babiez collection and abilities as a Guardian</p>
        </WelcomeMessage>
        
        <StatsCard>
          <StatRow>
            <span>Total Space Babiez:</span>
            <span>{guardianData.totalBabies}</span>
          </StatRow>
          <StatRow>
            <span>Rare or Higher:</span>
            <span>{guardianData.rareCount}</span>
          </StatRow>
          <StatRow>
            <span>Community Points:</span>
            <span>{guardianData.communityPoints}</span>
          </StatRow>
        </StatsCard>
      </Header>
      
      <h2>Your Space Babiez Collection</h2>
      
      {isLoading ? (
        <p>Loading your cosmic collection...</p>
      ) : (
        <Grid>
          {babyCollection.map(baby => (
            <Card key={baby.id}>
              <CardImage>
                <img src={baby.image} alt={baby.name} />
              </CardImage>
              <CardContent>
                <CardTitle>{baby.name}</CardTitle>
                <CardMeta>
                  <span style={{ color: getRarityColor(baby.rarity) }}>{baby.rarity}</span>
                  <span>Level {baby.level}</span>
                </CardMeta>
                <div>
                  <AttributeTag>{baby.element}</AttributeTag>
                  {Object.entries(baby.attributes).map(([key, value], index) => (
                    <AttributeTag key={index}>{key}: {value}</AttributeTag>
                  ))}
                </div>
                <ActionButton>Level Up</ActionButton>
              </CardContent>
            </Card>
          ))}
        </Grid>
      )}
      
      <NavSection>
        <h2>Explore the Univerze</h2>
        <NavGrid>
          <NavCard to="/etherland">
            <GalaxyIcon bg="linear-gradient(45deg, #9b51e0, #3081ed)">ETH</GalaxyIcon>
            <h3>ETHERLand</h3>
            <p>Generate new Space Babiez and explore the cosmic origin</p>
          </NavCard>
          
          <NavCard to="/metroverse">
            <GalaxyIcon bg="linear-gradient(45deg, #11998e, #38ef7d)">MET</GalaxyIcon>
            <h3>METROVerse</h3>
            <p>Level up your Babiez and compete in cosmic challenges</p>
          </NavCard>
          
          <NavCard to="/astroverse">
            <GalaxyIcon bg="linear-gradient(45deg, #f12711, #f5af19)">AST</GalaxyIcon>
            <h3>ASTROVerse</h3>
            <p>Join the Guardian community and earn rewards</p>
          </NavCard>
        </NavGrid>
      </NavSection>
    </DashboardContainer>
  );
};

export default GuardianDashboard;
