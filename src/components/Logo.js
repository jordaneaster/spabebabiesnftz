import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

const LogoText = styled.h1`
font-family: 'Akaya Telivigala', cursive;
font-size: ${props => props.theme.fontxxl};
color: ${props => props.theme.text};
transition: all 0.2s ease;

&:hover{
    transform: scale(1.1);
}

@media (max-width: 64em){
font-size: ${props => props.theme.fontxxl};

}
`

const Logo = () => {
  return (

        <Link to="/">
        
        <img src="https://i.ibb.co/tLMmTqG/White-Trans.png" style={ {marginLeft:'10%',width:"10%"}}></img>
        </Link>

  )
}

export default Logo