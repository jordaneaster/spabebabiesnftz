import React, { lazy, Suspense } from 'react'
import styled, { ThemeProvider } from 'styled-components'
// import Carousel from '../Carousel'
import Button from '../Button'
import {dark} from '../../styles/Themes';
import Loading from '../Loading';
import Popup from 'reactjs-popup';


const Carousel = lazy(() => import("../RMCarousel"));

const Section = styled.section`
min-height: 100vh;
width: 100%;
background-color: ${props => props.theme.text};
display: flex;
justify-content: center;
align-items: center;
position: relative;
overflow: hidden;

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
width: 50%;
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
  color: ${(props) => props.theme.body};
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
const SubText = styled.p`
  font-size: ${(props) => props.theme.fontlg};
  color: ${(props) => props.theme.body};
  align-self: flex-start;
  width: 80%;
margin: 1rem auto;
font-weight:400;
@media (max-width: 64em){
  width: 100%;
  text-align:center;
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
  color: ${(props) => `rgba(${props.theme.bodyRgba},0.6)`};
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
const modal=styled.Popup`
.modal {
  background-color:black;
  font-size: 20px;
}
.modal > .header {
  width: 100%;
  border-bottom: 1px solid gray;
  font-size: 18px;
  text-align: center;
  padding: 5px;
}
.modal > .content {
  width: 100%;
  padding: 10px 5px;
}
.modal > .actions {
  width: 100%;
  padding: 10px 5px;
  margin: auto;
  text-align: center;
}
.modal > .close {
  cursor: pointer;
  position: absolute;
  display: block;
  padding: 2px 5px;
  line-height: 20px;
  right: -10px;
  top: -10px;
  font-size: 24px;
  background: #ffffff;
  border-radius: 18px;
  border: 1px solid #cfcece;
}
`
const Rm = () => {
  return (
    <Section id="about">
      <Container>
        <Box> 
        <Suspense fallback={<Loading />}>
          <Carousel /> </Suspense> 
          
          <Popup style={{
                   
          }}
    trigger={<button className="button"> Open Modal </button>}
    modal
    nested
  >
    {close => (
      <div className="modal" style={{ 
        fontSize: '15px',
        background:'black',
        width:'50%',
        marginLeft:'25%',
        border: '0px solid',
        borderRadius:'6%'
      }}>
        <button className="close" style={{
          cursor: 'pointer',
          position: 'absolute',
          display: 'block',
          padding: '2px 5px',
          lineHeight: '20px',
          right: '-10px',
          top: '-10px',
          fontSize: '24px',
          background: '#ffffff',
          borderRadius: '18px',
          border: '1px solid #cfcece'
        }} onClick={close}>
          &times;
        </button>
       
        <div className="header" style={{ width: '100%', borderBottom: '1px solid gray',  fontSize: '18px',textAlign: 'center', padding: '5px'}}> Modal Title </div>
        <div className="content" style={{
          width: '100%',
          padding: '10px 5px',
          color:'White',
        }}>
          {' '}
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque, a nostrum.
          Dolorem, repellat quidem ut, minima sint vel eveniet quibusdam voluptates
          delectus doloremque, explicabo tempore dicta adipisci fugit amet dignissimos?
          <br />
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequatur sit
          commodi beatae optio voluptatum sed eius cumque, delectus saepe repudiandae
          explicabo nemo nam libero ad, doloribus, voluptas rem alias. Vitae?
        </div>
        <div className="actions" style={{
            width: '100%',
            padding: '10px 5px',
            margin: 'auto',
            textAlign: 'center',
        }}>
          <button
            className="button"
            onClick={() => {
              console.log('modal closed ');
              close();
            }}
          >
            close modal
          </button>
        </div>
      </div>
    )}
  </Popup>
          </Box>

      </Container>
    </Section>
  )
}

export default Rm