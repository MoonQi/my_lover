import useSWR from 'swr';
import type { Milestone } from '@/types/milestone';

interface MilestonesResponse {
  milestones: Milestone[];
  total: number;
  limit: number;
  offset: number;
}

export function useMilestones() {
  const { data, error, mutate, isLoading } = useSWR<MilestonesResponse>('/api/milestones');
  console.log('🚀 [useMilestones:13] data →', data);

  return {
    milestones: data?.milestones || [],
    total: data?.total || 0,
    isLoading,
    isError: error,
    mutate,
  };
}
