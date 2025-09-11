import { 
  useQuery, 
  useMutation, 
  useQueryClient, 
  UseQueryResult, 
  UseMutationResult 
} from "@tanstack/react-query";

import { getMoods, dispatchMoods, moodGraphRange } from "@/services/api/moodServices";
import { MoodEntry, MoodGraphApiResponse } from "@/types/moodTypes";
export interface PaginatedMoodsResponse {
  data: MoodEntry[];
  total: number;
  totalPages: number;
  averageMood: string;
}
//
// Fetch paginated moods
//
export function useMoods(page: number) {
  return useQuery<PaginatedMoodsResponse, Error>({ 
    // 👆 you can replace `any` with a proper `PaginatedMoodsResponse` type if available
    queryKey: ["moods", page],
    queryFn: () => getMoods(page),
    // keepPreviousData: true, // smoother pagination
    staleTime: 1000 * 60 * 5, // cache 5 min
  });
}

//
// Post new mood
//
export function useDispatchMood(): UseMutationResult<any, Error, MoodEntry> {
  const queryClient = useQueryClient();

  return useMutation<any, Error, MoodEntry>({
    mutationFn: (data: MoodEntry) => dispatchMoods(data),
    onSuccess: () => {
      // Refresh moods + graph after new entry
      queryClient.invalidateQueries({ queryKey: ["moods"] });
      queryClient.invalidateQueries({ queryKey: ["moodGraph"] });
    },
  });
}

//
// Fetch mood graph
//
export function useMoodGraph(
  range: string
): UseQueryResult<MoodGraphApiResponse, Error> {
  return useQuery<MoodGraphApiResponse, Error>({
    queryKey: ["moodGraph", range],
    queryFn: () => moodGraphRange(range),
    staleTime: 1000 * 60 * 10, // cache 10 min
  });
}
