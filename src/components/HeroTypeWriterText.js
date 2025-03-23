import React from 'react'
import styled from 'styled-components'
import Typewriter from 'typewriter-effect';

const Title = styled.h2`
  font-size: ${props => props.theme.fontlg};
  text-transform: capitalize;
  width: 80%;
  color: ${props => props.theme.text};
  align-self: flex-start;
  margin: 0 auto;
  text-align: center;
  
  span {
    text-transform: uppercase;
    font-family: 'flegrei', sans-serif;
    color: #aeff00;
  }
  
  .text-1 {
    color: #9b51e0;
  }
  .text-2 {
    color: #3081ed;
  }
  .text-3 {
    color: #aeff00;
  }
  
  @media (max-width: 70em) {
    font-size: ${props => props.theme.fontmd};
  }
  
  @media (max-width: 48em) {
    align-self: center;
    text-align: center;
  }
  
  @media (max-width: 40em) {
    width: 90%;
  }
`;

const HeroTypeWriterText = () => {
  return (
    <Title>
      <Typewriter
        options={{
          autoStart: true,
          loop: true,
        }}
        onInit={(typewriter) => {
          typewriter
            .typeString('<span class="text-1"> Rare Cosmic Baby</span>')
            .pauseFor(2000)
            .deleteAll()
            .typeString('<span class="text-2"> Intergalactic NFT</span>')
            .pauseFor(2000)
            .deleteAll()
            .typeString('<span class="text-3"> Universal Collectible</span>')
            .pauseFor(2000)
            .deleteAll()
            .typeString('<span> Digital Space Identity</span>')
            .pauseFor(2000)
            .deleteAll()
            .typeString('<span class="text-2"> Stellar Investment</span>')
            .pauseFor(2000)
            .deleteAll()
            .start();
        }}
      />
    </Title>
  );
}

export default HeroTypeWriterText;
