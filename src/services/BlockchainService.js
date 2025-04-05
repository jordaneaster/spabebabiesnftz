import { ethers } from 'ethers';
// Import contract addresses with a fallback if the file doesn't exist yet
let contractAddresses = {
  SpaceBabyNFT: "",
  SpaceBabiezNFT: "",
  NFTMarketplace: "",
  NFTStaking: "",
  AstroMilkToken: ""
};

try {
  contractAddresses = require('../../contracts/contract-addresses.json');
} catch (error) {
  console.warn("contract-addresses.json not found. Using empty addresses.");
  console.warn("You may need to deploy your contracts first.");
}

const NETWORK_CONFIG = {
  polygon: {
    chainId: '0x89', // 137 in decimal
    name: 'Polygon Mainnet',
    rpcUrl: 'https://polygon-rpc.com',
    blockExplorer: 'https://polygonscan.com',
    contractAddresses: {}, // Will be populated for mainnet
  },
  ganache: {
    chainId: '0x539', // 1337 in decimal (default Ganache chain ID)
    name: 'Ganache Local',
    rpcUrl: 'http://127.0.0.1:7545', // Default Ganache port
    blockExplorer: '',
    contractAddresses: contractAddresses, // Loaded from Truffle deployment
  }
};

// Import contract ABIs from Truffle builds
const importContract = async (contractName) => {
  try {
    return await import(`../../artifacts/contracts/${contractName}.json`);
  } catch (error) {
    console.error(`Failed to load contract ABI for ${contractName}:`, error);
    throw error;
  }
};

