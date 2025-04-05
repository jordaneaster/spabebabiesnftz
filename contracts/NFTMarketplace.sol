// SPDX-License-Identifier: MIT
pragma solidity ^0.8.29;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract NFTMarketplace {
    struct Listing {
        address seller;
        uint256 price;
    }
    
    // Mapping: NFT contract address => tokenId => Listing.
    mapping(address => mapping(uint256 => Listing)) public listings;
    
    event Listed(address indexed nftAddress, uint256 indexed tokenId, address seller, uint256 price);
    event Sold(address indexed nftAddress, uint256 indexed tokenId, address buyer, uint256 price);
    event Delisted(address indexed nftAddress, uint256 indexed tokenId, address seller);
    
    // List an NFT for sale.
    function listItem(address nftAddress, uint256 tokenId, uint256 price) public {
        IERC721 nft = IERC721(nftAddress);
        require(nft.ownerOf(tokenId) == msg.sender, "Not the owner");
        require(
            nft.getApproved(tokenId) == address(this) || nft.isApprovedForAll(msg.sender, address(this)),
            "Marketplace not approved"
        );
        
        listings[nftAddress][tokenId] = Listing({
            seller: msg.sender,
            price: price
        });
        emit Listed(nftAddress, tokenId, msg.sender, price);
    }
    
    // Buy a listed NFT.
    function buyItem(address nftAddress, uint256 tokenId) public payable {
        Listing memory listing = listings[nftAddress][tokenId];
        require(listing.price > 0, "Item not listed");
        require(msg.value >= listing.price, "Insufficient payment");
        
        // Transfer payment to the seller.
        payable(listing.seller).transfer(listing.price);
        // Transfer NFT ownership.
        IERC721(nftAddress).transferFrom(listing.seller, msg.sender, tokenId);
        
        // Remove the listing.
        delete listings[nftAddress][tokenId];
        emit Sold(nftAddress, tokenId, msg.sender, listing.price);
    }
    
    // Cancel a listing.
    function cancelListing(address nftAddress, uint256 tokenId) public {
        Listing memory listing = listings[nftAddress][tokenId];
        require(listing.seller == msg.sender, "Not the seller");
        delete listings[nftAddress][tokenId];
        emit Delisted(nftAddress, tokenId, msg.sender);
    }
}
