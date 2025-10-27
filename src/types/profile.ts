export interface UserProfile {
  address: string; // Wallet address (0x...)
  username: string; // Display name (@sarah_web3)
  displayName?: string; // Full name (Sarah Johnson)
  bio?: string; // Short bio (max 500 chars)
  avatar?: string; // IPFS hash or URL
  
  // Social links (optional)
  twitter?: string;
  github?: string;
  website?: string;
  
  // Stats (auto-calculated)
  bookmarksCount: number;
  spacesCount: number;
  membersCount: number; // Total members across their spaces
  joinedAt: number; // Timestamp
  
  // Verification
  isVerified?: boolean;
  
  // Privacy settings
  showEmail?: boolean;
  allowDMs?: boolean;
}

export interface ProfileFormData {
  username: string;
  displayName: string;
  bio: string;
  avatar?: File | string;
  twitter?: string;
  github?: string;
  website?: string;
}
