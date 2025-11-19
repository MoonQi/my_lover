import useSWR from 'swr';

export interface UpcomingAnniversary {
  id: string;
  date: Date | string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  imageWidth: number | null;
  imageHeight: number | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  nextAnniversary: string;
  daysUntil: number;
  yearsSince: number;
}

interface UpcomingAnniversariesResponse {
  upcoming: UpcomingAnniversary[];
  total: number;
}

export function useUpcomingMilestones() {
  const { data, error, mutate, isLoading } = useSWR<UpcomingAnniversariesResponse>(
    '/api/milestones/upcoming'
  );

  return {
    upcomingAnniversaries: data?.upcoming || [],
    total: data?.total || 0,
    isLoading,
    isError: error,
    mutate,
  };
}
