import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { ethers } from 'ethers';
import { useUserAuth } from '../context/UserAuthContext';

// Animations
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(174, 255, 0, 0.7); }
  70% { box-shadow: 0 0 0 10px rgba(174, 255, 0, 0); }
  100% { box-shadow: 0 0 0 0 rgba(174, 255, 0, 0); }
`;

// Styled Components
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  color: ${props => props.theme.text};
`;

const Header = styled.div`
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

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  
  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: rgba(36, 37, 38, 0.8);
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  
  h2 {
    color: #aeff00;
    margin-bottom: 1.5rem;
    text-align: center;
    font-size: ${props => props.theme.fontxl};
    
    @media (max-width: 768px) {
      font-size: ${props => props.theme.fontlg};
    }
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  
  label {
    font-size: ${props => props.theme.fontsm};
    color: ${props => `rgba(${props.theme.textRgba}, 0.9)`};
  }
  
  input, select {
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(174, 255, 0, 0.3);
    border-radius: 8px;
    padding: 0.75rem;
    color: white;
    font-size: ${props => props.theme.fontmd};
    
    &:focus {
      outline: none;
      border-color: #aeff00;
    }
  }
`;

const Button = styled.button`
  background: linear-gradient(90deg, #aeff00, #3081ed);
  background-size: 200% auto;
  color: black;
  border: none;
  padding: 1rem 2rem;
  border-radius: 50px;
  font-size: ${props => props.theme.fontmd};
  font-weight: bold;
  cursor: pointer;
  margin-top: 1rem;
  transition: 0.3s;
  animation: ${shimmer} 3s infinite linear;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(174, 255, 0, 0.2);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const ContractCard = styled.div`
  background: rgba(36, 37, 38, 0.8);
  border-radius: 15px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  
  h3 {
    font-size: ${props => props.theme.fontlg};
    margin-bottom: 1rem;
    color: #3081ed;
  }
  
  p {
    font-size: ${props => props.theme.fontsm};
    color: ${props => `rgba(${props.theme.textRgba}, 0.8)`};
    margin-bottom: 1rem;
  }
`;

const ContractAddress = styled.div`
  background: rgba(0, 0, 0, 0.3);
  border: 1px dashed rgba(174, 255, 0, 0.3);
  border-radius: 8px;
  padding: 0.75rem;
  font-family: monospace;
  font-size: ${props => props.theme.fontsm};
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  button {
    background: rgba(174, 255, 0, 0.2);
    border: none;
    border-radius: 4px;
    padding: 0.25rem 0.5rem;
    color: #aeff00;
    cursor: pointer;
    
    &:hover {
      background: rgba(174, 255, 0, 0.4);
    }
  }
`;

const TransactionsList = styled.div`
  margin-top: 2rem;
`;

const TransactionItem = styled.div`
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  
  .tx-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
  }
  
  .tx-title {
    color: #3081ed;
    font-weight: bold;
  }
  
  .tx-status {
    padding: 0.25rem 0.5rem;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: bold;
    
    &.pending {
      background: rgba(255, 152, 0, 0.2);
      color: #ff9800;
    }
    
    &.success {
      background: rgba(76, 175, 80, 0.2);
      color: #4CAF50;
    }
    
    &.failed {
      background: rgba(244, 67, 54, 0.2);
      color: #F44336;
    }
  }
  
  .tx-hash {
    font-family: monospace;
    font-size: ${props => props.theme.fontxs};
    color: ${props => `rgba(${props.theme.textRgba}, 0.7)`};
    margin-bottom: 0.5rem;
  }
  
  .tx-details {
    font-size: ${props => props.theme.fontxs};
    color: ${props => `rgba(${props.theme.textRgba}, 0.9)`};
  }
`;

const StatusBadge = styled.div`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: bold;
  margin-top: 1rem;
  
  &.connected {
    background: rgba(76, 175, 80, 0.2);
    color: #4CAF50;
    animation: ${pulse} 2s infinite;
  }
  
  &.disconnected {
    background: rgba(244, 67, 54, 0.2);
    color: #F44336;
  }
`;

const NetworkSelector = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
  gap: 1rem;
  
  button {
    background: rgba(36, 37, 38, 0.8);
    border: 1px solid rgba(174, 255, 0, 0.3);
    border-radius: 30px;
    padding: 0.5rem 1.5rem;
    color: white;
    font-size: ${props => props.theme.fontsm};
    cursor: pointer;
    transition: all 0.3s ease;
    
    &.active {
      background: linear-gradient(90deg, #3081ed, #9b51e0);
      border-color: transparent;
      transform: translateY(-3px);
      box-shadow: 0 5px 10px rgba(48, 129, 237, 0.3);
    }
    
    &:hover:not(.active) {
      border-color: #aeff00;
    }
  }
`;

