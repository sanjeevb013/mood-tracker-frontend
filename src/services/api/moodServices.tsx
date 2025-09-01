// services/moodsService.js
import axios from '@/lib/axios';
import { MoodEntry, MoodGraphApiResponse} from "../../types/moodTypes"

export const dispatchMoods = async (data:MoodEntry) => {
  const response = await axios.post('/moods',data);
  return response.data;
};

export const getMoods = async () => {
  const response = await axios.get(`/moods`);
  return response.data;
};


export const moodGraphRange = async (range: string): Promise<MoodGraphApiResponse> => {
  const response = await axios.get<MoodGraphApiResponse>(`/moodsGraph?range=${range}`);
  return response.data; // ✅ correctly typed as MoodGraphApiResponse
};