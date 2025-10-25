'use client';

import { useEffect, useState } from 'react';
import { Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface HistoryItem {
  id: string;
  url: string;
  scannedAt: string;
  violationsDetected: number;
  status: 'completed' | 'scanning' | 'failed';
}

export default function ScanHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/scan-history')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setHistory(data.data.slice(0, 5)); // Show only last 5
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch scan history:', err);
        setLoading(false);
      });
  }, []);

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Scans</h2>
        <div className="text-center py-8">
          <div className="animate-spin h-8 w-8 border-4 border-purple-600 border-t-transparent rounded-full mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Scans</h2>
      
      {history.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No scans yet</p>
      ) : (
        <div className="space-y-3">
          {history.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-purple-300 transition"
            >
              <div className="flex items-center space-x-3 flex-1">
                <Clock className="h-5 w-5 text-gray-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {item.url}
                  </p>
                  <p className="text-xs text-gray-500">{getTimeAgo(item.scannedAt)}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {item.violationsDetected > 0 ? (
                  <span className="flex items-center space-x-1 text-red-600 text-sm font-semibold">
                    <AlertCircle className="h-4 w-4" />
                    <span>{item.violationsDetected}</span>
                  </span>
                ) : (
                  <span className="flex items-center space-x-1 text-green-600 text-sm">
                    <CheckCircle className="h-4 w-4" />
                    <span>Clean</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <button className="w-full mt-4 text-purple-600 hover:text-purple-800 text-sm font-semibold">
        View All Scans →
      </button>
    </div>
  );
}