import axios from 'axios';
import CryptoJS from 'crypto-js';
import { IPFS_CONFIG } from '@/config/constants';

const PINATA_API_URL = 'https://api.pinata.cloud';

export interface IPFSUploadResult {
  ipfsHash: string;
  url: string;
}

/**
 * Upload JSON data to IPFS via Pinata
 */
export async function uploadToIPFS(data: any): Promise<IPFSUploadResult> {
  try {
    const response = await axios.post(
      `${PINATA_API_URL}/pinning/pinJSONToIPFS`,
      data,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${IPFS_CONFIG.jwt}`,
        },
      }
    );

    const ipfsHash = response.data.IpfsHash;
    return {
      ipfsHash,
      url: `${IPFS_CONFIG.gateway}/ipfs/${ipfsHash}`,
    };
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    throw new Error('Failed to upload to IPFS');
  }
}

/**
 * Fetch data from IPFS
 */
export async function fetchFromIPFS<T = any>(ipfsHash: string): Promise<T> {
  try {
    const url = `${IPFS_CONFIG.gateway}/ipfs/${ipfsHash}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching from IPFS:', error);
    throw new Error('Failed to fetch from IPFS');
  }
}

/**
 * Encrypt message content before uploading
 */
export function encryptMessage(content: string, password: string): string {
  return CryptoJS.AES.encrypt(content, password).toString();
}

/**
 * Decrypt message content after fetching
 */
export function decryptMessage(encryptedContent: string, password: string): string {
  const bytes = CryptoJS.AES.decrypt(encryptedContent, password);
  return bytes.toString(CryptoJS.enc.Utf8);
}

/**
 * Upload encrypted message to IPFS
 */
export async function uploadEncryptedMessage(
  content: string,
  senderAddress: string,
  recipientAddress: string
): Promise<IPFSUploadResult> {
  // Use a combination of addresses as encryption key
  const encryptionKey = `${senderAddress}-${recipientAddress}`;
  const encrypted = encryptMessage(content, encryptionKey);

  const messageData = {
    content: encrypted,
    sender: senderAddress,
    recipient: recipientAddress,
    timestamp: Date.now(),
    encrypted: true,
  };

  return uploadToIPFS(messageData);
}

/**
 * Fetch and decrypt message from IPFS
 */
export async function fetchEncryptedMessage(
  ipfsHash: string,
  senderAddress: string,
  recipientAddress: string
): Promise<string> {
  const data = await fetchFromIPFS<{
    content: string;
    encrypted: boolean;
  }>(ipfsHash);

  if (!data.encrypted) {
    return data.content;
  }

  const encryptionKey = `${senderAddress}-${recipientAddress}`;
  return decryptMessage(data.content, encryptionKey);
}

/**
 * Upload bookmark content to IPFS
 */
export async function uploadBookmarkContent(
  url: string,
  title: string,
  description: string,
  tags: string[],
  richContent?: string
): Promise<IPFSUploadResult> {
  const bookmarkData = {
    url,
    title,
    description,
    tags,
    richContent,
    timestamp: Date.now(),
  };

  return uploadToIPFS(bookmarkData);
}

/**
 * Pin file to IPFS via Pinata
 */
export async function pinFileToIPFS(file: File): Promise<IPFSUploadResult> {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post(
      `${PINATA_API_URL}/pinning/pinFileToIPFS`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${IPFS_CONFIG.jwt}`,
        },
      }
    );

    const ipfsHash = response.data.IpfsHash;
    return {
      ipfsHash,
      url: `${IPFS_CONFIG.gateway}/ipfs/${ipfsHash}`,
    };
  } catch (error) {
    console.error('Error pinning file to IPFS:', error);
    throw new Error('Failed to pin file to IPFS');
  }
}
