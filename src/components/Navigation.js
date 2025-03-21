import React,{useState} from 'react'
import styled from 'styled-components'
import Button from './Button'
import Logo from './Logo'
import Btn from './Btn'
import { Link, useLocation } from 'react-router-dom';

const Section = styled.section`
width: 100vw;
background-color: ${props => props.theme.body};


`
const NavBar = styled.nav`
display: flex;
justify-content: space-between;
align-items: center;
background-image: url('https://i.postimg.cc/jSfQSN5k/bckgrnd1.png');
-webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;

width: 100%;
height: ${props => props.theme.navHeight};
margin: 0 auto;

.mobile{
  display: none;
}

@media (max-width: 64em) {
.desktop{
  display: none;
}
.mobile{
  display: inline-block;
}

}


`
const Menu = styled.ul`
display: flex;
justify-content: space-between;
align-items: center;
list-style:none;


@media (max-width: 64em) {
/* 1024 px */



position: fixed;
top: ${props => props.theme.navHeight};
left: 0;
right: 0;
bottom: 0;
width: 100vw;
height: ${props => `calc(100vh - ${props.theme.navHeight})`};
z-index:50;
background-color: ${props => `rgba(${props.theme.bodyRgba},0.85)`};
backdrop-filter: blur(2px);

transform: ${props => props.click ? 'translateY(0)' : `translateY(1000%)`};
transition: all 0.3s ease;
flex-direction: column;
justify-content: center;

touch-action: none;


}

`

const MenuItem = styled.li`
margin: 0 1rem;
color: ${props => props.theme.text};
cursor: pointer;

&::after{
  content: ' ';
  display: block;
  width: 0%;
  height: 2px;
  background: ${props => props.theme.text};
  transition: width 0.3s ease;
}
&:hover::after{
  width: 100%;
}

@media (max-width: 64em) {
margin: 1rem 0;

&::after{
  display: none;
}

}
`
const HamburgerMenu = styled.span`
width:  ${props => props.click ? '2rem' : '1.5rem'};

height: 2px;
background: ${props => props.theme.text};

position: absolute;
top: 2rem;
left: 50%;
transform: ${props => props.click ? 'translateX(-50%) rotate(90deg)' : 'translateX(-50%) rotate(0)'  };

display: none;
justify-content: center;
align-items: center;

cursor: pointer;
transition: all 0.3s ease;

@media (max-width: 64em) {
/* 1024 px */
display: flex;

}

&::after, &::before{
  content: ' ';
  width:  ${props => props.click ? '1rem' : '1.5rem'};
  height: 2px;
  right: ${props => props.click ? '-2px' : '0'};
background: ${props => props.theme.text};
position: absolute;
transition: all 0.3s ease;

}

&::after{
  top: ${props => props.click ? '0.3rem' : '0.5rem'};
  transform: ${props => props.click ? 'rotate(-40deg)' : 'rotate(0)'  };

}
&::before{
  bottom: ${props => props.click ? '0.3rem' : '0.5rem'};
  transform: ${props => props.click ? 'rotate(40deg)' : 'rotate(0)'  };


`
 
const Navigation = () => {
  const location = useLocation();
  const [click, setClick] = useState(false);
  
  const isHomePage = location.pathname === '/';
  
  const navigateToSection = (sectionId) => {
    if (isHomePage) {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    }
    setClick(false);
  };

  return (
    <Section id="navigation">
      <NavBar>
        <Logo />
        <HamburgerMenu click={click} onClick={() => setClick(!click)}>
          &nbsp;
        </HamburgerMenu>
        <Menu click={click}>
          <MenuItem>
            {isHomePage ? (
              <a href="#home" onClick={() => navigateToSection('home')}>Home</a>
            ) : (
              <Link to="/">Home</Link>
            )}
          </MenuItem>
          <MenuItem>
            {isHomePage ? (
              <a href="#about" onClick={() => navigateToSection('about')}>About</a>
            ) : (
              <Link to="/#about">About</Link>
            )}
          </MenuItem>
          <MenuItem>
            {isHomePage ? (
              <a href="#roadmap" onClick={() => navigateToSection('roadmap')}>Roadmap</a>
            ) : (
              <Link to="/#roadmap">Roadmap</Link>
            )}
          </MenuItem>
          <MenuItem>
            {isHomePage ? (
              <a href="#showcase" onClick={() => navigateToSection('showcase')}>Showcase</a>
            ) : (
              <Link to="/#showcase">Showcase</Link>
            )}
          </MenuItem>
          <MenuItem>
            {isHomePage ? (
              <a href="#team" onClick={() => navigateToSection('team')}>Team</a>
            ) : (
              <Link to="/#team">Team</Link>
            )}
          </MenuItem>
          <MenuItem>
            {isHomePage ? (
              <a href="#faq" onClick={() => navigateToSection('faq')}>Faq</a>
            ) : (
              <Link to="/#faq">Faq</Link>
            )}
          </MenuItem>
          <MenuItem>
            <div className="mobile">
              <Btn></Btn>
            </div>
          </MenuItem>
        </Menu>
        <div style={{ marginRight: '10%' }} className="desktop">
          <Btn></Btn>
        </div>
      </NavBar>
    </Section>
  )
}

export default Navigation