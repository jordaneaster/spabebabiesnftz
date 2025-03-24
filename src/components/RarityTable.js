import React from 'react';
import styled from 'styled-components';

const TableContainer = styled.div`
  width: 100%;
  max-width: 900px;
  margin: 2rem auto;
  background-color: rgba(36, 37, 38, 0.9);
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 0 20px rgba(155, 81, 224, 0.5);
`;

const TableHeader = styled.div`
  padding: 1.5rem;
  background: linear-gradient(90deg, #9b51e0 0%, #3081ed 100%);
  text-align: center;
`;

const Title = styled.h2`
  font-size: ${props => props.theme.fontxl};
  color: white;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 2px;
  
  @media (max-width: 48em) {
    font-size: ${props => props.theme.fontlg};
  }
`;

const TableContent = styled.div`
  padding: 1.5rem;
`;

const InfoText = styled.p`
  font-size: ${props => props.theme.fontmd};
  color: ${props => `rgba(${props.theme.textRgba}, 0.9)`};
  line-height: 1.6;
  margin-bottom: 1.5rem;
  text-align: center;
  
  @media (max-width: 48em) {
    font-size: ${props => props.theme.fontsm};
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
  
  @media (max-width: 48em) {
    display: block;
    overflow-x: auto;
  }
`;

const Thead = styled.thead`
  background-color: rgba(48, 129, 237, 0.2);
`;

const Tr = styled.tr`
  &:nth-child(even) {
    background-color: rgba(155, 81, 224, 0.1);
  }
  
  &:hover {
    background-color: rgba(155, 81, 224, 0.2);
  }
`;

const Th = styled.th`
  padding: 1rem;
  text-align: left;
  color: #9b51e0;
  font-size: ${props => props.theme.fontmd};
  font-weight: 600;
  
  @media (max-width: 48em) {
    font-size: ${props => props.theme.fontsm};
    padding: 0.75rem;
  }
`;

const Td = styled.td`
  padding: 1rem;
  text-align: left;
  color: ${props => props.theme.text};
  font-size: ${props => props.theme.fontsm};
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  
  @media (max-width: 48em) {
    font-size: ${props => props.theme.fontxs};
    padding: 0.75rem;
  }
`;

const RarityBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: ${props => props.theme.fontxs};
  font-weight: 600;
  background-color: ${props => {
    switch(props.rarity) {
      case 'Common': return 'rgba(150, 150, 150, 0.3)';
      case 'Uncommon': return 'rgba(0, 200, 83, 0.3)';
      case 'Rare': return 'rgba(33, 150, 243, 0.3)';
      case 'Epic': return 'rgba(156, 39, 176, 0.3)';
      case 'Legendary': return 'rgba(255, 193, 7, 0.3)';
      default: return 'rgba(150, 150, 150, 0.3)';
    }
  }};
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
  margin-right: 0.5rem;
