'use client';

import { LucideIcon } from 'lucide-react';

type StatCardProps = {
  title: string;
  value: number;
  icon: LucideIcon;
  iconColor: string;
  bgColor: string;
  tooltip?: string;
};

export function StatCard({ title, value, icon: Icon, iconColor, bgColor, tooltip }: StatCardProps) {
  return (
    <div
      className="bg-white rounded-lg border shadow-sm p-4 hover:shadow-md transition-shadow"
      title={tooltip}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">
            {value.toLocaleString()}
          </p>
        </div>
        <div className={`${bgColor} p-3 rounded-lg`}>
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
      </div>
    </div>
  );
}
