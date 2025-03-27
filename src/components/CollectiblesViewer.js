import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const ViewerContainer = styled.div`
  background: rgba(36, 37, 38, 0.9);
  border: 2px solid #aeff00;
  border-radius: 20px;
  padding: 2rem;
  width: 100%;
  max-width: 900px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 2rem 0;
`;

const Title = styled.h2`
  color: #aeff00;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const NFTGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
  width: 100%;
`;

const NFTCard = styled.div`
  background: rgba(20, 20, 20, 0.8);
  border: 1px solid #444;
  border-radius: 10px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(174, 255, 0, 0.3);
  }
`;

const NFTImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const NFTInfo = styled.div`
  padding: 1rem;
`;

const NFTName = styled.h3`
  color: #fff;
  font-size: 1rem;
  margin-bottom: 0.5rem;
`;

const NFTAttribute = styled.div`
  background: rgba(174, 255, 0, 0.1);
  border-radius: 5px;
  padding: 0.3rem 0.5rem;
  margin: 0.2rem 0;
  font-size: 0.8rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: #aaa;
`;

const NetworkBadge = styled.span`
  background: ${props => props.network === 'ethereum' ? '#627eea' : '#14f195'};
  color: white;
  font-size: 0.7rem;
  padding: 0.2rem 0.5rem;
  border-radius: 10px;
  margin-left: 0.5rem;
  vertical-align: middle;
`;

const CollectiblesViewer = () => {
  const [nfts, setNfts] = useState([]);
  
  useEffect(() => {
    // Load from both localStorage and sessionStorage
    const loadNFTs = () => {
      try {
        // Get from localStorage (Solana minted mock NFTs)
        const solanaNFTs = JSON.parse(localStorage.getItem('mintedSolanaNFTs') || '[]')
          .map(nft => ({
            id: nft.mint || `solana-${Date.now()}`,
            name: nft.metadata?.name || 'Space Baby NFT',
            image: nft.metadata?.image || 'https://i.postimg.cc/GmQ6XVFR/image-Team-Dez.png',
            attributes: nft.metadata?.attributes || [],
            mintedAt: nft.timestamp ? new Date(nft.timestamp).toISOString() : new Date().toISOString(),
            network: 'solana',
            transactionHash: nft.signature
          }));
        
        // Get from sessionStorage (both Ethereum and Solana NFTs)
        const sessionNFTs = JSON.parse(sessionStorage.getItem('spaceBabiesNFTs') || '[]');
        
        // Combine and remove duplicates
        const combinedNFTs = [...solanaNFTs, ...sessionNFTs];
        const uniqueNFTs = combinedNFTs.filter((nft, index, self) => 
          index === self.findIndex(t => t.id === nft.id)
        );
        
        setNfts(uniqueNFTs);
      } catch (err) {
        console.error('Error loading NFTs:', err);
        setNfts([]);
      }
    };
    
    loadNFTs();
  }, []);
  
  return (
    <ViewerContainer>
      <Title>Your Space Baby Collectibles</Title>
      
      {nfts.length > 0 ? (
        <NFTGrid>
          {nfts.map(nft => (
            <NFTCard key={nft.id}>
              <NFTImage src={nft.image} alt={nft.name} />
              <NFTInfo>
                <NFTName>
                  {nft.name}
                  <NetworkBadge network={nft.network}>
                    {nft.network === 'ethereum' ? 'ETH' : 'SOL'}
                  </NetworkBadge>
                </NFTName>
                
                {nft.attributes && nft.attributes.map((attr, idx) => (
                  <NFTAttribute key={idx}>
                    {attr.trait_type}: {attr.value}
                  </NFTAttribute>
                ))}
                
                <div style={{ fontSize: '0.7rem', color: '#aaa', marginTop: '0.5rem' }}>
                  Minted: {new Date(nft.mintedAt).toLocaleString()}
                </div>
              </NFTInfo>
            </NFTCard>
          ))}
        </NFTGrid>
      ) : (
        <EmptyState>
          <p>You don't have any Space Baby collectibles yet.</p>
          <p>Connect your wallet and mint some NFTs first!</p>
        </EmptyState>
      )}
    </ViewerContainer>
  );
};

export default CollectiblesViewer;
