import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router-dom';
import { useUserAuth } from '../context/UserAuthContext';
import DashboardService from '../services/DashboardService';
import BlockchainService from '../services/BlockchainService';
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
  position: relative;
  
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

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  margin: 2rem 0 1rem;
  color: #aeff00;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  
  p {
    margin-top: 1rem;
    color: #aeff00;
  }
`;

const Spinner = styled.div`
  width: 50px;
  height: 50px;
  border: 4px solid rgba(174, 255, 0, 0.3);
  border-top: 4px solid #aeff00;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const RarityBadge = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.7);
  color: ${props => props.color};
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: bold;
`;

const ProgressContainer = styled.div`
  margin: 0.8rem 0;
`;

const ProgressLabel = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  margin-bottom: 0.3rem;
`;

const ProgressBar = styled.div`
  height: 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  width: ${props => props.width};
  background: linear-gradient(90deg, #3081ed, #9b51e0);
  border-radius: 4px;
`;

const AttributeContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const DualSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-top: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Section = styled.div`
  background: rgba(36, 37, 38, 0.8);
  border-radius: 15px;
  padding: 1.5rem;
  margin-top: 1rem;
`;

const ActivityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ActivityItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
`;

const ActivityIcon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: ${props => {
    switch (props.type) {
      case 'level_up': return 'linear-gradient(135deg, #ff9d00, #ff0000)';
      case 'mint': return 'linear-gradient(135deg, #00c853, #b2ff59)';
      case 'vote': return 'linear-gradient(135deg, #2196f3, #0d47a1)';
      default: return 'linear-gradient(135deg, #9b51e0, #3081ed)';
    }
  }};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  
  &:before {
    content: "${props => {
      switch (props.type) {
        case 'level_up': return '⬆️';
        case 'mint': return '🆕';
        case 'vote': return '🗳️';
        default: return '🔔';
      }
    }}";
    font-size: 1.2rem;
  }
`;

const ActivityContent = styled.div`
  flex-grow: 1;
  
  p {
    margin: 0;
    color: #fff;
  }
`;

const ActivityDate = styled.div`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 0.5rem;
`;

const BenefitsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const BenefitItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: ${props => props.claimed ? 'rgba(0, 0, 0, 0.2)' : 'rgba(174, 255, 0, 0.1)'};
  border-radius: 8px;
  border: 1px solid ${props => props.claimed ? 'transparent' : 'rgba(174, 255, 0, 0.3)'};
  opacity: ${props => props.claimed ? 0.7 : 1};
`;

const BenefitContent = styled.div`
  flex-grow: 1;
  
  p {
    margin: 0.5rem 0;
    color: #fff;
  }
`;

const BenefitTitle = styled.h4`
  margin: 0;
  color: #aeff00;
`;

const BenefitDate = styled.div`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
`;

const ClaimButton = styled.button`
  background: linear-gradient(90deg, #aeff00, #5cff85);
  color: #000;
  border: none;
  border-radius: 20px;
  padding: 0.5rem 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 10px rgba(174, 255, 0, 0.3);
  }
`;

const ProposalsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ProposalItem = styled.div`
  padding: 1.5rem;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
`;

const ProposalTitle = styled.h3`
  margin: 0;
  color: #3081ed;
`;

const ProposalDescription = styled.p`
  color: #fff;
  margin: 0.8rem 0;
`;

const ProposalFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
`;

const ProposalStatus = styled.span`
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  background: ${props => {
    switch (props.status) {
      case 'active': return 'rgba(76, 175, 80, 0.2)';
      case 'passed': return 'rgba(33, 150, 243, 0.2)';
      case 'failed': return 'rgba(244, 67, 54, 0.2)';
      default: return 'rgba(76, 175, 80, 0.2)';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'active': return '#4CAF50';
      case 'passed': return '#2196F3';
      case 'failed': return '#F44336';
      default: return '#4CAF50';
    }
  }};
`;

const ViewButton = styled(Link)`
  background: transparent;
  border: 1px solid #3081ed;
  color: #3081ed;
  border-radius: 20px;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  text-decoration: none;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(48, 129, 237, 0.1);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: rgba(255, 255, 255, 0.5);
`;

