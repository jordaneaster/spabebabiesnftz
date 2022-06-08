import React, { lazy, Suspense } from 'react';
import styled, { ThemeProvider } from 'styled-components';
// import Carousel from '../Carousel'
import Button from '../Button';
import { dark } from '../../styles/Themes';
import Loading from '../Loading';
import { TextRotationAngleup } from '@mui/icons-material';
import bgr from '../../assets/media/BGR4.png';

const CoverVideo = lazy(() => import('../CoverVideo'));
const TypeWriterText = lazy(() => import('../TypeWriterText'));


const Carousel = lazy(() => import("../Carousel"));

const Section = styled.section`
min-height: 100vh;
width: 100%;
background-color: ${props => props.theme.body};
display: flex;
justify-content: center;
align-items: center;
position: relative;
overflow: hidden;
background-image: url(${bgr});
-webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;


`;
const Container = styled.div`
width: 75%;
margin: 0 auto;
/* background-color: lightblue; */

display: flex;
justify-content: center;
align-items: center;
@media (max-width: 70em){
  width: 85%;
}

@media (max-width: 64em){
  width: 100%;
  flex-direction: column;

  &>*:last-child{
    width: 80%;
  }
}
@media (max-width: 40em){
  

  &>*:last-child{
    width: 90%;
  }
}
`;
const Box = styled.div`
width: 100%;
height: 100%;
min-height: 60vh;
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;

@media (max-width: 40em){
  min-height: 50vh;
}
`;

const Title = styled.h2`
  font-size: ${(props) => props.theme.fontxxl};
  text-transform: capitalize;
  color: white;
  align-self: flex-start;
  width: 80%;
  
margin: 0 auto;

@media (max-width: 64em){
  width: 100%;
  text-align:center;
}
@media (max-width: 40em){
  font-size: ${(props) => props.theme.fontxl};

}
@media (max-width: 30em){
  font-size: ${(props) => props.theme.fontlg};

}
`;
const SubText = styled.a`
  font-size: ${(props) => props.theme.fontlg};
  color: white;
  align-self: flex-start;
  width: 80%;
margin: 1rem auto;
font-weight:400;
@media (max-width: 64em){
  width: 100%;
  text-align:center;
  font-size: ${(props) => props.theme.fontmd};
  font-family: 'novecento-sans, sansSerif', font-weight: '700', font-style: 'normal'
}
@media (max-width: 40em){
  font-size: ${(props) => props.theme.fontmd};
  font-family: 'novecento-sans, sansSerif', font-weight: '700', font-style: 'normal'
}
@media (max-width: 30em){
  font-size: ${(props) => props.theme.fontsm};
  font-family: 'novecento-sans, sansSerif', font-weight: '700', font-style: 'normal'
}

`;

const SubTextLight = styled.p`
  font-size: ${(props) => props.theme.fontmd};
  color: white;
  text-align: left;
  align-self: flex-start;
  width: 80%;
margin: 1rem auto;
font-weight:400;
font-family: DIN Condensed light;

@media (max-width: 64em){
  width: 100%;
  text-align:center;
  font-size: ${(props) => props.theme.fontsm};

}
@media (max-width: 40em){
  font-size: ${(props) => props.theme.fontsm};

}
@media (max-width: 30em){
  font-size: ${(props) => props.theme.fontxs};
}

`;
const ButtonContainer = styled.div`
 width: 80%;
 margin: 1rem auto;
 display: flex;
  align-self: flex-start;

  @media (max-width: 64em){
width: 100%;

button{
  margin: 0 auto;
}
}

`;

const About = () => {
  return (
    <Section id="about">
      <Container>
        <Box>
          <Title style={{
            marginTop: '1.5rem',
            color: 'white',
            fontFamily: 'flegrei', fontWeight: '400', fontStyle: 'normal', display: 'flex', justifyContent: 'center', alignItems: 'center'
          }}>
            A BRAND | A VIBE | A CODE
          </Title>
          <SubText style={{ fontFamily: 'novecento-sans, sansSerif', fontWeight: '700', fontStyle: 'normal' }}>
            <b style={{
              color: '#aeff00',
              fontFamily: 'novecento-sans, sansSerif', fontWeight: '700', fontStyle: 'normal'
            }}>SPACE BABIEZ NFT</b> | exploring the limits of education through blockchain
          </SubText>

          <Box style={{ marginTop: "-15%", display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Suspense fallback={<Loading />}>
              <TypeWriterText /></Suspense>
          </Box>
          <Box style={{ width: '70%', marginLeft: '20%', marginTop: '-10%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Suspense fallback={<Loading />}>
              <CoverVideo style={{}} /></Suspense>
          </Box>
          <br /><br /><br /><br /> <b style={{
            color: '#aeff00', marginLeft: '0%', marginTop: '-5%', fontSize: '30px',
            fontFamily: 'flegrei', fontWeight: '400', fontStyle: 'normal',
            textAlign: 'center'

          }}>WHAT ABOUT THE KIDZ?</b><br />
          <SubText style={{ textAlign: "left", fontFamily: 'novecento-sans, sansSerif', fontWeight: '700', fontStyle: 'normal' }}>
            A collection of no more than 5555 hand drawn digital collectibles
            with physical and digital utility. The Space Babiez NFTZ Project is
            a unique perspective on learning that creates a supportive
            platform for NFT creators and ensures disadvantaged individuals
            have access to developing technology, evolving art, and
            alternative learning opportunities. Our primary focus is curating
            a decentralized education platform through the Metaverse and
            NFTs. Using this as our inspiration we have created the Space
            Babiez University.

          </SubText>
          <b style={{
            color: '#aeff00', marginLeft: '0%', fontSize: '30px',
            fontFamily: 'flegrei', fontWeight: '400', fontStyle: 'normal',
            textAlign: 'center'
          }}>WHAT IS SPACE BABIEZ UNIVERZITY?</b>
          <SubText style={{ textAlign: "left", fontFamily: 'novecento-sans, sansSerif', fontWeight: '700', fontStyle: 'normal' }}>
            A decentralized Meta-campus that will also house our
            community space called Guardianz Landing. SBU offers master
            courses, workshops, education, and resources on a wide-range
            of subjects, that will allow individuals to achieve real-world
            success in a gamified setting.
            The primary goal of SBU is to create is to create a platform for
            new NFT creators and individuals who want to learn new skills
            who may not have the opportunity due to circumnstance.

          </SubText>

          <SubText style={{ textAlign: "left", fontFamily: 'novecento-sans, sansSerif', fontWeight: '700', fontStyle: 'normal' }}>
            Long term, our charitble efforts include creating an interactive
            learning experience that will allow underprivileged kids to
            acquire the necessary education, skills, and resources to
            We will start to foster and envision Guardianz Landing in our
            Discord. Collaborations with educators, artists, developers, and
            other creative experts will be fostered to create an eclectic
            curriculum. From art to tech and everything in between!

          </SubText>
        </Box>
      </Container>
    </Section>
  );
};

export default About;