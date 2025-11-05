'use client';

import { useState, useEffect } from 'react';
import { useCategories, useDeleteCategory } from '@/hooks/useCategories';
import { Category } from '@/types/category';

export const CategoryManagementLogic = (userId: string) => {
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
	const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
	const [selectedCategory, setSelectedCategory] = useState<Category | null>(
		null
	);
	const [allLucideIcons, setAllLucideIcons] = useState<string[]>([]);

	const { data: categories, isLoading } = useCategories(userId);
	const deleteCategoryMutation = useDeleteCategory();

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

	const handleCreateCategory = (_category: Category) => {
		// The mutation will invalidate queries automatically
		setIsCreateModalOpen(false);
	};

	const handleUpdateCategory = (_category: Category) => {
		// The mutation will invalidate queries automatically
		setIsUpdateModalOpen(false);
		setSelectedCategory(null);
	};

	const handleDeleteCategory = (categoryId: number, userId: string) => {
		deleteCategoryMutation.mutate({ id: categoryId, userId });
	};

	return {
		categories,
		isLoading,
		isCreateModalOpen,
		isUpdateModalOpen,
		selectedCategory,
		allLucideIcons,
		setIsCreateModalOpen,
		setIsUpdateModalOpen,
		setSelectedCategory,
		handleCreateCategory,
		handleUpdateCategory,
		handleDeleteCategory,
	};
};
