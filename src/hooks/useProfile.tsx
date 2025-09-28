import { getProfile, updateProfile } from "@/services/api/profileServices";
import { UpdateProfile, UserProfile } from "@/types/profileTypes";
import {useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useGetApi } from "./api/useFetchData";

export function useProfile(userId: string) {
  return useGetApi<UserProfile>(['profile', userId], () => getProfile(userId), {
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation<UserProfile, Error, { userId: string; data: UpdateProfile }>({
    mutationFn: ({ userId, data }) => updateProfile(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}
