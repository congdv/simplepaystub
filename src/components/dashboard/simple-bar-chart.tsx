'use client';

type WeeklyData = {
  week: number;
  value: number;
};

type SimpleBarChartProps = {
  data: WeeklyData[];
  color: 'purple' | 'blue';
  title: string;
  total: number;
  weeklyAvg: number;
};

export function SimpleBarChart({ data, color, title, total, weeklyAvg }: SimpleBarChartProps) {
  const maxValue = Math.max(...data.map(d => d.value), 1);
  
  const colorClasses = {
    purple: {
      gradient: 'from-purple-400 to-purple-600',
      light: 'from-purple-200 to-purple-400',
      bg: 'bg-purple-100',
      icon: 'bg-purple-600',
    },
    blue: {
      gradient: 'from-blue-400 to-blue-600',
      light: 'from-blue-200 to-blue-400',
      bg: 'bg-blue-100',
      icon: 'bg-blue-600',
    },
  };

  const colors = colorClasses[color];

  return (
    <div className="bg-white rounded-lg border shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-4 h-4 rounded ${colors.icon}`} />
          <h2 className="text-base font-medium text-gray-700">{title}</h2>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">
            {total.toLocaleString()}
          </div>
          <div className="text-sm text-gray-500">
            ~{weeklyAvg.toLocaleString()} / week
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="relative h-32 mt-6">
        <div className="absolute inset-0 flex items-end gap-[2px]">
          {data.map((item, index) => {
            const heightPercent = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
            const isRecent = index >= data.length - 7; // Last 7 weeks
            
            return (
              <div
                key={item.week}
                className="flex-1 relative group"
                style={{ minWidth: '2px' }}
              >
                <div
                  className={`
                    w-full rounded-t transition-all duration-200
                    ${isRecent 
                      ? `bg-gradient-to-t ${colors.gradient}` 
                      : `bg-gradient-to-t ${colors.light} opacity-40`
                    }
                    group-hover:opacity-100
                  `}
                  style={{ height: `${heightPercent}%` }}
                />
                
                {/* Tooltip on hover */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                  <div className="bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                    {item.value.toLocaleString()}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Labels */}
      <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
        <span>41 weeks ago</span>
        <span>Today</span>
      </div>
    </div>
  );
}