`;

// Sample rarity data based on the Space Babiez information
const rarityData = {
  categories: [
    {
      name: "Origin Babiez",
      description: "4000 unique Origin Babiez with 115 different traits",
      traits: [
        { 
          trait: "Background", 
          values: [
            { name: "Cosmic Void", rarity: "Common", percentage: "35%" },
            { name: "Nebula Cloud", rarity: "Uncommon", percentage: "25%" },
            { name: "Star Field", rarity: "Rare", percentage: "20%" },
            { name: "Galaxy Swirl", rarity: "Epic", percentage: "15%" },
            { name: "Blackhole", rarity: "Legendary", percentage: "5%" }
          ]
        },
        {
          trait: "Skin",
          values: [
            { name: "Human", rarity: "Common", percentage: "40%" },
            { name: "Alien", rarity: "Uncommon", percentage: "25%" },
            { name: "Robotic", rarity: "Rare", percentage: "20%" },
            { name: "Ethereal", rarity: "Epic", percentage: "10%" },
            { name: "Astral", rarity: "Legendary", percentage: "5%" }
          ]
        },
        {
          trait: "Outfit",
          values: [
            { name: "Space Suit", rarity: "Common", percentage: "30%" },
            { name: "Stellar Armor", rarity: "Uncommon", percentage: "25%" },
            { name: "Cosmic Robes", rarity: "Rare", percentage: "20%" },
            { name: "Void Walker", rarity: "Epic", percentage: "15%" },
            { name: "Galaxy Guardian", rarity: "Legendary", percentage: "10%" }
          ]
        },
        {
          trait: "Accessories",
          values: [
            { name: "Oxygen Tank", rarity: "Common", percentage: "35%" },
            { name: "Star Compass", rarity: "Uncommon", percentage: "25%" },
            { name: "Cosmic Amulet", rarity: "Rare", percentage: "20%" },
            { name: "Dimension Orb", rarity: "Epic", percentage: "15%" },
            { name: "Infinity Gauntlet", rarity: "Legendary", percentage: "5%" }
          ]
        },
        {
          trait: "Special Powers",
          values: [
            { name: "Telekinesis", rarity: "Common", percentage: "30%" },
            { name: "Energy Manipulation", rarity: "Uncommon", percentage: "25%" },
            { name: "Teleportation", rarity: "Rare", percentage: "20%" },
            { name: "Time Control", rarity: "Epic", percentage: "15%" },
            { name: "Reality Warping", rarity: "Legendary", percentage: "10%" }
          ]
        },
      ]
    },
    {
      name: "Collector Cards",
      description: "1000 Collector Cards released in themed sets of 2-50 collectibles",
      traits: [
        {
          trait: "Set Type",
          values: [
            { name: "Cosmos Explorers", rarity: "Common", percentage: "40%" },
            { name: "Star Warriors", rarity: "Uncommon", percentage: "30%" },
            { name: "Void Masters", rarity: "Rare", percentage: "15%" },
            { name: "Galactic Legends", rarity: "Epic", percentage: "10%" },
            { name: "Universal Deities", rarity: "Legendary", percentage: "5%" }
          ]
        },
        {
          trait: "Card Frame",
          values: [
            { name: "Standard", rarity: "Common", percentage: "50%" },
            { name: "Silver", rarity: "Uncommon", percentage: "25%" },
            { name: "Gold", rarity: "Rare", percentage: "15%" },
            { name: "Platinum", rarity: "Epic", percentage: "7%" },
            { name: "Diamond", rarity: "Legendary", percentage: "3%" }
          ]
        }
      ]
    }
  ]
};

const RarityTable = () => {
  return (
    <TableContainer>
      <TableHeader>
        <Title>Space Babiez Rarity Table</Title>
      </TableHeader>
      <TableContent>
        <InfoText>
          Space Babiez NFTs feature various traits with different rarity levels, making each Baby unique. 
          There are 4000 Origin Babiez and 1000 Collectors Cards with a total of 115 different traits.
        </InfoText>
        
        {rarityData.categories.map((category, catIndex) => (
          <div key={catIndex}>
            <h3 style={{ color: '#3081ed', marginTop: '2rem' }}>{category.name}</h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '1rem' }}>{category.description}</p>
            
            {category.traits.map((traitItem, traitIndex) => (
              <div key={traitIndex} style={{ marginBottom: '2rem' }}>
                <h4 style={{ color: '#9b51e0', marginBottom: '0.5rem' }}>{traitItem.trait}</h4>
                <Table>
                  <Thead>
                    <Tr>
                      <Th>Value</Th>
                      <Th>Rarity</Th>
                      <Th>Percentage</Th>
                    </Tr>
                  </Thead>
                  <tbody>
                    {traitItem.values.map((value, valueIndex) => (
                      <Tr key={valueIndex}>
                        <Td>{value.name}</Td>
                        <Td>
                          <RarityBadge rarity={value.rarity}>{value.rarity}</RarityBadge>
                        </Td>
                        <Td>{value.percentage}</Td>
                      </Tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            ))}
          </div>
        ))}
      </TableContent>
    </TableContainer>
  );
};

export default RarityTable;
