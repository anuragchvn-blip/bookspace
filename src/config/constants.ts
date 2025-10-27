export const POLYGON_MUMBAI_CONFIG = {
  chainId: 80001,
  name: 'Polygon Mumbai',
  currency: 'MATIC',
  explorerUrl: 'https://mumbai.polygonscan.com',
  rpcUrl: process.env.NEXT_PUBLIC_POLYGON_RPC_URL || 'https://rpc-mumbai.maticvigil.com',
};

export const POLYGON_MAINNET_CONFIG = {
  chainId: 137,
  name: 'Polygon',
  currency: 'MATIC',
  explorerUrl: 'https://polygonscan.com',
  rpcUrl: 'https://polygon-rpc.com',
};

export const SOLANA_DEVNET_CONFIG = {
  network: 'devnet',
  endpoint: process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.devnet.solana.com',
};

export const SOLANA_MAINNET_CONFIG = {
  network: 'mainnet-beta',
  endpoint: 'https://api.mainnet-beta.solana.com',
};

export const CONTRACT_ADDRESSES = {
  bookmarkRegistry: process.env.NEXT_PUBLIC_BOOKMARK_REGISTRY_ADDRESS || '',
  dmRegistry: process.env.NEXT_PUBLIC_DM_REGISTRY_ADDRESS || '',
};

export const RAZORPAY_CONFIG = {
  keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
  enabled: !!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
};

export const IPFS_CONFIG = {
  gateway: process.env.NEXT_PUBLIC_PINATA_GATEWAY || 'https://gateway.pinata.cloud',
  apiKey: process.env.NEXT_PUBLIC_PINATA_API_KEY || '',
  secretKey: process.env.NEXT_PUBLIC_PINATA_SECRET_KEY || '',
  jwt: process.env.NEXT_PUBLIC_PINATA_JWT || '',
};

export const DM_ACCESS_PRICE = '1000000000000000000'; // 1 POL in wei
