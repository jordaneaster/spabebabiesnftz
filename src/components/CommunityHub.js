import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router-dom';
import supabase from '../utils/supabaseConfig';
import Footer from './Footer';
import bgr from '../assets/media/BGR3.png';
import { useUserAuth } from '../context/UserAuthContext';
import { ethers } from 'ethers';
import { FaInfoCircle, FaEthereum, FaRocket, FaWallet, FaExchangeAlt, FaLock } from 'react-icons/fa';
import Tooltip from './Tooltip'; // You'll need to create this component

// Animations
const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Styled Components
const HubContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  color: ${props => props.theme.text};
`;

const HubHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  
  h1 {
    font-size: ${props => props.theme.fontxxl};
    margin-bottom: 1rem;
    
    @media (max-width: 768px) {
      font-size: ${props => props.theme.fontxl};
    }
  }
  
  p {
    font-size: ${props => props.theme.fontmd};
    color: ${props => `rgba(${props.theme.textRgba}, 0.8)`};
    max-width: 800px;
    margin: 0 auto;
    
    @media (max-width: 768px) {
      font-size: ${props => props.theme.fontsm};
    }
  }
`;

const TabsContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-wrap: wrap;
    gap: 0.5rem;
  }
`;

const Tab = styled.button`
  padding: 0.8rem 1.5rem;
  background: ${props => props.active 
    ? 'linear-gradient(90deg, #3081ed, #9b51e0)' 
    : 'rgba(36, 37, 38, 0.8)'};
  color: white;
  border: none;
  font-size: ${props => props.theme.fontsm};
  font-weight: ${props => props.active ? '600' : '400'};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:first-child {
    border-top-left-radius: 30px;
    border-bottom-left-radius: 30px;
  }
  
  &:last-child {
    border-top-right-radius: 30px;
    border-bottom-right-radius: 30px;
  }
  
  &:hover {
    background: ${props => props.active 
      ? 'linear-gradient(90deg, #3081ed, #9b51e0)' 
      : 'rgba(48, 129, 237, 0.3)'};
  }
  
  @media (max-width: 768px) {
    font-size: ${props => props.theme.fontxs};
    padding: 0.6rem 1rem;
    flex-grow: 1;
    border-radius: 30px;
    margin: 0.2rem;
  }
`;

const ContentContainer = styled.div`
  animation: ${fadeIn} 0.5s ease forwards;
`;

// Initiatives section
const InitiativesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const InitiativeCard = styled.div`
  background: rgba(36, 37, 38, 0.8);
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-10px);
  }
`;

const InitiativeImage = styled.div`
  width: 100%;
  height: 180px;
  overflow: hidden;
  position: relative;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }
  
  &:hover img {
    transform: scale(1.1);
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 60px;
    background: linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0));
  }
`;

const InitiativeStatus = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: ${props => {
    switch(props.status) {
      case 'active': return 'rgba(76, 175, 80, 0.8)';
      case 'completed': return 'rgba(33, 150, 243, 0.8)';
      case 'upcoming': return 'rgba(255, 152, 0, 0.8)';
      default: return 'rgba(76, 175, 80, 0.8)';
    }
  }};
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.75rem;
  z-index: 1;
`;

const InitiativeContent = styled.div`
  padding: 1.5rem;
`;

const InitiativeTitle = styled.h3`
  font-size: ${props => props.theme.fontlg};
  margin-bottom: 0.75rem;
  color: #3081ed;
  
  @media (max-width: 768px) {
    font-size: ${props => props.theme.fontmd};
  }
`;

const InitiativeDescription = styled.p`
  font-size: ${props => props.theme.fontsm};
  color: ${props => `rgba(${props.theme.textRgba}, 0.8)`};
  margin-bottom: 1.5rem;
  line-height: 1.6;
`;

const ProgressContainer = styled.div`
  margin: 1rem 0;
`;

const ProgressLabel = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: ${props => props.theme.fontxs};
  
  span:last-child {
    color: #9b51e0;
    font-weight: 600;
  }
