import React from "react";
import styled from "styled-components";
import Typewriter from "typewriter-effect";
import Button from './Button';

const Title = styled.h2`
  font-size: ${(props) => props.theme.fontxxl};
  text-transform: capitalize;
  width: 80%;
  padding-left:'10%';
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${(props) => props.theme.text};
  align-self: flex-start;

  span {
    text-transform: uppercase;
    font-family: DIN Condensed dark;
  }
  .text-1{
      color: #aeff00 ;
  }
  .text-2{
      color: #aeff00 ;
  }
  .text-3{
      color: #aeff00 ;
  }

  @media (max-width: 70em) {
    font-size: ${(props) => props.theme.fontxl};

  }
  @media (max-width: 48em) { 
    align-self: center;
    text-align:center;
  }
  @media (max-width: 40em){
    width: 90%;
  }

  
`;
const SubTitle = styled.h3`
  font-size: ${(props) => props.theme.fontlg};
  text-transform: capitalize;
  color: ${props => `rgba(${props.theme.textRgba}, 0.6)`};
  font-weight:600;
  margin-bottom: 1rem;
  width: 80%;
  align-self: flex-start;

  @media (max-width: 40em) {
    font-size: ${(props) => props.theme.fontmd};

  }

  @media (max-width: 48em) { 
    align-self: center;
    text-align:center;
  }
  
`

const ButtonContainer = styled.div`
 width: 80%;
  align-self: flex-start;

  @media (max-width: 48em) { 
    align-self: center;
    text-align:center;

    button{
      margin: 0 auto;
    }
  }

`
const TypeWriterText = () => {
  return (
    <>
        <Title>
      <Typewriter
        options={{
          autoStart: true,
          loop: true,
        }}
        onInit={(typewriter) => {
          typewriter
            .typeString(`<span class="text-1">Changing the Norm!</span>`)
            .pauseFor(2000)
            .deleteAll()
            .typeString(`<span class="text-2">Reimagine Education.</span>`)
            .pauseFor(2000)
            .deleteAll()
            .typeString(`<span class="text-3">Fostering Creativity.</span>`)
            .pauseFor(2000)
            .deleteAll()
            .start();
        }}
      />
      
    </Title>
    
    </>
  );
};

export default TypeWriterText;
