import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { getSolanaNFTs } from '../utils/solanaUtils';
import { SOLANA_TESTNET } from '../utils/constants';

// Styled components
const ProfileContainer = styled.div`
  min-height: 100vh;
  background-color: #000000;
  background-image: 
    radial-gradient(circle at 80% 10%, rgba(40, 0, 80, 0.4) 0%, transparent 50%),
    radial-gradient(circle at 20% 90%, rgba(0, 80, 120, 0.4) 0%, transparent 50%);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ProfileHeader = styled.div`
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
  
  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
  }
`;

const ProfileInfo = styled.div`
  background: rgba(20, 20, 40, 0.7);
  border: 1px solid rgba(174, 255, 0, 0.3);
  border-radius: 15px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  width: 100%;
  max-width: 500px;
  
  @media (min-width: 768px) {
    margin-bottom: 0;
    margin-right: 1.5rem;
  }
`;

const ProfileStats = styled.div`
  background: rgba(20, 20, 40, 0.7);
  border: 1px solid rgba(108, 0, 255, 0.3);
  border-radius: 15px;
  padding: 1.5rem;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  width: 100%;
  max-width: 600px;
`;

const StatBox = styled.div`
  flex: 1;
  min-width: 120px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  padding: 1rem;
  text-align: center;
  
  h4 {
    color: ${props => props.color || '#aeff00'};
    margin-bottom: 0.5rem;
  }
  
  span {
    color: white;
    font-size: 1.5rem;
    font-weight: 600;
  }
`;

const Title = styled.h1`
  color: #aeff00;
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  text-align: center;
  font-family: 'flegrei', sans-serif;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.h2`
  color: white;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  text-align: center;
  
  @media (max-width: 768px) {
    font-size: 1.3rem;
  }
`;

const WalletAddress = styled.div`
  background: rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  padding: 0.8rem;
  display: flex;
  align-items: center;
  margin-top: 1rem;
  
  span {
    color: #aaa;
    margin-right: 0.5rem;
  }
  
  p {
    color: #aeff00;
    font-family: monospace;
    word-break: break-all;
  }
`;

const CollectionContainer = styled.div`
  width: 100%;
  max-width: 1200px;
`;

const CollectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 1rem;
  
  h3 {
    color: #aeff00;
    font-size: 1.5rem;
  }
`;

const NFTGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const NFTCard = styled.div`
  background: rgba(20, 20, 40, 0.7);
  border: 1px solid rgba(174, 255, 0, 0.3);
  border-radius: 15px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(174, 255, 0, 0.3);
  }
`;

const NFTImage = styled.div`
  height: 220px;
  overflow: hidden;
  position: relative;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(0deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 50%);
  }
`;

const NFTInfo = styled.div`
  padding: 1rem;
`;

const NFTName = styled.h4`
  color: #aeff00;
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
`;

const NFTAttributes = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.8rem;
`;

const NFTAttribute = styled.span`
  background: rgba(108, 0, 255, 0.2);
  border: 1px solid rgba(108, 0, 255, 0.3);
  border-radius: 15px;
  padding: 0.3rem 0.6rem;
  font-size: 0.8rem;
  color: white;
  white-space: nowrap;
`;

const NFTDate = styled.div`
  font-size: 0.8rem;
  color: #999;
  margin-top: 0.8rem;
`;

const EmptyCollection = styled.div`
  background: rgba(20, 20, 40, 0.7);
  border: 1px solid rgba(174, 255, 0, 0.3);
  border-radius: 15px;
  padding: 2rem;
  text-align: center;
  
  h3 {
    color: #aeff00;
    margin-bottom: 1rem;
  }
  
  p {
    color: white;
    line-height: 1.6;
    margin-bottom: 1.5rem;
  }
`;

// Keep the styled Link component for navigation
const NavButton = styled(Link)`
  background: ${props => props.$primary ? 'linear-gradient(90deg, #AEFF00 0%, #5CFF85 100%)' : 'transparent'};
  color: ${props => props.$primary ? '#000000' : '#AEFF00'};
  border: ${props => props.$primary ? 'none' : '2px solid #AEFF00'};
  border-radius: 30px;
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-block;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(174, 255, 0, 0.3);
  }
`;

// Create a new ActionButton for onClick handlers (using button element instead of Link)
const ActionButton = styled.button`
  background: ${props => props.$primary ? 'linear-gradient(90deg, #AEFF00 0%, #5CFF85 100%)' : 'transparent'};
  color: ${props => props.$primary ? '#000000' : '#AEFF00'};
  border: ${props => props.$primary ? 'none' : '2px solid #AEFF00'};
  border-radius: 30px;
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-block;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(174, 255, 0, 0.3);
  }
`;

const NavBar = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  flex-wrap: wrap;
  justify-content: center;
