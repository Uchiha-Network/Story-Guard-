import { Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface HistoryItem {
  id: string;
  url: string;
  timestamp: string;
  violations: number;
  status: 'completed' | 'scanning';
}

export default function ScanHistory() {
  const history: HistoryItem[] = [
    {
      id: '1',
      url: 'https://instagram.com/photographer',
      timestamp: '2 hours ago',
      violations: 2,
      status: 'completed',
    },
    {
      id: '2',
      url: 'https://pinterest.com/board/nature',
      timestamp: '5 hours ago',
      violations: 0,
      status: 'completed',
    },
    {
      id: '3',
      url: 'https://twitter.com/artgallery',
      timestamp: '1 day ago',
      violations: 1,
      status: 'completed',
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Scans</h2>
      
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
                <p className="text-xs text-gray-500">{item.timestamp}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {item.violations > 0 ? (
                <span className="flex items-center space-x-1 text-red-600 text-sm font-semibold">
                  <AlertCircle className="h-4 w-4" />
                  <span>{item.violations}</span>
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

      <button className="w-full mt-4 text-purple-600 hover:text-purple-800 text-sm font-semibold">
        View All Scans →
      </button>
    </div>
  );
}