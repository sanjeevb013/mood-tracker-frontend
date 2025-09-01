'use client';
import React, { useState } from 'react';
import { MoodOption, MoodEntry} from '@/types/moodTypes';

interface MoodLoggerProps {
  moodOptions: MoodOption[];
  tagOptions: string[];
  onSave: (entry: MoodEntry) => void;
}

const MoodLogger: React.FC<MoodLoggerProps> = ({ moodOptions, tagOptions, onSave }) => {
  const [selectedMood, setSelectedMood] = useState<MoodOption | null>(null);
  const [currentNote, setCurrentNote] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleMoodSelect = (mood: MoodOption) => {
    setSelectedMood(mood);
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };
  const handleSaveMood = () => {
    if (!selectedMood) return;
    console.log(selectedMood)
    const newEntry: MoodEntry = {
  
      date: new Date().toISOString().split('T')[0],
      mood: selectedMood.value,
      notes: currentNote,
      tags: selectedTags,
      timestamp: new Date().toISOString()
    };
    onSave(newEntry);
    setSelectedMood(null);
    setCurrentNote('');
    setSelectedTags([]);
  };

  return (
    <div className="rounded-2xl p-8 shadow-xl border backdrop-blur-sm">
      <div className="flex items-center mb-6">
        <span className="text-2xl mr-3">🎯</span>
        <h2 className="text-2xl font-semibold">Log Your Mood</h2>
      </div>

      {/* Mood Selection */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        {moodOptions.map((mood) => (
          <button
            key={mood.value}
            onClick={() => handleMoodSelect(mood)}
            className={`p-4 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
              selectedMood?.value === mood.value
                ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg'
                : 'hover:bg-opacity-20 hover:bg-gray-500'
            }`}
            type="button"
          >
            <div className="text-3xl mb-2">{mood.emoji}</div>
            <div className="text-sm font-medium">{mood.label}</div>
          </button>
        ))}
      </div>

      {/* Notes Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Notes (Optional)</label>
        <textarea
          value={currentNote}
          onChange={(e) => setCurrentNote(e.target.value)}
          placeholder="How are you feeling? What influenced your mood today?"
          className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
          rows={3}
        />
      </div>

      {/* Tags Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-3">Tags (Optional)</label>
        <div className="flex flex-wrap gap-2">
          {tagOptions.map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagToggle(tag)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedTags.includes(tag)
                  ? 'bg-indigo-100 text-indigo-800 border-2 border-indigo-300'
                  : 'border hover:bg-opacity-20 hover:bg-gray-500'
              }`}
              type="button"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSaveMood}
        disabled={!selectedMood}
        className={`w-full py-4 rounded-xl font-semibold transition-all ${
          selectedMood
            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg text-white'
            : 'opacity-50 cursor-not-allowed'
        }`}
        type="button"
      >
        Save Mood Entry
      </button>
    </div>
  );
};

export default React.memo(MoodLogger);