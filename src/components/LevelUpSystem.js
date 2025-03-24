import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import supabase from '../utils/supabaseConfig';
import TABLES from '../utils/supabaseSchema';

// Animations
const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.1); opacity: 1; }
  100% { transform: scale(1); opacity: 0.8; }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
  100% { transform: translateY(0px); }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const glow = keyframes`
  0% { box-shadow: 0 0 10px rgba(155, 81, 224, 0.5); }
  50% { box-shadow: 0 0 20px rgba(155, 81, 224, 0.8), 0 0 30px rgba(48, 129, 237, 0.5); }
  100% { box-shadow: 0 0 10px rgba(155, 81, 224, 0.5); }
`;

// Styled Components
const LevelUpContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  color: ${props => props.theme.text};
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  
  h1 {
    font-size: ${props => props.theme.fontxxl};
    margin-bottom: 1rem;
    
    @media (max-width: 768px) {
      font-size: ${props => props.theme.fontxl};
    }
  }
  
  p {
    font-size: ${props => props.theme.fontmd};
    color: ${props => `rgba(${props.theme.textRgba}, 0.8)`};
    max-width: 800px;
    margin: 0 auto;
    
    @media (max-width: 768px) {
      font-size: ${props => props.theme.fontsm};
    }
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  
  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
`;

const BabySelection = styled.div`
  background: rgba(36, 37, 38, 0.8);
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  
  h2 {
    color: #3081ed;
    margin-bottom: 1.5rem;
    text-align: center;
  }
`;

const BabyList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1.5rem;
  max-height: 500px;
  overflow-y: auto;
  padding-right: 10px;
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, #3081ed, #9b51e0);
    border-radius: 10px;
  }
`;

const BabyCard = styled.div`
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  
  ${props => props.selected && `
    animation: ${glow} 2s infinite;
    transform: scale(1.05);
  `}
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const BabyImage = styled.div`
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

const BabyInfo = styled.div`
  padding: 0.75rem;
  background: rgba(0, 0, 0, 0.5);
`;

const BabyName = styled.h4`
  font-size: ${props => props.theme.fontsm};
  margin-bottom: 0.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const BabyLevel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: ${props => props.theme.fontxs};
  
  span {
    color: ${props => {
      switch(props.rarity) {
        case 'Common': return '#bdbdbd';
        case 'Uncommon': return '#00c853';
        case 'Rare': return '#2196f3';
        case 'Epic': return '#9c27b0';
        case 'Legendary': return '#ffc107';
        default: return '#bdbdbd';
      }
    }};
  }
`;

const LevelUpInterface = styled.div`
  background: rgba(36, 37, 38, 0.8);
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  align-items: center;
  
  h2 {
    color: #3081ed;
    margin-bottom: 2rem;
    text-align: center;
  }
`;

const NoSelectionMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: ${props => `rgba(${props.theme.textRgba}, 0.6)`};
  
  svg {
    margin-bottom: 1rem;
    font-size: 3rem;
  }
`;

const SelectedBabyPreview = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
`;

const PreviewImage = styled.div`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 1.5rem;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle, rgba(155, 81, 224, 0.3) 0%, transparent 70%);
    z-index: 1;
  }
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    animation: ${float} 6s ease-in-out infinite;
  }
`;

const EvolutionTrack = styled.div`
  display: flex;
  align-items: center;
  margin: 2rem 0;
  position: relative;
  width: 100%;
  
  &::before {
    content: '';
    position: absolute;
    height: 4px;
    background: linear-gradient(90deg, #3081ed, #9b51e0);
    left: 0;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    z-index: 0;
  }
`;

const LevelNode = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: ${props => props.active 
    ? 'linear-gradient(45deg, #3081ed, #9b51e0)' 
    : 'rgba(255, 255, 255, 0.2)'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  margin: 0 auto;
  position: relative;
  z-index: 1;
  box-shadow: ${props => props.active 
    ? '0 0 10px rgba(155, 81, 224, 0.8)' 
    : 'none'};
  
  ${props => props.current && `
    animation: ${pulse} 2s infinite;
    border: 2px solid white;
  `}
`;

const AttributesContainer = styled.div`
  width: 100%;
  margin: 2rem 0;
`;

const AttributeRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  
  label {
    width: 120px;
    color: ${props => `rgba(${props.theme.textRgba}, 0.9)`};
  }
`;

const AttributeBar = styled.div`
  flex-grow: 1;
  height: 16px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: ${props => props.value}%;
    background: linear-gradient(90deg, #3081ed, #9b51e0);
    background-size: 200% 100%;
    animation: ${shimmer} 2s infinite linear;
    border-radius: 8px;
  }
  
  &::after {
    content: '${props => props.value}';
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: white;
    font-size: 12px;
    font-weight: bold;
  }
`;

const AttributeGain = styled.div`
  margin-left: 10px;
  color: #4caf50;
  font-size: 14px;
  font-weight: bold;
`;

const LevelUpButton = styled.button`
  padding: 1rem 2.5rem;
  background: linear-gradient(90deg, #3081ed, #9b51e0);
  background-size: 200% auto;
  color: white;
  border: none;
  border-radius: 50px;
  font-size: ${props => props.theme.fontmd};
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 2rem;
  animation: ${shimmer} 3s infinite linear;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(48, 129, 237, 0.3);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const RequirementsContainer = styled.div`
  margin-top: 2rem;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  width: 100%;
`;

const RequirementRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: ${props => props.theme.fontsm};
  
  .requirement-label {
    color: ${props => `rgba(${props.theme.textRgba}, 0.8)`};
  }
  
  .requirement-value {
    color: ${props => props.fulfilled ? '#4caf50' : '#f44336'};
    font-weight: bold;
  }
`;

const EvolutionEffect = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle, rgba(155, 81, 224, 0.8) 0%, rgba(0, 0, 0, 0.9) 100%);
  display: ${props => props.active ? 'flex' : 'none'};
  justify-content: center;
  align-items: center;
  z-index: 1000;
  
  img {
    max-width: 50%;
    max-height: 70%;
    object-fit: contain;
    animation: ${pulse} 1s infinite alternate;
  }
`;

const ResourcesDisplay = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
  width: 100%;
`;

const Resource = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  
  .resource-icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${props => props.color || 'linear-gradient(45deg, #3081ed, #9b51e0)'};
    margin-bottom: 0.5rem;
    font-size: 1.2rem;
  }
  
  .resource-value {
    font-weight: bold;
    color: ${props => props.color || '#9b51e0'};
  }
  
  .resource-name {
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.7);
  }
