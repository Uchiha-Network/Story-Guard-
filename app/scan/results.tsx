'use client';

import { useState } from 'react';
import { Search, Globe, Instagram, Twitter } from 'lucide-react';

export default function UrlInput() {
  const [url, setUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = () => {
    if (!url) return;
    setIsScanning(true);
    // Simulate scanning
    setTimeout(() => {
      setIsScanning(false);
    }, 3000);
  };

  const quickScanExamples = [
    { platform: 'Instagram', url: 'https://instagram.com/', icon: Instagram },
    { platform: 'Twitter', url: 'https://twitter.com/', icon: Twitter },
    { platform: 'Website', url: 'https://example.com', icon: Globe },
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Scan for Violations
      </h2>

      {/* URL Input */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter URL or Social Media Profile
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://instagram.com/username or any website URL"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <button
              onClick={handleScan}
              disabled={!url || isScanning}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isScanning ? (
                <>
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                  <span>Scanning...</span>
                </>
              ) : (
                <>
                  <Search className="h-5 w-5" />
                  <span>Scan Now</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick Scan Buttons */}
        <div>
          <p className="text-sm text-gray-600 mb-3">Quick scan examples:</p>
          <div className="flex flex-wrap gap-2">
            {quickScanExamples.map((example) => {
              const Icon = example.icon;
              return (
                <button
                  key={example.platform}
                  onClick={() => setUrl(example.url)}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition"
                >
                  <Icon className="h-4 w-4 text-gray-600" />
                  <span className="text-sm text-gray-700">{example.platform}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Scanning Progress */}
      {isScanning && (
        <div className="mt-6 bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center space-x-3 mb-3">
            <div className="animate-spin h-5 w-5 border-2 border-purple-600 border-t-transparent rounded-full"></div>
            <p className="font-medium text-purple-900">Scanning in progress...</p>
          </div>
          <div className="space-y-2 text-sm text-purple-800">
            <p>✓ Extracting images from URL</p>
            <p>✓ Generating perceptual hashes</p>
            <p className="animate-pulse">⟳ Comparing against your IP registry...</p>
          </div>
        </div>
      )}
    </div>
  );
}