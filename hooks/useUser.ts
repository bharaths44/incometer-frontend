import { useQuery } from '@tanstack/react-query';
import { fetchUserStats } from '../services/userService';

// Query keys
export const userKeys = {
	all: ['user'] as const,
	stats: (userId: string) => [...userKeys.all, 'stats', userId] as const,
};

// Hooks
export const useUserStats = (userId: string) => {
	return useQuery({
		queryKey: userKeys.stats(userId),
		queryFn: () => fetchUserStats(userId),
		enabled: !!userId,
	});
};
