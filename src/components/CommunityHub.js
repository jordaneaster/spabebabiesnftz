import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router-dom';
import supabase from '../utils/supabaseConfig';
import Navigation from './Navigation';
import Footer from './Footer';
import bgr from '../assets/media/BGR3.png';

// Animations
const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
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

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Styled Components
const HubContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  color: ${props => props.theme.text};
`;

const HubHeader = styled.div`
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

const TabsContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-wrap: wrap;
    gap: 0.5rem;
  }
`;

const Tab = styled.button`
  padding: 0.8rem 1.5rem;
  background: ${props => props.active 
    ? 'linear-gradient(90deg, #3081ed, #9b51e0)' 
    : 'rgba(36, 37, 38, 0.8)'};
  color: white;
  border: none;
  font-size: ${props => props.theme.fontsm};
  font-weight: ${props => props.active ? '600' : '400'};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:first-child {
    border-top-left-radius: 30px;
    border-bottom-left-radius: 30px;
  }
  
  &:last-child {
    border-top-right-radius: 30px;
    border-bottom-right-radius: 30px;
  }
  
  &:hover {
    background: ${props => props.active 
      ? 'linear-gradient(90deg, #3081ed, #9b51e0)' 
      : 'rgba(48, 129, 237, 0.3)'};
  }
  
  @media (max-width: 768px) {
    font-size: ${props => props.theme.fontxs};
    padding: 0.6rem 1rem;
    flex-grow: 1;
    border-radius: 30px;
    margin: 0.2rem;
  }
`;

const ContentContainer = styled.div`
  animation: ${fadeIn} 0.5s ease forwards;
`;

// Initiatives section
const InitiativesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const InitiativeCard = styled.div`
  background: rgba(36, 37, 38, 0.8);
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-10px);
  }
`;

const InitiativeImage = styled.div`
  width: 100%;
  height: 180px;
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
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 60px;
    background: linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0));
  }
`;

const InitiativeStatus = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: ${props => {
    switch(props.status) {
      case 'active': return 'rgba(76, 175, 80, 0.8)';
      case 'completed': return 'rgba(33, 150, 243, 0.8)';
      case 'upcoming': return 'rgba(255, 152, 0, 0.8)';
      default: return 'rgba(76, 175, 80, 0.8)';
    }
  }};
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.75rem;
  z-index: 1;
`;

const InitiativeContent = styled.div`
  padding: 1.5rem;
`;

const InitiativeTitle = styled.h3`
  font-size: ${props => props.theme.fontlg};
  margin-bottom: 0.75rem;
  color: #3081ed;
  
  @media (max-width: 768px) {
    font-size: ${props => props.theme.fontmd};
  }
`;

const InitiativeDescription = styled.p`
  font-size: ${props => props.theme.fontsm};
  color: ${props => `rgba(${props.theme.textRgba}, 0.8)`};
  margin-bottom: 1.5rem;
  line-height: 1.6;
`;

const ProgressContainer = styled.div`
  margin: 1rem 0;
`;

const ProgressLabel = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: ${props => props.theme.fontxs};
  
  span:last-child {
    color: #9b51e0;
    font-weight: 600;
  }
