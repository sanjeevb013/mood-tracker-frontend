'use client';
import React from 'react';
import { MoodOption, MoodEntry } from '@/types/moodTypes';

interface RecentEntriesProps {
  moodEntries: MoodEntry[];
  moodOptions: MoodOption[];
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const RecentEntries: React.FC<RecentEntriesProps> = ({ 
  moodEntries, 
  moodOptions, 
  totalPages, 
  currentPage , 
  onPageChange 
}) => {
  const entriesPerPage = 10;
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const currentEntries = moodEntries.slice(startIndex, endIndex);

  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages is less than or equal to max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show pages with ellipsis logic
      if (currentPage <= 3) {
        // Show first 3 pages, ellipsis, and last page
        pages.push(1, 2, 3, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Show first page, ellipsis, and last 3 pages
        pages.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
      } else {
        // Show first page, ellipsis, current page and neighbors, ellipsis, last page
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    
    return pages;
  };

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
          moodEntries.map((entry, index) => {
            const mood = moodOptions.find(m => m.value === entry.mood);
            return (
              <div
                key={`${entry.date}-${startIndex + index}`}
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

      {/* Pagination Controls */}
      {moodEntries.length > 0 && totalPages > 1 && (
        <div className="flex justify-center items-center mt-6 space-x-2">
          {/* Previous Button */}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              currentPage === 1
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            Previous
          </button>

          {/* Page Numbers */}
          {generatePageNumbers().map((page, index) => (
            <React.Fragment key={index}>
              {page === '...' ? (
                <span className="px-3 py-2 text-gray-400">...</span>
              ) : (
                <button
                  onClick={() => onPageChange(page as number)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    currentPage === page
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  {page}
                </button>
              )}
            </React.Fragment>
          ))}

          {/* Next Button */}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              currentPage === totalPages
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            Next
          </button>
        </div>
      )}

      {/* Page Info */}
      {moodEntries.length > 0 && totalPages > 1 && (
        <div className="text-center mt-4 text-sm text-gray-500">
          Page {currentPage} of {totalPages} ({moodEntries.length} total entries)
        </div>
      )}
    </div>
  );
};

export default RecentEntries;