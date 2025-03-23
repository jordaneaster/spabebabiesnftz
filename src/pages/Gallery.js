import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
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
  margin-bottom: 1rem;
  text-align: center;
  
  @media (max-width: 48em) {
    font-size: ${props => props.theme.fontxl};
  }
`;

const Subtitle = styled.h2`
  font-size: ${props => props.theme.fontlg};
  color: ${props => props.theme.text};
  margin-bottom: 2rem;
  text-align: center;
  opacity: 0.8;
  
  @media (max-width: 48em) {
    font-size: ${props => props.theme.fontmd};
  }
`;

const FiltersContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2rem;
`;

const FilterButton = styled.button`
  background: ${props => props.active ? 'linear-gradient(90deg, #9b51e0 0%, #3081ed 100%)' : 'rgba(48, 129, 237, 0.1)'};
  border: ${props => props.active ? 'none' : '1px solid #3081ed'};
  border-radius: 50px;
  padding: 0.5rem 1.5rem;
  color: white;
  font-size: ${props => props.theme.fontsm};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 10px rgba(48, 129, 237, 0.3);
  }
`;

const SortContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  
  @media (max-width: 48em) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const SortSelect = styled.select`
  background: rgba(48, 129, 237, 0.1);
  border: 1px solid #3081ed;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  color: white;
  font-size: ${props => props.theme.fontsm};
  cursor: pointer;
`;

const BabiesCount = styled.div`
  font-size: ${props => props.theme.fontmd};
  color: rgba(255, 255, 255, 0.7);
`;

const BabiesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const BabyCard = styled.div`
  background: rgba(36, 37, 38, 0.5);
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
    margin-bottom: 0.5rem;
  }
`;

const Owner = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.8rem;
  font-size: ${props => props.theme.fontsm};
  color: rgba(255, 255, 255, 0.5);
  
  span {
    color: #3081ed;
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

const RarityBadge = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  background: ${props => {
    switch(props.rarity) {
      case 'Common': return 'rgba(100, 100, 100, 0.7)';
      case 'Uncommon': return 'rgba(40, 167, 69, 0.7)';
      case 'Rare': return 'rgba(0, 123, 255, 0.7)';
      case 'Epic': return 'rgba(111, 66, 193, 0.7)';
      case 'Legendary': return 'rgba(255, 193, 7, 0.7)';
      default: return 'rgba(100, 100, 100, 0.7)';
    }
  }};
  color: white;
  padding: 0.2rem 0.8rem;
  border-radius: 50px;
  font-size: ${props => props.theme.fontsm};
  font-weight: bold;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2rem;
`;

const PageButton = styled.button`
  background: ${props => props.active ? 'linear-gradient(90deg, #9b51e0 0%, #3081ed 100%)' : 'rgba(48, 129, 237, 0.1)'};
  border: none;
  border-radius: 5px;
  padding: 0.5rem 1rem;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.active ? 'linear-gradient(90deg, #9b51e0 0%, #3081ed 100%)' : 'rgba(48, 129, 237, 0.2)'};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  width: 100%;
`;

const NoResultsMessage = styled.div`
  text-align: center;
  padding: 3rem;
  color: rgba(255, 255, 255, 0.7);
  
  h3 {
    font-size: ${props => props.theme.fontlg};
    margin-bottom: 1rem;
  }
