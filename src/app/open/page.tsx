'use client';

import { SimpleBarChart } from '@/components/dashboard/simple-bar-chart';
import { StatCard } from '@/components/dashboard/stat-card';
import { Download, Mail, Users, TrendingUp, Send } from 'lucide-react';
import { useEffect, useState } from 'react';

type WeeklyData = {
  week: number;
  value: number;
};

type DashboardMetrics = {
  weeklyUsers: WeeklyData[];
  weeklyDownloads: WeeklyData[];
  weeklyAvgUsers: number;
  weeklyAvgDownloads: number;
  thirtyDayDownloads: number;
  thirtyDayEmails: number;
  totalDownloads: number;
  totalEmails: number;
  totalUsers: number;
};

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch('/api/open/metrics');
        if (!response.ok) {
          throw new Error('Failed to fetch metrics');
        }
        const data = await response.json();
        setMetrics(data);
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

  if (error || !metrics) {
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

      {/* Weekly Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <SimpleBarChart
          data={metrics.weeklyUsers}
          color="purple"
          title="Very Active Users"
          total={metrics.totalUsers}
          weeklyAvg={metrics.weeklyAvgUsers}
        />
        <SimpleBarChart
          data={metrics.weeklyDownloads}
          color="blue"
          title="Downloads"
          total={metrics.totalDownloads}
          weeklyAvg={metrics.weeklyAvgDownloads}
        />
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard
          title="30-Day Downloads"
          value={metrics.thirtyDayDownloads}
          icon={Download}
          iconColor="text-blue-600"
          bgColor="bg-blue-50"
        />
        <StatCard
          title="30-Day Emails"
          value={metrics.thirtyDayEmails}
          icon={Mail}
          iconColor="text-green-600"
          bgColor="bg-green-50"
        />
        <StatCard
          title="Total Downloads"
          value={metrics.totalDownloads}
          icon={TrendingUp}
          iconColor="text-blue-600"
          bgColor="bg-blue-50"
        />
        <StatCard
          title="Total Emails"
          value={metrics.totalEmails}
          icon={Send}
          iconColor="text-green-600"
          bgColor="bg-green-50"
        />
        <StatCard
          title="Total Users"
          value={metrics.totalUsers}
          icon={Users}
          iconColor="text-purple-600"
          bgColor="bg-purple-50"
        />
      </div>
    </div>
  );
}
