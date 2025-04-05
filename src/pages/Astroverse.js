import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import gsap from 'gsap';
import { Link } from 'react-router-dom';
import supabase from '../utils/supabaseConfig';
import TABLES from '../utils/supabaseSchema';
import { connectPhantomWallet } from '../utils/walletUtils';
import Navbar from '../components/Navbar';

// Animations
const float = keyframes`
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(3deg); }
  100% { transform: translateY(0px) rotate(0deg); }
`;

const rotate = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.05); opacity: 1; }
  100% { transform: scale(1); opacity: 0.8; }
`;

const starTwinkle = keyframes`
  0% { opacity: 0.4; }
  50% { opacity: 1; }
  100% { opacity: 0.4; }
`;

const glowPulse = keyframes`
  0% { box-shadow: 0 0 5px rgba(174, 255, 0, 0.5); }
  50% { box-shadow: 0 0 20px rgba(174, 255, 0, 0.8); }
  100% { box-shadow: 0 0 5px rgba(174, 255, 0, 0.5); }
`;

const fadeSlideIn = keyframes`
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
`;

const Section = styled.section`
  min-height: 100vh;
  width: 100vw;
  background-color: #000000;
  background-image: 
    radial-gradient(circle at 10% 20%, rgba(40, 0, 80, 0.4) 0%, transparent 50%),
    radial-gradient(circle at 90% 80%, rgba(0, 80, 120, 0.4) 0%, transparent 50%);
  position: relative;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 3rem 1rem;
`;

const GalaxyNav = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  max-width: 800px;
  margin-bottom: 2rem;
  background: rgba(5, 5, 15, 0.4);
  border-radius: 50px;
  padding: 0.5rem;
  position: relative;
  z-index: 5;
`;

const GalaxyLink = styled(Link)`
  padding: 0.8rem 1.5rem;
  text-decoration: none;
  color: ${props => props.active ? '#000' : '#aeff00'};
  background: ${props => props.active ? '#aeff00' : 'transparent'};
  border-radius: 30px;
  transition: all 0.3s ease;
  font-weight: 600;
  
  &:hover {
    background: ${props => props.active ? '#aeff00' : 'rgba(174, 255, 0, 0.2)'};
  }
`;

const CitizenDashboard = styled.div`
  width: 100%;
  max-width: 1200px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  margin-top: 1rem;
  
  @media (min-width: 992px) {
    grid-template-columns: 360px 1fr;
  }
`;

const CitizenBadge = styled.div`
  background: rgba(5, 5, 15, 0.6);
  border: 1px solid rgba(174, 255, 0, 0.3);
  border-radius: 20px;
  padding: 1.5rem;
  animation: ${fadeSlideIn} 0.8s ease-out forwards;
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  
  h3 {
    color: #aeff00;
    font-size: 1.3rem;
    margin-bottom: 1rem;
    text-align: center;
  }
`;

const CitizenshipInfo = styled.div`
  background: rgba(5, 5, 15, 0.5);
  border-radius: 15px;
  padding: 1rem;
  margin-top: 1.5rem;
  border: 1px solid rgba(108, 0, 255, 0.3);
  
  p {
    color: #fff;
    margin-bottom: 0.5rem;
    font-size: 0.95rem;
  }
  
  .info-row {
    display: flex;
    justify-content: space-between;
    padding: 0.5rem 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    
    &:last-child {
      border-bottom: none;
    }
    
    span:first-child {
      color: rgba(255, 255, 255, 0.8);
    }
    
    span:last-child {
      color: #aeff00;
      font-weight: 600;
    }
  }
`;

const ContentSection = styled.div`
  background: rgba(5, 5, 15, 0.6);
  border: 1px solid rgba(174, 255, 0, 0.3);
  border-radius: 20px;
  padding: 1.5rem;
  animation: ${fadeSlideIn} 0.8s ease-out forwards;
  animation-delay: ${props => props.delay || '0s'};
  opacity: 0;
  backdrop-filter: blur(10px);
  
  h2 {
    color: #aeff00;
    font-size: 1.5rem;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    
    svg {
      margin-right: 0.8rem;
    }
  }
`;

