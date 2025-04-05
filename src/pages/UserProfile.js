import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import supabase from '../utils/supabaseConfig';
import bgr from '../assets/media/BGR3.png';
import TABLES from '../utils/supabaseSchema';
import Navbar from '../components/Navbar'; // Import the Navbar component

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
  width: 80%;
  max-width: 1200px;
  background-color: rgba(36, 37, 38, 0.9);
  border-radius: 20px;
  padding: 3rem;
  margin-top: 2rem;
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
  margin-bottom: 2rem;
  text-align: center;
  
  @media (max-width: 48em) {
    font-size: ${props => props.theme.fontxl};
  }
`;

const ProfileSection = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 2rem;
  
  @media (max-width: 48em) {
    flex-direction: column;
  }
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 2rem;
  
  @media (max-width: 48em) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const AvatarContainer = styled.div`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid #9b51e0;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ProfileInfo = styled.div`
  flex: 1;
`;

const UserName = styled.h2`
  font-size: ${props => props.theme.fontxl};
  color: ${props => props.theme.text};
  margin-bottom: 0.5rem;
`;

const WalletInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
  
  span {
    font-size: ${props => props.theme.fontsm};
    color: rgba(255, 255, 255, 0.7);
  }
  
  a {
    color: #3081ed;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const WalletType = styled.div`
  display: inline-block;
  background: rgba(155, 81, 224, 0.1);
  border: 1px solid #9b51e0;
  border-radius: 50px;
  padding: 0.3rem 1rem;
  font-size: ${props => props.theme.fontsm};
  color: #9b51e0;
`;

const StatsContainer = styled.div`
  display: flex;
  gap: 2rem;
  margin-top: 1.5rem;
  
  @media (max-width: 48em) {
    flex-wrap: wrap;
    gap: 1rem;
  }
`;

const StatItem = styled.div`
  background: rgba(48, 129, 237, 0.1);
  border-radius: 10px;
  padding: 1rem;
  min-width: 120px;
  text-align: center;
  
  h3 {
    font-size: ${props => props.theme.fontlg};
    color: #3081ed;
    margin-bottom: 0.5rem;
  }
  
  p {
    font-size: ${props => props.theme.fontsm};
    color: rgba(255, 255, 255, 0.7);
  }
`;

const Tabs = styled.div`
  display: flex;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 2rem;
`;

const Tab = styled.button`
  background: transparent;
  border: none;
  padding: 1rem 2rem;
  color: ${props => props.active ? props.theme.text : 'rgba(255, 255, 255, 0.5)'};
  font-size: ${props => props.theme.fontmd};
  border-bottom: 2px solid ${props => props.active ? '#9b51e0' : 'transparent'};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    color: ${props => props.theme.text};
  }
`;

const BabiesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const BabyCard = styled.div`
  background: rgba(36, 37, 38, 0.9);
  border-radius: 15px;
  padding: 1rem;
  border: 1px solid rgba(155, 81, 224, 0.3);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(155, 81, 224, 0.3);
  }
`;

const BabyImage = styled.div`
  width: 100%;
  aspect-ratio: 1;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 1rem;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const BabyInfo = styled.div`
  h3 {
    font-size: ${props => props.theme.fontmd};
    color: ${props => props.theme.text};
    margin-bottom: 0.5rem;
  }
  
  p {
    font-size: ${props => props.theme.fontsm};
    color: rgba(255, 255, 255, 0.7);
  }
`;

const AttributeTag = styled.span`
  display: inline-block;
  background: rgba(48, 129, 237, 0.1);
  border: 1px solid #3081ed;
  border-radius: 50px;
  padding: 0.2rem 0.8rem;
  font-size: ${props => props.theme.fontsm};
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
`;

const NoDataMessage = styled.div`
  text-align: center;
  padding: 3rem;
  color: rgba(255, 255, 255, 0.7);
  
  h3 {
    font-size: ${props => props.theme.fontlg};
    margin-bottom: 1.5rem;
  }
  
  p {
    font-size: ${props => props.theme.fontmd};
    margin-bottom: 2rem;
  }
  
  a {
    display: inline-block;
    background: linear-gradient(90deg, #9b51e0 0%, #3081ed 100%);
    color: white;
    padding: 0.8rem 2rem;
    border-radius: 50px;
    text-decoration: none;
    font-weight: bold;
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 7px 15px rgba(155, 81, 224, 0.4);
    }
  }
`;

