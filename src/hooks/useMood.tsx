// hooks/useMoods.js
import useSWR from 'swr';
import { getMoods } from '../services/api/moodServices';

export default function useMoods() {
  const { data, error, isLoading, mutate } = useSWR('/moods', getMoods);

  return {
    moods: data || [],
    error,
    isLoading,
    mutate, // allows manual cache update after POST
  };
}