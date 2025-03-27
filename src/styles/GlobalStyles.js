import { createGlobalStyle } from "styled-components";
import styled from "styled-components"; // Add this import
import "@fontsource/akaya-telivigala"
import "@fontsource/sora"

const GlobalStyles = createGlobalStyle`

${'' /* 
*{
    outline: 1px solid red !important;
} */}


*,*::before,*::after{
    margin: 0;
    padding: 0;
}

body{
    font-family: 'Sora', sans-serif;
    overflow-x: hidden;
    
}

h1,h2,h3,h4,h5,h6{
    margin: 0;
    padding: 0;
}
a{
    color: inherit;
    text-decoration:none;
}
*{
    -ms-overflow-style: none;
  }
  ::-webkit-scrollbar {
    display: none;
  }

  /* Added styles for rarity table */
  table {
    width: 100%;
    border-collapse: collapse;
  }
  
  th, td {
    text-align: left;
    padding: 8px;
  }
  
  tr:nth-child(even) {
    background-color: rgba(155, 81, 224, 0.1);
  }
  
  .rarity-badge {
    display: inline-block;
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 600;
  }
  
  .rarity-common {
    background-color: rgba(150, 150, 150, 0.3);
    color: #bdbdbd;
  }
  
  .rarity-uncommon {
    background-color: rgba(0, 200, 83, 0.3);
    color: #00c853;
  }
  
  .rarity-rare {
    background-color: rgba(33, 150, 243, 0.3);
    color: #2196f3;
  }
  
  .rarity-epic {
    background-color: rgba(156, 39, 176, 0.3);
    color: #9c27b0;
  }
  
  .rarity-legendary {
    background-color: rgba(255, 193, 7, 0.3);
    color: #ffc107;
  }
`

// Add or update these styles to ensure the nav elements are responsive
export const NavRight = styled.div`
  display: flex;
  align-items: center;
  
  @media (max-width: 768px) {
    margin-top: 15px;
    flex-direction: column;
    width: 100%;
  }
`;

export default GlobalStyles;