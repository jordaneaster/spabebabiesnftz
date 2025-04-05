// SPDX-License-Identifier: MIT
pragma solidity ^0.8.29;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title SpaceBabyNFT
 * @dev ERC721 token for Space Babiez NFTs with enumeration and level-up functionality
 */
contract SpaceBabyNFT is ERC721, Ownable, ReentrancyGuard, Pausable {
    using Strings for uint256;
    
    // Total supply caps
    uint256 public constant MAX_ORIGIN_BABIES = 4000;
    uint256 public constant MAX_COLLECTOR_CARDS = 1000;
    
    // Current supply counters
    uint256 public totalOriginBabies;
    uint256 public totalCollectorCards;
    
    // Base URI for metadata
    string private _baseTokenURI;
    
    // Price configs
    uint256 public mintPrice = 0.08 ether; // Price in native currency (ETH/MATIC)
    
    // Mapping for token types and attributes
    mapping(uint256 => bool) public isCollectorCard;
    mapping(uint256 => uint256) public tokenLevel;
    mapping(uint256 => uint256) public tokenExperience;
    mapping(uint256 => string) public tokenRarity;
    
    // Events
    event BabyMinted(address indexed to, uint256 indexed tokenId, bool isCollectorCard);
    event LevelUp(uint256 indexed tokenId, uint256 newLevel);
    event ExperienceGained(uint256 indexed tokenId, uint256 amount);
    event PriceUpdated(uint256 newPrice);
    
    /**
     * @dev Constructor for SpaceBabyNFT
     * @param name Name of the NFT collection
     * @param symbol Symbol for the NFT collection
     * @param baseURI Base URI for token metadata
     * @param initialOwner Address that will be set as the initial owner
     */
    constructor(
        string memory name,
        string memory symbol,
        string memory baseURI,
        address initialOwner
    ) ERC721(name, symbol) Ownable(initialOwner) {
        _baseTokenURI = baseURI;
    }
    
    /**
     * @dev Mint a new Origin Baby NFT
     * @param to Address to mint the NFT to
     * @param rarity Rarity level of the NFT (Common, Uncommon, Rare, Epic, Legendary)
     */
    function mintOriginBaby(address to, string memory rarity) 
        external 
        payable 
        nonReentrant 
        whenNotPaused 
    {
        require(totalOriginBabies < MAX_ORIGIN_BABIES, "Max origin babies reached");
        require(msg.value >= mintPrice, "Insufficient funds");
        
        uint256 tokenId = totalOriginBabies + totalCollectorCards + 1;
        
        _safeMint(to, tokenId);
        isCollectorCard[tokenId] = false;
        tokenLevel[tokenId] = 1;
        tokenExperience[tokenId] = 0;
        tokenRarity[tokenId] = rarity;
        
        totalOriginBabies++;
        
        emit BabyMinted(to, tokenId, false);
        
        // Refund excess payment
        if (msg.value > mintPrice) {
            payable(msg.sender).transfer(msg.value - mintPrice);
        }
    }
    
    /**
     * @dev Mint a new Collector Card NFT
     * @param to Address to mint the NFT to
     * @param rarity Rarity level of the NFT
     */
    function mintCollectorCard(address to, string memory rarity) 
        external 
        payable 
        nonReentrant 
        whenNotPaused 
    {
        require(totalCollectorCards < MAX_COLLECTOR_CARDS, "Max collector cards reached");
        require(msg.value >= mintPrice, "Insufficient funds");
        
        uint256 tokenId = totalOriginBabies + totalCollectorCards + 1;
        
        _safeMint(to, tokenId);
        isCollectorCard[tokenId] = true;
        tokenLevel[tokenId] = 1;
        tokenExperience[tokenId] = 0;
        tokenRarity[tokenId] = rarity;
        
        totalCollectorCards++;
        
        emit BabyMinted(to, tokenId, true);
        
        // Refund excess payment
        if (msg.value > mintPrice) {
            payable(msg.sender).transfer(msg.value - mintPrice);
        }
    }
    
    /**
     * @dev Add experience to a token
     * @param tokenId Token ID to add experience to
     * @param amount Amount of experience to add
     */
    function addExperience(uint256 tokenId, uint256 amount) 
        external 
        whenNotPaused 
    {
        require(_tokenExists(tokenId), "Token does not exist");
        require(ownerOf(tokenId) == msg.sender || msg.sender == owner(), "Not authorized");
        
        tokenExperience[tokenId] += amount;
        
        emit ExperienceGained(tokenId, amount);
        
        // Check if token can level up
        _checkForLevelUp(tokenId);
    }
    
    /**
     * @dev Level up a token if it has enough experience
     * @param tokenId Token ID to level up
     */
    function levelUp(uint256 tokenId) 
        external 
        nonReentrant 
        whenNotPaused 
    {
        require(_tokenExists(tokenId), "Token does not exist");
        require(ownerOf(tokenId) == msg.sender, "Not token owner");
        
        // Experience required for level up = current level * 100
        uint256 requiredExp = tokenLevel[tokenId] * 100;
        require(tokenExperience[tokenId] >= requiredExp, "Not enough experience");
        
        // Get max level based on rarity
        uint256 maxLevel = getMaxLevel(tokenRarity[tokenId]);
        require(tokenLevel[tokenId] < maxLevel, "Max level reached");
        
        // Consume experience
        tokenExperience[tokenId] -= requiredExp;
        
        // Increase level
        tokenLevel[tokenId]++;
        
        emit LevelUp(tokenId, tokenLevel[tokenId]);
    }
    
    /**
     * @dev Get the maximum level a token can reach based on its rarity
     * @param rarity Rarity level
     * @return uint256 Maximum level
     */
    function getMaxLevel(string memory rarity) public pure returns (uint256) {
        bytes32 rarityHash = keccak256(abi.encodePacked(rarity));
        
        if (rarityHash == keccak256(abi.encodePacked("Common"))) return 3;
        if (rarityHash == keccak256(abi.encodePacked("Uncommon"))) return 4;
        if (rarityHash == keccak256(abi.encodePacked("Rare"))) return 5;
        if (rarityHash == keccak256(abi.encodePacked("Epic"))) return 6;
        if (rarityHash == keccak256(abi.encodePacked("Legendary"))) return 7;
        
        return 3; // Default to Common max level
    }
    
    /**
     * @dev Check if a token can level up and do it automatically
     * @param tokenId Token ID to check
     */
    function _checkForLevelUp(uint256 tokenId) internal {
        uint256 requiredExp = tokenLevel[tokenId] * 100;
        uint256 maxLevel = getMaxLevel(tokenRarity[tokenId]);
        
        if (tokenExperience[tokenId] >= requiredExp && tokenLevel[tokenId] < maxLevel) {
            tokenExperience[tokenId] -= requiredExp;
            tokenLevel[tokenId]++;
            
            emit LevelUp(tokenId, tokenLevel[tokenId]);
        }
    }
    
    /**
     * @dev Set the base URI for all tokens
     * @param baseURI New base URI
     */
    function setBaseURI(string memory baseURI) external onlyOwner {
        _baseTokenURI = baseURI;
    }
    
    /**
     * @dev Set the mint price
     * @param price New price in native currency
     */
    function setMintPrice(uint256 price) external onlyOwner {
        mintPrice = price;
        emit PriceUpdated(price);
    }
    
    /**
     * @dev Pause contract functionality
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpause contract functionality
     */
    function unpause() external onlyOwner {
        _unpause();
    }
    
    /**
     * @dev Withdraw funds from the contract using safe pattern
     */
    function withdraw() external onlyOwner nonReentrant {
        uint256 balance = address(this).balance;
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Transfer failed");
    }
    
    /**
     * @dev Override baseURI
     */
    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }
    
    /**
     * @dev Get the URI for a token
     * @param tokenId Token ID to get URI for
     * @return Token URI
     */
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_tokenExists(tokenId), "URI query for nonexistent token");
        
        string memory baseURI = _baseURI();
        return bytes(baseURI).length > 0 ? 
            string(abi.encodePacked(baseURI, tokenId.toString(), ".json")) : "";
    }
    
    /**
     * @dev Helper function to check if a token exists
     * @param tokenId Token ID to check
     * @return bool True if the token exists
     */
    function _tokenExists(uint256 tokenId) internal view returns (bool) {
        return _ownerOf(tokenId) != address(0);
    }
}
