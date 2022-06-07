import React, { lazy, Suspense } from 'react'
import styled, { ThemeProvider } from 'styled-components'
// import Carousel from '../Carousel'
import Button from '../Button'
import {dark} from '../../styles/Themes';
import Loading from '../Loading';


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
background-image: url('https://i.postimg.cc/jSfQSN5k/bckgrnd1.png');
-webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;


`
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
`
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
`
 
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
`
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
  font-family: DIN Condensed dark;
  font-size: ${(props) => props.theme.fontmd};

}
@media (max-width: 40em){
  font-size: ${(props) => props.theme.fontmd};

}
@media (max-width: 30em){
  font-size: ${(props) => props.theme.fontsm};

}

`
const SubTextLight = styled.p`
  font-size: ${(props) => props.theme.fontmd};
  color: white;
  align-self: flex-start;
  width: 80%;
margin: 1rem auto;
font-weight:400;

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

`
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

`

const Oath = () => {
  return (
    <Section id="about">
      <Container>
        <Box> 
        <b style={{color:'#aeff00',marginTop:'0%',marginLeft:'0%',fontSize:'35px',
        fontFamily: 'flegrei',fontWeight: '300',fontStyle: 'normal'
        ,display: 'flex',justifyContent: 'center',alignItems: 'center'
    
    }}>GAURDIANZ OATH</b>
        <SubText style={{}}>
        We aim to create the most diverse group of misfits the NFT space has eve
Our goal is to break the stereotypes of humans naturally wanting to search for
differences instead of ways to reach the same goal differently. We want this
community to be a melting pot of the life experiences that can aid the next
member in their expedition through life. We want to show the world how the new
generation creates support systems that can go beyond family.

        </SubText>

        <SubText style={{}}>
        It is all of our duty in the NFT space to create opportunities and resources for
every brain that is capable of creativity and imagination, including ourselves.
Becoming a Guardian is more than being part of a club of diverse personalities; It
is a mindset, lifestyle, and commitment. It's knowing we are all special individuals
with unlimited potential and positive light to offer the universe. Let's foster each
other's gifts to create a world of magic for ourselves and others! This is a project
in more ways than one and we aim to win in humanity and the completion of each
iteration of our roadmap.

        </SubText>
         </Box>
      </Container>
    </Section>
  )
}

export default Oath