const ActionButton = styled(Link)`
  display: inline-block;
  background: linear-gradient(90deg, #9b51e0 0%, #3081ed 100%);
  color: white;
  padding: 0.8rem 2rem;
  border-radius: 50px;
  text-decoration: none;
  font-weight: bold;
  font-size: ${props => props.theme.fontsm};
  transition: all 0.3s ease;
  margin-top: 1.5rem;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 7px 15px rgba(155, 81, 224, 0.4);
  }
`;

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState('myBabies');
  const [userProfile, setUserProfile] = useState(null);
  const [userBabies, setUserBabies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [walletAddress, setWalletAddress] = useState('');
  
  useEffect(() => {
    // Try to get wallet from session storage first (for just generated babies)
    const storedWallet = sessionStorage.getItem('walletAddress');
    
    // Otherwise check if wallet is connected via browser
    const checkWalletAndLoadProfile = async () => {
      try {
        let address = storedWallet;
        
        if (!address && window.ethereum) {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            address = accounts[0];
          }
        }
        
        if (!address && window.solana && window.solana.isPhantom) {
          try {
            const response = await window.solana.connect({ onlyIfTrusted: true });
            if (response.publicKey) {
              address = response.publicKey.toString();
            }
          } catch (error) {
            console.error("Phantom error:", error);
          }
        }
        
        if (address) {
          setWalletAddress(address);
          await loadUserProfile(address);
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error checking wallet:", error);
        setIsLoading(false);
      }
    };
    
    checkWalletAndLoadProfile();
  }, []);
  
  const loadUserProfile = async (address) => {
    try {
      console.log("Loading profile for wallet:", address);
      
      // Get user profile from supabase
      const { data: profile, error: profileError } = await supabase
        .from(TABLES.USERS)
        .select('*')
        .eq('wallet_address', address)
        .single();
      
      if (profileError && profileError.code !== 'PGRST116') {
        console.error("Error fetching user profile:", profileError);
        throw profileError;
      }
      
      // Get all babies associated with this user by wallet_address
      // This ensures we find babies even if they were created without a proper user_id linkage
      const { data: babies, error: babiesError } = await supabase
        .from(TABLES.BABIES)
        .select('*')
        .eq('wallet_address', address)
        .eq('soul_generation_complete', true)
        .order('created_at', { ascending: false });
      
      if (babiesError) {
        console.error("Error fetching user's babies by wallet address:", babiesError);
        throw babiesError;
      }
      
      // If no babies found by wallet_address, try looking up by user_id
      if ((!babies || babies.length === 0) && profile && profile.id) {
        const { data: userBabies, error: userBabiesError } = await supabase
          .from(TABLES.BABIES)
          .select('*')
          .eq('user_id', profile.id)
          .eq('soul_generation_complete', true)
          .order('created_at', { ascending: false });
        
        if (userBabiesError) {
          console.error("Error fetching user's babies by user_id:", userBabiesError);
        } else if (userBabies && userBabies.length > 0) {
          console.log("Found babies by user_id:", userBabies.length);
          // Set babies found by user_id
          setUserBabies(userBabies.filter(baby => baby.image_url));
        }
      } else {
        console.log("Found babies by wallet_address:", babies?.length || 0);
        
        // Set babies found by wallet_address
        setUserBabies(babies?.filter(baby => baby.image_url) || []);
      }
      
      // Also check session storage for recently minted babies that might not be in the database yet
      try {
        const sessionBabies = JSON.parse(sessionStorage.getItem('spaceBabiesNFTs') || '[]');
        if (sessionBabies.length > 0) {
          console.log("Found babies in session storage:", sessionBabies.length);
          
          // Format session babies to match database structure
          const formattedSessionBabies = sessionBabies.map(baby => ({
            id: baby.id,
            name: baby.name,
            image_url: baby.image,
            attributes: baby.attributes.reduce((obj, attr) => {
              obj[attr.trait_type] = attr.value;
              return obj;
            }, {}),
            created_at: baby.mintedAt || new Date().toISOString(),
            wallet_address: address
          }));
          
          // Combine with existing babies, removing duplicates by ID
          const existingIds = new Set(userBabies.map(baby => baby.id));
          const uniqueSessionBabies = formattedSessionBabies.filter(baby => !existingIds.has(baby.id));
          
          if (uniqueSessionBabies.length > 0) {
            setUserBabies(prev => [...prev, ...uniqueSessionBabies]);
          }
        }
      } catch (sessionError) {
        console.warn("Error checking session storage:", sessionError);
      }
      
      // If we have a profile, use it, otherwise construct a minimal profile
      setUserProfile(profile || { wallet_address: address });
      setIsLoading(false);
    } catch (error) {
      console.error("Error loading profile:", error);
      setIsLoading(false);
    }
  };
  
  // Generate placeholder avatar based on wallet address
  const getAvatarUrl = () => {
    if (!walletAddress) return 'https://via.placeholder.com/150';
    // Use a service like robohash to generate avatar based on wallet
    return `https://robohash.org/${walletAddress}?set=set4&size=150x150`;
  };
  
  return (
    <Section>
      <Navbar /> {/* Add the Navbar component */}
      <Container>
        <Title>User Profile</Title>
        
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>Loading profile data...</p>
          </div>
        ) : !walletAddress ? (
          <NoDataMessage>
            <h3>No Wallet Connected</h3>
            <p>Please connect your wallet to view your profile</p>
            <Link to="/etherland">Connect Wallet</Link>
          </NoDataMessage>
        ) : (
          <>
            <ProfileSection>
              <ProfileHeader>
                <AvatarContainer>
                  <img src={getAvatarUrl()} alt="User Avatar" />
                </AvatarContainer>
                
                <ProfileInfo>
                  <UserName>Space Explorer</UserName>
                  <WalletInfo>
                    <span>Wallet:</span> 
                    {walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 4)}
                  </WalletInfo>
                  
                  <WalletType>
                    {userProfile?.wallet_type === 'phantom' ? 'Phantom Wallet' : 'MetaMask Wallet'}
                  </WalletType>
                  
                  <StatsContainer>
                    <StatItem>
                      <h3>{userBabies.length}</h3>
                      <p>Space Babies</p>
                    </StatItem>
                    <StatItem>
                      <h3>{userProfile?.attributes?.rarity || "N/A"}</h3>
                      <p>Highest Rarity</p>
                    </StatItem>
                  </StatsContainer>
                  
                  <ActionButton to="/etherland">Generate New Space Baby</ActionButton>
                </ProfileInfo>
              </ProfileHeader>
              
              <Tabs>
                <Tab 
                  active={activeTab === 'myBabies'} 
                  onClick={() => setActiveTab('myBabies')}
                >
                  My Space Babies
                </Tab>
                <Tab 
                  active={activeTab === 'activity'} 
                  onClick={() => setActiveTab('activity')}
                >
                  Activity
                </Tab>
              </Tabs>
              
              {activeTab === 'myBabies' && (
                <>
                  {userBabies.length === 0 ? (
                    <NoDataMessage>
                      <h3>No Space Babies Found</h3>
                      <p>You haven't generated any Space Babies yet</p>
                      <Link to="/etherland">Generate Your First Space Baby</Link>
                    </NoDataMessage>
                  ) : (
                    <BabiesGrid>
                      {userBabies.map((baby, index) => (
                        <BabyCard key={baby.id || index}>
                          <BabyImage>
                            <img src={baby.image_url} alt={baby.name || "Space Baby"} />
                          </BabyImage>
                          <BabyInfo>
                            <h3>{baby.name || `Space Baby #${index + 1}`}</h3>
                            <p>Generated: {new Date(baby.created_at).toLocaleDateString()}</p>
                            <div style={{ marginTop: '0.8rem' }}>
                              {baby.attributes && Object.entries(baby.attributes).slice(0, 3).map(([key, value]) => (
                                <AttributeTag key={key}>{key}: {value}</AttributeTag>
                              ))}
                            </div>
                          </BabyInfo>
                        </BabyCard>
                      ))}
                    </BabiesGrid>
                  )}
                </>
              )}
              
              {activeTab === 'activity' && (
                <div style={{ padding: '2rem', textAlign: 'center' }}>
                  <p>Activity history will be available soon</p>
                </div>
              )}
            </ProfileSection>
          </>
        )}
      </Container>
    </Section>
  );
};

export default UserProfile;
