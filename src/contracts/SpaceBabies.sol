// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title SpaceBabies
 * @dev ERC721 token for Space Babies NFT collection
 */
contract SpaceBabies is ERC721Enumerable, Ownable {
    struct Counter {
        uint256 _value; // default: 0
    }

    function current(Counter storage counter) internal view returns (uint256) {
        return counter._value;
    }

    function increment(Counter storage counter) internal {
        unchecked {
            counter._value += 1;
        }
    }

    function reset(Counter storage counter) internal {
        counter._value = 0;
    }
    using Strings for uint256;

    // Counter for token IDs
    Counters.Counter private _tokenIdTracker;
    
    // Base URI for metadata
    string private _baseTokenURI;
    
    // Mapping from token ID to custom URI (if different from baseURI + tokenId)
    mapping(uint256 => string) private _tokenURIs;
    
    // Price to mint one NFT
    uint256 public mintPrice = 0.01 ether;
    
    // Max supply of tokens
    uint256 public maxSupply = 10000;
    
    // Events
    event MintedNFT(address indexed owner, uint256 indexed tokenId, string tokenURI);
    
    /**
     * @dev Constructor
     */
    constructor() ERC721("Space Babies", "SBABY") {
        _baseTokenURI = "";
    }
    
    /**
     * @dev Returns URI for a given token ID
     */
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");

        string memory _tokenURI = _tokenURIs[tokenId];
        
        // If there's no custom URI, use the base URI + token ID
        if (bytes(_tokenURI).length > 0) {
            return _tokenURI;
        }

        return bytes(_baseTokenURI).length > 0 ? 
            string(abi.encodePacked(_baseTokenURI, tokenId.toString())) : 
            "";
    }
    
    /**
     * @dev Sets the base URI for all token IDs
     */
    function setBaseURI(string memory baseURI) external onlyOwner {
        _baseTokenURI = baseURI;
    }
    
    /**
     * @dev Sets a specific token URI
     */
    function setTokenURI(uint256 tokenId, string memory _tokenURI) external onlyOwner {
        require(_exists(tokenId), "ERC721Metadata: URI set of nonexistent token");
        _tokenURIs[tokenId] = _tokenURI;
    }
    
    /**
     * @dev Sets the mint price
     */
    function setMintPrice(uint256 _mintPrice) external onlyOwner {
        mintPrice = _mintPrice;
    }
    
    /**
     * @dev Mints a new NFT
     * @param tokenURI The metadata URI for this token
     */
    function mint(string memory tokenURI) public payable returns (uint256) {
        require(totalSupply() < maxSupply, "Max supply reached");
        require(msg.value >= mintPrice, "Insufficient payment");
        
        // Get the current token ID
        uint256 tokenId = _tokenIdTracker.current();
        
        // Mint the token
        _safeMint(msg.sender, tokenId);
        
        // Set the token URI if provided
        if (bytes(tokenURI).length > 0) {
            _tokenURIs[tokenId] = tokenURI;
        }
        
        // Emit event
        emit MintedNFT(msg.sender, tokenId, tokenURI);
        
        // Increment the token ID for next mint
        _tokenIdTracker.increment();
        
        return tokenId;
    }
    
    /**
     * @dev Withdraw contract balance to owner
     */
    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance to withdraw");
        
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Withdrawal failed");
    }
    
    /**
     * @dev Override base URI to allow customization
     */
    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }
}