const TabMenu = styled.div`
  display: flex;
  overflow-x: auto;
  padding-bottom: 0.5rem;
  margin-bottom: 1.5rem;
  
  &::-webkit-scrollbar {
    height: 3px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
  }
  
  &::-webkit-scrollbar-thumb {
    background: #aeff00;
    border-radius: 10px;
  }
`;

const TabButton = styled.button`
  background: ${props => props.active ? 'rgba(174, 255, 0, 0.2)' : 'transparent'};
  border: 1px solid ${props => props.active ? '#aeff00' : 'rgba(255, 255, 255, 0.3)'};
  color: ${props => props.active ? '#aeff00' : '#ffffff'};
  padding: 0.6rem 1.2rem;
  border-radius: 20px;
  margin-right: 0.8rem;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(174, 255, 0, 0.1);
  }
`;

const BenefitCard = styled.div`
  background: rgba(20, 20, 40, 0.5);
  border: 1px solid rgba(108, 0, 255, 0.3);
  border-radius: 15px;
  padding: 1.2rem;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(108, 0, 255, 0.3);
  }
  
  h4 {
    color: #aeff00;
    margin-bottom: 0.8rem;
    display: flex;
    align-items: center;
    
    svg {
      margin-right: 0.5rem;
    }
  }
  
  p {
    color: #ffffff;
    line-height: 1.5;
  }
`;

const LoadingBar = styled.div`
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  position: relative;
  overflow: hidden;
  margin: 1rem 0;
  
  &:after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: ${props => props.progress || '0%'};
    background: linear-gradient(90deg, #6c00ff 0%, #aeff00 100%);
    border-radius: 10px;
    transition: width 1s ease;
  }
`;

const InitiativeGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-top: 1rem;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const InitiativeCard = styled.div`
  background: rgba(20, 20, 40, 0.5);
  border: 1px solid rgba(174, 255, 0, 0.3);
  border-radius: 15px;
  padding: 1.2rem;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(174, 255, 0, 0.2);
  }
  
  h4 {
    color: #aeff00;
    margin-bottom: 0.8rem;
  }
  
  p {
    color: #ffffff;
    font-size: 0.95rem;
    margin-bottom: 1rem;
    line-height: 1.5;
  }
`;

const VoteButtons = styled.div`
  display: flex;
  gap: 0.8rem;
  margin-top: 1rem;
`;

const VoteButton = styled.button`
  background: ${props => props.voted ? 'rgba(174, 255, 0, 0.8)' : 'transparent'};
  color: ${props => props.voted ? '#000' : '#aeff00'};
  border: 1px solid #aeff00;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  
  svg {
    margin-right: 0.5rem;
  }
  
  &:hover {
    background: ${props => props.voted ? 'rgba(174, 255, 0, 0.8)' : 'rgba(174, 255, 0, 0.2)'};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const RoadmapSection = styled.div`
  position: relative;
  padding-left: 2rem;
  margin-top: 1rem;
  
  &:before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background: linear-gradient(to bottom, #aeff00, #6c00ff);
    border-radius: 3px;
  }
`;

const RoadmapItem = styled.div`
  position: relative;
  margin-bottom: 2rem;
  padding-left: 1.5rem;
  
  &:before {
    content: '';
    position: absolute;
    left: -1.5rem;
    top: 0;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background: ${props => props.unlocked ? '#aeff00' : props.current ? '#6c00ff' : 'rgba(255, 255, 255, 0.2)'};
    border: 2px solid ${props => props.unlocked ? '#aeff00' : props.current ? '#6c00ff' : 'rgba(255, 255, 255, 0.2)'};
    animation: ${props => props.current ? glowPulse : 'none'} 2s infinite;
  }
  
  h4 {
    color: ${props => props.unlocked ? '#aeff00' : props.current ? '#6c00ff' : '#ffffff'};
    margin-bottom: 0.5rem;
  }
  
  p {
    color: ${props => props.unlocked || props.current ? '#ffffff' : 'rgba(255, 255, 255, 0.6)'};
    font-size: 0.95rem;
    line-height: 1.5;
  }
`;

const StarsContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  pointer-events: none;
`;

