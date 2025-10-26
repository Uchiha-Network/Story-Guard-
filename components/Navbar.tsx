 'use client';

import Link from 'next/link';
import { Shield, Menu, Wallet } from 'lucide-react';
import { useState, useEffect } from 'react';
import { connectWallet, getWalletAddress } from '@/lib/story';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    // Check if wallet is already connected
    checkWalletConnection();
  }, []);

  const checkWalletConnection = async () => {
    const address = await getWalletAddress();
    setWalletAddress(address);
  };

  const handleConnectWallet = async () => {
    setIsConnecting(true);
    try {
      const address = await connectWallet();
      setWalletAddress(address);
    } catch (error: any) {
      alert(error.message || 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <nav className="bg-gradient-to-r from-purple-900 via-purple-800 to-indigo-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-purple-300" />
              <span className="font-bold text-xl">StoryGuard</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/dashboard" className="hover:text-purple-300 transition">
              Dashboard
            </Link>
            <Link href="/register" className="hover:text-purple-300 transition">
              Register IP
            </Link>
            <Link href="/scan" className="hover:text-purple-300 transition">
              Scan
            </Link>
            
            {walletAddress ? (
              <div className="flex items-center space-x-2 bg-purple-700 px-4 py-2 rounded-lg">
                <Wallet className="h-4 w-4" />
                <span className="text-sm">{formatAddress(walletAddress)}</span>
              </div>
            ) : (
              <button
                onClick={handleConnectWallet}
                disabled={isConnecting}
                className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition flex items-center space-x-2 disabled:opacity-50"
              >
                {isConnecting ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    <span>Connecting...</span>
                  </>
                ) : (
                  <>
                    <Wallet className="h-4 w-4" />
                    <span>Connect Wallet</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-purple-300"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-purple-800 px-4 py-4 space-y-3">
          <Link href="/dashboard" className="block hover:text-purple-300 transition">
            Dashboard
          </Link>
          <Link href="/register" className="block hover:text-purple-300 transition">
            Register IP
          </Link>
          <Link href="/scan" className="block hover:text-purple-300 transition">
            Scan
          </Link>
          
          {walletAddress ? (
            <div className="flex items-center space-x-2 bg-purple-700 px-4 py-2 rounded-lg">
              <Wallet className="h-4 w-4" />
              <span className="text-sm">{formatAddress(walletAddress)}</span>
            </div>
          ) : (
            <button
              onClick={handleConnectWallet}
              disabled={isConnecting}
              className="w-full bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition"
            >
              {isConnecting ? 'Connecting...' : 'Connect Wallet'}
            </button>
          )}
        </div>
      )}
    </nav>
  );
}