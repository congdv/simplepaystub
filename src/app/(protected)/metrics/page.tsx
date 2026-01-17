'use client';

import { RechartsLineHistorical } from '@/components/dashboard/recharts-line-historical';
import { RechartsHistorical } from '@/components/dashboard/recharts-historical';
import { StatCard } from '@/components/dashboard/stat-card';
import { Download, Mail, Users, TrendingUp, Send } from 'lucide-react';
import { useEffect, useState } from 'react';

type DailyData = {
  date: string;
  value: number;
};

type HistoricalData = {
  dailyData: DailyData[];
  dailyAvg: number;
  total: number;
};

type StatsMetrics = {
  thirtyDayDownloads: number;
  thirtyDayEmails: number;
  totalDownloads: number;
  totalEmails: number;
  totalUsers: number;
  activeUsers30d?: number;
};

export default function DashboardPage() {
  const [usersHistorical, setUsersHistorical] = useState<HistoricalData | null>(null);
  const [downloadsHistorical, setDownloadsHistorical] = useState<HistoricalData | null>(null);
  const [stats, setStats] = useState<StatsMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(false);
  const [downloadsLoading, setDownloadsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsersData = async (days: number) => {
    setUsersLoading(true);
    try {
      const response = await fetch(`/api/open/metrics/historical?type=users&days=${days}`);
      if (!response.ok) {
        throw new Error('Failed to fetch users data');
      }
      const data = await response.json();
      setUsersHistorical(data);
    } catch (err) {
      console.error('Error fetching users data:', err);
      setError('Failed to load users data');
    } finally {
      setUsersLoading(false);
    }
  };

  const fetchDownloadsData = async (days: number) => {
    setDownloadsLoading(true);
    try {
      const response = await fetch(`/api/open/metrics/historical?type=downloads&days=${days}`);
      if (!response.ok) {
        throw new Error('Failed to fetch downloads data');
      }
      const data = await response.json();
      setDownloadsHistorical(data);
    } catch (err) {
      console.error('Error fetching downloads data:', err);
      setError('Failed to load downloads data');
    } finally {
      setDownloadsLoading(false);
    }
  };

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const [usersResponse, downloadsResponse, statsResponse] = await Promise.all([
          fetch('/api/open/metrics/historical?type=users&days=7'),
          fetch('/api/open/metrics/historical?type=downloads&days=7'),
          fetch('/api/open/metrics/stats'),
        ]);

        if (!usersResponse.ok || !downloadsResponse.ok || !statsResponse.ok) {
          throw new Error('Failed to fetch metrics');
        }

        const [usersData, downloadsData, statsData] = await Promise.all([
          usersResponse.json(),
          downloadsResponse.json(),
          statsResponse.json(),
        ]);

        setUsersHistorical(usersData);
        setDownloadsHistorical(downloadsData);
        setStats(statsData);
      } catch (err) {
        console.error('Error fetching metrics:', err);
        setError('Failed to load dashboard metrics');
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="h-64 bg-gray-200 rounded-lg" />
            <div className="h-64 bg-gray-200 rounded-lg" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !usersHistorical || !downloadsHistorical || !stats) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-800">{error || 'Failed to load metrics'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      {/* Daily Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <RechartsLineHistorical
          data={usersHistorical.dailyData}
          color="purple"
          title="Total Users"
          total={usersHistorical.total}
          dailyAvg={usersHistorical.dailyAvg}
          onFilterChange={fetchUsersData}
          isLoading={usersLoading}
        />
        <RechartsHistorical
          data={downloadsHistorical.dailyData}
          color="blue"
          title="Downloads History"
          total={downloadsHistorical.total}
          dailyAvg={downloadsHistorical.dailyAvg}
          onFilterChange={fetchDownloadsData}
          isLoading={downloadsLoading}
        />
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <StatCard
          title="30-Day Downloads"
          value={stats.thirtyDayDownloads}
          icon={Download}
          iconColor="text-blue-600"
          bgColor="bg-blue-50"
        />
        <StatCard
          title="30-Day Emails"
          value={stats.thirtyDayEmails}
          icon={Mail}
          iconColor="text-green-600"
          bgColor="bg-green-50"
        />
        <StatCard
          title="Active (30d)"
          value={stats.activeUsers30d ?? 0}
          icon={Users}
          iconColor="text-purple-600"
          bgColor="bg-purple-50"
          tooltip="Unique logged-in users who generated a PDF or sent an email in the last 30 days."
        />
        <StatCard
          title="Total Downloads"
          value={stats.totalDownloads}
          icon={TrendingUp}
          iconColor="text-blue-600"
          bgColor="bg-blue-50"
        />
        <StatCard
          title="Total Emails"
          value={stats.totalEmails}
          icon={Send}
          iconColor="text-green-600"
          bgColor="bg-green-50"
        />
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          iconColor="text-purple-600"
          bgColor="bg-purple-50"
        />
      </div>
    </div>
  );
}