const GuardianDashboard = () => {
  const { user, walletAddress } = useUserAuth();
  const [babyCollection, setBabyCollection] = useState([]);
  const [guardianData, setGuardianData] = useState({
    name: 'Guardian',
    totalBabies: 0,
    rareCount: 0,
    communityPoints: 0,
    citizenshipLevel: 1,
    stakingRewards: 0
  });
  const [activities, setActivities] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [benefits, setBenefits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState('Loading your cosmic collection...');
  
  useEffect(() => {
    const loadGuardianData = async () => {
      if (!walletAddress) return;
      
      setIsLoading(true);
      setLoadingMessage('Connecting to the Astroverse...');
      
      try {
        // Fetch NFTs from blockchain
        setLoadingMessage('Scanning the blockchain for your Space Babiez...');
        const onChainNFTs = await BlockchainService.getOwnedNFTs(walletAddress);
        
        // Fetch NFT details from Supabase
        setLoadingMessage('Retrieving your guardian data...');
        const offChainNFTs = await DashboardService.fetchUserNFTs(walletAddress);
        
        // Merge data from blockchain and database
        const mergedCollection = await mergeNFTData(onChainNFTs, offChainNFTs);
        setBabyCollection(mergedCollection);
        
        // Calculate guardian stats
        const rareNFTs = mergedCollection.filter(nft => 
          nft.rarity === 'Rare' || nft.rarity === 'Epic' || nft.rarity === 'Legendary'
        );
        
        // If user exists in our context, use that data
        if (user) {
          setGuardianData({
            name: user.username || 'Guardian',
            totalBabies: mergedCollection.length,
            rareCount: rareNFTs.length,
            communityPoints: user.community_points || 0,
            citizenshipLevel: user.citizenship_level || 1,
            stakingRewards: user.staking_rewards || 0
          });
        }
        
        // Fetch user activities
        setLoadingMessage('Retrieving your recent activities...');
        if (user) {
          const userActivities = await DashboardService.fetchUserActivity(user.id);
          setActivities(userActivities);
          
          // Fetch active proposals
          const activeProposals = await DashboardService.fetchActiveProposals();
          setProposals(activeProposals);
          
          // Fetch guardian benefits
          const guardianBenefits = await DashboardService.fetchGuardianBenefits(user.id);
          setBenefits(guardianBenefits);
        }
        
        // Log this dashboard visit as activity
        if (user) {
          await DashboardService.logActivity(
            user.id, 
            'dashboard_visit', 
            'Visited the guardian dashboard'
          );
        }
        
      } catch (error) {
        console.error("Error loading guardian data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadGuardianData();
  }, [walletAddress, user]);
  
  // Merge NFT data from blockchain and database
  const mergeNFTData = async (onChainNFTs, offChainNFTs) => {
    // Create a map of off-chain NFTs by token ID for easy lookup
    const offChainMap = offChainNFTs.reduce((map, nft) => {
      map[nft.token_id] = nft;
      return map;
    }, {});
    
    // Merge the data
    return Promise.all(onChainNFTs.map(async (nft) => {
      const offChainData = offChainMap[nft.id] || {};
      const levelData = await DashboardService.fetchNFTLevel(offChainData.id || nft.id);
      
      return {
        id: nft.id,
        name: nft.metadata?.name || offChainData.name || `Space Baby #${nft.id}`,
        image: nft.metadata?.image || offChainData.image_url,
        rarity: nft.metadata?.attributes?.find(a => a.trait_type === 'Rarity')?.value || 
                offChainData.rarity || 'Common',
        level: levelData.current_level || 1,
        element: nft.metadata?.attributes?.find(a => a.trait_type === 'Element')?.value ||
                 offChainData.element || 'Unknown',
        attributes: nft.metadata?.attributes || offChainData.attributes || [],
        experience: levelData.experience_points || 0,
        maxLevel: getRarityMaxLevel(
          nft.metadata?.attributes?.find(a => a.trait_type === 'Rarity')?.value || 
          offChainData.rarity
        )
      };
    }));
  };
  
  // Get max level based on rarity
  const getRarityMaxLevel = (rarity) => {
    switch(rarity) {
      case 'Common': return 3;
      case 'Uncommon': return 4;
      case 'Rare': return 5;
      case 'Epic': return 6;
      case 'Legendary': return 7;
      default: return 3;
    }
  };
  
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
  
  const handleLevelUp = async (babyId) => {
    try {
      setIsLoading(true);
      setLoadingMessage(`Leveling up Space Baby #${babyId}...`);
      
      // Call blockchain service to level up
      const result = await BlockchainService.levelUpNFT(babyId);
      
      if (result) {
        // Update local state
        const updatedCollection = babyCollection.map(baby => {
          if (baby.id === babyId) {
            return {
              ...baby,
              level: baby.level + 1
            };
          }
          return baby;
        });
        
        setBabyCollection(updatedCollection);
        
        // Log activity
        if (user) {
          await DashboardService.logActivity(
            user.id,
            'level_up',
            `Leveled up Space Baby #${babyId} to level ${baby.level + 1}`,
            { baby_id: babyId }
          );
        }
        
        alert(`Successfully leveled up Space Baby #${babyId}!`);
      } else {
        alert('Level up failed. Please try again.');
      }
    } catch (err) {
      console.error('Error during level up:', err);
      alert('An error occurred during level up');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <DashboardContainer>
      <Header>
        <WelcomeMessage>
          <h2>Welcome to the Space Babiez Univerze, {guardianData.name}!</h2>
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
            <span>Citizenship Level:</span>
            <span>{guardianData.citizenshipLevel}</span>
          </StatRow>
          <StatRow>
            <span>Community Points:</span>
            <span>{guardianData.communityPoints}</span>
          </StatRow>
          <StatRow>
            <span>Staking Rewards:</span>
            <span>{guardianData.stakingRewards} ASTRO</span>
          </StatRow>
        </StatsCard>
      </Header>
      
      <SectionTitle>Your Space Babiez Collection</SectionTitle>
      
      {isLoading ? (
        <LoadingContainer>
          <Spinner />
          <p>{loadingMessage}</p>
        </LoadingContainer>
      ) : babyCollection.length > 0 ? (
        <Grid>
          {babyCollection.map(baby => (
            <Card key={baby.id}>
              <CardImage>
                <img src={baby.image} alt={baby.name} />
                <RarityBadge color={getRarityColor(baby.rarity)}>{baby.rarity}</RarityBadge>
              </CardImage>
              <CardContent>
                <CardTitle>{baby.name}</CardTitle>
                <CardMeta>
                  <span>Level {baby.level}/{baby.maxLevel}</span>
                  <span>{baby.element}</span>
                </CardMeta>
                <ProgressContainer>
                  <ProgressLabel>
                    <span>EXP</span>
                    <span>{baby.experience}/100</span>
                  </ProgressLabel>
                  <ProgressBar>
                    <ProgressFill width={`${Math.min(100, baby.experience)}%`} />
                  </ProgressBar>
                </ProgressContainer>
                <AttributeContainer>
                  {baby.attributes
                    .filter(attr => attr.trait_type !== 'Rarity' && attr.trait_type !== 'Element')
                    .slice(0, 3)
                    .map((attr, idx) => (
                      <AttributeTag key={idx}>
                        {attr.trait_type}: {attr.value}
                      </AttributeTag>
                    ))}
                </AttributeContainer>
                <ActionButton 
                  onClick={() => handleLevelUp(baby.id)}
                  disabled={baby.level >= baby.maxLevel}
                >
                  {baby.level >= baby.maxLevel ? 'Max Level' : 'Level Up'}
                </ActionButton>
              </CardContent>
            </Card>
          ))}
        </Grid>
      ) : (
        <EmptyState>
          <h3>No Space Babies Found</h3>
          <p>
            You haven't created any Space Babies yet. Visit Etherland to start your cosmic collection!
          </p>
          <NavCard to="/etherland">
            <GalaxyIcon bg="linear-gradient(45deg, #9b51e0, #3081ed)">ETH</GalaxyIcon>
            <h3>Go to Etherland</h3>
          </NavCard>
        </EmptyState>
      )}
      
      <DualSection>
        <Section>
          <SectionTitle>Recent Activity</SectionTitle>
          {activities.length > 0 ? (
            <ActivityList>
              {activities.map(activity => (
                <ActivityItem key={activity.id}>
                  <ActivityIcon type={activity.activity_type} />
                  <ActivityContent>
                    <p>{activity.description}</p>
                    <ActivityDate>
                      {new Date(activity.created_at).toLocaleString()}
                    </ActivityDate>
                  </ActivityContent>
                </ActivityItem>
              ))}
            </ActivityList>
          ) : (
            <EmptyState>No recent activities found.</EmptyState>
          )}
        </Section>
        
        <Section>
          <SectionTitle>Guardian Benefits</SectionTitle>
          {benefits.length > 0 ? (
            <BenefitsList>
              {benefits.map(benefit => (
                <BenefitItem key={benefit.id} claimed={benefit.claimed}>
                  <BenefitContent>
                    <BenefitTitle>{benefit.benefit_type}</BenefitTitle>
                    <p>{benefit.benefit_description}</p>
                    <BenefitDate>
                      {benefit.claimed 
                        ? `Claimed on ${new Date(benefit.claimed_at).toLocaleDateString()}` 
                        : `Expires on ${new Date(benefit.expires_at).toLocaleDateString()}`}
                    </BenefitDate>
                  </BenefitContent>
                  {!benefit.claimed && (
                    <ClaimButton>Claim Now</ClaimButton>
                  )}
                </BenefitItem>
              ))}
            </BenefitsList>
          ) : (
            <EmptyState>No benefits available currently.</EmptyState>
          )}
        </Section>
      </DualSection>
      
      <Section>
        <SectionTitle>Active Community Proposals</SectionTitle>
        {proposals.length > 0 ? (
          <ProposalsList>
            {proposals.map(proposal => (
              <ProposalItem key={proposal.id}>
                <ProposalTitle>{proposal.title}</ProposalTitle>
                <ProposalDescription>{proposal.description}</ProposalDescription>
                <ProposalFooter>
                  <ProposalStatus status={proposal.status}>
                    {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                  </ProposalStatus>
                  <ViewButton to={`/governance/${proposal.id}`}>
                    View & Vote
                  </ViewButton>
                </ProposalFooter>
              </ProposalItem>
            ))}
          </ProposalsList>
        ) : (
          <EmptyState>No active proposals at the moment.</EmptyState>
        )}
      </Section>
      
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
