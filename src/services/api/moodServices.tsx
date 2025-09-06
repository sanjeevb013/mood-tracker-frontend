import axios from '@/lib/axios';
import { MoodEntry, MoodGraphApiResponse} from "../../types/moodTypes"

export const dispatchMoods = async (data:MoodEntry) => {
  const response = await axios.post('moods/saveMood',data);
  return response.data;
};

export const getMoods = async (page: number) => {
  const response = await axios.get(`/moods/get?page=${page}`);
  return response.data;
};


export const moodGraphRange = async (range: string): Promise<MoodGraphApiResponse> => {
  const response = await axios.get<MoodGraphApiResponse>(`moods/moodsGraph?range=${range}`);
  return response.data; // ✅ correctly typed as MoodGraphApiResponse
};