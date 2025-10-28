// Quick script to check and unpause the BookmarkRegistry contract
const { ethers } = require('ethers');

const CONTRACT_ADDRESS = '0x7D7815C9C0Cc3F5AbbB8Add9FfF5bDAA445A75CE';
const RPC_URL = 'https://polygon-rpc.com';

const ABI = [
  'function isPaused() view returns (bool)',
  'function contractOwner() view returns (address)',
  'function unpauseContract() external',
  'function VERSION() view returns (string)',
];

async function main() {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);

  console.log('\n=== BookmarkRegistry Contract Status ===\n');
  
  try {
    const version = await contract.VERSION();
    console.log('✅ Contract Version:', version);
  } catch (e) {
    console.log('❌ Could not read version');
  }

  try {
    const isPaused = await contract.isPaused();
    console.log('Contract Status:', isPaused ? '🔴 PAUSED' : '✅ ACTIVE');
    
    if (isPaused) {
      console.log('\n⚠️  CONTRACT IS PAUSED! You need to unpause it.\n');
    }
  } catch (e) {
    console.log('❌ Could not read isPaused:', e.message);
  }

  try {
    const owner = await contract.contractOwner();
    console.log('Contract Owner:', owner);
    console.log('Your Address: 0x2913411D27f5d6716590F952b50088779Ae4a699');
    
    if (owner.toLowerCase() === '0x2913411D27f5d6716590F952b50088779Ae4a699'.toLowerCase()) {
      console.log('✅ You are the owner - you can unpause!');
    } else {
      console.log('❌ You are NOT the owner - only owner can unpause');
    }
  } catch (e) {
    console.log('❌ Could not read owner:', e.message);
  }

  console.log('\n=====================================\n');
}

main().catch(console.error);
