'use client';
import React from 'react';
import { MoodOption, MoodEntry } from '@/types/moodTypes';

interface RecentEntriesProps {
  moodEntries: MoodEntry[];
  moodOptions: MoodOption[];
}

const RecentEntries: React.FC<RecentEntriesProps> = ({ moodEntries, moodOptions }) => {
  return (
    <div className="rounded-2xl p-8 shadow-xl border backdrop-blur-sm mt-8">
      <div className="flex items-center mb-6">
        <span className="text-2xl mr-3">📋</span>
        <h2 className="text-2xl font-semibold">Recent Entries</h2>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {moodEntries.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p className="text-lg">No mood entries yet.</p>
            <p className="text-sm mt-2">Start by logging how you feel today—your journey begins with a single note ✨</p>
          </div>
        ) : (
          moodEntries.slice(0, 10).map((entry, index) => {
            const mood = moodOptions.find(m => m.value === entry.mood);
            return (
              <div
                key={`${entry.date}-${index}`}
                className="flex items-center justify-between p-4 rounded-xl border hover:bg-opacity-10 hover:bg-gray-500 transition-all"
              >
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">{mood?.emoji}</div>
                  <div>
                    <p className="font-medium">{mood?.label}</p>
                    <p className="text-sm opacity-70">
                      {new Date(entry.date).toLocaleDateString()}
                    </p>
                    {entry.notes && (
                      <p className="text-sm opacity-80 mt-1">{entry.notes}</p>
                    )}
                    {entry.tags.length > 0 && (
                      <div className="flex gap-1 mt-2">
                        {entry.tags.map((tag, tagIndex) => (
                          <span
                            key={`${tag}-${tagIndex}`}
                            className="px-2 py-1 bg-opacity-20 bg-gray-500 text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default RecentEntries;