`;

const ProgressBar = styled.div`
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  width: ${props => props.progress}%;
  background: linear-gradient(90deg, #3081ed, #9b51e0);
  background-size: 200% 100%;
  animation: ${shimmer} 2s infinite linear;
  border-radius: 4px;
`;

const ActionButton = styled.button`
  padding: 0.8rem 1.5rem;
  background: linear-gradient(90deg, #3081ed, #9b51e0);
  background-size: 200% auto;
  color: white;
  border: none;
  border-radius: 30px;
  font-size: ${props => props.theme.fontsm};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  animation: ${shimmer} 3s infinite linear;
  width: 100%;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 7px 15px rgba(155, 81, 224, 0.4);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

// Governance section
const GovernanceContainer = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ProposalsColumn = styled.div``;

const ProposalCard = styled.div`
  background: rgba(36, 37, 38, 0.8);
  border-radius: 15px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const ProposalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  
  h3 {
    font-size: ${props => props.theme.fontlg};
    color: #3081ed;
    
    @media (max-width: 768px) {
      font-size: ${props => props.theme.fontmd};
    }
  }
  
  span {
    background: ${props => {
      switch(props.status) {
        case 'active': return 'rgba(76, 175, 80, 0.2)';
        case 'passed': return 'rgba(33, 150, 243, 0.2)';
        case 'failed': return 'rgba(244, 67, 54, 0.2)';
        default: return 'rgba(76, 175, 80, 0.2)';
      }
    }};
    color: ${props => {
      switch(props.status) {
        case 'active': return '#4CAF50';
        case 'passed': return '#2196F3';
        case 'failed': return '#F44336';
        default: return '#4CAF50';
      }
    }};
    padding: 0.3rem 0.8rem;
    border-radius: 20px;
    font-size: 0.75rem;
  }
`;

const ProposalDescription = styled.p`
  font-size: ${props => props.theme.fontsm};
  color: ${props => `rgba(${props.theme.textRgba}, 0.8)`};
  margin-bottom: 1.5rem;
  line-height: 1.6;
`;

const VoteActions = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const VoteButton = styled.button`
  flex: 1;
  padding: 0.8rem;
  background: ${props => props.yes ? 'rgba(76, 175, 80, 0.2)' : 'rgba(244, 67, 54, 0.2)'};
  color: ${props => props.yes ? '#4CAF50' : '#F44336'};
  border: 1px solid ${props => props.yes ? '#4CAF50' : '#F44336'};
  border-radius: 30px;
  font-size: ${props => props.theme.fontsm};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.yes ? 'rgba(76, 175, 80, 0.4)' : 'rgba(244, 67, 54, 0.4)'};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const VotingStats = styled.div`
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const VoteBar = styled.div`
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
  position: relative;
`;

const YesVote = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: ${props => props.percentage}%;
  background: rgba(76, 175, 80, 0.8);
  border-radius: 4px 0 0 4px;
`;

const NoVote = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  width: ${props => 100 - props.yesPercentage}%;
  background: rgba(244, 67, 54, 0.8);
  border-radius: 0 4px 4px 0;
`;

const VoteLabels = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: ${props => props.theme.fontxs};
  
  span:first-child {
    color: #4CAF50;
  }
  
  span:last-child {
    color: #F44336;
  }
`;

// Stats Column
const StatsColumn = styled.div``;

const StatsCard = styled.div`
  background: rgba(36, 37, 38, 0.8);
  border-radius: 15px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
`;

const StatsTitle = styled.h3`
  font-size: ${props => props.theme.fontlg};
  color: #3081ed;
  margin-bottom: 1.5rem;
  text-align: center;
  
  @media (max-width: 768px) {
    font-size: ${props => props.theme.fontmd};
  }
`;

const StatItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.8rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  &:last-child {
    border-bottom: none;
  }
  
  span:first-child {
    color: ${props => `rgba(${props.theme.textRgba}, 0.7)`};
  }
  
  span:last-child {
    font-weight: 600;
    color: #9b51e0;
  }
`;

// Events section
const EventsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const EventCard = styled.div`
  background: rgba(36, 37, 38, 0.8);
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease;
  position: relative;
  
  &:hover {
    transform: translateY(-10px);
  }
`;

const EventDate = styled.div`
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: rgba(155, 81, 224, 0.9);
  color: white;
  padding: 0.5rem;
  border-radius: 10px;
  text-align: center;
  font-weight: 600;
  z-index: 1;
  
  .day {
    font-size: 1.5rem;
    line-height: 1;
  }
  
  .month {
    font-size: 0.8rem;
    text-transform: uppercase;
  }
`;

const EventImage = styled.div`
  width: 100%;
  height: 180px;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }
  
  &:hover img {
    transform: scale(1.1);
  }
`;

const EventContent = styled.div`
  padding: 1.5rem;
`;

const EventTitle = styled.h3`
  font-size: ${props => props.theme.fontlg};
  margin-bottom: 0.75rem;
  color: #3081ed;
  
  @media (max-width: 768px) {
    font-size: ${props => props.theme.fontmd};
  }
`;

const EventDescription = styled.p`
  font-size: ${props => props.theme.fontsm};
  color: ${props => `rgba(${props.theme.textRgba}, 0.8)`};
  margin-bottom: 1.5rem;
  line-height: 1.6;
`;

const EventMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: ${props => props.theme.fontxs};
  color: ${props => `rgba(${props.theme.textRgba}, 0.7)`};
  
  div {
    display: flex;
    align-items: center;
    
    svg {
      margin-right: 5px;
    }
  }
`;

// Add these missing styled components
const Section = styled.section`
  min-height: 100vh;
  width: 100vw;
  background-color: ${props => props.theme.body};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
`;

const Container = styled.div`
  width: 90%;
  max-width: 1200px;
  background-color: rgba(36, 37, 38, 0.9);
  border-radius: 20px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.7);
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: ${props => props.theme.fontxxl};
  text-transform: uppercase;
  color: ${props => props.theme.text};
  margin-bottom: 1rem;
  text-align: center;
  letter-spacing: 3px;
  
  @media (max-width: 48em) {
    font-size: ${props => props.theme.fontxl};
  }
`;

const CommunitySection = styled.div`
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 15px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const SectionTitle = styled.h3`
  color: ${props => props.theme.text};
  font-size: ${props => props.theme.fontlg};
  margin-bottom: 0.5rem;
`;

// Add these new styled components for Web3 interactions
const Web3Section = styled.div`
  background: linear-gradient(135deg, rgba(36, 37, 38, 0.8), rgba(25, 26, 27, 0.9));
  border-radius: 20px;
  padding: 2rem;
  margin-top: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(155, 81, 224, 0.2);
  
  h2 {
    font-size: ${props => props.theme.fontxl};
    margin-bottom: 2rem;
    text-align: center;
    color: #aeff00;
    text-shadow: 0 0 15px rgba(174, 255, 0, 0.3);
    
    @media (max-width: 768px) {
      font-size: ${props => props.theme.fontlg};
    }
  }
`;

const ContractGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ContractCard = styled.div`
  background: rgba(20, 21, 23, 0.7);
  border-radius: 15px;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid rgba(48, 129, 237, 0.2);
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 7px 20px rgba(48, 129, 237, 0.3);
    border-color: rgba(48, 129, 237, 0.5);
  }
`;

const ContractHeader = styled.div`
  background: linear-gradient(90deg, #3081ed, #9b51e0);
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  h3 {
    font-size: ${props => props.theme.fontmd};
    color: white;
    margin: 0;
  }
  
  svg {
    font-size: 1.5rem;
    color: white;
  }
`;

const ContractContent = styled.div`
  padding: 1.5rem;
  
  p {
    color: ${props => `rgba(${props.theme.textRgba}, 0.8)`};
    font-size: ${props => props.theme.fontsm};
    margin-bottom: 1.5rem;
    line-height: 1.6;
  }
  
  .contract-address {
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(48, 129, 237, 0.3);
    border-radius: 8px;
    padding: 0.75rem;
    font-family: monospace;
    font-size: 0.8rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    overflow: hidden;
    text-overflow: ellipsis;
    
    button {
      background: rgba(48, 129, 237, 0.2);
      border: none;
      color: #3081ed;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s ease;
      
      &:hover {
        background: rgba(48, 129, 237, 0.4);
      }
    }
  }
`;

const ActionGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const WalletStatus = styled.div`
  background: ${props => props.connected ? 
    'linear-gradient(90deg, rgba(174, 255, 0, 0.2), rgba(76, 175, 80, 0.2))' : 
    'linear-gradient(90deg, rgba(244, 67, 54, 0.1), rgba(244, 67, 54, 0.2))'
  };
  border: 1px solid ${props => props.connected ? 'rgba(76, 175, 80, 0.3)' : 'rgba(244, 67, 54, 0.3)'};
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  
  p {
    margin: 0;
    display: flex;
    align-items: center;
    
    svg {
      margin-right: 0.5rem;
      color: ${props => props.connected ? '#4CAF50' : '#F44336'};
    }
    
    span {
      color: ${props => props.connected ? '#4CAF50' : '#F44336'};
      font-weight: bold;
    }
  }
`;

const NetworkSelector = styled.div`
  background: rgba(20, 21, 23, 0.5);
  border-radius: 12px;
  padding: 0.5rem;
  display: flex;
  margin-bottom: 2rem;
  
  button {
    flex: 1;
    background: transparent;
    border: none;
    padding: 0.8rem 1.2rem;
    border-radius: 8px;
    color: ${props => `rgba(${props.theme.textRgba}, 0.8)`};
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: 500;
    position: relative;
    
    &.active {
      background: linear-gradient(90deg, #3081ed, #9b51e0);
      color: white;
      font-weight: 600;
      box-shadow: 0 5px 15px rgba(48, 129, 237, 0.3);
    }
    
    &:hover:not(.active) {
      color: white;
      background: rgba(48, 129, 237, 0.1);
    }
    
    .network-indicator {
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: ${props => props.mainnet ? '#4CAF50' : '#FF9800'};
    }
  }
`;

const FormField = styled.div`
  margin-bottom: 1.2rem;
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
    color: ${props => `rgba(${props.theme.textRgba}, 0.9)`};
    display: flex;
    align-items: center;
    
    svg {
      margin-right: 0.5rem;
      color: #9b51e0;
    }
  }
  
  input, select {
    width: 100%;
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(155, 81, 224, 0.3);
    border-radius: 8px;
    padding: 0.75rem 1rem;
    color: white;
    font-size: 1rem;
    
    &:focus {
      outline: none;
      border-color: #9b51e0;
    }
  }
  
  .helper-text {
    margin-top: 0.4rem;
    font-size: 0.8rem;
    color: ${props => `rgba(${props.theme.textRgba}, 0.6)`};
    display: flex;
    align-items: center;
    
    svg {
      margin-right: 0.3rem;
      color: #3081ed;
    }
  }
  
  .tooltip-icon {
    margin-left: 0.5rem;
    color: ${props => `rgba(${props.theme.textRgba}, 0.5)`};
    cursor: help;
    position: relative;
    display: inline-flex;
    
    &:hover .tooltip {
      display: block;
    }
    
    .tooltip {
      display: none;
      position: absolute;
      background: rgba(36, 37, 38, 0.95);
      color: white;
      padding: 0.75rem;
      border-radius: 8px;
      width: 200px;
      font-size: 0.8rem;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      margin-bottom: 0.5rem;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(155, 81, 224, 0.3);
      z-index: 10;
      
      &:after {
        content: '';
        position: absolute;
        top: 100%;
        left: 50%;
        border: 8px solid transparent;
        border-top-color: rgba(36, 37, 38, 0.95);
        transform: translateX(-50%);
      }
    }
  }
`;

const TransactionHistory = styled.div`
  margin-top: 3rem;
  
  h3 {
    font-size: ${props => props.theme.fontlg};
    margin-bottom: 1.5rem;
    color: #3081ed;
  }
  
  .history-item {
    background: rgba(20, 21, 23, 0.5);
    border-radius: 12px;
    padding: 1rem 1.5rem;
    margin-bottom: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-left: 4px solid;
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateX(5px);
    }
    
    &.success {
      border-left-color: #4CAF50;
      
      .status {
        color: #4CAF50;
      }
    }
    
    &.pending {
      border-left-color: #FF9800;
      
      .status {
        color: #FF9800;
      }
    }
    
    &.failed {
      border-left-color: #F44336;
      
      .status {
        color: #F44336;
      }
    }
    
    .tx-info {
      flex: 1;
      
      .title {
        font-weight: bold;
        margin-bottom: 0.3rem;
      }
      
      .hash {
        font-family: monospace;
        font-size: 0.8rem;
        color: ${props => `rgba(${props.theme.textRgba}, 0.6)`};
      }
    }
    
    .status {
      font-weight: bold;
      display: flex;
      align-items: center;
      
      svg {
        margin-right: 0.3rem;
      }
    }
  }
`;

const StatsOverview = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  background: rgba(20, 21, 23, 0.7);
  border-radius: 15px;
  padding: 1.5rem;
  text-align: center;
  transition: all 0.3s ease;
  border: 1px solid rgba(48, 129, 237, 0.1);
  animation: ${float} 5s ease-in-out infinite;
  animation-delay: ${props => props.delay || '0s'};
  
  &:hover {
    border-color: rgba(48, 129, 237, 0.5);
    transform: translateY(-5px);
  }
  
  .stat-icon {
    font-size: 2rem;
    color: #9b51e0;
    margin-bottom: 0.5rem;
  }
  
  .stat-value {
    font-size: ${props => props.theme.fontxl};
    font-weight: bold;
    background: linear-gradient(90deg, #3081ed, #9b51e0);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 0.5rem;
  }
  
  .stat-label {
    font-size: ${props => props.theme.fontsm};
    color: ${props => `rgba(${props.theme.textRgba}, 0.8)`};
  }
`;

// Sample contract data
const contractsInfo = [
  {
    name: 'Space Babiez NFT',
    icon: <FaRocket />,
    description: 'The main NFT contract for minting and managing your Space Babiez collection.',
    address: '0x1234567890123456789012345678901234567890',
    functions: [
      { name: 'Mint Space Baby', price: '0.08 ETH' },
      { name: 'Level Up Baby', price: 'Gas only' }
    ]
  },
  {
    name: 'AstroMilk Token',
    icon: <FaEthereum />,
    description: 'ERC20 governance token used for rewards and community participation.',
    address: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
    functions: [
      { name: 'Transfer AMLK', price: 'Gas only' },
      { name: 'Approve Spending', price: 'Gas only' }
    ]
  },
  {
    name: 'NFT Staking',
    icon: <FaLock />,
    description: 'Stake your Space Babiez to earn AstroMilk tokens as passive income.',
    address: '0x9876543210987654321098765432109876543210',
    functions: [
      { name: 'Stake NFT', price: 'Gas only' },
      { name: 'Claim Rewards', price: 'Gas only' },
      { name: 'Unstake NFT', price: 'Gas only' }
    ]
  }
];

// Mock transaction data
const mockTransactions = [
  {
    id: 1,
    title: 'Minted Space Baby #1234',
    hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    status: 'success',
    timestamp: '2023-11-30T15:45:22'
  },
  {
    id: 2,
    title: 'Staked Space Baby #1234',
    hash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
    status: 'pending',
    timestamp: '2023-11-30T16:12:05'
  },
  {
    id: 3,
    title: 'Claimed 45 AMLK Rewards',
    hash: '0x7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12345',
    status: 'success',
    timestamp: '2023-11-29T12:30:15'
  },
  {
    id: 4,
    title: 'Voted on Proposal #12',
    hash: '0xdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890ab',
    status: 'failed',
    timestamp: '2023-11-28T09:15:45'
  }
];

// Sample data - Add these back to fix the undefined variables
const initiatives = [
  {
    id: 1,
    title: 'Space Babiez Community Fund',
    description: 'A community fund to assist Guardians in times of need through SBU initiatives.',
    image: 'https://i.postimg.cc/pTmP1V9b/image-11.png',
    status: 'active',
    goal: 10000,
    current: 7500
  },
  {
    id: 2,
    title: 'Children\'s Education Initiative',
    description: 'Supporting education programs for underprivileged children across the globe.',
    image: 'https://i.postimg.cc/cLTZxtwG/image-12.png',
    status: 'upcoming',
    goal: 5000,
    current: 0
  },
  {
    id: 3,
    title: 'Environmental Restoration Project',
    description: 'Planting trees and restoring natural habitats to combat climate change.',
    image: 'https://i.postimg.cc/15hyJQs2/image-13.png',
    status: 'completed',
    goal: 8000,
    current: 8000
  }
];

const proposals = [
  {
    id: 1,
    title: 'Add New Traits for Generation II',
    description: 'Proposal to add 20 new traits for the upcoming Generation II Space Babiez, including new backgrounds, outfits, and special powers.',
    status: 'active',
    yesVotes: 732,
    noVotes: 128,
    endDate: '2023-12-15'
  },
  {
    id: 2,
    title: 'Partnership with Cosmic Kids Charity',
    description: 'Establish an official partnership with Cosmic Kids Charity to donate 5% of all secondary sales to support children\'s education programs.',
    status: 'passed',
    yesVotes: 956,
    noVotes: 44,
    endDate: '2023-11-30'
  },
  {
    id: 3,
    title: 'Special Edition Holiday Cards',
    description: 'Create a limited series of 100 holiday-themed collector cards available exclusively to Guardians.',
    status: 'failed',
    yesVotes: 345,
    noVotes: 621,
    endDate: '2023-11-15'
  }
];

const events = [
  {
    id: 1,
    title: 'Virtual Guardian Meetup',
    description: 'Join other Guardians for our monthly virtual meetup to discuss the future of Space Babiez and showcase your collection.',
    image: 'https://i.postimg.cc/HswdNhLx/image-10.png',
    date: '2023-12-20',
    time: '18:00 UTC',
    location: 'Discord',
    attendees: 156
  },
  {
    id: 2,
    title: 'NFT NYC Afterparty',
    description: 'Exclusive afterparty for Space Babiez Guardians during NFT NYC. Meet the team and other Guardians in person!',
    image: 'https://i.postimg.cc/tRVX3TQF/image-14.png',
    date: '2024-02-15',
    time: '21:00 EST',
    location: 'New York, NY',
    attendees: 87
  },
  {
    id: 3,
    title: 'Space Babiez AMA Session',
    description: 'Ask Me Anything session with the Space Babiez team. Learn about upcoming features and get your questions answered!',
    image: 'https://i.postimg.cc/15hyJQs2/image-13.png',
    date: '2023-12-10',
    time: '15:00 UTC',
    location: 'Twitter Spaces',
    attendees: 230
  }
];

const CommunityHub = () => {
  const [activeTab, setActiveTab] = useState('initiatives');
  const [userVotes, setUserVotes] = useState({});
  const { walletAddress, walletConnected, connectWallet } = useUserAuth();
  const [selectedNetwork, setSelectedNetwork] = useState('mainnet');
  const [mintAmount, setMintAmount] = useState(1);
  const [tokenId, setTokenId] = useState('');
  const [transactions, setTransactions] = useState(mockTransactions);
  const [processing, setProcessing] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);
  const [showTooltip, setShowTooltip] = useState({});
  
  useEffect(() => {
    // Check if wallet is connected from session storage
    const walletAddress = sessionStorage.getItem('walletAddress');
    
    // In a real implementation, we would fetch user votes from the database
    // For now, we'll use a mock
    setUserVotes({
      1: null, // User hasn't voted on proposal 1
      2: 'yes', // User voted yes on proposal 2
      3: 'no'  // User voted no on proposal 3
    });
  }, []);
  
  const handleCopyAddress = (address) => {
    navigator.clipboard.writeText(address);
    alert('Contract address copied to clipboard!');
  };
  
  const handleMint = async () => {
    if (!walletConnected) {
      alert('Please connect your wallet first');
      return;
    }
    
    setProcessing(true);
    
    try {
      // Simulate a blockchain transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Add the transaction to our list
      const newTx = {
        id: Date.now(),
        title: `Minted Space Baby #${1000 + Math.floor(Math.random() * 9000)}`,
        hash: `0x${Math.random().toString(16).substring(2, 66)}`,
        status: 'success',
        timestamp: new Date().toISOString()
      };
      
      setTransactions([newTx, ...transactions]);
      alert('Successfully minted a new Space Baby!');
    } catch (error) {
      console.error('Minting error:', error);
      alert('Error minting: ' + error.message);
    } finally {
      setProcessing(false);
    }
  };
  
  const handleStake = async () => {
    if (!walletConnected) {
      alert('Please connect your wallet first');
      return;
    }
    
    if (!tokenId) {
      alert('Please enter a token ID');
      return;
    }
    
    setProcessing(true);
    
    try {
      // Simulate a blockchain transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Add the transaction to our list
      const newTx = {
        id: Date.now(),
        title: `Staked Space Baby #${tokenId}`,
        hash: `0x${Math.random().toString(16).substring(2, 66)}`,
        status: 'pending',
        timestamp: new Date().toISOString()
      };
      
      setTransactions([newTx, ...transactions]);
      alert(`Staking transaction submitted for Space Baby #${tokenId}!`);
    } catch (error) {
      console.error('Staking error:', error);
      alert('Error staking: ' + error.message);
    } finally {
      setProcessing(false);
    }
  };
  
  const handleVote = (proposalId, voteType) => {
    // In a real implementation, we would send this vote to the database
    // For now, we'll just update the local state
    setUserVotes(prev => ({
      ...prev,
      [proposalId]: voteType
    }));
    
    // Simulate a transaction
    const newTx = {
      id: Date.now(),
      title: `Voted ${voteType} on Proposal #${proposalId}`,
      hash: `0x${Math.random().toString(16).substring(2, 66)}`,
      status: 'pending',
      timestamp: new Date().toISOString()
    };
    
    setTransactions([newTx, ...transactions]);
    alert(`Your vote (${voteType}) on proposal #${proposalId} has been submitted!`);
  };
  
  const handleSupportInitiative = (initiativeId) => {
    // In a real implementation, we would send a transaction or update the database
    const newTx = {
      id: Date.now(),
      title: `Supported Initiative #${initiativeId}`,
      hash: `0x${Math.random().toString(16).substring(2, 66)}`,
      status: 'success',
      timestamp: new Date().toISOString()
    };
    
    setTransactions([newTx, ...transactions]);
    alert(`You've supported initiative #${initiativeId}! Thank you for your contribution.`);
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      day: date.getDate(),
      month: date.toLocaleString('default', { month: 'short' })
    };
  };
  
  const renderContractInteraction = () => {
    if (!selectedContract) {
      return (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>Select a contract to interact with its functions</p>
        </div>
      );
    }
    
    const contract = contractsInfo.find(c => c.name === selectedContract);
    
    return (
      <div>
        <h3 style={{ marginBottom: '1.5rem', color: '#3081ed' }}>{contract.name} Functions</h3>
        
        {contract.name === 'Space Babiez NFT' && (
          <>
            <FormField>
              <label>
                <FaRocket /> Mint New Space Baby
                <span className="tooltip-icon">
                  <FaInfoCircle />
                  <span className="tooltip">
                    Create a new Space Baby NFT. Each Space Baby has unique traits and can level up over time.
                  </span>
                </span>
              </label>
              <input 
                type="number" 
                min="1" 
                max="5"
                placeholder="Number of Space Babiez to mint" 
                value={mintAmount}
                onChange={(e) => setMintAmount(parseInt(e.target.value) || 1)}
              />
              <div className="helper-text">
                <FaInfoCircle /> Cost: {(mintAmount * 0.08).toFixed(2)} ETH
              </div>
            </FormField>
            
            <ActionButton 
              onClick={handleMint}
              disabled={processing || !walletConnected}
            >
              {processing ? 'Processing...' : 'Mint Space Baby'}
            </ActionButton>
          </>
        )}
        
        {contract.name === 'NFT Staking' && (
          <>
            <FormField>
              <label>
                <FaLock /> Stake Your Space Baby
                <span className="tooltip-icon">
                  <FaInfoCircle />
                  <span className="tooltip">
                    Lock up your Space Baby to earn AstroMilk tokens as rewards. The longer you stake, the more you earn!
                  </span>
                </span>
              </label>
              <input 
                type="number"
                placeholder="Space Baby Token ID" 
                value={tokenId}
                onChange={(e) => setTokenId(e.target.value)}
              />
            </FormField>
            
            <FormField>
              <label>Staking Period</label>
              <select>
                <option value="30">30 days (10% APY)</option>
                <option value="90">90 days (15% APY)</option>
                <option value="180">180 days (20% APY)</option>
                <option value="365">365 days (25% APY)</option>
              </select>
            </FormField>
            
            <ActionButton 
              onClick={handleStake}
              disabled={processing || !walletConnected || !tokenId}
            >
              {processing ? 'Processing...' : 'Stake Space Baby'}
            </ActionButton>
          </>
        )}
        
        {contract.name === 'AstroMilk Token' && (
          <>
            <FormField>
              <label>
                <FaExchangeAlt /> Transfer AstroMilk Tokens
                <span className="tooltip-icon">
                  <FaInfoCircle />
                  <span className="tooltip">
                    Send AstroMilk tokens to another wallet address. These tokens can be used for governance voting and special perks.
                  </span>
                </span>
              </label>
              <input type="text" placeholder="Recipient Address (0x...)" />
            </FormField>
            
            <FormField>
              <label>Amount of AMLK</label>
              <input type="number" placeholder="Amount to send" />
            </FormField>
            
            <ActionButton 
              onClick={() => alert('Token transfer would happen here')}
              disabled={processing || !walletConnected}
            >
              {processing ? 'Processing...' : 'Transfer Tokens'}
            </ActionButton>
          </>
        )}
      </div>
    );
  };
  
  const renderWeb3Portal = () => (
    <Web3Section>
      <h2>Web3 Portal</h2>
      
      <WalletStatus connected={walletConnected}>
        <p>
          <FaWallet />
          <span>
            {walletConnected 
              ? `Connected: ${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}` 
              : 'Wallet Disconnected'}
          </span>
        </p>
        
        {!walletConnected && (
          <ActionButton onClick={connectWallet}>
            Connect Wallet
          </ActionButton>
        )}
      </WalletStatus>
      
      <NetworkSelector mainnet={selectedNetwork === 'mainnet'}>
        <button 
          className={selectedNetwork === 'mainnet' ? 'active' : ''}
          onClick={() => setSelectedNetwork('mainnet')}
        >
          Ethereum Mainnet
          <span className="network-indicator"></span>
        </button>
        <button 
          className={selectedNetwork === 'polygon' ? 'active' : ''}
          onClick={() => setSelectedNetwork('polygon')}
        >
          Polygon Network
          <span className="network-indicator"></span>
        </button>
        <button 
          className={selectedNetwork === 'testnet' ? 'active' : ''}
          onClick={() => setSelectedNetwork('testnet')}
        >
          Goerli Testnet
          <span className="network-indicator"></span>
        </button>
      </NetworkSelector>
      
      <StatsOverview>
        <StatCard delay="0s">
          <div className="stat-icon"><FaRocket /></div>
          <div className="stat-value">12,547</div>
          <div className="stat-label">Space Babiez Minted</div>
        </StatCard>
        
        <StatCard delay="0.2s">
          <div className="stat-icon"><FaLock /></div>
          <div className="stat-value">5,283</div>
          <div className="stat-label">Space Babiez Staked</div>
        </StatCard>
        
        <StatCard delay="0.4s">
          <div className="stat-icon"><FaEthereum /></div>
          <div className="stat-value">1.45M</div>
          <div className="stat-label">AMLK in Circulation</div>
        </StatCard>
      </StatsOverview>
      
      <ContractGrid>
        {contractsInfo.map((contract, index) => (
          <ContractCard key={index}>
            <ContractHeader>
              <h3>{contract.name}</h3>
              {contract.icon}
            </ContractHeader>
            <ContractContent>
              <p>{contract.description}</p>
              <div className="contract-address">
                <span>{contract.address.substring(0, 6)}...{contract.address.substring(contract.address.length - 4)}</span>
                <button onClick={() => handleCopyAddress(contract.address)}>Copy</button>
              </div>
              <ActionButton onClick={() => setSelectedContract(contract.name)}>
                Interact with Contract
              </ActionButton>
            </ContractContent>
          </ContractCard>
        ))}
      </ContractGrid>
      
      {renderContractInteraction()}
      
      <TransactionHistory>
        <h3>Recent Transactions</h3>
        {transactions.slice(0, 5).map(tx => (
          <div key={tx.id} className={`history-item ${tx.status}`}>
            <div className="tx-info">
              <div className="title">{tx.title}</div>
              <div className="hash">{tx.hash.substring(0, 10)}...{tx.hash.substring(tx.hash.length - 8)}</div>
            </div>
            <div className="status">
              {tx.status === 'success' && <FaRocket />}
              {tx.status === 'pending' && <span>⏳</span>}
              {tx.status === 'failed' && <span>❌</span>}
              {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
            </div>
          </div>
        ))}
      </TransactionHistory>
    </Web3Section>
  );
  
  const renderInitiatives = () => (
    <InitiativesGrid>
      {initiatives.map(initiative => (
        <InitiativeCard key={initiative.id}>
          <InitiativeImage>
            <img src={initiative.image} alt={initiative.title} />
            <InitiativeStatus status={initiative.status}>
              {initiative.status.charAt(0).toUpperCase() + initiative.status.slice(1)}
            </InitiativeStatus>
          </InitiativeImage>
          <InitiativeContent>
            <InitiativeTitle>{initiative.title}</InitiativeTitle>
            <InitiativeDescription>{initiative.description}</InitiativeDescription>
            
            <ProgressContainer>
              <ProgressLabel>
                <span>Progress</span>
                <span>${initiative.current.toLocaleString()} / ${initiative.goal.toLocaleString()}</span>
              </ProgressLabel>
              <ProgressBar>
                <ProgressFill progress={(initiative.current / initiative.goal) * 100} />
              </ProgressBar>
            </ProgressContainer>
            
            <ActionButton 
              onClick={() => handleSupportInitiative(initiative.id)}
              disabled={initiative.status !== 'active' || !walletConnected}
            >
              {initiative.status === 'active' 
                ? (walletConnected ? 'Support Initiative' : 'Connect Wallet to Support') 
                : initiative.status === 'completed' 
                  ? 'Completed' 
                  : 'Coming Soon'}
            </ActionButton>
          </InitiativeContent>
        </InitiativeCard>
      ))}
    </InitiativesGrid>
  );
  
  const renderGovernance = () => (
    <GovernanceContainer>
      <ProposalsColumn>
        <h2>Active Proposals</h2>
        {proposals.map(proposal => (
          <ProposalCard key={proposal.id}>
            <ProposalHeader status={proposal.status}>
              <h3>{proposal.title}</h3>
              <span>{proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}</span>
            </ProposalHeader>
            <ProposalDescription>{proposal.description}</ProposalDescription>
            
            <VotingStats>
              <VoteBar>
                <YesVote percentage={(proposal.yesVotes / (proposal.yesVotes + proposal.noVotes)) * 100} />
                <NoVote yesPercentage={(proposal.yesVotes / (proposal.yesVotes + proposal.noVotes)) * 100} />
              </VoteBar>
              <VoteLabels>
                <span>Yes: {proposal.yesVotes}</span>
                <span>No: {proposal.noVotes}</span>
              </VoteLabels>
            </VotingStats>
            
            {proposal.status === 'active' && (
              <VoteActions>
                <VoteButton 
                  yes 
                  onClick={() => handleVote(proposal.id, 'yes')}
                  disabled={!walletConnected || userVotes[proposal.id] === 'yes'}
                >
                  {userVotes[proposal.id] === 'yes' ? 'Voted Yes' : 'Vote Yes'}
                </VoteButton>
                <VoteButton 
                  onClick={() => handleVote(proposal.id, 'no')}
                  disabled={!walletConnected || userVotes[proposal.id] === 'no'}
                >
                  {userVotes[proposal.id] === 'no' ? 'Voted No' : 'Vote No'}
                </VoteButton>
              </VoteActions>
            )}
          </ProposalCard>
        ))}
      </ProposalsColumn>
      
      <StatsColumn>
        <StatsCard>
          <StatsTitle>Community Stats</StatsTitle>
          <StatItem>
            <span>Total Guardians</span>
            <span>4,326</span>
          </StatItem>
          <StatItem>
            <span>Total Space Babiez</span>
            <span>12,547</span>
          </StatItem>
          <StatItem>
            <span>Active Proposals</span>
            <span>3</span>
          </StatItem>
          <StatItem>
            <span>Funds Raised</span>
            <span>$42,850</span>
          </StatItem>
          <StatItem>
            <span>Guardian Participation</span>
            <span>72%</span>
          </StatItem>
        </StatsCard>
        
        <StatsCard>
          <StatsTitle>Your Guardian Status</StatsTitle>
          {walletConnected ? (
            <>
              <StatItem>
                <span>Guardian Level</span>
                <span>Silver</span>
              </StatItem>
              <StatItem>
                <span>Space Babiez Owned</span>
                <span>3</span>
              </StatItem>
              <StatItem>
                <span>Rarest Baby</span>
                <span>Legendary</span>
              </StatItem>
              <StatItem>
                <span>Governance Power</span>
                <span>73</span>
              </StatItem>
              <StatItem>
                <span>Votes Cast</span>
                <span>12</span>
              </StatItem>
            </>
          ) : (
            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <p>Connect your wallet to view your Guardian status</p>
              <ActionButton style={{ marginTop: '1rem', maxWidth: '200px' }}>
                Connect Wallet
              </ActionButton>
            </div>
          )}
        </StatsCard>
      </StatsColumn>
    </GovernanceContainer>
  );
  
  const renderEvents = () => (
    <EventsGrid>
      {events.map(event => {
        const formattedDate = formatDate(event.date);
        return (
          <EventCard key={event.id}>
            <EventDate>
              <div className="day">{formattedDate.day}</div>
              <div className="month">{formattedDate.month}</div>
            </EventDate>
            <EventImage>
              <img src={event.image} alt={event.title} />
            </EventImage>
            <EventContent>
              <EventTitle>{event.title}</EventTitle>
              <EventDescription>{event.description}</EventDescription>
              <EventMeta>
                <div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {event.time}
                </div>
                <div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {event.location}
                </div>
                <div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {event.attendees} Attendees
                </div>
              </EventMeta>
              <ActionButton style={{ marginTop: '1rem' }}>
                RSVP to Event
              </ActionButton>
            </EventContent>
          </EventCard>
        );
      })}
    </EventsGrid>
  );
  
  return (
    <>
      <Section style={{ background: `url(${bgr}) no-repeat`, backgroundSize: 'cover' }}>
        <Container>
          <Title>Community Hub</Title>
          
          <TabsContainer>
            <Tab 
              active={activeTab === 'initiatives'} 
              onClick={() => setActiveTab('initiatives')}
            >
              Initiatives
            </Tab>
            <Tab 
              active={activeTab === 'governance'} 
              onClick={() => setActiveTab('governance')}
            >
              Governance
            </Tab>
            <Tab 
              active={activeTab === 'events'} 
              onClick={() => setActiveTab('events')}
            >
              Events
            </Tab>
            <Tab 
              active={activeTab === 'web3'} 
              onClick={() => setActiveTab('web3')}
            >
              Web3 Portal
            </Tab>
          </TabsContainer>
          
          <ContentContainer>
            {activeTab === 'initiatives' && renderInitiatives()}
            {activeTab === 'governance' && renderGovernance()}
            {activeTab === 'events' && renderEvents()}
            {activeTab === 'web3' && renderWeb3Portal()}
          </ContentContainer>
        </Container>
      </Section>
      <Footer />
    </>
  );
};

export default CommunityHub;