`;

const Profile = () => {
  const [walletAddress, setWalletAddress] = useState('');
  const [collection, setCollection] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Check if wallet is connected and load NFTs
    const loadProfile = async () => {
      setLoading(true);
      
      // Try to get wallet address from localStorage first
      const storedAddress = localStorage.getItem('phantomWalletAddress');
      
      if (storedAddress) {
        setWalletAddress(storedAddress);
        
        // Load NFTs from session storage
        try {
          // Combine NFTs from various sources
          const storedNFTs = JSON.parse(sessionStorage.getItem('spaceBabiesNFTs') || '[]');
          const localNFTs = JSON.parse(localStorage.getItem('mintedSolanaNFTs') || '[]').map(nft => ({
            id: nft.mint || `solana-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            name: nft.metadata?.name || 'Space Baby NFT',
            image: nft.metadata?.image || 'https://i.postimg.cc/GmQ6XVFR/image-Team-Dez.png',
            attributes: nft.metadata?.attributes || [],
            mintedAt: nft.timestamp ? new Date(nft.timestamp).toISOString() : new Date().toISOString(),
            network: 'solana',
            transactionHash: nft.signature
          }));
          
          // Combine and deduplicate
          const allNFTs = [...storedNFTs, ...localNFTs];
          const uniqueNFTs = Array.from(new Map(allNFTs.map(nft => [nft.id, nft])).values());
          
          setCollection(uniqueNFTs);
        } catch (error) {
          console.error('Error loading NFTs:', error);
          setCollection([]);
        }
      } else {
        // Try to connect to phantom if available
        if (window.solana && window.solana.isPhantom) {
          try {
            const response = await window.solana.connect({ onlyIfTrusted: true });
            if (response.publicKey) {
              const address = response.publicKey.toString();
              setWalletAddress(address);
              localStorage.setItem('phantomWalletAddress', address);
              
              // Load NFTs as above
              // ...
            }
          } catch (error) {
            console.log("Wallet not previously authorized");
            setWalletAddress('');
            setCollection([]);
          }
        }
      }
      
      setLoading(false);
    };
    
    loadProfile();
  }, []);
  
  const connectWallet = async () => {
    if (!window.solana || !window.solana.isPhantom) {
      alert("Phantom wallet not detected! Please install Phantom extension.");
      return;
    }
    
    try {
      const response = await window.solana.connect();
      if (response.publicKey) {
        const address = response.publicKey.toString();
        setWalletAddress(address);
        localStorage.setItem('phantomWalletAddress', address);
        
        // Reload the page to get NFTs
        window.location.reload();
      }
    } catch (error) {
      console.error("Error connecting to Phantom:", error);
      alert("Failed to connect to Phantom wallet: " + error.message);
    }
  };
  
  return (
    <ProfileContainer>
      <ProfileHeader>
        <ProfileInfo>
          <Title>Space Guardian</Title>
          <Subtitle>Your Cosmic Collection</Subtitle>
          
          {walletAddress ? (
            <WalletAddress>
              <span>Wallet:</span>
              <p>{walletAddress.substring(0, 10)}...{walletAddress.substring(walletAddress.length - 6)}</p>
            </WalletAddress>
          ) : (
            // Use ActionButton instead of Button for onClick handlers
            <ActionButton onClick={connectWallet}>Connect Phantom Wallet</ActionButton>
          )}
        </ProfileInfo>
        
        <ProfileStats>
          <StatBox color="#aeff00">
            <h4>Collection Size</h4>
            <span>{collection.length}</span>
          </StatBox>
          
          <StatBox color="#6c00ff">
            <h4>Network</h4>
            <span>Solana</span>
          </StatBox>
          
          <StatBox color="#ff33a8">
            <h4>Last Minted</h4>
            <span>
              {collection.length > 0 ? 
                new Date(collection[collection.length - 1].mintedAt).toLocaleDateString() : 
                'N/A'}
            </span>
          </StatBox>
        </ProfileStats>
      </ProfileHeader>
      
      <CollectionContainer>
        <CollectionHeader>
          <h3>Your Space Babies</h3>
        </CollectionHeader>
        
        {loading ? (
          <EmptyCollection>
            <h3>Loading your collection...</h3>
          </EmptyCollection>
        ) : collection.length > 0 ? (
          <NFTGrid>
            {collection.map((nft) => (
              <NFTCard key={nft.id}>
                <NFTImage>
                  <img src={nft.image} alt={nft.name} />
                </NFTImage>
                <NFTInfo>
                  <NFTName>{nft.name}</NFTName>
                  <NFTAttributes>
                    {nft.attributes && nft.attributes.slice(0, 3).map((attr, idx) => (
                      <NFTAttribute key={idx}>
                        {attr.trait_type}: {attr.value}
                      </NFTAttribute>
                    ))}
                  </NFTAttributes>
                  <NFTDate>
                    Minted on {new Date(nft.mintedAt).toLocaleDateString()}
                  </NFTDate>
                </NFTInfo>
              </NFTCard>
            ))}
          </NFTGrid>
        ) : (
          <EmptyCollection>
            <h3>No Space Babies Found</h3>
            <p>
              You haven't created any Space Babies yet. Visit Etherland to start your cosmic collection!
            </p>
            <NavButton to="/etherland" $primary>Go to Etherland</NavButton>
          </EmptyCollection>
        )}
      </CollectionContainer>
      
      <NavBar>
        <NavButton to="/">Home</NavButton>
        <NavButton to="/etherland">Return to Etherland</NavButton>
        <NavButton to="/astroverse" $primary>Visit Astroverse</NavButton>
      </NavBar>
    </ProfileContainer>
  );
};

export default Profile;
