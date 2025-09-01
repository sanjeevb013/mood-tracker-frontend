'use client';
import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';
import { MoodOption, ChartDataPoint } from '@/types/moodTypes';

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    name: string;
  }>;
  label?: string;
}

interface MoodTrendsChartProps {
  chartData: ChartDataPoint[];
  viewType: 'weekly' | 'monthly';
  setViewType: (type: 'weekly' | 'monthly') => void;
  moodOptions: MoodOption[];
}

const CustomTooltip: React.FC<TooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const value = payload[0].value;
    return (
      <div className="p-3 border rounded-lg shadow-lg bg-white">
        <p>{`Mood: ${value}`}</p>
      </div>
    );
  }
  return null;
};

const MoodTrendsChart: React.FC<MoodTrendsChartProps> = ({
  chartData,
  viewType,
  setViewType,
  moodOptions
}) => {
  return (
    <div className="rounded-2xl p-8 shadow-xl border backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <span className="text-2xl mr-3">📈</span>
          <h2 className="text-2xl font-semibold">Mood Trends</h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setViewType('weekly')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              viewType === 'weekly'
                ? 'bg-indigo-100 text-indigo-800'
                : 'hover:bg-opacity-20 hover:bg-gray-500'
            }`}
            type="button"
          >
            Weekly
          </button>
          <button
            onClick={() => setViewType('monthly')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              viewType === 'monthly'
                ? 'bg-indigo-100 text-indigo-800'
                : 'hover:bg-opacity-20 hover:bg-gray-500'
            }`}
            type="button"
          >
            Monthly
          </button>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis domain={[1, 5]} />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="mood"
            stroke="url(#gradient)"
            strokeWidth={3}
            dot={{ r: 6 }}
            activeDot={{ r: 8 }}
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{ stopColor: '#667eea' }} />
              <stop offset="100%" style={{ stopColor: '#764ba2' }} />
            </linearGradient>
          </defs>
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MoodTrendsChart;