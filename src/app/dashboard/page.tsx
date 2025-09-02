'use client';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import MoodLogger from '@/components/moodTrackingDashboard/MoodLogger';
import MoodTrendsChart from '@/components/moodTrackingDashboard/MoodTrendsChart';
import QuickStats from '@/components/moodTrackingDashboard/QuickStats';
import RecentEntries from '@/components/moodTrackingDashboard/RecentEnteries';
import { MoodOption, MoodEntry, ChartDataPoint } from '@/types/moodTypes';
import { getMoods, dispatchMoods, moodGraphRange } from '@/services/api/moodServices';

const MoodTrackingPage: React.FC = () => {
  /** State */
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [viewType, setViewType] = useState<'weekly' | 'monthly'>('weekly');
  const [currentPage, setCurrentPage] = useState(1);

  // Consolidated stats (instead of 3 separate states)
  const [stats, setStats] = useState({
    totalEntries: 0,
    moodAverage: '',
    totalPages: 0,
  });

  /** Static Options */
  const moodOptions: MoodOption[] = useMemo(() => [
    { emoji: '😢', label: 'Sad', value: 1, color: '#e74c3c' },
    { emoji: '😟', label: 'Anxious', value: 2, color: '#f39c12' },
    { emoji: '😐', label: 'Neutral', value: 3, color: '#95a5a6' },
    { emoji: '😊', label: 'Happy', value: 4, color: '#2ecc71' },
    { emoji: '😄', label: 'Excited', value: 5, color: '#9b59b6' },
  ], []);

  const tagOptions = useMemo(
    () => [
      'Work', 'Family', 'Health', 'Social', 'Exercise',
      'Sleep', 'Stress', 'Achievement', 'Relationship', 'Weather',
    ],
    []
  );

  /** Helpers */
  const formatDate = useCallback((date: string) => {
    const options: Intl.DateTimeFormatOptions =
      viewType === 'weekly'
        ? { weekday: 'short' }
        : { month: 'short', day: 'numeric' };

    return new Date(date).toLocaleDateString('en-US', options);
  }, [viewType]);

  /** API Calls */
  const fetchMoods = useCallback(async (page: number) => {
    try {
      const { totalPages, averageMood, data, total } = await getMoods(page);
      setMoodEntries(data);
      setStats({ totalPages, moodAverage: averageMood, totalEntries: total });
    } catch (err) {
      console.error('Failed to fetch moods:', err);
    }
  }, []);

  const fetchMoodGraphData = useCallback(async () => {
    try {
      const range = viewType === 'weekly' ? '7d' : '30d';
      const { data } = await moodGraphRange(range);

      setChartData(
        data.map((entry: any) => ({
          date: formatDate(entry.date),
          mood: entry.mood,
          fullDate: entry.date,
        }))
      );
    } catch (err) {
      console.error('Failed to fetch graph data:', err);
    }
  }, [viewType, formatDate]);

  /** Lifecycle */
  useEffect(() => { fetchMoods(currentPage); }, [fetchMoods, currentPage]);
  useEffect(() => { fetchMoodGraphData(); }, [fetchMoodGraphData]);

  /** Save handler */
  const handleSaveMood = async (entry: MoodEntry) => {
    try {
      await dispatchMoods(entry);
      await fetchMoods(currentPage); // refresh after save
    } catch (err) {
      console.error('Error saving mood:', err);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-9xl p-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Mood Tracking Dashboard
          </h1>
          <p className="text-lg">Track your emotional wellbeing and discover patterns</p>
        </div>

        {/* Mood Logger + Quick Stats */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
          <MoodLogger
            moodOptions={moodOptions}
            tagOptions={tagOptions}
            onSave={handleSaveMood}
          />
          <QuickStats
            moodEntries={moodEntries}
            moodOptions={moodOptions}
            total={stats.totalEntries}
            moodAverage={stats.moodAverage}
          />
        </div>

        {/* Chart */}
        <MoodTrendsChart
          chartData={chartData}
          viewType={viewType}
          setViewType={setViewType}
          moodOptions={moodOptions}
        />

        {/* Recent Entries with Pagination */}
        <RecentEntries
          moodEntries={moodEntries}
          moodOptions={moodOptions}
          totalPages={stats.totalPages}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default MoodTrackingPage;