`;

const ProgressBar = styled.div`
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  width: ${props => props.progress}%;
  background: linear-gradient(90deg, #3081ed, #9b51e0);
  background-size: 200% 100%;
  animation: ${shimmer} 2s infinite linear;
  border-radius: 4px;
`;

const ActionButton = styled.button`
  padding: 0.8rem 1.5rem;
  background: linear-gradient(90deg, #3081ed, #9b51e0);
  background-size: 200% auto;
  color: white;
  border: none;
  border-radius: 30px;
  font-size: ${props => props.theme.fontsm};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  animation: ${shimmer} 3s infinite linear;
  width: 100%;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 7px 15px rgba(155, 81, 224, 0.4);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

// Governance section
const GovernanceContainer = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ProposalsColumn = styled.div``;

const ProposalCard = styled.div`
  background: rgba(36, 37, 38, 0.8);
  border-radius: 15px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const ProposalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  
  h3 {
    font-size: ${props => props.theme.fontlg};
    color: #3081ed;
    
    @media (max-width: 768px) {
      font-size: ${props => props.theme.fontmd};
    }
  }
  
  span {
    background: ${props => {
      switch(props.status) {
        case 'active': return 'rgba(76, 175, 80, 0.2)';
        case 'passed': return 'rgba(33, 150, 243, 0.2)';
        case 'failed': return 'rgba(244, 67, 54, 0.2)';
        default: return 'rgba(76, 175, 80, 0.2)';
      }
    }};
    color: ${props => {
      switch(props.status) {
        case 'active': return '#4CAF50';
        case 'passed': return '#2196F3';
        case 'failed': return '#F44336';
        default: return '#4CAF50';
      }
    }};
    padding: 0.3rem 0.8rem;
    border-radius: 20px;
    font-size: 0.75rem;
  }
`;

const ProposalDescription = styled.p`
  font-size: ${props => props.theme.fontsm};
  color: ${props => `rgba(${props.theme.textRgba}, 0.8)`};
  margin-bottom: 1.5rem;
  line-height: 1.6;
`;

const VoteActions = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const VoteButton = styled.button`
  flex: 1;
  padding: 0.8rem;
  background: ${props => props.yes ? 'rgba(76, 175, 80, 0.2)' : 'rgba(244, 67, 54, 0.2)'};
  color: ${props => props.yes ? '#4CAF50' : '#F44336'};
  border: 1px solid ${props => props.yes ? '#4CAF50' : '#F44336'};
  border-radius: 30px;
  font-size: ${props => props.theme.fontsm};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.yes ? 'rgba(76, 175, 80, 0.4)' : 'rgba(244, 67, 54, 0.4)'};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const VotingStats = styled.div`
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const VoteBar = styled.div`
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
  position: relative;
`;

const YesVote = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: ${props => props.percentage}%;
  background: rgba(76, 175, 80, 0.8);
  border-radius: 4px 0 0 4px;
`;

const NoVote = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  width: ${props => 100 - props.yesPercentage}%;
  background: rgba(244, 67, 54, 0.8);
  border-radius: 0 4px 4px 0;
`;

const VoteLabels = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: ${props => props.theme.fontxs};
  
  span:first-child {
    color: #4CAF50;
  }
  
  span:last-child {
    color: #F44336;
  }
`;

// Stats Column
const StatsColumn = styled.div``;

const StatsCard = styled.div`
  background: rgba(36, 37, 38, 0.8);
  border-radius: 15px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
`;

const StatsTitle = styled.h3`
  font-size: ${props => props.theme.fontlg};
  color: #3081ed;
  margin-bottom: 1.5rem;
  text-align: center;
  
  @media (max-width: 768px) {
    font-size: ${props => props.theme.fontmd};
  }
`;

const StatItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.8rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  &:last-child {
    border-bottom: none;
  }
  
  span:first-child {
    color: ${props => `rgba(${props.theme.textRgba}, 0.7)`};
  }
  
  span:last-child {
    font-weight: 600;
    color: #9b51e0;
  }
`;

// Events section
const EventsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const EventCard = styled.div`
  background: rgba(36, 37, 38, 0.8);
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease;
  position: relative;
  
  &:hover {
    transform: translateY(-10px);
  }
`;

const EventDate = styled.div`
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: rgba(155, 81, 224, 0.9);
  color: white;
  padding: 0.5rem;
  border-radius: 10px;
  text-align: center;
  font-weight: 600;
  z-index: 1;
  
  .day {
    font-size: 1.5rem;
    line-height: 1;
  }
  
  .month {
    font-size: 0.8rem;
    text-transform: uppercase;
  }
`;

const EventImage = styled.div`
  width: 100%;
  height: 180px;
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

const EventContent = styled.div`
  padding: 1.5rem;
`;

const EventTitle = styled.h3`
  font-size: ${props => props.theme.fontlg};
  margin-bottom: 0.75rem;
  color: #3081ed;
  
  @media (max-width: 768px) {
    font-size: ${props => props.theme.fontmd};
  }
`;

const EventDescription = styled.p`
  font-size: ${props => props.theme.fontsm};
  color: ${props => `rgba(${props.theme.textRgba}, 0.8)`};
  margin-bottom: 1.5rem;
  line-height: 1.6;
`;

const EventMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: ${props => props.theme.fontxs};
  color: ${props => `rgba(${props.theme.textRgba}, 0.7)`};
  
  div {
    display: flex;
    align-items: center;
    
    svg {
      margin-right: 5px;
    }
  }
`;

// Add these missing styled components
const Section = styled.section`
  min-height: 100vh;
  width: 100vw;
  background-color: ${props => props.theme.body};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
`;

const Container = styled.div`
  width: 90%;
  max-width: 1200px;
  background-color: rgba(36, 37, 38, 0.9);
  border-radius: 20px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.7);
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: ${props => props.theme.fontxxl};
  text-transform: uppercase;
  color: ${props => props.theme.text};
  margin-bottom: 1rem;
  text-align: center;
  letter-spacing: 3px;
  
  @media (max-width: 48em) {
    font-size: ${props => props.theme.fontxl};
  }
`;

const CommunitySection = styled.div`
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 15px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const SectionTitle = styled.h3`
  color: ${props => props.theme.text};
  font-size: ${props => props.theme.fontlg};
  margin-bottom: 0.5rem;
`;

// Sample data
const initiatives = [
  {
    id: 1,
    title: 'Space Babiez Community Fund',
    description: 'A community fund to assist Guardians in times of need through SBU initiatives.',
    image: 'https://i.postimg.cc/pTmP1V9b/image-11.png',
    status: 'active',
    goal: 10000,
    current: 7500
  },
  {
    id: 2,
    title: 'Children\'s Education Initiative',
    description: 'Supporting education programs for underprivileged children across the globe.',
    image: 'https://i.postimg.cc/cLTZxtwG/image-12.png',
    status: 'upcoming',
    goal: 5000,
    current: 0
  },
  {
    id: 3,
    title: 'Environmental Restoration Project',
    description: 'Planting trees and restoring natural habitats to combat climate change.',
    image: 'https://i.postimg.cc/15hyJQs2/image-13.png',
    status: 'completed',
    goal: 8000,
    current: 8000
  }
];

const proposals = [
  {
    id: 1,
    title: 'Add New Traits for Generation II',
    description: 'Proposal to add 20 new traits for the upcoming Generation II Space Babiez, including new backgrounds, outfits, and special powers.',
    status: 'active',
    yesVotes: 732,
    noVotes: 128,
    endDate: '2023-12-15'
  },
  {
    id: 2,
    title: 'Partnership with Cosmic Kids Charity',
    description: 'Establish an official partnership with Cosmic Kids Charity to donate 5% of all secondary sales to support children\'s education programs.',
    status: 'passed',
    yesVotes: 956,
    noVotes: 44,
    endDate: '2023-11-30'
  },
  {
    id: 3,
    title: 'Special Edition Holiday Cards',
    description: 'Create a limited series of 100 holiday-themed collector cards available exclusively to Guardians.',
    status: 'failed',
    yesVotes: 345,
    noVotes: 621,
    endDate: '2023-11-15'
  }
];

const events = [
  {
    id: 1,
    title: 'Virtual Guardian Meetup',
    description: 'Join other Guardians for our monthly virtual meetup to discuss the future of Space Babiez and showcase your collection.',
    image: 'https://i.postimg.cc/HswdNhLx/image-10.png',
    date: '2023-12-20',
    time: '18:00 UTC',
    location: 'Discord',
    attendees: 156
  },
  {
    id: 2,
    title: 'NFT NYC Afterparty',
    description: 'Exclusive afterparty for Space Babiez Guardians during NFT NYC. Meet the team and other Guardians in person!',
    image: 'https://i.postimg.cc/tRVX3TQF/image-14.png',
    date: '2024-02-15',
    time: '21:00 EST',
    location: 'New York, NY',
    attendees: 87
  },
  {
    id: 3,
    title: 'Space Babiez AMA Session',
    description: 'Ask Me Anything session with the Space Babiez team. Learn about upcoming features and get your questions answered!',
    image: 'https://i.postimg.cc/15hyJQs2/image-13.png',
    date: '2023-12-10',
    time: '15:00 UTC',
    location: 'Twitter Spaces',
    attendees: 230
  }
];

const CommunityHub = () => {
  const [activeTab, setActiveTab] = useState('initiatives');
  const [userVotes, setUserVotes] = useState({});
  const [walletConnected, setWalletConnected] = useState(false);
  
  useEffect(() => {
    // Check if wallet is connected from session storage
    const walletAddress = sessionStorage.getItem('walletAddress');
    setWalletConnected(!!walletAddress);
    
    // In a real implementation, we would fetch user votes from the database
    // For now, we'll use a mock
    setUserVotes({
      1: null, // User hasn't voted on proposal 1
      2: 'yes', // User voted yes on proposal 2
      3: 'no'  // User voted no on proposal 3
    });
  }, []);
  
  const handleVote = (proposalId, voteType) => {
    // In a real implementation, we would send this vote to the database
    // For now, we'll just update the local state
    setUserVotes(prev => ({
      ...prev,
      [proposalId]: voteType
    }));
    
    // Update the vote counts in the proposals (just for demo)
    // In a real app, this would come from the database after voting
  };
  
  const handleSupportInitiative = (initiativeId) => {
    // In a real implementation, we would send a transaction or update the database
    alert(`You've supported initiative #${initiativeId}! This would trigger a transaction in a real implementation.`);
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      day: date.getDate(),
      month: date.toLocaleString('default', { month: 'short' })
    };
  };
  
  const renderInitiatives = () => (
    <InitiativesGrid>
      {initiatives.map(initiative => (
        <InitiativeCard key={initiative.id}>
          <InitiativeImage>
            <img src={initiative.image} alt={initiative.title} />
            <InitiativeStatus status={initiative.status}>
              {initiative.status.charAt(0).toUpperCase() + initiative.status.slice(1)}
            </InitiativeStatus>
          </InitiativeImage>
          <InitiativeContent>
            <InitiativeTitle>{initiative.title}</InitiativeTitle>
            <InitiativeDescription>{initiative.description}</InitiativeDescription>
            
            <ProgressContainer>
              <ProgressLabel>
                <span>Progress</span>
                <span>${initiative.current.toLocaleString()} / ${initiative.goal.toLocaleString()}</span>
              </ProgressLabel>
              <ProgressBar>
                <ProgressFill progress={(initiative.current / initiative.goal) * 100} />
              </ProgressBar>
            </ProgressContainer>
            
            <ActionButton 
              onClick={() => handleSupportInitiative(initiative.id)}
              disabled={initiative.status !== 'active' || !walletConnected}
            >
              {initiative.status === 'active' 
                ? (walletConnected ? 'Support Initiative' : 'Connect Wallet to Support') 
                : initiative.status === 'completed' 
                  ? 'Completed' 
                  : 'Coming Soon'}
            </ActionButton>
          </InitiativeContent>
        </InitiativeCard>
      ))}
    </InitiativesGrid>
  );
  
  const renderGovernance = () => (
    <GovernanceContainer>
      <ProposalsColumn>
        <h2>Active Proposals</h2>
        {proposals.map(proposal => (
          <ProposalCard key={proposal.id}>
            <ProposalHeader status={proposal.status}>
              <h3>{proposal.title}</h3>
              <span>{proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}</span>
            </ProposalHeader>
            <ProposalDescription>{proposal.description}</ProposalDescription>
            
            <VotingStats>
              <VoteBar>
                <YesVote percentage={(proposal.yesVotes / (proposal.yesVotes + proposal.noVotes)) * 100} />
                <NoVote yesPercentage={(proposal.yesVotes / (proposal.yesVotes + proposal.noVotes)) * 100} />
              </VoteBar>
              <VoteLabels>
                <span>Yes: {proposal.yesVotes}</span>
                <span>No: {proposal.noVotes}</span>
              </VoteLabels>
            </VotingStats>
            
            {proposal.status === 'active' && (
              <VoteActions>
                <VoteButton 
                  yes 
                  onClick={() => handleVote(proposal.id, 'yes')}
                  disabled={!walletConnected || userVotes[proposal.id] === 'yes'}
                >
                  {userVotes[proposal.id] === 'yes' ? 'Voted Yes' : 'Vote Yes'}
                </VoteButton>
                <VoteButton 
                  onClick={() => handleVote(proposal.id, 'no')}
                  disabled={!walletConnected || userVotes[proposal.id] === 'no'}
                >
                  {userVotes[proposal.id] === 'no' ? 'Voted No' : 'Vote No'}
                </VoteButton>
              </VoteActions>
            )}
          </ProposalCard>
        ))}
      </ProposalsColumn>
      
      <StatsColumn>
        <StatsCard>
          <StatsTitle>Community Stats</StatsTitle>
          <StatItem>
            <span>Total Guardians</span>
            <span>4,326</span>
          </StatItem>
          <StatItem>
            <span>Total Space Babiez</span>
            <span>12,547</span>
          </StatItem>
          <StatItem>
            <span>Active Proposals</span>
            <span>3</span>
          </StatItem>
          <StatItem>
            <span>Funds Raised</span>
            <span>$42,850</span>
          </StatItem>
          <StatItem>
            <span>Guardian Participation</span>
            <span>72%</span>
          </StatItem>
        </StatsCard>
        
        <StatsCard>
          <StatsTitle>Your Guardian Status</StatsTitle>
          {walletConnected ? (
            <>
              <StatItem>
                <span>Guardian Level</span>
                <span>Silver</span>
              </StatItem>
              <StatItem>
                <span>Space Babiez Owned</span>
                <span>3</span>
              </StatItem>
              <StatItem>
                <span>Rarest Baby</span>
                <span>Legendary</span>
              </StatItem>
              <StatItem>
                <span>Governance Power</span>
                <span>73</span>
              </StatItem>
              <StatItem>
                <span>Votes Cast</span>
                <span>12</span>
              </StatItem>
            </>
          ) : (
            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <p>Connect your wallet to view your Guardian status</p>
              <ActionButton style={{ marginTop: '1rem', maxWidth: '200px' }}>
                Connect Wallet
              </ActionButton>
            </div>
          )}
        </StatsCard>
      </StatsColumn>
    </GovernanceContainer>
  );
  
  const renderEvents = () => (
    <EventsGrid>
      {events.map(event => {
        const formattedDate = formatDate(event.date);
        return (
          <EventCard key={event.id}>
            <EventDate>
              <div className="day">{formattedDate.day}</div>
              <div className="month">{formattedDate.month}</div>
            </EventDate>
            <EventImage>
              <img src={event.image} alt={event.title} />
            </EventImage>
            <EventContent>
              <EventTitle>{event.title}</EventTitle>
              <EventDescription>{event.description}</EventDescription>
              <EventMeta>
                <div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {event.time}
                </div>
                <div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {event.location}
                </div>
                <div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {event.attendees} Attendees
                </div>
              </EventMeta>
              <ActionButton style={{ marginTop: '1rem' }}>
                RSVP to Event
              </ActionButton>
            </EventContent>
          </EventCard>
        );
      })}
    </EventsGrid>
  );
  
  return (
    <>
      <Navigation />
      <Section style={{ background: `url(${bgr}) no-repeat`, backgroundSize: 'cover' }}>
        <Container>
          <Title>Community Hub</Title>
          
          <CommunitySection>
            <SectionTitle>Community Chat</SectionTitle>
            <p style={{ color: 'white' }}>Connect with other Space Babiez collectors and discuss the latest updates.</p>
            {/* Chat component would go here */}
          </CommunitySection>
          
          <CommunitySection>
            <SectionTitle>Upcoming Events</SectionTitle>
            <p style={{ color: 'white' }}>Don't miss out on our community events and NFT drops!</p>
            {/* Events list would go here */}
          </CommunitySection>
          
          <CommunitySection>
            <SectionTitle>Community Leaderboard</SectionTitle>
            <p style={{ color: 'white' }}>See who's making the biggest impact in our community.</p>
            {/* Leaderboard component would go here */}
          </CommunitySection>
        </Container>
      </Section>
      <Footer />
    </>
  );
};

export default CommunityHub;
