import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllCategories, createCategory } from "../services/categoryService";

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