'use client';

import { useEffect, useState } from 'react';
import { AlertCircle, ExternalLink, Check, X } from 'lucide-react';

interface Violation {
  id: string;
  registeredIpId: string;
  foundUrl: string;
  foundImageUrl: string;
  platform: string;
  similarity: number;
  detectedAt: string;
  status: 'pending' | 'resolved' | 'disputed';
}

export default function ViolationsTable() {
  const [violations, setViolations] = useState<Violation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchViolations();
  }, []);

  const fetchViolations = () => {
    fetch('/api/violations')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setViolations(data.data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch violations:', err);
        setLoading(false);
      });
  };

  const updateStatus = (id: string, status: 'resolved' | 'disputed') => {
    fetch('/api/violations', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          fetchViolations(); // Refresh the list
        }
      })
      .catch(err => console.error('Failed to update status:', err));
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      resolved: 'bg-green-100 text-green-800',
      disputed: 'bg-red-100 text-red-800',
    };
    return styles[status] || styles.pending;
  };

  const pendingCount = violations.filter(v => v.status === 'pending').length;

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-12 text-center">
        <div className="animate-spin h-8 w-8 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-600">Loading violations...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
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

      {violations.length === 0 ? (
        <div className="p-12 text-center">
          <AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No violations detected yet</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
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
                      {new Date(violation.detectedAt).toLocaleDateString()}
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
                          title="View original"
                        
                          <ExternalLink className="h-5 w-5" />
                        
                        <button
                          onClick={() => updateStatus(violation.id, 'resolved')}
                          className="text-green-600 hover:text-green-800 transition"
                          title="Mark as resolved"
                        >
                          <Check className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => updateStatus(violation.id, 'disputed')}
                          className="text-red-600 hover:text-red-800 transition"
                          title="Mark as disputed"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-gray-50 border-t border-gray-200">
            <button className="text-purple-600 hover:text-purple-800 text-sm font-semibold">
              View All Violations →
            </button>
          </div>
        </>
      )}
    </div>
  );
}