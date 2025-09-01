'use client';
import React, { useState, useEffect, useMemo } from 'react';
import MoodLogger from '@/components/moodTrackingDashboard/MoodLogger';
import MoodTrendsChart from '@/components/moodTrackingDashboard/MoodTrendsChart';
import QuickStats from '@/components/moodTrackingDashboard/QuickStats';
import RecentEntries from '@/components/moodTrackingDashboard/RecentEnteries';
import { MoodOption, MoodEntry, ChartDataPoint } from '@/types/moodTypes';
import { getMoods, dispatchMoods, moodGraphRange } from '@/services/api/moodServices';

const MoodTrackingPage: React.FC = () => {
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [viewType, setViewType] = useState<'weekly' | 'monthly'>('weekly');
  const [totalEnteries, setTotalEnteries] = useState<string>("");
  const [moodAverage, setMoodAverage]=useState<string>("");
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]); // NEW state for graph

  /** Mood Options */
  const moodOptions: MoodOption[] = useMemo(
    () => [
      { emoji: '😢', label: 'Sad', value: 1, color: '#e74c3c' },
      { emoji: '😟', label: 'Anxious', value: 2, color: '#f39c12' },
      { emoji: '😐', label: 'Neutral', value: 3, color: '#95a5a6' },
      { emoji: '😊', label: 'Happy', value: 4, color: '#2ecc71' },
      { emoji: '😄', label: 'Excited', value: 5, color: '#9b59b6' },
    ],
    []
  );

  /** Tag Options */
  const tagOptions: string[] = useMemo(
    () => [
      'Work',
      'Family',
      'Health',
      'Social',
      'Exercise',
      'Sleep',
      'Stress',
      'Achievement',
      'Relationship',
      'Weather',
    ],
    []
  );

  /** Fetch moods for quick stats & recent entries */
  const fetchMoods = async () => {
    try {
      const data = await getMoods();
      setTotalEnteries(data.total);
      setMoodAverage(data.averageMood)
      setMoodEntries(data.data);
    } catch (error) {
      console.error("Failed to fetch moods:", error);
    }
  };

  /** Fetch moods for chart */
  const fetchMoodGraphData = async (range: string) => {
    try {
      const response = await moodGraphRange(range);
      // Assuming API gives you something like { date: string, mood: number }
      const transformed: ChartDataPoint[] = response.data.map((entry: any) => ({
        date:
          viewType === 'weekly'
            ? new Date(entry.date).toLocaleDateString('en-US', { weekday: 'short' })
            : new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        mood: entry.mood,
        fullDate: entry.date,
      }));
      setChartData(transformed);
    } catch (error) {
      console.error("Failed to fetch graph moods:", error);
    }
  };

  /** Initial fetch */
  useEffect(() => {
    fetchMoods();
  }, []);

  /** Re-fetch graph whenever viewType changes */
  useEffect(() => {
    const range = viewType === 'weekly' ? "7d" : "30d";
    fetchMoodGraphData(range);
  }, [viewType]);

  /** Handle Save */
  const handleSaveMood = async (entry: MoodEntry) => {
    if (entry) {
      try {
        await dispatchMoods(entry);
      } catch (error) {
        console.error('Error dispatching mood:', error);
      }
    }
    setMoodEntries((prev) => [...prev, entry]); // update state for recent entries
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-9xl p-6">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Mood Tracking Dashboard
          </h1>
          <p className="text-lg">
            Track your emotional wellbeing and discover patterns
          </p>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
          <MoodLogger
            moodOptions={moodOptions}
            tagOptions={tagOptions}
            onSave={handleSaveMood}
          />
          <QuickStats moodEntries={moodEntries} moodOptions={moodOptions} total={totalEnteries} moodAverage={moodAverage} />
        </div>

        {/* Chart + Recent Entries */}
        <MoodTrendsChart
          chartData={chartData}  // using API-based graph data
          viewType={viewType}
          setViewType={setViewType}
          moodOptions={moodOptions}
        />
        <RecentEntries moodEntries={moodEntries} moodOptions={moodOptions} />
      </div>
    </div>
  );
};

export default MoodTrackingPage;
