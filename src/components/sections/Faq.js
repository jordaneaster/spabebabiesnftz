import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import React, { useLayoutEffect, useRef } from 'react'
import styled from 'styled-components';
import Accordion from '../Accordion';


const Section = styled.section`
min-height: 100vh;
height: auto;
width: 100vw;
background-color: ${props => props.theme.body};
position: relative;
color: ${(props) => props.theme.text};
overflow: hidden;


display: flex;
justify-content: center;
align-items: center;
flex-direction: column;
`
const Title = styled.h1`
  font-size: ${(props) => props.theme.fontxxl};
  text-transform: uppercase;
  color: ${(props) => props.theme.text};
  
  margin: 1rem auto;
  border-bottom: 2px solid ${(props) => props.theme.text};
  width: fit-content;

  @media (max-width: 48em){
  font-size: ${(props) => props.theme.fontxl};

  }
`;

const Container = styled.div`
width: 75%;
margin: 2rem auto;
color: ${(props) => props.theme.text};
display: flex;
justify-content: space-between;
align-content: center;

@media (max-width: 64em){
  width: 80%;
  }
  @media (max-width: 48em){
  width: 90%;
  flex-direction: column;

  &>*:last-child{
    &>*:first-child{

    margin-top: 0;
}

  }
  }
`
const Box = styled.div`
width: 45%;
color: ${(props) => props.theme.text};
@media (max-width: 64em){
  width: 90%;
  align-self: center;
  }

`

const Faq = () => {

const ref = useRef(null);
gsap.registerPlugin(ScrollTrigger);
useLayoutEffect(() => {
  
  let element = ref.current;

  ScrollTrigger.create({
    trigger: element,
    start:'bottom bottom',
    end:'bottom top',
    pin:true,   
    pinSpacing:false, 
    scrub:1,
    // markers:true,
  })

  return () => {
    ScrollTrigger.kill();
  };
}, [])

  return (
    <Section ref={ref} id="faq">
    <Title>Faq</Title>

    <Container>

<Box>
  <Accordion style={{color:'white'}} ScrollTrigger={ScrollTrigger} title="How many Space BABIEZ NFTZ will be in circulation?" >
  NO MORE than 5555 Space Babiez will ever be minted on the blockchain. All
announcements will happen in our Discord.   </Accordion>
  <Accordion ScrollTrigger={ScrollTrigger} title="How many traits and are there rarity tiers?" >
  160 traits<br/>
2 species<br/>
4 families<br/>
10 Galactic Guardian Alien Angels<br/>
5 unique 1 of 1s
  </Accordion>
  <Accordion ScrollTrigger={ScrollTrigger} title="What are the Space Babiez community values?" >
  Humanity. Transparency. Equality. Creativity. Everything that we do will rest on the
foundation of these core values. We want to foster a community of learners,
change-makers, and creators. Individuals with diverse life experiences who have
much to offer the world but have not found a support system to foster these skills.
We strive to create a feeling of family and we open our doors to anyone who has
ever been called too weird, not good enough, or left behind. We are more than our
circumstances.   </Accordion>
<Accordion ScrollTrigger={ScrollTrigger} title="Is the team doxxed?" >
YES, all 10 members
</Accordion>
</Box>
<Box>
<Accordion ScrollTrigger={ScrollTrigger} title="When is mint and how much is a Space Babiez NFT?" >
You will be able to use your NFT as an avatar in the Metaverse and our future video game. Holding also means that you are part of an exclusive network of investors and entrepreneurs.
  </Accordion>
  <Accordion ScrollTrigger={ScrollTrigger} title="How do I receive a whitelist spot?
" >
The grinding stops here! The easiest way to get on our whitelist is to participate in
Pledge Week. Receiving a qualifying score in our virtual whitelist game,
Demontra’s Playground, is another easy way to reserve your WL spot. Join our
Discord to participate
  </Accordion>
  <Accordion ScrollTrigger={ScrollTrigger} title="How can I use my NFT?
" >
Your NFT is many things. Besides being a fun art piece and an access pass to an
exclusive club of investors, educators, and entrepreneurs, your NFT will reveal
secret encryptions that will unlock even more utility, roles, and lore. You will be
able to use your NFT as an avatar in the Metaverse and our future video game.
Your NFT will also act as a ID badge for SBU that can be decorated with
accolades. Using your NFT and achieving goal will ultimately increase the value of
your NFT
  </Accordion>
  <Accordion ScrollTrigger={ScrollTrigger} title="What are your utilities?
" >
Underpromse. Over-deliver. On-going surprises. The value of the utility of the
Space Babiez can only be measured by the innovation and dedication of the team
and we are always strategizing new concepts and ideas. Join the Discord.
  </Accordion>
</Box>
    </Container>
    </Section>
  )
}

export default Faq