'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { User, Mail, Link as LinkIcon, Github, Twitter, Upload, Loader2 } from 'lucide-react';
import Image from 'next/image';

interface ProfileEditorProps {
  onSave?: (profile: any) => void;
  initialData?: any;
}

export function ProfileEditor({ onSave, initialData }: ProfileEditorProps) {
  const { address } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(initialData?.avatar || '');
  
  const [formData, setFormData] = useState({
    username: initialData?.username || '',
    displayName: initialData?.displayName || '',
    bio: initialData?.bio || '',
    twitter: initialData?.twitter || '',
    github: initialData?.github || '',
    website: initialData?.website || '',
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      // In production, upload to IPFS here
      // const ipfsHash = await uploadToIPFS(file);
      // setFormData({ ...formData, avatar: ipfsHash });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address,
          ...formData,
          avatar: avatarPreview,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save profile');
      }

      const data = await response.json();
      
      // Show success message
      alert('Profile saved successfully!');
      
      if (onSave) {
        onSave(data.profile);
      }
    } catch (error: any) {
      alert(error.message || 'Failed to save profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-black/40 border-2 border-gray-800 p-4 sm:p-6 md:p-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6 sm:mb-8 border-b border-gray-800 pb-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-px w-8 bg-cyan-400"></div>
          <span className="text-xs text-gray-500 font-mono tracking-wider">PROFILE EDITOR</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-yellow-400">Edit Your Profile</h2>
        <p className="text-xs sm:text-sm text-gray-400 mt-2">
          Set up your public profile. This information is stored off-chain (free to update).
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        {/* Avatar Upload */}
        <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
          <div className="flex-shrink-0 mx-auto sm:mx-0">
            <div className="w-24 h-24 rounded-full bg-gray-800 border-2 border-gray-700 overflow-hidden flex items-center justify-center">
              {avatarPreview ? (
                <Image src={avatarPreview} alt="Avatar" width={96} height={96} className="w-full h-full object-cover" />
              ) : (
                <User className="w-12 h-12 text-gray-600" />
              )}
            </div>
          </div>
          <div className="flex-1 w-full">
            <label className="block text-xs text-gray-500 mb-2 font-mono tracking-wider uppercase">
              Profile Picture
            </label>
            <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-gray-800 border border-gray-700 hover:border-cyan-400 transition-colors w-full sm:w-auto justify-center sm:justify-start">
              <Upload className="w-4 h-4" />
              <span className="text-sm">Upload Image</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </label>
            <p className="text-xs text-gray-500 mt-2">
              JPG, PNG, or GIF. Max 2MB. Uploaded to IPFS.
            </p>
          </div>
        </div>

        {/* Username */}
        <div>
          <label className="block text-xs text-gray-500 mb-2 font-mono tracking-wider uppercase">
            Username *
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">@</span>
            <input
              type="text"
              required
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full pl-8 pr-4 py-3 bg-black/60 border-2 border-gray-700 text-white focus:border-yellow-500 focus:outline-none font-mono"
              placeholder="your_username"
              pattern="[a-zA-Z0-9_]{3,20}"
              title="3-20 characters, letters, numbers, and underscore only"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            3-20 characters. Letters, numbers, and underscore only.
          </p>
        </div>

        {/* Display Name */}
        <div>
          <label className="block text-xs text-gray-500 mb-2 font-mono tracking-wider uppercase">
            Display Name
          </label>
          <input
            type="text"
            value={formData.displayName}
            onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
            className="w-full px-4 py-3 bg-black/60 border-2 border-gray-700 text-white focus:border-yellow-500 focus:outline-none"
            placeholder="Your Full Name"
          />
        </div>

        {/* Bio */}
        <div>
          <label className="block text-xs text-gray-500 mb-2 font-mono tracking-wider uppercase">
            Bio
          </label>
          <textarea
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            rows={4}
            maxLength={500}
            className="w-full px-4 py-3 bg-black/60 border-2 border-gray-700 text-white focus:border-yellow-500 focus:outline-none resize-none"
            placeholder="Tell us about yourself... (max 500 characters)"
          />
          <p className="text-xs text-gray-500 mt-1 text-right">
            {formData.bio.length}/500 characters
          </p>
        </div>

        {/* Social Links */}
        <div className="border-t border-gray-800 pt-6">
          <h3 className="text-sm text-gray-400 font-mono tracking-wider uppercase mb-4">
            Social Links (Optional)
          </h3>
          
          <div className="space-y-4">
            {/* Twitter */}
            <div>
              <label className="block text-xs text-gray-500 mb-2 font-mono tracking-wider uppercase">
                Twitter
              </label>
              <div className="relative">
                <Twitter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={formData.twitter}
                  onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 bg-black/60 border-2 border-gray-700 text-white focus:border-yellow-500 focus:outline-none"
                  placeholder="@your_twitter"
                />
              </div>
            </div>

            {/* GitHub */}
            <div>
              <label className="block text-xs text-gray-500 mb-2 font-mono tracking-wider uppercase">
                GitHub
              </label>
              <div className="relative">
                <Github className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={formData.github}
                  onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 bg-black/60 border-2 border-gray-700 text-white focus:border-yellow-500 focus:outline-none"
                  placeholder="github.com/username"
                />
              </div>
            </div>

            {/* Website */}
            <div>
              <label className="block text-xs text-gray-500 mb-2 font-mono tracking-wider uppercase">
                Website
              </label>
              <div className="relative">
                <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 bg-black/60 border-2 border-gray-700 text-white focus:border-yellow-500 focus:outline-none"
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-6 border-t border-gray-800">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="w-full sm:flex-1 px-6 py-3 sm:py-4 border-2 border-gray-600 text-gray-300 font-bold hover:border-gray-500 transition-colors text-sm sm:text-base"
          >
            CANCEL
          </button>
          <button
            type="submit"
            disabled={isLoading || !address}
            className="w-full sm:flex-1 px-6 py-3 sm:py-4 bg-yellow-500 text-black font-bold hover:bg-yellow-400 transition-colors border-2 border-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                SAVING...
              </>
            ) : (
              'SAVE PROFILE'
            )}
          </button>
        </div>
      </form>

      {/* Info Box */}
      <div className="mt-6 bg-cyan-900/20 border border-cyan-700/50 p-4 rounded">
        <p className="text-xs text-cyan-300">
          <strong>💡 Note:</strong> Your profile is stored on IPFS (decentralized storage). 
          Updates are FREE (no gas fees). Your wallet address ({address?.slice(0, 6)}...{address?.slice(-4)}) 
          is your unique identity across the platform.
        </p>
      </div>
    </div>
  );
}
