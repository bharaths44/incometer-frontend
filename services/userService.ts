import { UserStats } from '../types/user';
import { API_BASE_URL } from '../lib/constants';
import { authenticatedFetch } from '../lib/authFetch';

const API_BASE_URL_USERS = `${API_BASE_URL}/users`;

export const fetchUserStats = async (userId: string): Promise<UserStats> => {
	const response = await authenticatedFetch(
		`${API_BASE_URL_USERS}/${userId}/stats`
	);
	if (!response.ok) {
		throw new Error('Failed to fetch user statistics');
	}
	return response.json();
};
