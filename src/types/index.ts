export interface Bookmark {
  id: number;
  url: string;
  title: string;
  description: string;
  tags: string[];
  owner: string;
  spaceId: number;
  timestamp: number;
  ipfsHash: string;
  isDeleted: boolean;
}

export interface Space {
  id: number;
  name: string;
  description: string;
  owner: string;
  isPublic: boolean;
  accessPrice: bigint;
  memberCount: number;
  createdAt: number;
  isActive: boolean;
}

export interface DMAccess {
  sender: string;
  recipient: string;
  paidAt: number;
  isActive: boolean;
}

export interface Message {
  id: number;
  sender: string;
  recipient: string;
  ipfsHash: string;
  timestamp: number;
}

export interface DecryptedMessage extends Message {
  content: string;
  isEncrypted: boolean;
}

export interface TipTransaction {
  signature: string;
  sender: string;
  recipient: string;
  amount: number;
  timestamp: number;
  message?: string;
}

export interface UserProfile {
  address: string;
  bookmarkCount: number;
  spaceCount: number;
  memberSpaces: number[];
  totalTipsReceived?: number;
  totalTipsSent?: number;
}
