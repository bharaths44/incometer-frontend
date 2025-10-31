import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
	getAllCategories,
	createCategory,
	updateCategory,
	deleteCategory,
} from '../services/categoryService';
import { CategoryRequestDTO } from '../types/category';

// Query keys
export const categoryKeys = {
	all: ['categories'] as const,
	lists: () => [...categoryKeys.all, 'list'] as const,
	list: (userId: number) => [...categoryKeys.lists(), userId] as const,
};

// Hooks
export const useCategories = (userId: number) => {
	return useQuery({
		queryKey: categoryKeys.list(userId),
		queryFn: () => getAllCategories(userId),
		enabled: !!userId,
	});
};

export const useCreateCategory = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createCategory,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
		},
	});
};

export const useUpdateCategory = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			id,
			category,
		}: {
			id: number;
			category: CategoryRequestDTO;
		}) => updateCategory(id, category),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
		},
	});
};

export const useDeleteCategory = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, userId }: { id: number; userId: number }) =>
			deleteCategory(id, userId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
		},
	});
};