`;

// Sample data
const mockBabies = [
  {
    id: '1',
    name: 'Space Baby #3217',
    image: 'https://i.postimg.cc/HswdNhLx/image-10.png',
    rarity: 'Epic',
    level: 3,
    maxLevel: 5,
    attributes: {
      cosmicPower: 78,
      intelligence: 92,
      adaptability: 65,
      charisma: 45
    },
    levelUpRequirements: {
      stardust: 250,
      cosmicEssence: 5
    }
  },
  {
    id: '2',
    name: 'Space Baby #4582',
    image: 'https://i.postimg.cc/pTmP1V9b/image-11.png',
    rarity: 'Rare',
    level: 2,
    maxLevel: 4,
    attributes: {
      cosmicPower: 62,
      intelligence: 75,
      adaptability: 88,
      charisma: 51
    },
    levelUpRequirements: {
      stardust: 150,
      cosmicEssence: 3
    }
  },
  {
    id: '3',
    name: 'Space Baby #1045',
    image: 'https://i.postimg.cc/cLTZxtwG/image-12.png',
    rarity: 'Legendary',
    level: 4,
    maxLevel: 7,
    attributes: {
      cosmicPower: 95,
      intelligence: 87,
      adaptability: 91,
      charisma: 83
    },
    levelUpRequirements: {
      stardust: 500,
      cosmicEssence: 10
    }
  },
  {
    id: '4',
    name: 'Space Baby #8733',
    image: 'https://i.postimg.cc/15hyJQs2/image-13.png',
    rarity: 'Common',
    level: 1,
    maxLevel: 3,
    attributes: {
      cosmicPower: 45,
      intelligence: 50,
      adaptability: 40,
      charisma: 60
    },
    levelUpRequirements: {
      stardust: 100,
      cosmicEssence: 2
    }
  },
  {
    id: '5',
    name: 'Space Baby #2198',
    image: 'https://i.postimg.cc/tRVX3TQF/image-14.png',
    rarity: 'Uncommon',
    level: 2,
    maxLevel: 4,
    attributes: {
      cosmicPower: 55,
      intelligence: 68,
      adaptability: 72,
      charisma: 61
    },
    levelUpRequirements: {
      stardust: 150,
      cosmicEssence: 3
    }
  }
];

// Mock user resources
const mockUserResources = {
  stardust: 350,
  cosmicEssence: 8
};

const LevelUpSystem = () => {
  const [babyCollection, setBabyCollection] = useState(mockBabies);
  const [selectedBaby, setSelectedBaby] = useState(null);
  const [userResources, setUserResources] = useState(mockUserResources);
  const [attributeGains, setAttributeGains] = useState({});
  const [isEvolutionActive, setIsEvolutionActive] = useState(false);
  const [levelingUp, setLevelingUp] = useState(false);
  
  useEffect(() => {
    if (selectedBaby) {
      // Calculate random attribute gains for next level
      const gains = {};
      Object.keys(selectedBaby.attributes).forEach(attr => {
        gains[attr] = Math.floor(Math.random() * 10) + 3; // 3-12 points gain
      });
      setAttributeGains(gains);
    }
  }, [selectedBaby]);
  
  const selectBaby = (baby) => {
    setSelectedBaby(baby);
  };
  
  const canLevelUp = () => {
    if (!selectedBaby) return false;
    if (selectedBaby.level >= selectedBaby.maxLevel) return false;
    
    const requirements = selectedBaby.levelUpRequirements;
    return userResources.stardust >= requirements.stardust && 
           userResources.cosmicEssence >= requirements.cosmicEssence;
  };
  
  const levelUp = () => {
    if (!canLevelUp() || levelingUp) return;
    
    setLevelingUp(true);
    setIsEvolutionActive(true);
    
    // Simulate level up process
    setTimeout(() => {
      const updatedBabies = babyCollection.map(baby => {
        if (baby.id === selectedBaby.id) {
          // Apply attribute gains
          const updatedAttributes = {};
          Object.keys(baby.attributes).forEach(attr => {
            updatedAttributes[attr] = baby.attributes[attr] + attributeGains[attr];
          });
          
          // Update baby with new level and attributes
          return {
            ...baby,
            level: baby.level + 1,
            attributes: updatedAttributes
          };
        }
        return baby;
      });
      
      // Update user resources
      const requirements = selectedBaby.levelUpRequirements;
      const updatedResources = {
        stardust: userResources.stardust - requirements.stardust,
        cosmicEssence: userResources.cosmicEssence - requirements.cosmicEssence
      };
      
      setBabyCollection(updatedBabies);
      setUserResources(updatedResources);
      
      // Find and set the updated baby as selected
      const updatedBaby = updatedBabies.find(baby => baby.id === selectedBaby.id);
      setSelectedBaby(updatedBaby);
      
      // Calculate new attribute gains for next level
      const newGains = {};
      Object.keys(updatedBaby.attributes).forEach(attr => {
        newGains[attr] = Math.floor(Math.random() * 10) + 3;
      });
      setAttributeGains(newGains);
      
      setTimeout(() => {
        setIsEvolutionActive(false);
        setLevelingUp(false);
      }, 3000);
    }, 2000);
  };
  
  return (
    <LevelUpContainer>
      <EvolutionEffect active={isEvolutionActive}>
        {selectedBaby && <img src={selectedBaby.image} alt={selectedBaby.name} />}
      </EvolutionEffect>
      
      <Header>
        <h1>Level Up Your Space Babiez</h1>
        <p>
          Enhance your Space Babiez abilities by leveling them up with cosmic resources. 
          Each level increases their attributes and unlocks new powers in the Space Babiez Universe.
        </p>
      </Header>
      
      <ResourcesDisplay>
        <Resource color="#ffc107">
          <div className="resource-icon">✨</div>
          <div className="resource-value">{userResources.stardust}</div>
          <div className="resource-name">Stardust</div>
        </Resource>
        
        <Resource color="#9c27b0">
          <div className="resource-icon">⚡</div>
          <div className="resource-value">{userResources.cosmicEssence}</div>
          <div className="resource-name">Cosmic Essence</div>
        </Resource>
      </ResourcesDisplay>
      
      <Grid>
        <BabySelection>
          <h2>Select a Baby</h2>
          <BabyList>
            {babyCollection.map(baby => (
              <BabyCard 
                key={baby.id} 
                onClick={() => selectBaby(baby)}
                selected={selectedBaby?.id === baby.id}
              >
                <BabyImage>
                  <img src={baby.image} alt={baby.name} />
                </BabyImage>
                <BabyInfo>
                  <BabyName>{baby.name}</BabyName>
                  <BabyLevel rarity={baby.rarity}>
                    <span>{baby.rarity}</span>
                    <div>Lvl {baby.level}/{baby.maxLevel}</div>
                  </BabyLevel>
                </BabyInfo>
              </BabyCard>
            ))}
          </BabyList>
        </BabySelection>
        
        <LevelUpInterface>
          <h2>Power Up Station</h2>
          
          {!selectedBaby ? (
            <NoSelectionMessage>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 12H16M12 8V16M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <p>Select a Space Baby to begin the level up process</p>
            </NoSelectionMessage>
          ) : (
            <>
              <SelectedBabyPreview>
                <PreviewImage>
                  <img src={selectedBaby.image} alt={selectedBaby.name} />
                </PreviewImage>
                <h3>{selectedBaby.name}</h3>
                <p>Level {selectedBaby.level} {selectedBaby.rarity}</p>
              </SelectedBabyPreview>
              
              <EvolutionTrack>
                {Array.from({ length: selectedBaby.maxLevel }, (_, i) => (
                  <LevelNode 
                    key={i} 
                    active={i + 1 <= selectedBaby.level}
                    current={i + 1 === selectedBaby.level}
                  >
                    {i + 1}
                  </LevelNode>
                ))}
              </EvolutionTrack>
              
              <AttributesContainer>
                {Object.entries(selectedBaby.attributes).map(([attribute, value]) => (
                  <AttributeRow key={attribute}>
                    <label>{attribute}:</label>
                    <AttributeBar value={value} />
                    {selectedBaby.level < selectedBaby.maxLevel && (
                      <AttributeGain>+{attributeGains[attribute] || 0}</AttributeGain>
                    )}
                  </AttributeRow>
                ))}
              </AttributesContainer>
              
              {selectedBaby.level < selectedBaby.maxLevel ? (
                <>
                  <RequirementsContainer>
                    <h4>Level Up Requirements</h4>
                    <RequirementRow 
                      fulfilled={userResources.stardust >= selectedBaby.levelUpRequirements.stardust}
                    >
                      <span className="requirement-label">Stardust:</span>
                      <span className="requirement-value">
                        {userResources.stardust} / {selectedBaby.levelUpRequirements.stardust}
                      </span>
                    </RequirementRow>
                    <RequirementRow 
                      fulfilled={userResources.cosmicEssence >= selectedBaby.levelUpRequirements.cosmicEssence}
                    >
                      <span className="requirement-label">Cosmic Essence:</span>
                      <span className="requirement-value">
                        {userResources.cosmicEssence} / {selectedBaby.levelUpRequirements.cosmicEssence}
                      </span>
                    </RequirementRow>
                  </RequirementsContainer>
                  
                  <LevelUpButton 
                    onClick={levelUp} 
                    disabled={!canLevelUp() || levelingUp}
                  >
                    {levelingUp ? 'Powering Up...' : 'Level Up Baby'}
                  </LevelUpButton>
                </>
              ) : (
                <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                  <h3 style={{ color: '#ffc107' }}>Maximum Level Reached!</h3>
                  <p>This Space Baby has reached its maximum potential</p>
                </div>
              )}
            </>
          )}
        </LevelUpInterface>
      </Grid>
    </LevelUpContainer>
  );
};

export default LevelUpSystem;
