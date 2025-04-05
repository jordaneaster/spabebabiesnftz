// SPDX-License-Identifier: MIT
pragma solidity ^0.8.29;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract SpaceBabiezNFT is ERC721, Ownable, ReentrancyGuard {
    uint256 public tokenCounter;
    uint256 public mintPrice = 0.08 ether;
    
    // Structure holding dynamic traits for each Space Baby.
    struct Baby {
        uint256 level;
        uint256 generation;
        uint256 experience;
        string rarity; // Common, Uncommon, Rare, Epic, Legendary
    }
    
    // Mapping from token ID to its traits.
    mapping(uint256 => Baby) public babyData;
    
    // Events
    event BabyMinted(address indexed to, uint256 indexed tokenId, uint256 generation);
    event LevelUp(uint256 indexed tokenId, uint256 newLevel);
    event ExperienceGained(uint256 indexed tokenId, uint256 amount);
    event BabyBred(uint256 indexed parent1Id, uint256 indexed parent2Id, uint256 indexed childId);
    
    constructor() ERC721("SpaceBabiez", "SBABY") Ownable(msg.sender) ReentrancyGuard() {
        tokenCounter = 0;
    }
    
    // Mint a new Space Baby NFT (only owner can mint the initial OG babies).
    function mintBaby(address to) public payable nonReentrant returns (uint256) {
        if (msg.sender != owner()) {
            require(msg.value >= mintPrice, "Insufficient payment");
        }
        
        uint256 tokenId = tokenCounter;
        _safeMint(to, tokenId);
        babyData[tokenId] = Baby({
            level: 1,
            generation: 1,
            experience: 0,
            rarity: "Common"
        });
        
        tokenCounter++;
        
        emit BabyMinted(to, tokenId, 1);
        
        // Refund excess payment
        if (msg.value > mintPrice) {
            payable(msg.sender).transfer(msg.value - mintPrice);
        }
        
        return tokenId;
    }
    
    // Mint a baby with specified rarity (only owner can call)
    function mintBabyWithRarity(address to, string memory rarity) public onlyOwner returns (uint256) {
        uint256 tokenId = tokenCounter;
        _safeMint(to, tokenId);
        babyData[tokenId] = Baby({
            level: 1,
            generation: 1,
            experience: 0,
            rarity: rarity
        });
        
        tokenCounter++;
        
        emit BabyMinted(to, tokenId, 1);
        
        return tokenId;
    }
    
    // Grow up the Space Baby (increase its level) if it has enough experience
    function growUp(uint256 tokenId) public {
        require(ownerOf(tokenId) == msg.sender, "Not the owner");
        Baby storage baby = babyData[tokenId];
        
        // Calculate required experience: level * 100
        uint256 requiredExp = baby.level * 100;
        require(baby.experience >= requiredExp, "Not enough experience");
        
        // Calculate max level based on rarity
        uint256 maxLevel = getMaxLevel(baby.rarity);
        require(baby.level < maxLevel, "Already at max level");
        
        // Consume experience and level up
        baby.experience -= requiredExp;
        baby.level += 1;
        
        emit LevelUp(tokenId, baby.level);
    }
    
    // Breed two Space Babiez to create a new baby.
    function breed(uint256 parent1, uint256 parent2) public nonReentrant returns (uint256) {
        require(ownerOf(parent1) == msg.sender && ownerOf(parent2) == msg.sender, "Must own both parents");
        require(parent1 != parent2, "Cannot breed with self");
        
        Baby memory baby1 = babyData[parent1];
        Baby memory baby2 = babyData[parent2];
        
        // Both parents must be at least level 2
        require(baby1.level >= 2 && baby2.level >= 2, "Parents must be at least level 2");
        
        // For demonstration, the new baby's generation is one more than the lower generation of the two parents.
        uint256 newGeneration = (baby1.generation < baby2.generation ? baby1.generation : baby2.generation) + 1;
        
        // Determine rarity of child based on parents' rarities
        string memory childRarity = determineChildRarity(baby1.rarity, baby2.rarity);
        
        uint256 tokenId = tokenCounter;
        _safeMint(msg.sender, tokenId);
        babyData[tokenId] = Baby({
            level: 1,
            generation: newGeneration,
            experience: 0,
            rarity: childRarity
        });
        
        tokenCounter++;
        
        emit BabyBred(parent1, parent2, tokenId);
        emit BabyMinted(msg.sender, tokenId, newGeneration);
        
        return tokenId;
    }
    
    // Function to update experience
    function addExperience(uint256 tokenId, uint256 exp) public {
        require(_tokenExists(tokenId), "Token doesn't exist");
        require(ownerOf(tokenId) == msg.sender || msg.sender == owner(), "Not authorized");
        
        Baby storage baby = babyData[tokenId];
        baby.experience += exp;
        
        emit ExperienceGained(tokenId, exp);
        
        // Check if baby can level up automatically
        _checkForLevelUp(tokenId);
    }
    
    // Check if a baby can level up and do it automatically
    function _checkForLevelUp(uint256 tokenId) internal {
        Baby storage baby = babyData[tokenId];
        uint256 requiredExp = baby.level * 100;
        uint256 maxLevel = getMaxLevel(baby.rarity);
        
        if (baby.experience >= requiredExp && baby.level < maxLevel) {
            baby.experience -= requiredExp;
            baby.level++;
            
            emit LevelUp(tokenId, baby.level);
        }
    }
    
    // Get maximum level based on rarity
    function getMaxLevel(string memory rarity) public pure returns (uint256) {
        bytes32 rarityHash = keccak256(abi.encodePacked(rarity));
        
        if (rarityHash == keccak256(abi.encodePacked("Common"))) return 3;
        if (rarityHash == keccak256(abi.encodePacked("Uncommon"))) return 4;
        if (rarityHash == keccak256(abi.encodePacked("Rare"))) return 5;
        if (rarityHash == keccak256(abi.encodePacked("Epic"))) return 6;
        if (rarityHash == keccak256(abi.encodePacked("Legendary"))) return 7;
        
        return 3; // Default to Common max level
    }
    
    // Determine child's rarity based on parents' rarities
    function determineChildRarity(string memory rarity1, string memory rarity2) internal view returns (string memory) {
        // Basic implementation - more sophisticated logic could be used
        bytes32 r1 = keccak256(abi.encodePacked(rarity1));
        bytes32 r2 = keccak256(abi.encodePacked(rarity2));
        
        // If both parents are Legendary, child is Legendary
        if (r1 == keccak256(abi.encodePacked("Legendary")) && 
            r2 == keccak256(abi.encodePacked("Legendary"))) {
            return "Legendary";
        }
        
        // If one parent is Legendary, 50% chance for Epic
        if (r1 == keccak256(abi.encodePacked("Legendary")) || 
            r2 == keccak256(abi.encodePacked("Legendary"))) {
            // Use a hash of block data to generate "randomness" - replacing deprecated block.difficulty
            if (uint256(keccak256(abi.encodePacked(block.timestamp, block.prevrandao))) % 2 == 0) {
                return "Epic";
            } else {
                return "Rare";
            }
        }
        
        // Default to Common
        return "Common";
    }
    
    // Set mint price
    function setMintPrice(uint256 price) external onlyOwner {
        mintPrice = price;
    }
    
    // Withdraw contract funds
    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Transfer failed");
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
