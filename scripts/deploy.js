// Use multiple methods to access ethers based on your hardhat version
const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  let ethers;
  
  // Try different ways to access ethers based on your hardhat version
  try {
    // For newer hardhat versions
    if (hre.ethers) {
      ethers = hre.ethers;
      console.log("Using hre.ethers");
    } else {
      // For older hardhat versions
      ethers = require("hardhat").ethers;
      console.log("Using require('hardhat').ethers");
    }
  } catch (error) {
    console.error("Failed to load ethers:", error.message);
    console.log("Make sure @nomicfoundation/hardhat-ethers or @nomiclabs/hardhat-ethers plugin is installed and required in hardhat.config.js");
    process.exit(1);
  }
  
  // Verify we have access to ethers
  if (!ethers || !ethers.getContractFactory) {
    console.error("Error: ethers is not properly initialized. Make sure hardhat-ethers plugin is installed and required.");
    process.exit(1);
  }
  
  // Get the deployer's address safely
  const signers = await ethers.getSigners();
  const deployer = signers[0];
  
  // Get address using v5 or v6 style API
  let deployerAddress;
  try {
    // Try v6 style
    deployerAddress = await deployer.getAddress();
  } catch (error) {
    // If that fails, try v5 style
    deployerAddress = deployer.address;
  }
  
  console.log(`Deploying contracts from: ${deployerAddress}`);
  
  // Load existing contract-addresses.json
  const addressesPath = path.join(__dirname, "../contracts/contract-addresses.json");
  let addressesJson;
  try {
    addressesJson = JSON.parse(fs.readFileSync(addressesPath, "utf8"));
    console.log("Loaded existing contract addresses from file");
  } catch (error) {
    console.log("Could not load contract-addresses.json, creating a new one");
    addressesJson = {
      "SpaceBabyNFT": "",
      "SpaceBabiezNFT": "",
      "NFTMarketplace": "",
      "NFTStaking": "",
      "AstroMilkToken": ""
    };
  }
  
  // List your main contract names here
  const contractNames = [
    "SpaceBabiezNFT",
    "NFTMarketplace",
    "AstroMilkToken",
    "SpaceBabyNFT"  
  ];
  
  // For contracts with constructor arguments
  const constructorArgs = {
    "SpaceBabyNFT": ["Space Baby NFT", "SBABY", "https://example.com/metadata/", deployerAddress]
  };
  
  console.log(`Preparing to deploy ${contractNames.length} contracts`);
  
  // Deploy each contract
  for (const contractName of contractNames) {
    try {
      console.log(`Deploying ${contractName}...`);
      
      // Get contract factory
      const ContractFactory = await ethers.getContractFactory(contractName);
      
      // Check if this contract has constructor arguments
      let deployedContract;
      if (constructorArgs[contractName]) {
        deployedContract = await ContractFactory.deploy(...constructorArgs[contractName]);
      } else {
        deployedContract = await ContractFactory.deploy();
      }
      
      await deployedContract.waitForDeployment();
      const address = await deployedContract.getAddress();
      
      console.log(`${contractName} deployed to: ${address}`);
      
      // Update the addresses JSON with the new address
      addressesJson[contractName] = address;
      
      // Write updated addresses back to the file
      fs.writeFileSync(addressesPath, JSON.stringify(addressesJson, null, 2));
      console.log(`Updated contract-addresses.json with ${contractName} address`);
      
    } catch (error) {
      console.error(`Error deploying contract ${contractName}:`, error.message);
    }
  }
  
  console.log("All deployments completed. Final addresses:");
  console.log(JSON.stringify(addressesJson, null, 2));
}

// Execute deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
