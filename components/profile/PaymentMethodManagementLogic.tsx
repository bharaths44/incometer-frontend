'use client';

import { useState, useEffect } from 'react';
import {
	usePaymentMethods,
	useDeletePaymentMethod,
} from '@/hooks/usePaymentMethods';
import { PaymentMethodResponseDTO } from '@/types/paymentMethod';

export const PaymentMethodManagementLogic = (userId: number) => {
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
	const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
	const [selectedPaymentMethod, setSelectedPaymentMethod] =
		useState<PaymentMethodResponseDTO | null>(null);
	const [allLucideIcons, setAllLucideIcons] = useState<string[]>([]);

	const { data: paymentMethods, isLoading } = usePaymentMethods(userId);
	const deletePaymentMethodMutation = useDeletePaymentMethod();

	// Load Lucide icons
	useEffect(() => {
		const loadAllIcons = async () => {
			try {
				const icons = await import('lucide-react');
				const iconNames = Object.keys(icons).filter(
					(key) =>
						key !== 'default' &&
						key !== 'createLucideIcon' &&
						key !== 'LucideIcon' &&
						key !== 'icons' &&
						!key.startsWith('Lucid') &&
						!key.endsWith('Icon') &&
						key.charAt(0) === key.charAt(0).toUpperCase()
				);
				// Convert PascalCase names to kebab-case for Icon component
				const kebabCaseIcons: string[] = iconNames.map((name) =>
					name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
				);

				// Remove duplicates and sort
				const uniqueIcons = [...new Set(kebabCaseIcons)].sort();
				setAllLucideIcons(uniqueIcons);
			} catch (error) {
				console.error('Failed to load Lucide icons:', error);
				// Fallback to predefined icons
				setAllLucideIcons([
					'shopping-bag',
					'car',
					'film',
					'zap',
					'heart',
					'home',
					'credit-card',
					'plane',
					'scissors',
					'utensils',
					'shopping-cart',
					'briefcase',
					'gift',
					'book',
					'users',
				]);
			}
		};
		loadAllIcons();
	}, []);

	const handleCreatePaymentMethod = (
		_paymentMethod: PaymentMethodResponseDTO
	) => {
		// The mutation will invalidate queries automatically
		setIsCreateModalOpen(false);
	};

	const handleUpdatePaymentMethod = (
		_paymentMethod: PaymentMethodResponseDTO
	) => {
		// The mutation will invalidate queries automatically
		setIsUpdateModalOpen(false);
		setSelectedPaymentMethod(null);
	};

	const handleDeletePaymentMethod = (
		paymentMethodId: number,
		userId: number
	) => {
		deletePaymentMethodMutation.mutate({ id: paymentMethodId, userId });
	};

	return {
		paymentMethods,
		isLoading,
		isCreateModalOpen,
		isUpdateModalOpen,
		selectedPaymentMethod,
		allLucideIcons,
		setIsCreateModalOpen,
		setIsUpdateModalOpen,
		setSelectedPaymentMethod,
		handleCreatePaymentMethod,
		handleUpdatePaymentMethod,
		handleDeletePaymentMethod,
	};
};
