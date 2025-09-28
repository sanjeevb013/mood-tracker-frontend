import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';

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