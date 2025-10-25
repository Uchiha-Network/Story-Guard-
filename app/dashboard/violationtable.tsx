'use client';

import { AlertCircle, ExternalLink, Check, X } from 'lucide-react';

interface Violation {
  id: string;
  imageUrl: string;
  imageName: string;
  platform: string;
  foundUrl: string;
  similarity: number;
  date: string;
  status: 'pending' | 'resolved' | 'disputed';
}

export default function ViolationsTable() {
  const violations: Violation[] = [
    {
      id: '1',
      imageUrl: '/images/placeholder.jpg',
      imageName: 'sunset-beach.jpg',
      platform: 'Instagram',
      foundUrl: 'https://instagram.com/example',
      similarity: 98,
      date: '2024-10-20',
      status: 'pending',
    },
    {
      id: '2',
      imageUrl: '/images/placeholder.jpg',
      imageName: 'mountain-view.jpg',
      platform: 'Twitter',
      foundUrl: 'https://twitter.com/example',
      similarity: 94,
      date: '2024-10-19',
      status: 'disputed',
    },
    {
      id: '3',
      imageUrl: '/images/placeholder.jpg',
      imageName: 'city-night.jpg',
      platform: 'Pinterest',
      foundUrl: 'https://pinterest.com/example',
      similarity: 89,
      date: '2024-10-18',
      status: 'resolved',
    },
  ];

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      resolved: 'bg-green-100 text-green-800',
      disputed: 'bg-red-100 text-red-800',
    };
    return styles[status] || styles.pending;
  };

  const pendingCount = violations.filter(v => v.status === 'pending').length;

  return (
    <div className="bg-white rounded - xl shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                             <AlertCircle className="h-5 w-5 text-red-500" />
                            <h2 className="text-xl font-bold text-gray-800">Recent Violations</h2>
                        </div>
                                 <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
                                        {pendingCount} Active
                                 </span>
                </div>
        </div>


        <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
                <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Image
                </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Platform
                    </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Similarity
                            </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                         Date Found
                                    </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                     Status
                                            </th>
                                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                             Actions
                                                 </th>
                 </tr>
            </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {violations.map((violation) => (
              <tr key={violation.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-3">
                        <div className="h-12 w-12 bg-gray-200 rounded-lg flex items-center justify-center">
                            <span className="text-gray-500 text-xs">IMG</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                        {violation.imageName}
                        </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900">{violation.platform}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                        <span className="text-sm font-semibold text-gray-900">
                         {violation.similarity}%
                         </span>
                            <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                                    <div
                                         className="bg-purple-600 h-2 rounded-full"
                                         style={{ width: `${violation.similarity}%` }}
                                    />
                            </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(violation.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(violation.status)}`}>
                    {violation.status.charAt(0).toUpperCase() + violation.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex items-center space-x-2">
                    
                      href={violation.foundUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-600 hover:text-purple-800 transition"
                    
                      <ExternalLink className="h-5 w-5" />
                    
                    <button className="text-green-600 hover:text-green-800 transition">
                      <Check className="h-5 w-5" />
                    </button>
                    <button className="text-red-600 hover:text-red-800 transition">
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>




    </div>

    );
  }