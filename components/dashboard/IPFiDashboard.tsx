// IP Finance Dashboard Component
'use client';

import { useState, useEffect } from 'react';
import { DollarSign, Wallet, TrendingUp, Lock } from 'lucide-react';
import { IPAsset, StakingPosition, LicenseTransaction } from '@/lib/ipfi';

export default function IPFiDashboard() {
  const [assets, setAssets] = useState<IPAsset[]>([]);
  const [stakingPositions, setStakingPositions] = useState<StakingPosition[]>([]);
  const [licenses, setLicenses] = useState<LicenseTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch IPFi data
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [assetsRes, stakingRes, licensesRes] = await Promise.all([
        fetch('/api/ipfi/assets'),
        fetch('/api/ipfi/staking'),
        fetch('/api/ipfi/licenses'),
      ]);

      const [assetsData, stakingData, licensesData] = await Promise.all([
        assetsRes.json(),
        stakingRes.json(),
        licensesRes.json(),
      ]);

      setAssets(assetsData.data);
      setStakingPositions(stakingData.data);
      setLicenses(licensesData.data);
    } catch (error) {
      console.error('Failed to fetch IPFi data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse p-8">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-purple-600" />
            </div>
            <span className="text-sm font-semibold text-green-600">+24.5%</span>
          </div>
          <h3 className="text-gray-500 text-sm font-medium">Total Revenue</h3>
          <p className="text-3xl font-bold text-gray-800">
            ${assets.reduce((sum, asset) => sum + asset.revenue.total, 0).toLocaleString()}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Lock className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-sm font-semibold text-green-600">+12.3%</span>
          </div>
          <h3 className="text-gray-500 text-sm font-medium">Total Staked</h3>
          <p className="text-3xl font-bold text-gray-800">
            {stakingPositions.reduce((sum, pos) => sum + pos.shares, 0)} Shares
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <span className="text-sm font-semibold text-green-600">+8.1%</span>
          </div>
          <h3 className="text-gray-500 text-sm font-medium">Active Licenses</h3>
          <p className="text-3xl font-bold text-gray-800">{licenses.length}</p>
        </div>
      </div>

      {/* Assets Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Your IP Assets</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Asset</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Shares</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price/Share</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Staking APR</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {assets.map((asset) => (
                <tr key={asset.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 bg-gray-200 rounded-lg"></div>
                      <span className="text-sm font-medium text-gray-900">Asset #{asset.id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {asset.totalShares.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${asset.pricePerShare.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-green-600 text-sm font-semibold">
                      {asset.stakingAPR}% APR
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                    ${asset.revenue.total.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 text-white">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50 transition text-center">
            Fractionalize IP
          </button>
          <button className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50 transition text-center">
            Stake Shares
          </button>
          <button className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50 transition text-center">
            Issue License
          </button>
        </div>
      </div>
    </div>
  );
}