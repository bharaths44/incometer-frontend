import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
	createCategory,
	deleteCategory,
	getAllCategories,
	updateCategory,
} from '@/services/categoryService';
import { CategoryRequestDTO } from '@/types/category';

// Query keys
export const categoryKeys = {
	all: ['categories'] as const,
	lists: () => [...categoryKeys.all, 'list'] as const,
	list: (userId: string) => [...categoryKeys.lists(), userId] as const,
};

// Hooks
export const useCategories = (userId: string) => {
	return useQuery({
		queryKey: categoryKeys.list(userId),
		queryFn: () => getAllCategories(userId),
		enabled: !!userId,
		staleTime: 30000, // Cache for 30 seconds
	});
};

export const useCreateCategory = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (category: CategoryRequestDTO) => createCategory(category),
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
		mutationFn: ({ id, userId }: { id: number; userId: string }) =>
			deleteCategory(id, userId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
		},
	});
};