`;

const Gallery = () => {
  const [allBabies, setAllBabies] = useState([]);
  const [displayedBabies, setDisplayedBabies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const babiesPerPage = 12;
  
  useEffect(() => {
    const fetchAllBabies = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from(TABLES.BABIES)
          .select('*')
          .eq('soul_generation_complete', true)
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error("Error fetching space babies:", error);
          throw error;
        }
        
        console.log("Fetched babies from database:", data?.length || 0);
        
        // Filter out entries without images
        const validBabies = data.filter(baby => baby.image_url);
        console.log("Valid babies with images:", validBabies?.length || 0);
        
        setAllBabies(validBabies);
        
        // Apply initial filters and sort
        applyFiltersAndSort(validBabies, activeFilter, sortBy);
        setIsLoading(false);
      } catch (error) {
        console.error("Error in fetchAllBabies:", error);
        setIsLoading(false);
      }
    };
    
    fetchAllBabies();
  }, []);
  
  // Apply filters and sorting
  const applyFiltersAndSort = (babies, filter, sort) => {
    let filtered = [...babies];
    
    // Apply filter
    if (filter !== 'all') {
      filtered = filtered.filter(baby => 
        baby.attributes && baby.attributes.rarity === filter
      );
    }
    
    // Apply sort
    if (sort === 'newest') {
      filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (sort === 'oldest') {
      filtered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    } else if (sort === 'power') {
      filtered.sort((a, b) => 
        (b.attributes?.cosmicPower || 0) - (a.attributes?.cosmicPower || 0)
      );
    }
    
    // Calculate total pages
    const pages = Math.ceil(filtered.length / babiesPerPage);
    setTotalPages(pages || 1);
    
    // Reset to first page if filter/sort changes
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
    
    // Get babies for current page
    const start = 0;
    const end = babiesPerPage;
    setDisplayedBabies(filtered.slice(start, end));
  };
  
  // Handle filter change
  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    applyFiltersAndSort(allBabies, filter, sortBy);
  };
  
  // Handle sort change
  const handleSortChange = (e) => {
    const newSort = e.target.value;
    setSortBy(newSort);
    applyFiltersAndSort(allBabies, activeFilter, newSort);
  };
  
  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    
    // Apply current filter and sort to full dataset
    let filtered = [...allBabies];
    
    if (activeFilter !== 'all') {
      filtered = filtered.filter(baby => 
        baby.attributes && baby.attributes.rarity === activeFilter
      );
    }
    
    // Apply current sort
    if (sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (sortBy === 'oldest') {
      filtered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    } else if (sortBy === 'power') {
      filtered.sort((a, b) => 
        (b.attributes?.cosmicPower || 0) - (a.attributes?.cosmicPower || 0)
      );
    }
    
    // Get babies for selected page
    const start = (page - 1) * babiesPerPage;
    const end = start + babiesPerPage;
    setDisplayedBabies(filtered.slice(start, end));
  };
  
  // Format wallet address for display
  const formatWalletAddress = (address) => {
    if (!address) return "Unknown Owner";
    return `${address.substring(0, 4)}...${address.substring(address.length - 4)}`;
  };
  
  return (
    <Section>
      <Navbar /> {/* Add the Navbar component */}
      <Container>
        <Title>Space Babiez Gallery</Title>
        <Subtitle>Explore all the minted Space Babies in the cosmos</Subtitle>
        
        <FiltersContainer>
          <FilterButton 
            active={activeFilter === 'all'}
            onClick={() => handleFilterChange('all')}
          >
            All
          </FilterButton>
          <FilterButton 
            active={activeFilter === 'Common'}
            onClick={() => handleFilterChange('Common')}
          >
            Common
          </FilterButton>
          <FilterButton 
            active={activeFilter === 'Uncommon'}
            onClick={() => handleFilterChange('Uncommon')}
          >
            Uncommon
          </FilterButton>
          <FilterButton 
            active={activeFilter === 'Rare'}
            onClick={() => handleFilterChange('Rare')}
          >
            Rare
          </FilterButton>
          <FilterButton 
            active={activeFilter === 'Epic'}
            onClick={() => handleFilterChange('Epic')}
          >
            Epic
          </FilterButton>
          <FilterButton 
            active={activeFilter === 'Legendary'}
            onClick={() => handleFilterChange('Legendary')}
          >
            Legendary
          </FilterButton>
        </FiltersContainer>
        
        <SortContainer>
          <BabiesCount>{allBabies.length} Space Babies found</BabiesCount>
          
          <div>
            <SortSelect value={sortBy} onChange={handleSortChange}>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="power">Highest Power</option>
            </SortSelect>
          </div>
        </SortContainer>
        
        {isLoading ? (
          <LoadingContainer>
            <p>Loading Space Babies...</p>
          </LoadingContainer>
        ) : displayedBabies.length === 0 ? (
          <NoResultsMessage>
            <h3>No Space Babies Found</h3>
            <p>Try changing your filter settings</p>
          </NoResultsMessage>
        ) : (
          <>
            <BabiesGrid>
              {displayedBabies.map((baby, index) => (
                <BabyCard key={baby.id || index}>
                  <BabyImage style={{ position: 'relative' }}>
                    <img src={baby.image_url} alt={baby.name || "Space Baby"} />
                    {baby.attributes?.rarity && (
                      <RarityBadge rarity={baby.attributes.rarity}>
                        {baby.attributes.rarity}
                      </RarityBadge>
                    )}
                  </BabyImage>
                  <BabyInfo>
                    <h3>{baby.name || `Space Baby #${index + 1}`}</h3>
                    <p>Created: {new Date(baby.created_at).toLocaleDateString()}</p>
                    
                    <div style={{ marginTop: '0.8rem' }}>
                      {baby.attributes && Object.entries(baby.attributes)
                        .filter(([key]) => key !== 'rarity')
                        .slice(0, 2)
                        .map(([key, value]) => (
                          <AttributeTag key={key}>
                            {key}: {value}
                          </AttributeTag>
                        ))}
                    </div>
                    
                    <Owner>
                      Owner: <span>{formatWalletAddress(baby.wallet_address)}</span>
                    </Owner>
                  </BabyInfo>
                </BabyCard>
              ))}
            </BabiesGrid>
            
            <PaginationContainer>
              <PageButton 
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                &lt;
              </PageButton>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(page => (
                  page === 1 || 
                  page === totalPages || 
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ))
                .map((page, index, array) => {
                  // Add ellipsis
                  if (index > 0 && array[index - 1] !== page - 1) {
                    return (
                      <React.Fragment key={`ellipsis-${page}`}>
                        <span style={{ color: 'white', alignSelf: 'center' }}>...</span>
                        <PageButton 
                          active={page === currentPage}
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </PageButton>
                      </React.Fragment>
                    );
                  }
                  return (
                    <PageButton 
                      key={page}
                      active={page === currentPage}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </PageButton>
                  );
                })}
              
              <PageButton 
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                &gt;
              </PageButton>
            </PaginationContainer>
          </>
        )}
      </Container>
    </Section>
  );
};

export default Gallery;
