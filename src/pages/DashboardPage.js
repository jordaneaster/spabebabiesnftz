import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import UniverseNavigation from '../components/UniverseNavigation';
import GuardianDashboard from '../components/GuardianDashboard';
import CommunityHub from '../components/CommunityHub';
import bgr from '../assets/media/BGR3.png';
import Footer from '../components/Footer';

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
  padding: 2rem;
`;

const Container = styled.div`
  width: 90%;
  max-width: 1400px;
  background-color: rgba(36, 37, 38, 0.9);
  border-radius: 20px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
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
  
  @media (max-width: 30em) {
    font-size: ${props => props.theme.fontlg};
  }
`;

const Subtitle = styled.h2`
  font-size: ${props => props.theme.fontlg};
  color: ${props => props.theme.text};
  margin-bottom: 2rem;
  text-align: center;
  
  @media (max-width: 48em) {
    font-size: ${props => props.theme.fontmd};
  }
`;

const TabsContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
  width: 100%;
  max-width: 600px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.5rem;
    align-items: center;
  }
`;

const Tab = styled.button`
  padding: 1rem 2rem;
  background: ${props => props.active 
    ? 'linear-gradient(90deg, #3081ed, #9b51e0)' 
    : 'rgba(36, 37, 38, 0.8)'};
  color: white;
  border: none;
  font-size: ${props => props.theme.fontmd};
  font-weight: ${props => props.active ? '600' : '400'};
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 150px;
  
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
    width: 100%;
    border-radius: 30px;
  }
`;

const ContentContainer = styled.div`
  width: 100%;
`;

const NavigationContainer = styled.div`
  width: 100%;
  margin-bottom: 2rem;
`;

const LoadingOverlay = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  
  h3 {
    margin-top: 1rem;
    color: #9b51e0;
  }
`;

const DashboardCard = styled.div`
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 15px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [walletConnected, setWalletConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Check if wallet is connected
    const walletAddress = sessionStorage.getItem('walletAddress');
    setWalletConnected(!!walletAddress);
    
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  }, []);
  
  return (
    <>
      <Section>
        <Container>
          <Title>Space Babiez Guardian Portal</Title>
          <Subtitle>Explore Your Space Babiez Universe</Subtitle>
          
          <NavigationContainer>
            <UniverseNavigation showDetails={false} />
          </NavigationContainer>
          
          <TabsContainer>
            <Tab 
              active={activeTab === 'dashboard'} 
              onClick={() => setActiveTab('dashboard')}
            >
              My Collection
            </Tab>
            <Tab 
              active={activeTab === 'community'} 
              onClick={() => setActiveTab('community')}
            >
              Community
            </Tab>
          </TabsContainer>
          
          <ContentContainer>
            {isLoading ? (
              <LoadingOverlay>
                <div style={{ width: '50px', height: '50px', border: '3px solid #9b51e0', borderRadius: '50%', borderTopColor: 'transparent', animation: 'spin 1s linear infinite' }}></div>
                <h3>Loading Guardian Data...</h3>
              </LoadingOverlay>
            ) : (
              <>
                {activeTab === 'dashboard' && <GuardianDashboard />}
                {activeTab === 'community' && <CommunityHub />}
              </>
            )}
          </ContentContainer>
        </Container>
      </Section>
      <Footer />
    </>
  );
};

export default DashboardPage;