const Star = styled.div`
  position: absolute;
  width: ${props => props.size || 3}px;
  height: ${props => props.size || 3}px;
  background-color: #ffffff;
  border-radius: 50%;
  opacity: 0.8;
  animation: ${starTwinkle} ${props => props.duration || 3}s infinite ease-in-out;
  animation-delay: ${props => props.delay || 0}s;
  top: ${props => props.top || 0}%;
  left: ${props => props.left || 0}%;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #aeff00;
  margin-bottom: 1rem;
  text-align: center;
  font-family: 'flegrei', sans-serif;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.p`
  color: #ffffff;
  font-size: 1.1rem;
  text-align: center;
  max-width: 800px;
  margin-bottom: 2rem;
  opacity: 0.9;
`;

const NFTDisplayContainer = styled.div`
  position: relative;
  width: 280px;
  height: 280px;
  margin: 0 auto 2rem;
  overflow: visible;
  order: -1;
  
  @media (max-width: 768px) {
    width: 240px;
    height: 240px;
  }
`;

const NFTOrbitalRing = styled.div`
  position: absolute;
  width: 320px;
  height: 320px;
  border: 1px solid rgba(174, 255, 0, 0.6);
  border-radius: 50%;
  top: -5%;
  left: -5%;
  transform: translate(-50%, -50%);
  animation: ${rotate} 20s linear infinite;
  
  &:before {
    content: '';
    position: absolute;
    width: 15px;
    height: 15px;
    background: #aeff00;
    border-radius: 50%;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    box-shadow: 0 0 10px #aeff00, 0 0 20px #aeff00;
  }
  
  @media (max-width: 768px) {
    width: 280px;
    height: 280px;
  }
`;

const NFTSecondRing = styled.div`
  position: absolute;
  width: 370px;
  height: 370px;
  border: 1px dashed rgba(108, 0, 255, 0.4);
  border-radius: 50%;
  top: -9%;
  left: -5%;
  transform: translate(-50%, -50%);
  animation: ${rotate} 30s linear infinite reverse;
  
  &:before {
    content: '';
    position: absolute;
    width: 12px;
    height: 12px;
    background: #6c00ff;
    border-radius: 50%;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    box-shadow: 0 0 10px #6c00ff, 0 0 15px #6c00ff;
  }
  
  @media (max-width: 768px) {
    width: 330px;
    height: 330px;
  }
`;

const NFTImage = styled.div`
  position: absolute;
  width: 220px;
  height: 220px;
  border-radius: 50%;
  overflow: hidden;
  background: radial-gradient(circle, #1a002a 0%, #000000 100%);
  animation: ${float} 6s ease-in-out infinite;
  box-shadow: 0 5px 25px rgba(108, 0, 255, 0.5);
  top: 20%;
  left: 13%;
  transform: translate(-50%, -50%);
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  
  &:before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, rgba(108, 0, 255, 0.2), rgba(174, 255, 0, 0.2));
    mix-blend-mode: screen;
    animation: ${pulse} 4s infinite ease-in-out;
  }
  
  @media (max-width: 768px) {
    width: 180px;
    height: 180px;
  }
`;

const AttributesTitle = styled.h3`
  color: #ffffff;
  font-size: 1.2rem;
  margin-top: 2rem;
  margin-bottom: 1rem;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  clear: both;
  
  svg {
    margin-right: 0.5rem;
    color: #aeff00;
  }
`;

const AttributesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  justify-content: center;
  margin-top: 1rem;
`;

const AttributeTag = styled.div`
  background: rgba(174, 255, 0, 0.1);
  border: 1px solid rgba(174, 255, 0, 0.3);
  border-radius: 20px;
  padding: 0.5rem 1rem;
  
  span {
    display: block;
    text-align: center;
    
    &:first-child {
      color: #aeff00;
      font-size: 0.9rem;
      margin-bottom: 0.2rem;
    }
    
    &:last-child {
      color: white;
      font-size: 1rem;
    }
  }
`;

const NavOptions = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const NavButton = styled(Link)`
  background-color: ${props => props.$primary ? 'rgba(174, 255, 0, 0.8)' : 'transparent'};
  color: ${props => props.$primary ? '#000000' : '#aeff00'};
  border: ${props => props.$primary ? 'none' : '2px solid #aeff00'};
  padding: 0.8rem 1.5rem;
  border-radius: 30px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-block;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(174, 255, 0, 0.3);
  }
`;

