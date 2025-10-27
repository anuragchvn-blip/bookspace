// @ts-nocheck - Hardhat deployment script
import { ethers } from "hardhat";

async function main() {
  console.log("Deploying BookSpace contracts to Polygon Mumbai...");

  // Get deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());

  // Deploy BookmarkRegistry
  console.log("\n1. Deploying BookmarkRegistry...");
  const BookmarkRegistry = await ethers.getContractFactory("BookmarkRegistry");
  const bookmarkRegistry = await BookmarkRegistry.deploy();
  await bookmarkRegistry.waitForDeployment();
  const bookmarkRegistryAddress = await bookmarkRegistry.getAddress();
  console.log("BookmarkRegistry deployed to:", bookmarkRegistryAddress);

  // Deploy DirectMessageRegistry
  console.log("\n2. Deploying DirectMessageRegistry...");
  const DirectMessageRegistry = await ethers.getContractFactory("DirectMessageRegistry");
  const dmRegistry = await DirectMessageRegistry.deploy();
  await dmRegistry.waitForDeployment();
  const dmRegistryAddress = await dmRegistry.getAddress();
  console.log("DirectMessageRegistry deployed to:", dmRegistryAddress);

  // Save deployment info
  console.log("\n✅ Deployment completed!");
  console.log("\nAdd these addresses to your .env file:");
  console.log(`NEXT_PUBLIC_BOOKMARK_REGISTRY_ADDRESS=${bookmarkRegistryAddress}`);
  console.log(`NEXT_PUBLIC_DM_REGISTRY_ADDRESS=${dmRegistryAddress}`);

  // Verify contracts (optional - requires API key)
  console.log("\nTo verify contracts on PolygonScan, run:");
  console.log(`npx hardhat verify --network mumbai ${bookmarkRegistryAddress}`);
  console.log(`npx hardhat verify --network mumbai ${dmRegistryAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
