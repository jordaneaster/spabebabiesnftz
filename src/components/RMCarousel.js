import React, {useState} from 'react'
import styled from 'styled-components'
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-cards";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Popup from '../components/Popup';


import { Pagination, Navigation, Autoplay, EffectCards } from "swiper";


// import img4 from '../assets/Nfts/bighead-3.svg';
// import img5 from '../assets/Nfts/bighead-4.svg';
// import img6 from '../assets/Nfts/bighead-5.svg';
// import img7 from '../assets/Nfts/bighead-6.svg';
// import img8 from '../assets/Nfts/bighead-7.svg';
// import img9 from '../assets/Nfts/bighead-8.svg';
// import img10 from '../assets/Nfts/bighead-9.svg';

import Arrow from '../assets/Arrow.svg';


const Container = styled.div`
width: 50vw;
height: auto;
overflow: hidden;
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

`





const RMCarousel = () => {
    const [isOpen, setIsOpen] = useState(false);
 
    const togglePopup = () => {
      setIsOpen(!isOpen);
    }


    const [isOpen2, setIsOpen2] = useState(false);
 
    const togglePopup2 = () => {
      setIsOpen2(!isOpen2);
    }


    const [isOpen3, setIsOpen3] = useState(false);
 
    const togglePopup3 = () => {
      setIsOpen3(!isOpen3);
    }
    function butt(){
        
    }
  return (
    <Container>
        <b style={{color:'#ff0066',marginTop:'0%',marginLeft:'0%',fontSize:'35px',
        fontFamily: 'flegrei',fontWeight: '300',fontStyle: 'normal'
        ,display: 'flex',justifyContent: 'center',alignItems: 'center'
    
    }}>THE JOURNEY 1.0</b>
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
        modules={[EffectCards,Pagination, Navigation, Autoplay]}
        navigation={true}
        effect={"cards"}
        grabCursor={true}
        
        className="mySwiper"
      >

        
        <SwiperSlide onClick={togglePopup}>  <img width={'100%'}  src="https://i.postimg.cc/Kjps8R5h/EL.png" alt="The Weirdos" /> 
        </SwiperSlide>
        
        <SwiperSlide onClick={togglePopup2}>  <img width={500} height={400}  src="https://i.postimg.cc/QN0jLm1v/AV.png" alt="The Weirdos" />   </SwiperSlide>
        <SwiperSlide onClick={ togglePopup3}>  <img width={500} height={400}  src="https://i.postimg.cc/rsc260wV/MVV.png" alt="The Weirdos" />   </SwiperSlide>
        {/* <SwiperSlide>  <img width={500} height={400}  src={img4} alt="The Weirdos" />   </SwiperSlide>
        <SwiperSlide>  <img width={500} height={400}  src={img5} alt="The Weirdos" />   </SwiperSlide>
        <SwiperSlide>  <img width={500} height={400}  src={img6} alt="The Weirdos" />   </SwiperSlide>
        <SwiperSlide>  <img width={500} height={400}  src={img7} alt="The Weirdos" />   </SwiperSlide>
        <SwiperSlide>  <img width={500} height={400}  src={img8} alt="The Weirdos" />   </SwiperSlide>
        <SwiperSlide>  <img width={500} height={400}  src={img9} alt="The Weirdos" />   </SwiperSlide>
        <SwiperSlide>  <img width={500} height={400}  src={img10} alt="The Weirdos" />   </SwiperSlide> */}

      </Swiper>
      
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