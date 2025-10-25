'use client';

import { useState } from 'react';
import { Search, Info, Zap } from 'lucide-react';
import UrlInput from '@/components/scan/UrlInput';
import ScanResults from '@/components/scan/scanresult';
import ScanHistory from '@/components/scan/history';

export default function ScanPage() {
  const [scanResult, setScanResult] = useState<any>(null);

  const handleScanComplete = (result: any) => {
    setScanResult(result);
    // Scroll to results
    setTimeout(() => {
      document.getElementById('scan-results')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-3">
            <Search className="h-8 w-8 text-purple-600" />
            <h1 className="text-4xl font-bold text-gray-800">Scan for Violations</h1>
          </div>
          <p className="text-gray-600 text-lg">
            Check any URL or social media profile for unauthorized use of your images
          </p>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8 flex items-start space-x-3">
          <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm text-blue-900">
              <strong>How scanning works:</strong> Enter a URL and we'll extract all images, 
              compare them against your registered IP using AI-powered perceptual hashing, 
              and flag any matches with 85%+ similarity.
            </p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Input & Results (2/3 width) */}
          <div className="lg:col-span-2 space-y-6">
            <UrlInput onScanComplete={handleScanComplete} />
            <div id="scan-results">
              <ScanResults result={scanResult} />
            </div>
          </div>

          {/* Right Column - History & Stats (1/3 width) */}
          <div className="lg:col-span-1 space-y-6">
            <ScanHistory />
            
            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-4">Scan Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-purple-100">Total Scans:</span>
                  <span className="text-2xl font-bold">47</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-100">Violations Found:</span>
                  <span className="text-2xl font-bold">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-100">Pages Checked:</span>
                  <span className="text-2xl font-bold">1,247</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Supported Platforms */}
        <div className="mt-12 bg-white rounded-xl shadow-md p-8">
          <div className="flex items-center space-x-2 mb-6">
            <Zap className="h-6 w-6 text-purple-600" />
            <h2 className="text-2xl font-bold text-gray-800">
              Supported Platforms
            </h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {['Instagram', 'Twitter', 'Pinterest', 'Facebook', 'TikTok', 'LinkedIn', 'Tumblr', 'Reddit', 'Medium', 'Behance', 'DeviantArt', 'Dribbble'].map((platform) => (
              <div
                key={platform}
                className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition"
              >
                <span className="text-sm font-medium text-gray-700">{platform}</span>
              </div>
            ))}
          </div>
          
          <p className="text-sm text-gray-600 mt-4 text-center">
            + Any website or blog with publicly accessible images
          </p>
        </div>
      </div>
    </div>
  );
}