import React, { useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';

import ETH from '../../assets/icons8-ethereum-48.png';
import bgr from '../../assets/media/BGR3.png';

const Section = styled.section`
min-height: 100vh;
width: 100vw;
background-color: ${props => props.theme.body};
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
position: relative;
overflow: hidden;
background-image: url(${bgr});
&>*:first-child{
  animation-duration: 20s;

  @media (max-width: 30em){
    animation-duration: 15s;

  }
}
&>*:last-child{
  animation-duration: 15s;
  @media (max-width: 30em){
    animation-duration: 10s;

  }
}
`;
const move = keyframes`
0%{ transform: translateX(100%)   };
100%{ transform: translateX(-100%)   }

`;

const Row = styled.div`
/* background-color: lightblue; */
white-space: nowrap;
box-sizing:content-box;
margin: 2rem 0;
display: flex;

animation: ${move}  linear infinite ${props => props.direction};


`;
const ImgContainer = styled.div`
width: 15rem;
margin: 0 1rem;
background-color:#242526;

border-radius: 0px;
cursor: pointer;

@media (max-width: 48em){
  width: 12rem;
  }
  @media (max-width: 30em){
  width: 10rem;
  }

img{
  width: 100%;
  height: auto;
}
`;

const Details = styled.div`
display: flex;
justify-content: space-between;
padding: 0.8rem 1rem;
background-color: ${props => props.theme.text};
border: 2px solid ${props => `rgba(${props.theme.bodyRgba},0.5)`};

border-bottom-left-radius: 0px;
border-bottom-right-radius: 0px;

span{
  font-size: ${props => props.theme.fontsm};
  color:${props => `rgba(${props.theme.bodyRgba},0.5)`};
  font-weight:600;
  line-height: 1.5rem;
}

h1{
  font-size: ${props => props.theme.fontmd};
  color: ${props => props.theme.body};
  font-weight:600;

  @media (max-width: 30em){
    font-size: ${props => props.theme.fontsm};

  }

}

`;

const Price = styled.div`
display: flex;
justify-content: flex-start;
align-items: center;

img{
  width: 1rem;
  height: auto;

}
`;

const NftItem = ({ img, number = 0, price = 0, passRef }) => {

  let play = (e) => {
    passRef.current.style.animationPlayState = 'running';
  };
  let pause = (e) => {
    passRef.current.style.animationPlayState = 'paused';
  };


  return (
    <ImgContainer onMouseOver={e => pause(e)} onMouseOut={e => play(e)}  >
      <img width={500} height={400} src={img} alt="The Weirdos" />
      <Details>
        <div>
          <span>Babiez</span> <br />
          <h1>#{number}</h1>
        </div>

        <div>
          <span>Price</span>
          <Price>
            <img width={200} height={200} src={ETH} alt="ETH" />
            <h1>{Number(price).toFixed(1)}</h1>
          </Price>
        </div>
      </Details>
    </ImgContainer>
  );
};

const CallToAction = styled.div`
  width: 80%;
  max-width: 1200px;
  margin: 2rem auto;
  padding: 2.5rem;
  background-color: rgba(36, 37, 38, 0.9);
  border-radius: 12px;
  border: 2px solid ${props => props.theme.text};
  box-shadow: 0 0 25px rgba(0, 0, 0, 0.6);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  
  @media (max-width: 48em) {
    width: 90%;
    padding: 1.5rem;
  }
`;

const Title = styled.h2`
  font-size: ${props => props.theme.fontxxl};
  color: ${props => props.theme.text};
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  
  @media (max-width: 48em) {
    font-size: ${props => props.theme.fontlg};
  }
`;

const Description = styled.p`
  font-size: ${props => props.theme.fontmd};
  color: ${props => `rgba(${props.theme.textRgba}, 0.9)`};
  margin-bottom: 2rem;
  max-width: 800px;
  line-height: 1.6;
  
  @media (max-width: 48em) {
    font-size: ${props => props.theme.fontsm};
  }
`;

const Button = styled.button`
  padding: 1.2rem 2.5rem;
  background: linear-gradient(90deg, #9b51e0 0%, #3081ed 100%);
  color: white;
  font-size: ${props => props.theme.fontmd};
  font-weight: 700;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  letter-spacing: 1px;
  text-transform: uppercase;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 7px 15px rgba(155, 81, 224, 0.4);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  @media (max-width: 48em) {
    padding: 1rem 2rem;
    font-size: ${props => props.theme.fontsm};
  }
`;

const HighlightSpan = styled.span`
  color: #9b51e0;
  font-weight: 700;
`;

const EtherlandCTA = () => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    // Force a full page reload to /etherland instead of using React Router
    window.location.href = '/etherland';
  };

  return (
    <CallToAction>
      <Title>Discover Your Cosmic Identity</Title>
      <Description>
        Unlock your unique <HighlightSpan>Space Baby Soul</HighlightSpan> and join the intergalactic community. 
        Each soul is algorithmically generated with rare cosmic traits that determine your position in the Etherland. 
        Mint now to secure your place in this expanding digital universe!
      </Description>
      <Button onClick={handleNavigate}>
        Begin Soul Journey
      </Button>
    </CallToAction>
  );
};

const Showcase = () => {
  const Row1Ref = useRef(null);
  const Row2Ref = useRef(null);

  return (
    <Section id="showcase">
      <EtherlandCTA />
      <Row direction="none" ref={Row1Ref}>
        <NftItem img="https://i.postimg.cc/HswdNhLx/image-10.png" number={852} price={1} passRef={Row1Ref} />
        <NftItem img='https://i.postimg.cc/pTmP1V9b/image-11.png' number={123} price={1.2} passRef={Row1Ref} />
        <NftItem img='https://i.postimg.cc/cLTZxtwG/image-12.png' number={456} price={2.5} passRef={Row1Ref} />
        <NftItem img='https://i.postimg.cc/15hyJQs2/image-13.png' number={666} price={3.5} passRef={Row1Ref} />
        <NftItem img='https://i.postimg.cc/tRVX3TQF/image-14.png' number={452} price={4.7} passRef={Row1Ref} />


      </Row>
      <Row direction="reverse" ref={Row2Ref}>
        <NftItem img='https://i.postimg.cc/d0tsrjw0/image-6.png' number={888} price={1.2} passRef={Row2Ref} />
        <NftItem img='https://i.postimg.cc/3x3YQFyZ/image-7.png' number={211} price={3.2} passRef={Row2Ref} />
        <NftItem img='https://i.postimg.cc/XvHV8BYk/image-8.png' number={455} price={1.8} passRef={Row2Ref} />
        <NftItem img='https://i.postimg.cc/50DfccvH/image-9.png' number={456} price={5.1} passRef={Row2Ref} />
        <NftItem img='https://i.postimg.cc/mrTKLzxh/image-25.png' number={865} price={3.7} passRef={Row2Ref} />


      </Row>
    </Section>
  );
};

export default Showcase;