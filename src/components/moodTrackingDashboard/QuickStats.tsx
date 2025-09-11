'use client';
import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  Cell
} from 'recharts';
import { MoodOption, MoodEntry } from '@/types/moodTypes';

interface MoodDistributionData {
  name: string;
  count: number;
  color: string;
}

interface QuickStatsProps {
  moodEntries: MoodEntry[];
  moodOptions: MoodOption[];
  total:number
  moodAverage:string
}

const QuickStats: React.FC<QuickStatsProps> = ({ moodEntries, moodOptions, total, moodAverage }) => {

  const getMoodDistribution = (): MoodDistributionData[] => {
    return moodOptions.map(mood => ({
      name: mood.label,
      count: moodEntries.filter(entry => entry.mood === mood.value).length,
      color: mood.color
    }));
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-2xl p-6 shadow-xl border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm">Average Mood</p>
              <p className="text-3xl font-bold text-indigo-600">{moodAverage}</p>
            </div>
            <div className="text-3xl">📊</div>
          </div>
        </div>
        <div className="rounded-2xl p-6 shadow-xl border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm">Total Entries</p>
              <p className="text-3xl font-bold text-purple-600">{total}</p>
            </div>
            <div className="text-3xl">📝</div>
          </div>
        </div>
      </div>

      {/* Mood Distribution */}
      <div className="rounded-2xl p-6 shadow-xl border">
        <h3 className="text-lg font-semibold mb-4">Mood Distribution</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={getMoodDistribution()}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {getMoodDistribution().map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default QuickStats;