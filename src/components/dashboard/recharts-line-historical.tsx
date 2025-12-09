'use client';

import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

type DailyData = {
  date: string;
  value: number;
};

type RechartsLineHistoricalProps = {
  data: DailyData[];
  color?: 'blue' | 'green' | 'purple';
  title: string;
  total: number;
  dailyAvg: number;
  onFilterChange?: (days: number) => void;
  isLoading?: boolean;
};

type TimeRange = 7 | 30 | 60;

export function RechartsLineHistorical({ 
  data, 
  color = 'purple', 
  title, 
  total, 
  dailyAvg,
  onFilterChange,
  isLoading = false
}: RechartsLineHistoricalProps) {
  const [selectedRange, setSelectedRange] = useState<TimeRange>(7);

  const handleRangeChange = (range: TimeRange) => {
    setSelectedRange(range);
    if (onFilterChange) {
      onFilterChange(range);
    }
  };

  const colorClasses = {
    blue: {
      stroke: '#3b82f6',
      fill: '#3b82f6',
      icon: 'bg-blue-600',
    },
    green: {
      stroke: '#10b981',
      fill: '#10b981',
      icon: 'bg-green-600',
    },
    purple: {
      stroke: '#8b5cf6',
      fill: '#8b5cf6',
      icon: 'bg-purple-600',
    },
  };

  const colors = colorClasses[color];

  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 text-white text-xs rounded py-2 px-3 shadow-lg">
          <div className="font-medium">{payload[0].value.toLocaleString()}</div>
          <div className="text-gray-400">{formatDate(payload[0].payload.date)}</div>
        </div>
      );
    }
    return null;
  };

  // Prepare data with formatted dates for X-axis
  const chartData = data.map(item => ({
    ...item,
    displayDate: formatDate(item.date),
  }));

  return (
    <div className="bg-white rounded-lg border shadow-sm p-6">
      {/* Header with Filter */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-4 h-4 rounded ${colors.icon}`} />
          <h2 className="text-base font-medium text-gray-700">{title}</h2>
        </div>
        <div className="flex items-center gap-4">
          {/* Time Range Filter */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            {([7, 30, 60] as TimeRange[]).map((range) => (
              <button
                key={range}
                onClick={() => handleRangeChange(range)}
                disabled={isLoading}
                className={`
                  px-3 py-1 text-xs font-medium rounded-md transition-all
                  ${selectedRange === range
                    ? `${colors.icon} text-white shadow-sm`
                    : 'text-gray-600 hover:text-gray-900'
                  }
                  ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                {range}d
              </button>
            ))}
          </div>
          {/* Stats */}
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">
              {isLoading ? '...' : total.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500">
              ~{isLoading ? '...' : dailyAvg.toLocaleString()} / day
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="mt-6">
        {data.length === 0 ? (
          <div className="h-48 flex items-center justify-center text-gray-400 text-sm">
            No data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis 
                dataKey="displayDate" 
                tick={{ fontSize: 12, fill: '#9ca3af' }}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#9ca3af' }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone"
                dataKey="value" 
                stroke={colors.stroke}
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 5, fill: colors.fill }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
