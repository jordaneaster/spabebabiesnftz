import React, { lazy, Suspense } from 'react'
import styled from 'styled-components';


import Loading from '../Loading';
// import ConfettiComponent from '../Confetti';

const ConfettiComponent = lazy(() => import("../Confetti"));


const Section = styled.section`
min-height: 100vh;
width: 100vw;
background-color: ${props => props.theme.body};
position: relative;
background-image: url('https://i.postimg.cc/jSfQSN5k/bckgrnd1.png');
-webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
overflow: hidden;
`
const Title = styled.h1`
  font-size: ${(props) => props.theme.fontxxl};
  text-transform: capitalize;
  color: ${(props) => props.theme.text};
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 1rem auto;
  border-bottom: 2px solid ${(props) => props.theme.text};
  width: fit-content;

  @media (max-width: 40em){
    font-size: ${(props) => props.theme.fontxl};

}
`;

const Container = styled.div`
width: 75%;
margin: 2rem auto;

display: flex;
justify-content: space-between;
align-items: center;
flex-wrap: wrap;

@media (max-width: 64em){
width: 80%;
}
@media (max-width: 48em){
width: 90%;
justify-content: center;
}
`

const Item = styled.div`
width: calc(20rem - 4vw);
padding: 1rem 0;
color: ${props => props.theme.body};
margin: 2rem 1rem;
position: relative;
z-index:5;

backdrop-filter: blur(4px);

border: 2px solid ${props => props.theme.text};
border-radius: 20px;

&:hover{
  img{
    transform: translateY(-2rem) scale(1.2);
  }
}

@media (max-width: 30em){
width: 70vw;
}

`

const ImageContainer = styled.div`
width: 80%;
margin: 0 auto;
background-color:#242526;
border: 1px solid ${props => props.theme.text};
border-radius: 20px;
cursor: pointer;

img{
transition: all 0.3s ease;
}
`

const Name = styled.h2`
font-size: ${props => props.theme.fontlg};
display: flex;
align-items: center;
justify-content: center;
text-transform: uppercase;
color: ${props => props.theme.text};
margin-top: 1rem;
`

const Position = styled.h2`
font-size: ${props => props.theme.fontmd};
display: flex;
align-items: center;
justify-content: center;
text-transform: capitalize;
color: ${props => `rgba(${props.theme.textRgba},0.9)`};
font-weight:400;
`

const MemberComponent = ({img, name=" ",position=" "}) => {

  return(
    <Item>
      <ImageContainer>
        <img width={200} height={200}  src={img} alt={name} />
      </ImageContainer>
      <Name>{name}</Name>
      <Position>{position}</Position>
    </Item>
  )
}


const Team = () => {
  return (
    <Section id="team">
    <Suspense fallback={<Loading />}>
    <ConfettiComponent  /> </Suspense>
    <b style={{color:'#aeff00',marginTop:'0%',marginLeft:'0%',fontSize:'50px',
        fontFamily: 'flegrei',fontWeight: '300',fontStyle: 'normal'
        ,display: 'flex',justifyContent: 'center',alignItems: 'center'
    
    }}>THE MISFITS</b>
      <Container>
        <MemberComponent img="https://i.postimg.cc/GmQ6XVFR/image-Team-Dez.png"  name="Dez" position="Founder" />
        <MemberComponent img='https://i.postimg.cc/gcVLd4Sw/image-Team-Bazil.png'  name="Bazil" position="Lead Dev" />
        <MemberComponent img='https://i.postimg.cc/QtBPxMRN/image-Team-Jordan.png'  name="Jordan" position="Dev" />
        <MemberComponent img='https://i.postimg.cc/1RVhyWQ0/image-Team-Brenton.png'  name="Brenton" position="Community Manager" />
        <MemberComponent img='https://i.postimg.cc/fTYG9JkJ/image-Team-Crypto-Fran.png'  name="Crypto Fran" position="Community" />
        <MemberComponent img='https://i.postimg.cc/X7MMqwjR/image-Team-Godfather.png'  name="Godfather" position="Advisor" />
        <MemberComponent img='https://i.postimg.cc/cLZVM08T/image-Team-Jayne.png'  name="Jayne" position="Marketing" />
        <MemberComponent img='https://i.postimg.cc/q7vSSww3/image-Team-Mara-X.png'  name="Mara x" position="Marketer" />
        <MemberComponent img='https://i.postimg.cc/R0pyBtpb/image-Team-Oliver.png'  name="Oliver" position="Advisor" />
        <MemberComponent img='https://i.postimg.cc/4dr0Kgg6/image-Team-Rishi.png'  name="Rishi" position="Mod" />
        
        

      </Container>
    </Section>
  )
}

export default Team