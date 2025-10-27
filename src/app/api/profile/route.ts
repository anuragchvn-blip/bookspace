import { NextRequest, NextResponse } from 'next/server';

// In production, replace with actual database (Prisma, Supabase, etc.)
// For now, we'll use IPFS via Pinata for decentralized storage

interface ProfileData {
  address: string;
  username: string;
  displayName?: string;
  bio?: string;
  avatar?: string;
  twitter?: string;
  github?: string;
  website?: string;
  updatedAt: number;
}

export async function POST(request: NextRequest) {
  try {
    // Ensure Pinata JWT is configured
    if (!process.env.NEXT_PUBLIC_PINATA_JWT) {
      return NextResponse.json(
        { error: 'Pinata JWT not configured. Set NEXT_PUBLIC_PINATA_JWT in .env.local' },
        { status: 500 }
      );
    }
    const body = await request.json();
    const { address, username, displayName, bio, avatar, twitter, github, website } = body;

    // Validate required fields
    if (!address || !username) {
      return NextResponse.json(
        { error: 'Address and username are required' },
        { status: 400 }
      );
    }

    // Validate username format (alphanumeric, underscore, 3-20 chars)
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!usernameRegex.test(username)) {
      return NextResponse.json(
        { error: 'Username must be 3-20 characters (letters, numbers, underscore only)' },
        { status: 400 }
      );
    }

    // Validate bio length
    if (bio && bio.length > 500) {
      return NextResponse.json(
        { error: 'Bio must be 500 characters or less' },
        { status: 400 }
      );
    }

    // Create profile data
    const profileData: ProfileData = {
      address: address.toLowerCase(),
      username,
      displayName: displayName || username,
      bio: bio || '',
      avatar: avatar || '',
      twitter: twitter || '',
      github: github || '',
      website: website || '',
      updatedAt: Date.now(),
    };

    // Upload to IPFS via Pinata
    const pinataResponse = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
      },
      body: JSON.stringify({
        pinataContent: profileData,
        pinataMetadata: {
          name: `profile-${address.toLowerCase()}`,
        },
      }),
    });

    if (!pinataResponse.ok) {
      throw new Error('Failed to upload profile to IPFS');
    }

    const { IpfsHash } = await pinataResponse.json();

    // In production, also save to database for faster queries
    // await db.profile.upsert({
    //   where: { address: address.toLowerCase() },
    //   update: { ...profileData, ipfsHash: IpfsHash },
    //   create: { ...profileData, ipfsHash: IpfsHash },
    // });

    return NextResponse.json({
      success: true,
      ipfsHash: IpfsHash,
      profile: profileData,
    });
  } catch (error: any) {
    console.error('Profile creation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create profile' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');

    if (!address) {
      return NextResponse.json(
        { error: 'Address parameter required' },
        { status: 400 }
      );
    }

    // In production, fetch from database first
    // const profile = await db.profile.findUnique({
    //   where: { address: address.toLowerCase() },
    // });

    // For now, return default profile structure
    // Frontend will handle IPFS fetching if hash exists
    return NextResponse.json({
      address: address.toLowerCase(),
      username: `user_${address.slice(2, 8)}`, // Default username
      displayName: `User ${address.slice(0, 6)}...`,
      bio: '',
      avatar: '',
      twitter: '',
      github: '',
      website: '',
      bookmarksCount: 0,
      spacesCount: 0,
      membersCount: 0,
      joinedAt: Date.now(),
      isVerified: false,
    });
  } catch (error: any) {
    console.error('Profile fetch error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}
