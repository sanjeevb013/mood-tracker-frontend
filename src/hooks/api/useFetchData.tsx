import { useQuery, UseQueryOptions, UseQueryResult, useMutation, UseMutationResult, UseMutationOptions} from '@tanstack/react-query';

export function useGetApi<TData = unknown, TError = Error>(
  queryKey: UseQueryOptions<TData, TError>['queryKey'],
  queryFn: UseQueryOptions<TData, TError>['queryFn'],
  options?: Partial<UseQueryOptions<TData, TError>>
): UseQueryResult<TData, TError> {
  return useQuery<TData, TError>({
    queryKey,
    queryFn,
    staleTime: 1000 * 60 * 5,
    ...options,
  });
}

export function usePostApi<TData = unknown, TVariables = unknown, TError = Error>(
  mutationFn: UseMutationOptions<TData, TError, TVariables>['mutationFn'],
  options?: Partial<UseMutationOptions<TData, TError, TVariables>>
): UseMutationResult<TData, TError, TVariables> {
  return useMutation<TData, TError, TVariables>({
    mutationFn,
    ...options,
  });
}