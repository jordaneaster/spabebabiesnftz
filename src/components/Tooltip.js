import React, { useState } from 'react';
import styled from 'styled-components';
import { FaInfoCircle } from 'react-icons/fa';

const TooltipContainer = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
  margin-left: 8px;
`;

const TooltipIcon = styled.div`
  color: ${props => props.theme.textRgba ? `rgba(${props.theme.textRgba}, 0.6)` : '#aaaaaa'};
  cursor: help;
  font-size: 16px;
  transition: color 0.3s ease;
  
  &:hover {
    color: ${props => props.theme.textRgba ? `rgba(${props.theme.textRgba}, 0.9)` : '#ffffff'};
  }
`;

const TooltipContent = styled.div`
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(36, 37, 38, 0.95);
  color: white;
  padding: 10px 14px;
  border-radius: 8px;
  border: 1px solid rgba(155, 81, 224, 0.3);
  font-size: 12px;
  width: ${props => props.width || '220px'};
  z-index: 1000;
  margin-bottom: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  opacity: ${props => props.visible ? '1' : '0'};
  visibility: ${props => props.visible ? 'visible' : 'hidden'};
  transition: all 0.3s ease;
  line-height: 1.5;
  
  &:after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -8px;
    border-width: 8px;
    border-style: solid;
    border-color: rgba(36, 37, 38, 0.95) transparent transparent transparent;
  }
`;

const Tooltip = ({ text, width }) => {
  const [visible, setVisible] = useState(false);
  
  return (
    <TooltipContainer 
      onMouseEnter={() => setVisible(true)} 
      onMouseLeave={() => setVisible(false)}
    >
      <TooltipIcon>
        <FaInfoCircle />
      </TooltipIcon>
      <TooltipContent visible={visible} width={width}>
        {text}
      </TooltipContent>
    </TooltipContainer>
  );
};

export default Tooltip;
