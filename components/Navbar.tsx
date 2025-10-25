 'use client';

import Link from 'next/link';
import { Shield, Menu } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

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
            <button className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition">
              Connect Wallet
            </button>
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
          <button className="w-full bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition">
            Connect Wallet
          </button>
        </div>
      )}
    </nav>
  );
}