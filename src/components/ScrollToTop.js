import React, { useLayoutEffect, useRef, useEffect } from 'react'
import { useWindowScroll } from 'react-use';
import styled from 'styled-components'
import { useLocation } from 'react-router-dom';

const Up = styled.div`
width: 3rem;
height: 3rem;

box-sizing:border-box;
margin: 0;
padding: 0;
color: ${props => props.theme.text};
background-color: ${props => props.theme.body};

font-size:${props => props.theme.fontxl};
position :fixed ;
right: 1rem;
bottom: 1rem;

cursor: pointer;

display: none;
justify-content: center;
align-items: center;

border-radius: 50%;
transition:all 0.2s ease ;
&:hover{
    transform: scale(1.2);
}
&:active{
    transform: scale(0.9);
}


`

const ScrollToTop = () => {

    const ref = useRef(null);
    const { y } = useWindowScroll();
    const { pathname, hash } = useLocation();

    const scrollToTop = () => {

        let element = document.getElementById("navigation");
      
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest'
        })
      }

      useLayoutEffect(() => {
        if(y > 200){
            ref.current.style.display = "flex"
        }else{
            ref.current.style.display = "none"
        }
      }, [y])

      useEffect(() => {
        // If there's a hash in the URL, scroll to that element
        if (hash) {
          // Slight delay to ensure the DOM is fully loaded
          setTimeout(() => {
            const element = document.getElementById(hash.substring(1));
            if (element) {
              element.scrollIntoView({ behavior: 'smooth' });
            }
          }, 100);
        } else {
          // If no hash, scroll to top of the page
          window.scrollTo(0, 0);
        }
      }, [pathname, hash]);

  return (
    <Up  ref={ref}  onClick={() => scrollToTop()}>
        &#x2191;
    </Up>
  )
}

export default ScrollToTop