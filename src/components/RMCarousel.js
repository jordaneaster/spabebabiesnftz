import React, {useState} from 'react'
import styled from 'styled-components'
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-cards";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Popup from '../components/Popup';

import { Navigation, EffectCards } from "swiper";
import Arrow from '../assets/Arrow.svg';

const Container = styled.div`
width: 50vw;
height: auto;
overflow: hidden;
position: relative;
@media (max-width: 70em){
    height: auto;
}

@media (max-width: 64em){
    height: auto;
    width: 100%;
}
@media (max-width: 48em){
    height: auto;
    width: 100%;
}
@media (max-width: 30em){
    height: auto;
    width: 100%;
}

.swiper{
    width: 100%;
    height: auto;
}

.swiper-slide{
    background-color: ${props => props.theme.carouselColor};
    border-radius: 20px;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    cursor: pointer;

    &:hover .click-overlay {
      opacity: 1;
    }

    img{
        display: block;
        width: 100%;
        height: auto;
        object-fit: cover;
        
    }
}

.swiper-button-next{
    color: ${props => props.theme.text};
    right: 0;
    width: 4rem;
    top: 60%;
    
    background-image: url(${Arrow});
    background-position: center;
    background-size: cover;
    filter: drop-shadow(0px 0px 8px rgba(255, 255, 255, 0.7));
    opacity: 0.9;
    transition: all 0.3s ease;

    &:hover {
      transform: scale(1.1);
      opacity: 1;
      filter: drop-shadow(0px 0px 12px rgba(255, 255, 255, 0.9));
    }

    &:after{
        display: none;
    }

    @media (max-width: 64em){
    width: 3rem;

    }
    @media (max-width: 30em){
    width: 2rem;

    }
}
.swiper-button-prev{
    color: ${props => props.theme.text};
    left: 0;
    top: 60%;
    width: 4rem;
    transform: rotate(180deg);
    background-image: url(${Arrow});
    background-position: center;
    background-size: cover;
    filter: drop-shadow(0px 0px 8px rgba(255, 255, 255, 0.7));
    opacity: 0.9;
    transition: all 0.3s ease;

    &:hover {
      transform: rotate(180deg) scale(1.1);
      opacity: 1;
      filter: drop-shadow(0px 0px 12px rgba(255, 255, 255, 0.9));
    }

    &:after{
        display: none;
    }
    @media (max-width: 64em){
    width: 3rem;

    }
    @media (max-width: 30em){
    width: 2rem;

    }


}

.pulse-animation {
  animation: pulse 2s infinite;
  @keyframes pulse {
    0% {
      transform: scale(1);
      opacity: 0.7;
    }
    50% {
      transform: scale(1.05);
      opacity: 1;
    }
    100% {
      transform: scale(1);
      opacity: 0.7;
    }
  }
}

.navigation-hint {
  text-align: center;
  color: ${props => props.theme.text};
  font-size: 1rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
  opacity: 0.7;
}
`

const ClickOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.4);
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 10;
  
  .info-text {
    background-color: rgba(0, 0, 0, 0.7);
    padding: 10px 20px;
    border-radius: 30px;
    color: white;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .info-icon {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 2px solid white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
  }
`;

const RMCarousel = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isOpen2, setIsOpen2] = useState(false);
    const [isOpen3, setIsOpen3] = useState(false);
 
    const togglePopup = () => {
      setIsOpen(!isOpen);
    }
    
    const togglePopup2 = () => {
      setIsOpen2(!isOpen2);
    }
    
    const togglePopup3 = () => {
      setIsOpen3(!isOpen3);
    }

  return (
    <Container>
        <b style={{color:'#ff0066',marginTop:'0%',marginLeft:'0%',fontSize:'35px',
        fontFamily: 'flegrei',fontWeight: '300',fontStyle: 'normal'
        ,display: 'flex',justifyContent: 'center',alignItems: 'center'
    
    }}>THE JOURNEY 1.0</b>
        
        <div className="navigation-hint">
          Navigate using the arrows and click on images to learn more
        </div>
        
        <Swiper
        autoplay={{
            delay:2000000,
            disableOnInteraction:false,
        }}
        pagination={{
            type:'fraction',
        }}
        scrollbar={{
            draggable:true
        }}
        modules={[EffectCards, Navigation]}
        navigation={{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        }}
        effect={"cards"}
        grabCursor={true}
        className="mySwiper"
      >
        <SwiperSlide onClick={togglePopup}>  
          <img width={'100%'} src="https://i.postimg.cc/Kjps8R5h/EL.png" alt="The Weirdos" /> 
          <ClickOverlay className="click-overlay">
            <div className="info-text">
              <span className="info-icon">i</span>
              <span>Click for details</span>
            </div>
          </ClickOverlay>
        </SwiperSlide>
        
        <SwiperSlide onClick={togglePopup2}>  
          <img width={500} height={400} src="https://i.postimg.cc/QN0jLm1v/AV.png" alt="The Weirdos" />   
          <ClickOverlay className="click-overlay">
            <div className="info-text">
              <span className="info-icon">i</span>
              <span>Click for details</span>
            </div>
          </ClickOverlay>
        </SwiperSlide>
        
        <SwiperSlide onClick={togglePopup3}>  
          <img width={500} height={400} src="https://i.postimg.cc/rsc260wV/MVV.png" alt="The Weirdos" />   
          <ClickOverlay className="click-overlay">
            <div className="info-text">
              <span className="info-icon">i</span>
              <span>Click for details</span>
            </div>
          </ClickOverlay>
        </SwiperSlide>
        
        {/* <SwiperSlide>  <img width={500} height={400}  src={img4} alt="The Weirdos" />   </SwiperSlide>
        <SwiperSlide>  <img width={500} height={400}  src={img5} alt="The Weirdos" />   </SwiperSlide>
        <SwiperSlide>  <img width={500} height={400}  src={img6} alt="The Weirdos" />   </SwiperSlide>
        <SwiperSlide>  <img width={500} height={400}  src={img7} alt="The Weirdos" />   </SwiperSlide>
        <SwiperSlide>  <img width={500} height={400}  src={img8} alt="The Weirdos" />   </SwiperSlide>
        <SwiperSlide>  <img width={500} height={400}  src={img9} alt="The Weirdos" />   </SwiperSlide>
        <SwiperSlide>  <img width={500} height={400}  src={img10} alt="The Weirdos" />   </SwiperSlide> */}
      </Swiper>
      
      {/* Manually add more prominent arrows with pulse animation */}
      <div className="swiper-button-next pulse-animation"></div>
      <div className="swiper-button-prev pulse-animation"></div>
      
      <div>
   {isOpen && <Popup
      content={<>
        <b style={{color:'#aeff00 ',marginLeft:'30%',fontSize:'30px',
        fontFamily: 'flegrei',fontWeight: '400',fontStyle: 'normal',
        outline:'5px solid black'
    
    }}>ETHERLAND | PORTAL |</b><br/><br/><br/>
    <b style={{color:'#aeff00 ',fontSize:'20px',
        fontFamily: 'flegrei sans-serif'
    
    }}>ACTIVATE</b><br/><br/>
        <a style={{color:'white',fontFamily: 'DIN Condensed dark',fontWeight: '400',fontStyle: 'normal',}}>Space Babiez are finally old enough for their own Twitter and Instagram! Now we get to spend the rest of our live locked in a Discord. YAY....</a><br/>
        <br/><br/><b style={{color:'#aeff00 ',fontSize:'20px',
        fontFamily: 'flegrei sans-serif'
    
    }}>DEMONTRA'S PLAYGROUND</b><br/><br/>
        <a style={{color:'white',fontFamily: 'DIN Condensed dark',fontWeight: '400',fontStyle: 'normal',}}>In true university greek week fashion. te Guardianz will participate in interactive activities for prizes and WL spots to create new connections and define community values</a><br/>
        <br/><br/><b style={{color:'#aeff00 ',fontSize:'20px',
        fontFamily: 'flegrei sans-serif'
    
    }}>GUARDIANZ LANDING</b><br/><br/>
        <a style={{color:'white',fontFamily: 'DIN Condensed dark',fontWeight: '400',fontStyle: 'normal',}}>The holder's section of our website will open and allow Guardianz to access further Space Babiez functionns, utility and exclusive content</a><br/>
        <br/><br/><b style={{color:'#aeff00 ',fontSize:'20px',
        fontFamily: 'flegrei sans-serif'
    
    }}>ASTROM$LK</b><br/><br/>
        <a style={{color:'white',fontFamily: 'DIN Condensed dark',fontWeight: '400',fontStyle: 'normal',}}>The future of each Space Baby depends on it! M$LK is a social currency allowing you to level up through its usage and interact with our ecosystem</a><br/>
        <br/><br/><b style={{color:'#aeff00 ',fontSize:'20px',
        fontFamily: 'flegrei sans-serif'
    
    }}>WHITELIST MINT</b><br/>
      </>}
      handleClose={togglePopup}
    />}
  </div>




  <div>
   {isOpen2 && <Popup
      content={<>
        <b style={{color:'#6c00ff',marginLeft:'30%',fontSize:'30px',
        fontFamily: 'flegrei',fontWeight: '400',fontStyle: 'normal',
        outline:'5px solid black'
    
    }}>ASTROVERSE | PORTAL |</b><br/><br/><br/>
    <b style={{color:'#6c00ff',fontSize:'20px',
        fontFamily: 'flegrei sans-serif'
    
    }}>RELEASE JOURNEY 2.0</b><br/><br/>
        <b style={{color:'#6c00ff',fontSize:'20px',
        fontFamily: 'flegrei sans-serif'
    
    }}>3D CRYPTONIC SOUL GENERATOR</b><br/><br/>
        <a style={{color:'white',fontFamily: 'DIN Condensed dark',fontWeight: '400',fontStyle: 'normal',}}>This process jumpstarts the "soul" of our baby by revealing useful encryptions about your baby and transforms the 2D character into 3D version. These encryptions will assign attributes. power. and roles to each NFT that can be accessed once minted. Guardianz begin this process by completing an interactive story builder that will assign these unique encryptions to each baby to solidify its fate within the universe. These encryptions become important as the University develops and how it will ultimately operate</a><br/>
        <br/><br/><b style={{color:'#6c00ff',fontSize:'20px',
        fontFamily: 'flegrei sans-serif'
    
    }}>SPACE BABIEZ UNIVERZITY</b><br/><br/>
        <a style={{color:'white',fontFamily: 'DIN Condensed dark',fontWeight: '400',fontStyle: 'normal',}}>Independent whitepaper coming! Join the Discord</a><br/>
        <br/><br/><b style={{color:'#6c00ff',fontSize:'20px',
        fontFamily: 'flegrei sans-serif'
    
    }}>FRATZ</b><br/><br/>
        <a style={{color:'white',fontFamily: 'DIN Condensed dark',fontWeight: '400',fontStyle: 'normal',}}>Through the CSG Guardianz will be randomly separated into distinct groups to create
fraternity style clubs within the university, which will have specific roles with our DAO.
Each Frat will set their own guidelines and create an identity to build pride within the
university. Fratz will create an emblem in the essence of modern day fraternities and will
have full commercial rights. Guardianz will have the opportunity to create their own NFT
collections depending on the accolades achieved with their NFT. These collections will
expand the Space Babiez Univerze. More information in the SBU whitepaper</a><br/>
        <br/><br/>
      </>}
      handleClose={togglePopup2}
    />}
  </div>





  <div>
   {isOpen3 && <Popup
      content={<>
        <b style={{color:'#ff0066',marginLeft:'30%',fontSize:'30px',
        fontFamily: 'flegrei',fontWeight: '400',fontStyle: 'normal',
        outline:'5px solid black'
    
    }}>METROVERSE | PORTAL |</b><br/><br/><br/>
    <b style={{color:'#ff0066',fontSize:'20px',
        fontFamily: 'flegrei sans-serif'
    
    }}>PRE-SALE | PUBLIC SALE</b><br/><br/>
        <b style={{color:'#ff0066',fontSize:'20px',
        fontFamily: 'flegrei sans-serif'
    
    }}>BOARDING SCHOOL</b><br/><br/>
        <a style={{color:'white',fontFamily: 'DIN Condensed dark',fontWeight: '400',fontStyle: 'normal',}}>The interactive process of enrolling (staking) Babiez in fictional courses will begin.
Guardianz will be able to send their babiez to a special boarding school that will be hosted
on our dapp. At boarding school babiez can learn new skills and earn accolades that will
visibly attatch to your NFT, increasing it's utility and value. This process will be visible
through a progress bar.</a><br/>
        <br/><br/><b style={{color:'#ff0066',fontSize:'20px',
        fontFamily: 'flegrei sans-serif'
    
    }}>QR SPACEBAGZ | AIRDROPS | PHYSICAL GOODS</b><br/><br/>
        <a style={{color:'white',fontFamily: 'DIN Condensed dark',fontWeight: '400',fontStyle: 'normal',}}>Recieve free company airdrops for life, access to whitelists, stealth portals, and AstroMail.
These rare bags will have a probability of spawning after a certain period of time and the
probability will increase gradually for long time holders and holder's of rare NFT's. A Space
bag consists of two parts: a physical bag and the digital NFT. You must have a Spacebag to
recieve airdrops. Each bag will have a QR code that will connect to your personal Space
Babiez Profile and lore. More on this later.</a><br/>
        <br/><br/><b style={{color:'#ff0066',fontSize:'20px',
        fontFamily: 'flegrei sans-serif'
    
    }}>THE NURSERY</b><br/><br/>
        <a style={{color:'white',fontFamily: 'DIN Condensed dark',fontWeight: '400',fontStyle: 'normal',}}>Space Babiez will release Merch: Drop 1.0. We will utilize creators from our community to
design this line. Artists will recieve a percentage of royalties. Special section for those
holding rarities and other roles. We will develop a fan section for the Guardianz to list and manage their holdings</a><br/>
        <br/><br/>
      </>}
      handleClose={togglePopup3}
    />}
  </div>
    </Container>
  )
}

export default RMCarousel