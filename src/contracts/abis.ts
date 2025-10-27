export const BOOKMARK_REGISTRY_ABI = [
  {
    "inputs": [
      { "internalType": "string", "name": "_url", "type": "string" },
      { "internalType": "string", "name": "_title", "type": "string" },
      { "internalType": "string", "name": "_description", "type": "string" },
      { "internalType": "string[]", "name": "_tags", "type": "string[]" },
      { "internalType": "uint256", "name": "_spaceId", "type": "uint256" },
      { "internalType": "string", "name": "_ipfsHash", "type": "string" }
    ],
    "name": "createBookmark",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "string", "name": "_name", "type": "string" },
      { "internalType": "string", "name": "_description", "type": "string" },
      { "internalType": "bool", "name": "_isPublic", "type": "bool" },
      { "internalType": "uint256", "name": "_accessPrice", "type": "uint256" }
    ],
    "name": "createSpace",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "_spaceId", "type": "uint256" },
      { "internalType": "uint256", "name": "_deadline", "type": "uint256" }
    ],
    "name": "joinSpace",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "_bookmarkId", "type": "uint256" }
    ],
    "name": "deleteBookmark",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "_bookmarkId", "type": "uint256" },
      { "internalType": "string", "name": "_url", "type": "string" },
      { "internalType": "string", "name": "_title", "type": "string" },
      { "internalType": "string", "name": "_description", "type": "string" },
      { "internalType": "string[]", "name": "_tags", "type": "string[]" },
      { "internalType": "string", "name": "_ipfsHash", "type": "string" }
    ],
    "name": "updateBookmark",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "_user", "type": "address" }
    ],
    "name": "getUserBookmarks",
    "outputs": [{ "internalType": "uint256[]", "name": "", "type": "uint256[]" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "_user", "type": "address" }
    ],
    "name": "getUserSpaces",
    "outputs": [{ "internalType": "uint256[]", "name": "", "type": "uint256[]" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTotalBookmarks",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTotalSpaces",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

export const DM_REGISTRY_ABI = [
  {
    "inputs": [
      { "internalType": "address", "name": "_recipient", "type": "address" }
    ],
    "name": "purchaseDMAccess",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "_recipient", "type": "address" },
      { "internalType": "string", "name": "_ipfsHash", "type": "string" }
    ],
    "name": "sendMessage",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "_sender", "type": "address" },
      { "internalType": "address", "name": "_recipient", "type": "address" }
    ],
    "name": "checkDMAccess",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "_user", "type": "address" }
    ],
    "name": "getInbox",
    "outputs": [{ "internalType": "uint256[]", "name": "", "type": "uint256[]" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "DM_ACCESS_PRICE",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  }
] as const;
