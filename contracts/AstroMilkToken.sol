// SPDX-License-Identifier: MIT
pragma solidity ^0.8.29;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AstroMilkToken is ERC20, Ownable {
    constructor() ERC20("AstroMilk", "AMLK") Ownable(msg.sender) {
        // Initial mint to the owner – adjust supply as needed.
        _mint(msg.sender, 1000000 * 10**decimals());
    }
    
    // Mint function for use by other contracts (e.g., the staking contract) if needed.
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}
