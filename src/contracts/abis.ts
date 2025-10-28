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
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "_bookmarkId", "type": "uint256" }
    ],
    "name": "getBookmark",
    "outputs": [
      {
        "components": [
          { "internalType": "uint256", "name": "id", "type": "uint256" },
          { "internalType": "string", "name": "url", "type": "string" },
          { "internalType": "string", "name": "title", "type": "string" },
          { "internalType": "string", "name": "description", "type": "string" },
          { "internalType": "string[]", "name": "tags", "type": "string[]" },
          { "internalType": "address", "name": "owner", "type": "address" },
          { "internalType": "uint256", "name": "spaceId", "type": "uint256" },
          { "internalType": "uint256", "name": "timestamp", "type": "uint256" },
          { "internalType": "string", "name": "ipfsHash", "type": "string" },
          { "internalType": "bool", "name": "isDeleted", "type": "bool" }
        ],
        "internalType": "struct BookmarkRegistry.Bookmark",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "_spaceId", "type": "uint256" }
    ],
    "name": "getSpace",
    "outputs": [
      {
        "components": [
          { "internalType": "uint256", "name": "id", "type": "uint256" },
          { "internalType": "string", "name": "name", "type": "string" },
          { "internalType": "string", "name": "description", "type": "string" },
          { "internalType": "address", "name": "owner", "type": "address" },
          { "internalType": "bool", "name": "isPublic", "type": "bool" },
          { "internalType": "uint256", "name": "accessPrice", "type": "uint256" },
          { "internalType": "uint256", "name": "memberCount", "type": "uint256" },
          { "internalType": "uint256", "name": "createdAt", "type": "uint256" },
          { "internalType": "bool", "name": "isActive", "type": "bool" }
        ],
        "internalType": "struct BookmarkRegistry.Space",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "_spaceId", "type": "uint256" }
    ],
    "name": "getSpaceBookmarks",
    "outputs": [{ "internalType": "uint256[]", "name": "", "type": "uint256[]" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "_user", "type": "address" },
      { "internalType": "uint256", "name": "_spaceId", "type": "uint256" }
    ],
    "name": "checkSpaceAccess",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "_spaceId", "type": "uint256" },
      { "internalType": "string", "name": "_name", "type": "string" },
      { "internalType": "string", "name": "_description", "type": "string" },
      { "internalType": "bool", "name": "_isPublic", "type": "bool" },
      { "internalType": "uint256", "name": "_accessPrice", "type": "uint256" }
    ],
    "name": "updateSpace",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;

// DirectMessageRegistry ABI (v1.4 - Security Hardened)
export const DM_REGISTRY_ABI = [
  {
    "inputs": [],
    "name": "VERSION",
    "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "DM_ACCESS_PRICE",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "_recipient", "type": "address" },
      { "internalType": "uint256", "name": "_deadline", "type": "uint256" }
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
      { "internalType": "uint256", "name": "_messageId", "type": "uint256" }
    ],
    "name": "getMessage",
    "outputs": [
      {
        "components": [
          { "internalType": "uint256", "name": "id", "type": "uint256" },
          { "internalType": "address", "name": "sender", "type": "address" },
          { "internalType": "address", "name": "recipient", "type": "address" },
          { "internalType": "string", "name": "ipfsHash", "type": "string" },
          { "internalType": "uint256", "name": "timestamp", "type": "uint256" }
        ],
        "internalType": "struct DirectMessageRegistry.Message",
        "name": "",
        "type": "tuple"
      }
    ],
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
    "inputs": [
      { "internalType": "address", "name": "_user1", "type": "address" },
      { "internalType": "address", "name": "_user2", "type": "address" }
    ],
    "name": "getConversation",
    "outputs": [{ "internalType": "uint256[]", "name": "", "type": "uint256[]" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "string", "name": "_hash", "type": "string" }
    ],
    "name": "isValidIPFSHash",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "_sender", "type": "address" }
    ],
    "name": "blockSender",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "platformOwner",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "isPaused",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getContractStats",
    "outputs": [
      { "internalType": "uint256", "name": "totalMessages", "type": "uint256" },
      { "internalType": "uint256", "name": "revenue", "type": "uint256" },
      { "internalType": "uint256", "name": "accessPrice", "type": "uint256" },
      { "internalType": "bool", "name": "paused", "type": "bool" }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;