// Mock contract data
const contractsData = {
  mainnet: [
    { 
      name: 'Space Babiez NFT', 
      address: '0x1234567890123456789012345678901234567890',
      description: 'Main NFT contract for Space Babiez collection' 
    },
    { 
      name: 'Staking Pool', 
      address: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
      description: 'Staking contract for earning rewards with Space Babiez' 
    }
  ],
  testnet: [
    { 
      name: 'Space Babiez NFT (Testnet)', 
      address: '0x9876543210987654321098765432109876543210',
      description: 'Test version of Space Babiez NFT contract' 
    },
    { 
      name: 'Staking Pool (Testnet)', 
      address: '0xfedcbafedcbafedcbafedcbafedcbafedcbafedc',
      description: 'Test version of staking contract' 
    }
  ]
};

// Mock transaction data
const mockTransactions = [
  {
    id: 1,
    title: 'Mint Space Baby',
    hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    status: 'success',
    timestamp: '2023-11-30T15:45:22',
    details: '1 Space Baby minted for 0.05 ETH'
  },
  {
    id: 2,
    title: 'Stake Space Baby',
    hash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
    status: 'pending',
    timestamp: '2023-11-30T16:12:05',
    details: 'Staking Space Baby #1234 in pool'
  }
];

const ContractInteraction = () => {
  const { walletAddress, walletConnected } = useUserAuth();
  const [selectedNetwork, setSelectedNetwork] = useState('mainnet');
  const [mintAmount, setMintAmount] = useState(1);
  const [tokenId, setTokenId] = useState('');
  const [stakeAmount, setStakeAmount] = useState('');
  const [transactions, setTransactions] = useState(mockTransactions);
  const [processing, setProcessing] = useState(false);
  
  // Function to handle minting
  const handleMint = async (e) => {
    e.preventDefault();
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
        id: transactions.length + 1,
        title: `Mint ${mintAmount} Space ${mintAmount > 1 ? 'Babies' : 'Baby'}`,
        hash: `0x${Math.random().toString(16).substring(2, 66)}`,
        status: 'success',
        timestamp: new Date().toISOString(),
        details: `${mintAmount} Space ${mintAmount > 1 ? 'Babies' : 'Baby'} minted for ${mintAmount * 0.05} ETH`
      };
      
      setTransactions([newTx, ...transactions]);
      
      alert(`Successfully minted ${mintAmount} Space ${mintAmount > 1 ? 'Babies' : 'Baby'}!`);
    } catch (error) {
      console.error('Minting error:', error);
      alert('Error minting: ' + error.message);
    } finally {
      setProcessing(false);
    }
  };
  
  // Function to handle staking
  const handleStake = async (e) => {
    e.preventDefault();
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
        id: transactions.length + 1,
        title: 'Stake Space Baby',
        hash: `0x${Math.random().toString(16).substring(2, 66)}`,
        status: 'pending',
        timestamp: new Date().toISOString(),
        details: `Staking Space Baby #${tokenId} in pool`
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
  
  // Function to handle sending AstroMilk
  const handleSendMilk = async (e) => {
    e.preventDefault();
    if (!walletConnected) {
      alert('Please connect your wallet first');
      return;
    }
    
    if (!stakeAmount) {
      alert('Please enter an amount to send');
      return;
    }
    
    setProcessing(true);
    
    try {
      // Simulate a blockchain transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Add the transaction to our list
      const newTx = {
        id: transactions.length + 1,
        title: 'Send AstroMilk',
        hash: `0x${Math.random().toString(16).substring(2, 66)}`,
        status: 'pending',
        timestamp: new Date().toISOString(),
        details: `Sending ${stakeAmount} MILK tokens`
      };
      
      setTransactions([newTx, ...transactions]);
      
      alert(`AstroMilk transaction submitted!`);
    } catch (error) {
      console.error('Token transfer error:', error);
      alert('Error sending AstroMilk: ' + error.message);
    } finally {
      setProcessing(false);
    }
  };
  
  // Function to copy contract address
  const copyAddress = (address) => {
    navigator.clipboard.writeText(address);
    alert('Address copied to clipboard!');
  };
  
  // Format transaction time
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };
  
  return (
    <Container>
      <Header>
        <h1>Space Babiez Contract Portal</h1>
        <p>
          Interact directly with the Space Babiez blockchain contracts.
          Mint new Space Babiez, stake your NFTs, and manage your cosmic portfolio.
        </p>
        
        <StatusBadge className={walletConnected ? 'connected' : 'disconnected'}>
          {walletConnected 
            ? `Connected: ${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}` 
            : 'Wallet Disconnected'}
        </StatusBadge>
      </Header>
      
      <NetworkSelector>
        <button 
          className={selectedNetwork === 'mainnet' ? 'active' : ''} 
          onClick={() => setSelectedNetwork('mainnet')}
        >
          Ethereum Mainnet
        </button>
        <button 
          className={selectedNetwork === 'testnet' ? 'active' : ''} 
          onClick={() => setSelectedNetwork('testnet')}
        >
          Goerli Testnet
        </button>
      </NetworkSelector>
      
      <div>
        <h2>Available Contracts</h2>
        {contractsData[selectedNetwork].map((contract, index) => (
          <ContractCard key={index}>
            <h3>{contract.name}</h3>
            <p>{contract.description}</p>
            <ContractAddress>
              <span>{contract.address}</span>
              <button onClick={() => copyAddress(contract.address)}>Copy</button>
            </ContractAddress>
          </ContractCard>
        ))}
      </div>
      
      <Grid>
        <Card>
          <h2>Mint Space Babiez</h2>
          <Form onSubmit={handleMint}>
            <InputGroup>
              <label>Number of Space Babiez to mint:</label>
              <input 
                type="number" 
                min="1" 
                max="10" 
                value={mintAmount} 
                onChange={(e) => setMintAmount(parseInt(e.target.value))} 
                disabled={processing}
              />
            </InputGroup>
            
            <InputGroup>
              <label>Total Cost:</label>
              <input 
                type="text" 
                value={`${(mintAmount * 0.05).toFixed(2)} ETH`} 
                disabled 
              />
            </InputGroup>
            
            <Button type="submit" disabled={processing || !walletConnected}>
              {processing ? 'Processing...' : 'Mint Space Babiez'}
            </Button>
          </Form>
        </Card>
        
        <Card>
          <h2>Stake Your Space Babiez</h2>
          <Form onSubmit={handleStake}>
            <InputGroup>
              <label>Space Baby Token ID:</label>
              <input 
                type="number" 
                placeholder="Enter token ID" 
                value={tokenId} 
                onChange={(e) => setTokenId(e.target.value)} 
                disabled={processing}
              />
            </InputGroup>
            
            <InputGroup>
              <label>Staking Period:</label>
              <select>
                <option value="30">30 days (10% APY)</option>
                <option value="90">90 days (15% APY)</option>
                <option value="180">180 days (20% APY)</option>
                <option value="365">365 days (25% APY)</option>
              </select>
            </InputGroup>
            
            <Button type="submit" disabled={processing || !walletConnected || !tokenId}>
              {processing ? 'Processing...' : 'Stake Space Baby'}
            </Button>
          </Form>
        </Card>
      </Grid>
      
      <Card style={{ marginTop: '2rem' }}>
        <h2>Send AstroMilk Tokens</h2>
        <Form onSubmit={handleSendMilk}>
          <InputGroup>
            <label>Recipient Address:</label>
            <input 
              type="text" 
              placeholder="Enter wallet address" 
              disabled={processing}
            />
          </InputGroup>
          
          <InputGroup>
            <label>Amount:</label>
            <input 
              type="text" 
              placeholder="Enter MILK amount" 
              value={stakeAmount} 
              onChange={(e) => setStakeAmount(e.target.value)} 
              disabled={processing}
            />
          </InputGroup>
          
          <Button type="submit" disabled={processing || !walletConnected || !stakeAmount}>
            {processing ? 'Processing...' : 'Send AstroMilk'}
          </Button>
        </Form>
      </Card>
      
      <TransactionsList>
        <h2>Recent Transactions</h2>
        {transactions.length > 0 ? (
          transactions.map(tx => (
            <TransactionItem key={tx.id}>
              <div className="tx-header">
                <span className="tx-title">{tx.title}</span>
                <span className={`tx-status ${tx.status}`}>
                  {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                </span>
              </div>
              <div className="tx-hash">Tx: {tx.hash}</div>
              <div className="tx-details">{tx.details}</div>
              <div className="tx-details">Time: {formatTime(tx.timestamp)}</div>
            </TransactionItem>
          ))
        ) : (
          <p>No transactions yet</p>
        )}
      </TransactionsList>
    </Container>
  );
};

export default ContractInteraction;
