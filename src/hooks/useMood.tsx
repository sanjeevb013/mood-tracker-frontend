import { 
  useQuery, 
  useMutation, 
  useQueryClient, 
  UseQueryResult, 
  UseMutationResult, 
  keepPreviousData
} from "@tanstack/react-query";

import { getMoods, dispatchMoods, moodGraphRange } from "@/services/api/moodServices";
import { MoodEntry, MoodGraphApiResponse } from "@/types/moodTypes";
import { useGetApi } from "./api/useFetchData";
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
  return useGetApi<PaginatedMoodsResponse>(['moods', page], () => getMoods(page), {
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
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
