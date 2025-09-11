import { getProfile, updateProfile } from "@/services/api/profileServices";
import { UpdateProfile, UserProfile } from "@/types/profileTypes";
import {useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useProfile(userId:string){
    return useQuery<UserProfile>({
        queryKey:['profile',userId],
        queryFn: () => getProfile(userId),
        staleTime: 1000 * 60 * 10
    })
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
