// SPDX-License-Identifier: MIT
pragma solidity ^0.8.29;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "./AstroMilkToken.sol";

contract NFTStaking {
    IERC721 public spaceBabiez;
    AstroMilkToken public milkToken;
    
    // Structure to track staking details.
    struct StakeInfo {
        uint256 tokenId;
        uint256 stakedAt;
        address owner;
    }
    
    // Example reward rate (tokens per second per NFT).
    uint256 public rewardRate = 1e18 / uint256(86400); // ~1 AMLK token per day per NFT
    
    // Mapping from tokenId to its staking details.
    mapping(uint256 => StakeInfo) public stakes;
    
    event Staked(address indexed owner, uint256 tokenId, uint256 timestamp);
    event Unstaked(address indexed owner, uint256 tokenId, uint256 reward);
    
    constructor(IERC721 _spaceBabiez, AstroMilkToken _milkToken) {
        spaceBabiez = _spaceBabiez;
        milkToken = _milkToken;
    }
    
    // Stake an NFT.
    function stake(uint256 tokenId) public {
        require(spaceBabiez.ownerOf(tokenId) == msg.sender, "Not the owner");
        // Transfer NFT to this contract.
        spaceBabiez.transferFrom(msg.sender, address(this), tokenId);
        stakes[tokenId] = StakeInfo({
            tokenId: tokenId,
            stakedAt: block.timestamp,
            owner: msg.sender
        });
        emit Staked(msg.sender, tokenId, block.timestamp);
    }
    
    // Unstake an NFT and claim rewards.
    function unstake(uint256 tokenId) public {
        StakeInfo memory stakeInfo = stakes[tokenId];
        require(stakeInfo.owner == msg.sender, "Not the staker");
        
        uint256 stakedDuration = block.timestamp - stakeInfo.stakedAt;
        uint256 reward = stakedDuration * rewardRate;
        
        // Remove the stake record.
        delete stakes[tokenId];
        
        // Return the NFT.
        spaceBabiez.transferFrom(address(this), msg.sender, tokenId);
        // Mint the reward tokens.
        milkToken.mint(msg.sender, reward);
        
        emit Unstaked(msg.sender, tokenId, reward);
    }
    
    // Claim accrued rewards without unstaking.
    function claim(uint256 tokenId) public {
        StakeInfo storage stakeInfo = stakes[tokenId];
        require(stakeInfo.owner == msg.sender, "Not the staker");
        
        uint256 stakedDuration = block.timestamp - stakeInfo.stakedAt;
        uint256 reward = stakedDuration * rewardRate;
        // Reset the staking timestamp.
        stakeInfo.stakedAt = block.timestamp;
        milkToken.mint(msg.sender, reward);
    }
}