class BlockchainService {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.contracts = {};
    this.isInitialized = false;
    this.currentNetwork = 'ganache'; // Default to ganache for development
    this.mnemonic = ''; // Will store the mnemonic phrase
    this.contractTypes = ['SpaceBabyNFT', 'SpaceBabiezNFT', 'NFTMarketplace', 'NFTStaking', 'AstroMilkToken'];
  }
  
  /**
   * Set which network to use (polygon or ganache)
   */
  setNetwork(networkName) {
    if (NETWORK_CONFIG[networkName]) {
      this.currentNetwork = networkName;
      this.isInitialized = false; // Force re-initialization with new network
      return true;
    }
    return false;
  }
  
  /**
   * Set Ganache mnemonic passphrase
   */
  setMnemonic(mnemonic) {
    this.mnemonic = mnemonic;
    this.isInitialized = false; // Force re-initialization with new mnemonic
    return true;
  }
  
  /**
   * Initialize blockchain service with provider and signer
   */
  async initialize() {
    try {
      // For Ganache, we can connect directly to the RPC URL
      if (this.currentNetwork === 'ganache') {
        // Create provider from RPC URL - updated for ethers v6
        this.provider = new ethers.JsonRpcProvider(NETWORK_CONFIG.ganache.rpcUrl);
        
        // If we have a mnemonic, create a wallet from it
        if (this.mnemonic) {
          // Updated for ethers v6
          const wallet = ethers.Wallet.fromPhrase(this.mnemonic);
          this.signer = wallet.connect(this.provider);
        } else {
          // Get accounts differently in v6
          const accounts = await this.provider.listAccounts();
          if (accounts.length > 0) {
            this.signer = await this.provider.getSigner(accounts[0].address);
          } else {
            console.error('No accounts found in Ganache');
            return false;
          }
        }
        
        // Initialize contracts using Truffle artifacts
        await this.initializeContracts();
        
        this.isInitialized = true;
        return true;
      }
      // For other networks, use MetaMask
      else if (window.ethereum) {
        // Create provider and signer - updated for ethers v6
        this.provider = new ethers.BrowserProvider(window.ethereum);
        this.signer = await this.provider.getSigner();
        
        // Initialize contracts
        await this.initializeContracts();
        
        this.isInitialized = true;
        return true;
      } else {
        console.error('Ethereum provider not found');
        return false;
      }
    } catch (error) {
      console.error('Failed to initialize blockchain service', error);
      this.isInitialized = false;
      return false;
    }
  }
  
  /**
   * Initialize contracts using Truffle artifacts
   */
  async initializeContracts() {
    try {
      for (const contractType of this.contractTypes) {
        // Get the deployed address from config
        const address = NETWORK_CONFIG[this.currentNetwork].contractAddresses[contractType];
        
        if (!address) {
          console.warn(`No address found for ${contractType} on ${this.currentNetwork}`);
          continue;
        }
        
        // Import the contract artifact
        const artifact = await importContract(contractType);
        
        // Create contract instance
        this.contracts[contractType] = new ethers.Contract(
          address,
          artifact.abi,
          this.signer
        );
        
        console.log(`${contractType} initialized at address ${address}`);
      }
      
      return true;
    } catch (error) {
      console.error('Failed to initialize contracts:', error);
      return false;
    }
  }
  
  /**
   * Get a contract instance by type
   */
  getContract(contractType) {
    if (!this.contracts[contractType]) {
      throw new Error(`Contract ${contractType} not initialized`);
    }
    return this.contracts[contractType];
  }
  
  /**
   * Get all deployed contract addresses
   */
  getContractAddresses() {
    return NETWORK_CONFIG[this.currentNetwork].contractAddresses;
  }
  
  /**
   * Get NFTs owned by the connected wallet
   */
  async getOwnedNFTs(walletAddress, contractType = 'SpaceBabyNFT') {
    if (!this.isInitialized) await this.initialize();
    
    try {
      const contract = this.getContract(contractType);
      
      // This will depend on your contract implementation
      const balance = await contract.balanceOf(walletAddress);
      const tokenCount = Number(balance); // Updated for ethers v6
      
      const ownedTokens = [];
      for (let i = 0; i < tokenCount; i++) {
        const tokenId = await contract.tokenOfOwnerByIndex(walletAddress, i);
        const tokenURI = await contract.tokenURI(tokenId);
        
        // Fetch metadata from IPFS or other storage
        const metadata = await this.fetchMetadata(tokenURI);
        
        ownedTokens.push({
          id: tokenId.toString(),
          tokenURI,
          metadata
        });
      }
      
      return ownedTokens;
    } catch (error) {
      console.error('Error getting owned NFTs:', error);
      return [];
    }
  }
  
  /**
   * Fetch metadata from IPFS or other storage
   */
  async fetchMetadata(tokenURI) {
    try {
      // Convert IPFS URI to HTTP if needed
      let uri = tokenURI;
      if (tokenURI.startsWith('ipfs://')) {
        uri = tokenURI.replace('ipfs://', 'https://ipfs.io/ipfs/');
      }
      
      const response = await fetch(uri);
      const metadata = await response.json();
      return metadata;
    } catch (error) {
      console.error('Error fetching metadata:', error);
      return {};
    }
  }
  
  /**
   * Level up an NFT
   */
  async levelUpNFT(tokenId, contractType = 'SpaceBabyNFT') {
    if (!this.isInitialized) await this.initialize();
    
    try {
      const contract = this.getContract(contractType);
      const tx = await contract.levelUp(tokenId);
      await tx.wait();
      return true;
    } catch (error) {
      console.error('Error leveling up NFT:', error);
      return false;
    }
  }
  
  /**
   * Stake an NFT for rewards
   */
  async stakeNFT(tokenId) {
    if (!this.isInitialized) await this.initialize();
    
    try {
      const contract = this.getContract('NFTStaking');
      const tx = await contract.stake(tokenId);
      await tx.wait();
      return true;
    } catch (error) {
      console.error('Error staking NFT:', error);
      return false;
    }
  }
  
  /**
   * Claim rewards from staking
   */
  async claimRewards(tokenId) {
    if (!this.isInitialized) await this.initialize();
    
    try {
      const contract = this.getContract('NFTStaking');
      const tx = await contract.claim(tokenId);
      await tx.wait();
      return true;
    } catch (error) {
      console.error('Error claiming rewards:', error);
      return false;
    }
  }
  
  /**
   * Mint a new NFT
   */
  async mintNFT(to, rarity, contractType = 'SpaceBabyNFT') {
    if (!this.isInitialized) await this.initialize();
    
    try {
      const contract = this.getContract(contractType);
      
      let tx;
      if (contractType === 'SpaceBabyNFT') {
        // Check if it's Origin Baby or Collector Card
        const isCollector = Math.random() > 0.7; // 30% chance for collector cards
        
        if (isCollector) {
          tx = await contract.mintCollectorCard(to, rarity, {
            value: ethers.parseEther('0.08') // Updated for ethers v6
          });
        } else {
          tx = await contract.mintOriginBaby(to, rarity, {
            value: ethers.parseEther('0.08') // Updated for ethers v6
          });
        }
      } else if (contractType === 'SpaceBabiezNFT') {
        tx = await contract.mintBaby(to);
      }
      
      await tx.wait();
      return tx;
    } catch (error) {
      console.error('Error minting NFT:', error);
      throw error;
    }
  }
  
  /**
   * List NFT in marketplace
   */
  async listNFTForSale(nftAddress, tokenId, price) {
    if (!this.isInitialized) await this.initialize();
    
    try {
      const marketplace = this.getContract('NFTMarketplace');
      const nftContract = new ethers.Contract(
        nftAddress,
        ['function approve(address to, uint256 tokenId)'],
        this.signer
      );
      
      // Approve marketplace to transfer the NFT
      const approveTx = await nftContract.approve(marketplace.address, tokenId);
      await approveTx.wait();
      
      // List the item
      const tx = await marketplace.listItem(nftAddress, tokenId, price);
      await tx.wait();
      
      return tx;
    } catch (error) {
      console.error('Error listing NFT for sale:', error);
      throw error;
    }
  }
}

export default new BlockchainService();