const Message = styled.div`
  color: #ffffff;
  background: rgba(108, 0, 255, 0.2);
  border: 1px solid rgba(108, 0, 255, 0.4);
  border-radius: 10px;
  padding: 1rem;
  max-width: 600px;
  margin: 2rem auto;
  text-align: center;
  
  h3 {
    color: #aeff00;
    margin-bottom: 0.5rem;
  }
  
  p {
    line-height: 1.6;
  }
`;

const ActionButton = styled.button`
  background: ${props => props.$secondary ? 'transparent' : 'linear-gradient(90deg, #6c00ff 0%, #aeff00 100%)'};
  border: ${props => props.$secondary ? '1px solid #aeff00' : 'none'};
  color: ${props => props.$secondary ? '#aeff00' : '#000000'};
  padding: 0.7rem 1.5rem;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  
  svg {
    margin-right: 0.5rem;
  }
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(108, 0, 255, 0.4);
  }
`;

const BabiesGallery = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
  width: 100%;
`;

const BabyCard = styled.div`
  background: rgba(20, 20, 40, 0.6);
  border: 1px solid rgba(174, 255, 0, 0.3);
  border-radius: 15px;
  padding: 1rem;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  
  &.selected {
    border: 2px solid #aeff00;
    box-shadow: 0 0 15px rgba(174, 255, 0, 0.5);
    transform: translateY(-5px);
    
    &::after {
      content: '✓';
      position: absolute;
      top: -10px;
      right: -10px;
      background: #aeff00;
      color: black;
      width: 25px;
      height: 25px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
    }
  }
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(174, 255, 0, 0.3);
  }
`;

const BabyImage = styled.div`
  width: 100%;
  aspect-ratio: 1;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 1rem;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 10px;
  }
`;

const BabyName = styled.h4`
  color: #aeff00;
  font-size: 1rem;
  margin-bottom: 0.5rem;
  text-align: center;
`;

const BabyId = styled.p`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.8rem;
  text-align: center;
`;

const LoadMoreButton = styled.button`
  background: linear-gradient(90deg, #6c00ff 0%, #aeff00 100%);
  border: none;
  color: black;
  padding: 0.7rem 1.5rem;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 2rem auto;
  display: block;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(108, 0, 255, 0.4);
  }
`;

const GalleryTab = styled.button`
  background: ${props => props.active ? 'rgba(174, 255, 0, 0.2)' : 'transparent'};
  border: 1px solid ${props => props.active ? '#aeff00' : 'rgba(255, 255, 255, 0.3)'};
  color: ${props => props.active ? '#aeff00' : '#ffffff'};
  padding: 0.6rem 1.2rem;
  border-radius: 20px;
  margin-right: 0.8rem;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  
  &:hover {
    background: rgba(174, 255, 0, 0.1);
  }
`;

const GalleryContainer = styled.div`
  margin-top: 1rem;
  width: 100%;
`;

const ConnectPrompt = styled.div`
  background: rgba(20, 20, 40, 0.6);
  border: 1px solid rgba(174, 255, 0, 0.3);
  border-radius: 15px;
  padding: 2rem;
  margin: 2rem 0;
  text-align: center;
  
  p {
    color: white;
    margin-bottom: 1.5rem;
  }
`;

const SectionTitle = styled.h3`
  color: #aeff00;
  font-size: 1.3rem;
  margin: 2rem 0 1rem;
  text-align: center;
  border-bottom: 1px solid rgba(174, 255, 0, 0.3);
  padding-bottom: 0.5rem;
