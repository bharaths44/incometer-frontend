import { useState, useEffect, useMemo } from 'react';
import { useAuthContext } from '@/components/auth/AuthProvider';

export function useProfilePageLogic() {
	const [isEditing, setIsEditing] = useState(false);
	const [activeTab, setActiveTab] = useState('personal');

	// Get user from auth context
	const { user } = useAuthContext();

	// Compute profile data from user
	const profile = useMemo(
		() => ({
			name: user?.name || '',
			email: user?.email || '',
			password: '',
			phone: user?.phoneNumber || '',
		}),
		[user]
	);

	const [editData, setEditData] = useState(profile);

	// Get userId from auth context
	const userId = user ? user.userId : '1';

	// Update editData when profile changes
	useEffect(() => {
		setEditData(profile);
	}, [profile]);

	useEffect(() => {
		// Handle hash changes for navigation from dropdown menu
		const handleHashChange = () => {
			const hash = window.location.hash.replace('#', '');
			if (hash === 'categories' || hash === 'payment-methods') {
				setActiveTab(hash);
			}
		};

		// Check initial hash
		handleHashChange();

		// Listen for hash changes
		window.addEventListener('hashchange', handleHashChange);
		return () => window.removeEventListener('hashchange', handleHashChange);
	}, []);

	const handleSave = () => {
		// TODO: Implement save to backend API
		setIsEditing(false);
	};

	return {
		isEditing,
		setIsEditing,
		activeTab,
		setActiveTab,
		profile,
		editData,
		setEditData,
		userId,
		handleSave,
	};
}
