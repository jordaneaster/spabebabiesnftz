import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

// Animations
const pageFlip = keyframes`
  0% { transform: rotateY(0deg); }
  100% { transform: rotateY(-180deg); }
`;

const pageFlipReverse = keyframes`
  0% { transform: rotateY(-180deg); }
  100% { transform: rotateY(0deg); }
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

// Styled Components
const AlbumContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  color: ${props => props.theme.text};
  
  h1 {
    text-align: center;
    margin-bottom: 2rem;
    font-size: ${props => props.theme.fontxxl};
    
    @media (max-width: 768px) {
      font-size: ${props => props.theme.fontxl};
    }
  }
`;

const AlbumHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const AlbumInfo = styled.div`
  h2 {
    color: #3081ed;
    margin-bottom: 0.5rem;
  }
  
  p {
    color: ${props => `rgba(${props.theme.textRgba}, 0.8)`};
  }
`;

const FilterControls = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`;

const FilterButton = styled.button`
  background: ${props => props.active 
    ? 'linear-gradient(90deg, #3081ed, #9b51e0)' 
    : 'rgba(36, 37, 38, 0.8)'};
  color: white;
  border: none;
  padding: 0.5rem 1.5rem;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.active 
      ? 'linear-gradient(90deg, #3081ed, #9b51e0)' 
      : 'rgba(48, 129, 237, 0.3)'};
  }
`;

const BookContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 900px;
  height: 600px;
  margin: 0 auto;
  perspective: 1500px;
  
  @media (max-width: 768px) {
    height: 400px;
  }
`;

const Book = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transform: rotateX(10deg);
  transition: transform 0.5s;
`;

const BookCover = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: ${props => props.back 
    ? 'linear-gradient(135deg, #242526 0%, #3c3f41 100%)' 
    : 'linear-gradient(45deg, #3081ed 0%, #9b51e0 100%)'};
  border-radius: 10px;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.5);
  backface-visibility: hidden;
  transform: ${props => props.back ? 'rotateY(180deg)' : 'none'};
  
  h2 {
    font-size: 2.5rem;
    color: white;
    text-align: center;
    margin-bottom: 1rem;
  }
  
  p {
    color: rgba(255, 255, 255, 0.8);
    text-align: center;
    max-width: 80%;
  }
`;

const CoverImage = styled.div`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 2rem;
  border: 5px solid rgba(255, 255, 255, 0.3);
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const BookPages = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  transform-style: preserve-3d;
`;

const Page = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: rgba(36, 37, 38, 0.95);
  border-radius: 10px;
  box-shadow: ${props => props.isRight ? '-5px 0 10px rgba(0, 0, 0, 0.5)' : '5px 0 10px rgba(0, 0, 0, 0.5)'};
  transform-origin: ${props => props.isRight ? 'left center' : 'right center'};
  transform-style: preserve-3d;
  transform: ${props => {
    if (props.isFlipped && props.isRight) return 'rotateY(-180deg)';
    if (props.isFlipped && !props.isRight) return 'rotateY(180deg)';
    return 'none';
  }};
  animation: ${props => {
    if (props.isAnimating && props.isRight && props.isFlipped) return pageFlip;
    if (props.isAnimating && !props.isRight && !props.isFlipped) return pageFlipReverse;
    return 'none';
  }} 0.8s cubic-bezier(0.645, 0.045, 0.355, 1.000) forwards;
  z-index: ${props => props.zIndex};
  
  &:before, &:after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    backface-visibility: hidden;
    border-radius: 10px;
  }
  
  &:after {
    transform: rotateY(180deg);
  }
`;

const PageContent = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  box-sizing: border-box;
  transform: ${props => props.isBack ? 'rotateY(180deg)' : 'none'};
  backface-visibility: hidden;
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  width: 100%;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const CardSlot = styled.div`
  position: relative;
  aspect-ratio: 2/3;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  padding: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  perspective: 1000px;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const Card = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.6s;
  transform: ${props => props.flipped ? 'rotateY(180deg)' : 'none'};
`;

const CardFace = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
`;

