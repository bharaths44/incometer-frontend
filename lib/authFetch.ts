// Utility for making authenticated API calls
export const authenticatedFetch = async (
	url: string,
	options: RequestInit = {}
): Promise<Response> => {
	const token = localStorage.getItem('token');
	const headers: Record<string, string> = {
		'Content-Type': 'application/json',
		...(options.headers as Record<string, string>),
	};

	if (token) {
		headers['Authorization'] = `Bearer ${token}`;
	}

	return fetch(url, {
		...options,
		headers,
	});
};
