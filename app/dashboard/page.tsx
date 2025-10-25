'use client';

import { useEffect, useState } from 'react';
import { Shield, AlertCircle, Search, TrendingUp, DollarSign } from 'lucide-react';
import StatsCard from '@/app/dashboard/Statcard';
import ViolationsTable from '@/app/dashboard/violationtable';
import RecentActivity from '@/app/dashboard/recentacticities';

interface Stats {
  protectedImages: number;
  activeViolations: number;
  scansThisWeek: number;
  revenueRecovered: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    protectedImages: 0,
    activeViolations: 0,
    scansThisWeek: 0,
    revenueRecovered: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch stats from API
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setStats(data.data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch stats:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Dashboard</h1>
          <p className="text-gray-600">Monitor your protected assets and violations</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Protected Images"
            value={stats.protectedImages}
            icon={Shield}
            trend="12%"
            trendUp={true}
            color="purple"
          />
          <StatsCard
            title="Active Violations"
            value={stats.activeViolations}
            icon={AlertCircle}
            trend="3%"
            trendUp={false}
            color="red"
          />
          <StatsCard
            title="Scans This Week"
            value={stats.scansThisWeek}
            icon={Search}
            trend="18%"
            trendUp={true}
            color="blue"
          />
          <StatsCard
            title="Revenue Recovered"
            value={`$${stats.revenueRecovered.toLocaleString()}`}
            icon={DollarSign}
            trend="25%"
            trendUp={true}
            color="green"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Violations Table - Takes 2 columns */}
          <div className="lg:col-span-2">
            <ViolationsTable />
          </div>

          {/* Recent Activity - Takes 1 column */}
          <div className="lg:col-span-1">
            <RecentActivity />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 text-white">
          <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <a
              href="/register"
              className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50 transition text-center">
                  Register New IP
              </a>
              <a
            
              href="/scan"
              className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50 transition text-center">
                  
              Start New Scan
              </a>
          
          
            <button className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50 transition">
              View All Assets
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}