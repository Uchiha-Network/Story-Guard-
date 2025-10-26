'use client';

import { AlertCircle, CheckCircle, ExternalLink, Image as ImageIcon } from 'lucide-react';

interface Violation {
  id: string;
  registeredIpId: string;
  foundUrl: string;
  foundImageUrl: string;
  platform: string;
  similarity: number;
}

interface ScanResult {
  scanId: string;
  url: string;
  imagesFound: number;
  violationsDetected: number;
  violations: Violation[];
}

interface ScanResultsProps {
  result: ScanResult | null;
}

export default function ScanResults({ result }: ScanResultsProps) {
  if (!result) {
    return (
      <div className="bg-white rounded-xl shadow-md p-12 text-center">
        <div className="text-gray-400 mb-4">
          <AlertCircle className="h-16 w-16 mx-auto" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          No Scan Results Yet
        </h3>
        <p className="text-gray-600">
          Enter a URL above and click "Scan Now" to check for violations
        </p>
      </div>
    );
  }

  const hasViolations = result.violations.length > 0;

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Scan Results</h2>
        {hasViolations ? (
          <span className="flex items-center space-x-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            <span className="font-semibold">
              {result.violations.length} Violation{result.violations.length !== 1 ? 's' : ''} Found
            </span>
          </span>
        ) : (
          <span className="flex items-center space-x-2 text-green-600">
            <CheckCircle className="h-5 w-5" />
            <span className="font-semibold">No Violations Found</span>
          </span>
        )}
      </div>

      {/* Scan Summary */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6 grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-600">Scanned URL</p>
          <p className="font-medium text-gray-800 truncate">{result.url}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Images Found</p>
          <p className="font-medium text-gray-800">{result.imagesFound}</p>
        </div>
      </div>

      {hasViolations ? (
        <div className="space-y-4">
          {result.violations.map((violation) => (
            <div
              key={violation.id}
              className="border border-gray-200 bg-white rounded-lg p-4 hover:border-gray-300 transition shadow-sm"
            >
              <div>
                <div className="flex items-start space-x-4">
                  {/* Image Placeholder */}
                  <div className="flex space-x-2">
                    <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      <ImageIcon className="h-8 w-8 text-gray-400" />
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-semibold rounded">
                        {violation.platform}
                      </span>
                      <span className="text-sm text-gray-600">
                        Similarity: <span className="font-bold text-purple-600">{violation.similarity}%</span>
                      </span>
                    </div>
                    
                    <div className="mb-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-purple-600 h-2 rounded-full transition-all"
                          style={{ width: `${violation.similarity}%` }}
                        />
                      </div>
                    </div>

                    <a>
                      href={violation.foundUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-purple-600 hover:text-purple-800 flex items-center space-x-1"
                    
                        <span>View original post</span>
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-4">
                  <button className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg font-semibold transition">
                    File Dispute
                  </button>
                  <button className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm rounded-lg font-semibold transition">
                    Offer License
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            All Clear!
          </h3>
          <p className="text-gray-600">
            No violations detected on this URL. Your content is safe.
          </p>
        </div>
      )}
    </div>
  );
}