'use client';
import React, { useState, useMemo, useCallback } from 'react';
import MoodLogger from '@/components/moodTrackingDashboard/MoodLogger';
import MoodTrendsChart from '@/components/moodTrackingDashboard/MoodTrendsChart';
import QuickStats from '@/components/moodTrackingDashboard/QuickStats';
import RecentEntries from '@/components/moodTrackingDashboard/RecentEnteries';
import { MoodOption, MoodEntry } from '@/types/moodTypes';
import { useMoods, useMoodGraph, useDispatchMood } from "@/hooks/useMood";

const MoodTrackingPage: React.FC = () => {
  /** State */
  const [viewType, setViewType] = useState<'weekly' | 'monthly'>('weekly');
  const [currentPage, setCurrentPage] = useState(1);

  /** Queries */
  const { data: moodsData, isLoading: moodsLoading } = useMoods(currentPage);
  const { data: graphData, isLoading: graphLoading } = useMoodGraph(
    viewType === 'weekly' ? '7d' : '30d'
  );

  /** Mutation */
  const { mutateAsync: saveMood, isPending: savingMood } = useDispatchMood();

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

  /** Save handler */
  const handleSaveMood = useCallback(
    async (entry: MoodEntry) => {
      try {
        await saveMood(entry);
        // React Query will auto-invalidate & refetch moods + graph
      } catch (err) {
        console.error('Error saving mood:', err);
      }
    },
    [saveMood]
  );

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
            // isSaving={savingMood}
          />
          <QuickStats
            moodEntries={moodsData?.data ?? []}
            moodOptions={moodOptions}
            total={moodsData?.total ?? 0}
            moodAverage={moodsData?.averageMood ?? ''}
          />
        </div>

        {/* Chart */}
        <MoodTrendsChart
          chartData={
            graphData?.data.map(entry => ({
              date: new Date(entry.date).toLocaleDateString(
                'en-US',
                viewType === 'weekly'
                  ? { weekday: 'short' }
                  : { month: 'short', day: 'numeric' }
              ),
              mood: entry.mood,
              fullDate: entry.date,
            })) ?? []
          }
          viewType={viewType}
          setViewType={setViewType}
          moodOptions={moodOptions}
          // isLoading={graphLoading}
        />

        {/* Recent Entries with Pagination */}
        <RecentEntries
          moodEntries={moodsData?.data ?? []}
          moodOptions={moodOptions}
          totalPages={moodsData?.totalPages ?? 0}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          // isLoading={moodsLoading}
        />
      </div>
    </div>
  );
};

export default MoodTrackingPage;