`;

const Astroverse = () => {
  const [spaceBabies, setSpaceBabies] = useState([]);
  const [selectedBaby, setSelectedBaby] = useState(null);
  const [stars, setStars] = useState([]);
  const [activeTab, setActiveTab] = useState('benefits');
  const [activeGalleryView, setActiveGalleryView] = useState('all');
  const [votes, setVotes] = useState({});
  const [loadingProgress, setLoadingProgress] = useState(35);
  const [isLoading, setIsLoading] = useState(true);
  const [walletAddress, setWalletAddress] = useState('');
  const sectionRef = useRef(null);
  const tlRef = useRef(null);
  
  // Generate stars for the background
  useEffect(() => {
    const generatedStars = [];
    for (let i = 0; i < 100; i++) {
      generatedStars.push({
        id: i,
        size: Math.random() * 3 + 1,
        top: Math.random() * 100,
        left: Math.random() * 100,
        duration: Math.random() * 3 + 2,
        delay: Math.random() * 5
      });
    }
    setStars(generatedStars);
  }, []);
  
  // Check for wallet connection and load Space Babies
  useEffect(() => {
    const checkWalletAndLoadBabies = async () => {
      try {
        // First try to get wallet from session storage
        let address = sessionStorage.getItem('walletAddress');
        
        // Check for phantom wallet connection
        if (!address && window.solana && window.solana.isPhantom) {
          try {
            const response = await window.solana.connect({ onlyIfTrusted: true });
            if (response.publicKey) {
              address = response.publicKey.toString();
              console.log("Connected to Phantom wallet:", address);
            }
          } catch (error) {
            console.error("Phantom wallet auto-connect error:", error);
          }
        }
        
        // Check for Ethereum wallet
        if (!address && window.ethereum) {
          try {
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            if (accounts.length > 0) {
              address = accounts[0];
              console.log("Connected to Ethereum wallet:", address);
            }
          } catch (error) {
            console.error("Ethereum wallet error:", error);
          }
        }
        
        // Try to get the address from localStorage as a fallback
        if (!address) {
          const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
          if (currentUser && currentUser.wallet_address) {
            address = currentUser.wallet_address;
            console.log("Using wallet address from local storage:", address);
          }
        }
        
        if (address) {
          setWalletAddress(address);
          await loadUserBabies(address);
        } else {
          console.log("No wallet address found");
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error checking wallet:", error);
        setIsLoading(false);
      }
    };
    
    checkWalletAndLoadBabies();
  }, []);
  
  // Load user's Space Babies from all available sources
  const loadUserBabies = async (address) => {
    try {
      console.log("Loading babies for wallet:", address);
      let allBabies = [];
      
      // 1. Try to fetch babies from database
      try {
        // Get all babies associated with this user by wallet_address
        const { data: dbBabies, error: babiesError } = await supabase
          .from(TABLES.BABIES)
          .select('*')
          .eq('wallet_address', address)
          .order('created_at', { ascending: false });
        
        if (babiesError) {
          console.error("Error fetching user's babies by wallet address:", babiesError);
        } else if (dbBabies && dbBabies.length > 0) {
          console.log("Found babies in database:", dbBabies.length);
          
          // Format database babies to match our expected structure
          const formattedDbBabies = dbBabies.map(baby => ({
            id: baby.id || String(Math.random()).slice(2),
            name: baby.name || `Space Baby #${baby.id?.slice(-4) || Math.floor(Math.random() * 1000)}`,
            image: baby.image_url,
            attributes: baby.attributes || {},
            created_at: baby.created_at
          }));
          
          allBabies = [...allBabies, ...formattedDbBabies.filter(baby => baby.image)];
        }
      } catch (dbError) {
        console.error("Database error:", dbError);
      }
      
      // 2. Try to fetch babies from session storage
      try {
        // Check for the current Space Baby first
        const currentBaby = sessionStorage.getItem('currentSpaceBaby');
        if (currentBaby) {
          const parsedBaby = JSON.parse(currentBaby);
          if (parsedBaby && parsedBaby.image) {
            // Check if this baby is already in our allBabies array
            const alreadyExists = allBabies.some(
              baby => baby.id === parsedBaby.id || baby.image === parsedBaby.image
            );
            
            if (!alreadyExists) {
              allBabies.push({
                ...parsedBaby,
                id: parsedBaby.id || String(Math.random()).slice(2)
              });
            }
          }
        }
        
        // Check for all minted NFTs
        const savedNFTs = JSON.parse(sessionStorage.getItem('spaceBabiesNFTs') || '[]');
        if (savedNFTs.length > 0) {
          console.log("Found babies in session storage:", savedNFTs.length);
          
          // Filter out any babies that are already in our allBabies array
          const uniqueSavedBabies = savedNFTs.filter(savedBaby => {
            return !allBabies.some(baby => 
              baby.id === savedBaby.id || 
              (savedBaby.image && baby.image === savedBaby.image)
            );
          });
          
          allBabies = [...allBabies, ...uniqueSavedBabies];
        }
      } catch (sessionError) {
        console.error("Error checking session storage:", sessionError);
      }
      
      console.log("Total babies found:", allBabies.length);
      
      // Set all found babies to state
      if (allBabies.length > 0) {
        setSpaceBabies(allBabies);
        // Set the first baby as the selected one
        setSelectedBaby(allBabies[0]);
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error("Error loading user babies:", error);
      setIsLoading(false);
    }
  };
  
  // Handle connecting a wallet
  const handleConnectWallet = async () => {
    try {
      setIsLoading(true);
      
      // Try Phantom wallet first
      if (window.solana && window.solana.isPhantom) {
        const wallet = await connectPhantomWallet();
        if (wallet && wallet.address) {
          setWalletAddress(wallet.address);
          await loadUserBabies(wallet.address);
          return;
        }
      }
      
      // Try Ethereum wallet as fallback
      if (window.ethereum) {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          await loadUserBabies(accounts[0]);
          return;
        }
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error("Error connecting wallet:", error);
      setIsLoading(false);
    }
  };
  
  // Select a baby from the gallery
  const handleSelectBaby = (baby) => {
    setSelectedBaby(baby);
  };
  
  // Animation when component mounts
  useEffect(() => {
    if (sectionRef.current) {
      tlRef.current = gsap.timeline();
      
      // Animate the header elements
      tlRef.current.fromTo(
        '.header-content',
        {
          opacity: 0,
          y: -30
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out'
        }
      );
      
      // Animate the galaxy navigation
      tlRef.current.fromTo(
        '.galaxy-nav',
        {
          opacity: 0,
          y: 20
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out'
        },
        '-=0.5'
      );
      
      // Animate the dashboard elements with staggered timing
      tlRef.current.fromTo(
        '.dashboard-item',
        {
          opacity: 0,
          y: 30
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: 'power2.out'
        },
        '-=0.3'
      );
    }
  }, [selectedBaby]);
  
  const handleVote = (initiativeId, vote) => {
    setVotes(prev => ({
      ...prev,
      [initiativeId]: vote
    }));
    
    // Here you would typically send the vote to your backend
    console.log(`Voted ${vote} for initiative ${initiativeId}`);
  };
  
  // Filter babies based on the active gallery view
  const filteredBabies = () => {
    if (activeGalleryView === 'all') {
      return spaceBabies;
    } else if (activeGalleryView === 'recent') {
      return [...spaceBabies].sort((a, b) => {
        return new Date(b.created_at || 0) - new Date(a.created_at || 0);
      });
    } else if (activeGalleryView === 'rare') {
      return [...spaceBabies].filter(baby => {
        // Implement your own rarity logic here
        return true;
      });
    }
    return spaceBabies;
  };
  
  // Render the gallery view
  const renderGallery = () => {
    return (
      <GalleryContainer>
        <SectionTitle>Select a Space Baby</SectionTitle>
        
        <div>
          <GalleryTab 
            active={activeGalleryView === 'all'} 
            onClick={() => setActiveGalleryView('all')}
          >
            All Space Babies
          </GalleryTab>
          <GalleryTab 
            active={activeGalleryView === 'recent'} 
            onClick={() => setActiveGalleryView('recent')}
          >
            Recently Added
          </GalleryTab>
          <GalleryTab 
            active={activeGalleryView === 'rare'} 
            onClick={() => setActiveGalleryView('rare')}
          >
            Rare Traits
          </GalleryTab>
        </div>
        
        <BabiesGallery>
          {filteredBabies().map((baby, index) => (
            <BabyCard 
              key={baby.id || index} 
              onClick={() => handleSelectBaby(baby)}
              className={selectedBaby && selectedBaby.id === baby.id ? 'selected' : ''}
            >
              <BabyImage>
                <img src={baby.image} alt={baby.name} />
              </BabyImage>
              <BabyName>{baby.name}</BabyName>
              <BabyId>#{baby.id?.substring(0, 6) || index}</BabyId>
            </BabyCard>
          ))}
        </BabiesGallery>
        
        {spaceBabies.length > 12 && (
          <LoadMoreButton>
            Load More
          </LoadMoreButton>
        )}
      </GalleryContainer>
    );
  };

  return (
    <Section ref={sectionRef}>
      <Navbar />
      <StarsContainer>
        {stars.map(star => (
          <Star 
            key={star.id}
            size={star.size}
            top={star.top}
            left={star.left}
            duration={star.duration}
            delay={star.delay}
          />
        ))}
      </StarsContainer>
      
      <div className="header-content">
        <Title>Welcome to the Astroverse</Title>
        <Subtitle>
          As a guardian of a Space Baby, you have citizenship in the Astroverse galaxy. 
          Access exclusive content, participate in community initiatives, and help shape the future of SBU.
        </Subtitle>
      </div>
      
      <GalaxyNav className="galaxy-nav">
        <GalaxyLink to="/etherland">ETHERLand</GalaxyLink>
        <GalaxyLink to="/metroverse">METROVerse</GalaxyLink>
        <GalaxyLink to="/astroverse" active="true">ASTROVerse</GalaxyLink>
      </GalaxyNav>
      
      {isLoading ? (
        <Message>
          <h3>Loading your Space Babies...</h3>
          <LoadingBar progress={`${loadingProgress}%`} />
        </Message>
      ) : spaceBabies.length > 0 && selectedBaby ? (
        <CitizenDashboard>
          <CitizenBadge className="dashboard-item">
            <h3>Your Astroverse Citizen</h3>
            
            {/* Display NFT container first */}
            <NFTDisplayContainer>
              <NFTOrbitalRing />
              <NFTSecondRing />
              <NFTImage>
                <img src={selectedBaby.image} alt={selectedBaby.name} />
              </NFTImage>
            </NFTDisplayContainer>
            
            <CitizenshipInfo>
              <div className="info-row">
                <span>Name:</span>
                <span>{selectedBaby.name}</span>
              </div>
              <div className="info-row">
                <span>Citizenship ID:</span>
                <span>#{selectedBaby.id?.substring(0, 6) || Math.floor(Math.random() * 4000) + 1}</span>
              </div>
              <div className="info-row">
                <span>Status:</span>
                <span>Active Guardian</span>
              </div>
              <div className="info-row">
                <span>Joined:</span>
                <span>{new Date(selectedBaby.created_at || Date.now()).toLocaleDateString()}</span>
              </div>
            </CitizenshipInfo>
            
            <AttributesTitle>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
              </svg>
              Soul Attributes
            </AttributesTitle>
            <AttributesContainer>
              {selectedBaby.attributes && Array.isArray(selectedBaby.attributes) ? (
                // Handle array type attributes
                selectedBaby.attributes.map((attr, index) => (
                  <AttributeTag key={index}>
                    <span>{attr.trait_type}</span>
                    <span>{attr.value}</span>
                  </AttributeTag>
                ))
              ) : selectedBaby.attributes ? (
                // Handle object type attributes
                Object.entries(selectedBaby.attributes).map(([trait, value], index) => (
                  <AttributeTag key={index}>
                    <span>{trait}</span>
                    <span>{value}</span>
                  </AttributeTag>
                ))
              ) : (
                <p style={{ color: "white", textAlign: "center" }}>No attributes found</p>
              )}
            </AttributesContainer>
            
            {/* Display gallery below citizen info */}
            {renderGallery()}
          </CitizenBadge>
          
          <div>
            <ContentSection className="dashboard-item">
              <h2>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                  <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                </svg>
                Astroverse Hub
              </h2>
              
              <TabMenu>
                <TabButton active={activeTab === 'benefits'} onClick={() => setActiveTab('benefits')}>
                  Guardian Benefits
                </TabButton>
                <TabButton active={activeTab === 'community'} onClick={() => setActiveTab('community')}>
                  Community Initiatives
                </TabButton>
                <TabButton active={activeTab === 'roadmap'} onClick={() => setActiveTab('roadmap')}>
                  Future Roadmap
                </TabButton>
                <TabButton active={activeTab === 'income'} onClick={() => setActiveTab('income')}>
                  Passive Income
                </TabButton>
              </TabMenu>
              
              {/* The rest of the tab content remains the same */}
              {activeTab === 'benefits' && (
                <>
                  <BenefitCard>
                    <h4>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zm.995-14.901a1 1 0 1 0-1.99 0A5.002 5.002 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901z"/>
                      </svg>
                      Member-Only Content Access
                    </h4>
                    <p>Exclusive access to art drops, digital experiences, and special content curated for Astroverse citizens only.</p>
                    <ActionButton>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
                      </svg>
                      Access Content Hub
                    </ActionButton>
                  </BenefitCard>
                  
                  <BenefitCard>
                    <h4>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                        <path d="M8 3a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 3zm4 8a4 4 0 0 1-8 0V5a4 4 0 0 1 8 0v6z"/>
                      </svg>
                      Interactive Platforms
                    </h4>
                    <p>Access to members-only interactive platforms including DAO voting systems, community chat channels, and metaverse integration experiences.</p>
                    <ActionButton>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5z"/>
                      </svg>
                      Join Platforms
                    </ActionButton>
                  </BenefitCard>
                  
                  <BenefitCard>
                    <h4>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M13.442 2.558a.625.625 0 0 1 0 .884l-10 10a.625.625 0 1 1-.884-.884l10-10a.625.625 0 0 1 .884 0zM4.5 6a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm0 1a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zm7 6a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm0 1a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"/>
                      </svg>
                      Early Access to New Features
                    </h4>
                    <p>Be the first to experience new Space Babiez features, collaborations, and expansions into new galaxies.</p>
                    <ActionButton>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"/>
                      </svg>
                      Check Beta Features
                    </ActionButton>
                  </BenefitCard>
                </>
              )}
            </ContentSection>
            
            <NavOptions className="dashboard-item" style={{ animationDelay: '0.4s' }}>
              <NavButton to="/mint" $primary>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" style={{ marginRight: '0.5rem' }}>
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                  <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                </svg>
                Mint Another Space Baby
              </NavButton>
              
              <NavButton to="/profile">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" style={{ marginRight: '0.5rem' }}>
                  <path fillRule="evenodd" d="M6 1a.5.5 0 0 1 .5.5V3H9a.5.5 0 0 1 0 1H6.5v1.5a.5.5 0 0 1-1 0V4H3a.5.5 0 0 1 0-1h2.5V1.5A.5.5 0 0 1 6 1zm3 8a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V10h-1.5a.5.5 0 0 1 0-1H9V7.5a.5.5 0 0 1 1 0V9h1.5a.5.5 0 0 1 0 1H10v3.5a.5.5 0 0 1-.5.5H4a.5.5 0 0 1-.5-.5V10a.5.5 0 0 1 .5-.5h5z"/>
                </svg>
                View Full Profile
              </NavButton>
            </NavOptions>
          </div>
        </CitizenDashboard>
      ) : walletAddress ? (
        <Message>
          <h3>No Space Babies Found</h3>
          <p>You don't appear to have any Space Baby NFTs yet. Citizenship in the Astroverse is granted to Space Baby guardians.</p>
          <NavOptions style={{ marginTop: '1.5rem' }}>
            <NavButton to="/mint" $primary>Mint Your Space Baby</NavButton>
          </NavOptions>
        </Message>
      ) : (
        <ConnectPrompt>
          <h3>Connect Your Wallet</h3>
          <p>Connect your wallet to access your Space Babies and Astroverse citizenship benefits.</p>
          <ActionButton onClick={handleConnectWallet}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" style={{ marginRight: "0.5rem" }}>
              <path d="M0 3a2 2 0 0 1 2-2h13.5a.5.5 0 0 1 0 1H15v2a1 1 0 0 1 1 1v8.5a1.5 1.5 0 0 1-1.5 1.5h-12A2.5 2.5 0 0 1 0 12.5V3zm1 1.732V12.5A1.5 1.5 0 0 0 2.5 14h12a.5.5 0 0 0 .5-.5V5H2a1.99 1.99 0 0 1-1-.268zM1 3a1 1 0 0 0 1 1h12V2H2a1 1 0 0 0-1 1z"/>
            </svg>
            Connect Wallet
          </ActionButton>
        </ConnectPrompt>
      )}
    </Section>
  );
};

export default Astroverse;