const CardFront = styled(CardFace)`
  background: ${props => props.empty 
    ? 'linear-gradient(135deg, rgba(48, 129, 237, 0.2), rgba(155, 81, 224, 0.2))' 
    : 'none'};
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const CardBack = styled(CardFace)`
  background: linear-gradient(45deg, #3081ed, #9b51e0);
  transform: rotateY(180deg);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0.5rem;
  
  h4 {
    font-size: 0.8rem;
    color: white;
    margin-bottom: 0.5rem;
    text-align: center;
  }
  
  span {
    font-size: 0.7rem;
    color: rgba(255, 255, 255, 0.8);
    line-height: 1.2;
    text-align: center;
  }
`;

const EmptySlotText = styled.span`
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.8rem;
  text-align: center;
  position: absolute;
`;

const RarityBadge = styled.div`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: rgba(0, 0, 0, 0.5);
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
  padding: 0.25rem 0.5rem;
  border-radius: 5px;
  font-size: 0.7rem;
  z-index: 1;
`;

const NavigationButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 2rem;
`;

const NavButton = styled.button`
  background: rgba(36, 37, 38, 0.8);
  border: none;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  
  &:hover:not(:disabled) {
    background: linear-gradient(90deg, #3081ed, #9b51e0);
    transform: translateY(-3px);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PageNumber = styled.div`
  position: absolute;
  bottom: 1rem;
  width: 100%;
  text-align: center;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
`;

// Sample data
const mockCollections = [
  {
    id: 'origin',
    name: 'Origin Babiez',
    description: 'The first 4000 Space Babiez ever created',
    coverImage: 'https://i.postimg.cc/HswdNhLx/image-10.png',
    cards: [
      { id: '1', name: 'Space Baby #3217', image: 'https://i.postimg.cc/HswdNhLx/image-10.png', rarity: 'Epic', attributes: { element: 'Fire', power: 78 } },
      { id: '2', name: 'Space Baby #4582', image: 'https://i.postimg.cc/pTmP1V9b/image-11.png', rarity: 'Rare', attributes: { element: 'Water', power: 62 } },
      { id: '3', name: 'Space Baby #1045', image: 'https://i.postimg.cc/cLTZxtwG/image-12.png', rarity: 'Legendary', attributes: { element: 'Void', power: 95 } },
      { id: '4', name: 'Space Baby #8733', image: 'https://i.postimg.cc/15hyJQs2/image-13.png', rarity: 'Common', attributes: { element: 'Earth', power: 45 } },
      { id: '5', name: 'Space Baby #2198', image: 'https://i.postimg.cc/tRVX3TQF/image-14.png', rarity: 'Uncommon', attributes: { element: 'Air', power: 55 } },
      null, // Empty slot
      null, // Empty slot
      null, // Empty slot
      null, // Empty slot
      null, // Empty slot
      null, // Empty slot
      null  // Empty slot
    ]
  },
  {
    id: 'collector',
    name: 'Collector Cards',
    description: 'Special edition collectible cards',
    coverImage: 'https://i.postimg.cc/cLTZxtwG/image-12.png',
    cards: [
      { id: '101', name: 'Cosmic Explorer', image: 'https://i.postimg.cc/tRVX3TQF/image-14.png', rarity: 'Epic', attributes: { set: 'Cosmos Explorers', power: 88 } },
      { id: '102', name: 'Star Guardian', image: 'https://i.postimg.cc/15hyJQs2/image-13.png', rarity: 'Rare', attributes: { set: 'Star Warriors', power: 72 } },
      null, // Empty slot
      null, // Empty slot
      null, // Empty slot
      null  // Empty slot
    ]
  }
];

const CollectorsAlbum = () => {
  const [currentCollection, setCurrentCollection] = useState(mockCollections[0]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isPageAnimating, setIsPageAnimating] = useState(false);
  const [flippedCards, setFlippedCards] = useState({});
  const [pageFlipped, setPageFlipped] = useState([]);
  const maxCardsPerPage = 6; // 3x2 grid
  const totalPages = Math.ceil(currentCollection.cards.length / maxCardsPerPage);
  
  // Initialize page flip state
  useEffect(() => {
    setPageFlipped(Array(totalPages).fill(false));
  }, [currentCollection, totalPages]);
  
  const switchCollection = (collectionId) => {
    const newCollection = mockCollections.find(c => c.id === collectionId);
    if (newCollection) {
      setCurrentCollection(newCollection);
      setCurrentPage(0);
      setFlippedCards({});
      setPageFlipped(Array(Math.ceil(newCollection.cards.length / maxCardsPerPage)).fill(false));
    }
  };
  
  const nextPage = () => {
    if (currentPage < totalPages - 1 && !isPageAnimating) {
      setIsPageAnimating(true);
      setTimeout(() => {
        setCurrentPage(currentPage + 1);
        const newPageFlipped = [...pageFlipped];
        newPageFlipped[currentPage] = true;
        setPageFlipped(newPageFlipped);
        setIsPageAnimating(false);
      }, 400); // Half of animation time
    }
  };
  
  const prevPage = () => {
    if (currentPage > 0 && !isPageAnimating) {
      setIsPageAnimating(true);
      setTimeout(() => {
        setCurrentPage(currentPage - 1);
        const newPageFlipped = [...pageFlipped];
        newPageFlipped[currentPage - 1] = false;
        setPageFlipped(newPageFlipped);
        setIsPageAnimating(false);
      }, 400); // Half of animation time
    }
  };
  
  const toggleCardFlip = (cardIndex) => {
    const adjustedIndex = currentPage * maxCardsPerPage + cardIndex;
    if (currentCollection.cards[adjustedIndex]) {
      setFlippedCards({
        ...flippedCards,
        [adjustedIndex]: !flippedCards[adjustedIndex]
      });
    }
  };
  
  const renderPage = (pageIndex) => {
    const startIdx = pageIndex * maxCardsPerPage;
    const pageCards = currentCollection.cards.slice(startIdx, startIdx + maxCardsPerPage);
    
    return (
      <CardsGrid>
        {pageCards.map((card, idx) => (
          <CardSlot key={idx} onClick={() => toggleCardFlip(idx)}>
            {card ? (
              <>
                <RarityBadge rarity={card.rarity}>
                  {card.rarity}
                </RarityBadge>
                <Card flipped={flippedCards[startIdx + idx]}>
                  <CardFront>
                    <img src={card.image} alt={card.name} />
                  </CardFront>
                  <CardBack>
                    <h4>{card.name}</h4>
                    {Object.entries(card.attributes).map(([key, value], attrIdx) => (
                      <span key={attrIdx}>{key}: {value}</span>
                    ))}
                  </CardBack>
                </Card>
              </>
            ) : (
              <CardFront empty>
                <EmptySlotText>Empty Slot</EmptySlotText>
              </CardFront>
            )}
          </CardSlot>
        ))}
      </CardsGrid>
    );
  };
  
  return (
    <AlbumContainer>
      <h1>Space Babiez Collector's Album</h1>
      
      <AlbumHeader>
        <AlbumInfo>
          <h2>{currentCollection.name}</h2>
          <p>{currentCollection.description}</p>
        </AlbumInfo>
        
        <FilterControls>
          {mockCollections.map(collection => (
            <FilterButton 
              key={collection.id}
              active={currentCollection.id === collection.id}
              onClick={() => switchCollection(collection.id)}
            >
              {collection.name}
            </FilterButton>
          ))}
        </FilterControls>
      </AlbumHeader>
      
      <BookContainer>
        <Book>
          <BookCover>
            <CoverImage>
              <img src={currentCollection.coverImage} alt={currentCollection.name} />
            </CoverImage>
            <h2>{currentCollection.name}</h2>
            <p>Flip through your collection of Space Babiez</p>
          </BookCover>
          
          <BookCover back>
            <h2>The End</h2>
            <p>Collect more Space Babiez to complete your album!</p>
          </BookCover>
          
          <BookPages>
            {Array.from({ length: totalPages }).map((_, idx) => (
              <Page 
                key={idx}
                isRight={true}
                isFlipped={pageFlipped[idx]}
                isAnimating={isPageAnimating && (idx === currentPage || idx === currentPage - 1)}
                zIndex={totalPages - idx}
              >
                <PageContent>
                  {renderPage(idx)}
                  <PageNumber>Page {idx + 1} of {totalPages}</PageNumber>
                </PageContent>
                
                <PageContent isBack>
                  {idx < totalPages - 1 ? renderPage(idx + 1) : null}
                  {idx < totalPages - 1 && <PageNumber>Page {idx + 2} of {totalPages}</PageNumber>}
                </PageContent>
              </Page>
            ))}
          </BookPages>
        </Book>
      </BookContainer>
      
      <NavigationButtons>
        <NavButton onClick={prevPage} disabled={currentPage === 0}>
          ← Previous Page
        </NavButton>
        <NavButton onClick={nextPage} disabled={currentPage >= totalPages - 1}>
          Next Page →
        </NavButton>
      </NavigationButtons>
    </AlbumContainer>
  );
};

export default CollectorsAlbum;
