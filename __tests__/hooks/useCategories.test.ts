import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import {
	useCategories,
	useCreateCategory,
	useUpdateCategory,
	useDeleteCategory,
	categoryKeys,
} from '@/hooks/useCategories';
import type { Category, CategoryRequestDTO } from '@/types/category';

// Mock the category service functions
jest.mock('@/services/categoryService', () => ({
	getAllCategories: jest.fn(),
	createCategory: jest.fn(),
	updateCategory: jest.fn(),
	deleteCategory: jest.fn(),
}));

import {
	getAllCategories,
	createCategory,
	updateCategory,
	deleteCategory,
} from '@/services/categoryService';

const mockGetAllCategories = getAllCategories as jest.MockedFunction<
	typeof getAllCategories
>;
const mockCreateCategory = createCategory as jest.MockedFunction<
	typeof createCategory
>;
const mockUpdateCategory = updateCategory as jest.MockedFunction<
	typeof updateCategory
>;
const mockDeleteCategory = deleteCategory as jest.MockedFunction<
	typeof deleteCategory
>;

// Create a test wrapper with QueryClient
const createWrapper = () => {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				retry: false,
			},
			mutations: {
				retry: false,
			},
		},
	});

	const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
		return React.createElement(
			QueryClientProvider,
			{ client: queryClient },
			children
		);
	};

	return Wrapper;
};

describe('useCategories', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('categoryKeys', () => {
		it('should generate correct list key', () => {
			const key = categoryKeys.list('1');

			expect(key).toEqual(['categories', 'list', '1']);
		});
	});

	describe('useCategories', () => {
		it('should fetch categories successfully', async () => {
			const mockCategories: Category[] = [
				{
					categoryId: 1,
					name: 'Food',
					icon: 'utensils',
					type: 'EXPENSE',
					createdAt: '2024-01-01T00:00:00Z',
				},
				{
					categoryId: 2,
					name: 'Salary',
					icon: 'dollar-sign',
					type: 'INCOME',
					createdAt: '2024-01-01T00:00:00Z',
				},
			];

			mockGetAllCategories.mockResolvedValueOnce(mockCategories);

			const { result } = renderHook(() => useCategories('1'), {
				wrapper: createWrapper(),
			});

			expect(result.current.isLoading).toBe(true);

			await waitFor(() => {
				expect(result.current.isSuccess).toBe(true);
			});

			expect(result.current.data).toEqual(mockCategories);
			expect(mockGetAllCategories).toHaveBeenCalledWith('1');
		});

		it('should handle error when fetching categories fails', async () => {
			const error = new Error('Failed to fetch categories');
			mockGetAllCategories.mockRejectedValueOnce(error);

			const { result } = renderHook(() => useCategories('1'), {
				wrapper: createWrapper(),
			});

			await waitFor(() => {
				expect(result.current.isError).toBe(true);
			});

			expect(result.current.error).toEqual(error);
		});

		it('should be disabled when userId is not provided', () => {
			const { result } = renderHook(() => useCategories(''), {
				wrapper: createWrapper(),
			});

			expect(result.current.isFetching).toBe(false);
			expect(mockGetAllCategories).not.toHaveBeenCalled();
		});
	});

	describe('useCreateCategory', () => {
		it('should create category successfully', async () => {
			const categoryRequest: CategoryRequestDTO = {
				userId: '1',
				name: 'Entertainment',
				icon: 'film',
				type: 'EXPENSE',
			};

			const mockCategory: Category = {
				categoryId: 3,
				name: 'Entertainment',
				icon: 'film',
				type: 'EXPENSE',
				createdAt: '2024-01-01T00:00:00Z',
			};

			mockCreateCategory.mockResolvedValueOnce(mockCategory);

			const { result } = renderHook(() => useCreateCategory(), {
				wrapper: createWrapper(),
			});

			result.current.mutate(categoryRequest);

			await waitFor(() => {
				expect(result.current.isSuccess).toBe(true);
			});

			expect(result.current.data).toEqual(mockCategory);
			expect(mockCreateCategory).toHaveBeenCalledTimes(1);
			expect(mockCreateCategory).toHaveBeenCalledWith(categoryRequest);
		});

		it('should handle error when creating category fails', async () => {
			const error = new Error('Failed to create category');
			const categoryRequest: CategoryRequestDTO = {
				userId: '1',
				name: 'Test',
				icon: 'test-icon',
				type: 'EXPENSE',
			};

			mockCreateCategory.mockRejectedValueOnce(error);

			const { result } = renderHook(() => useCreateCategory(), {
				wrapper: createWrapper(),
			});

			result.current.mutate(categoryRequest);

			await waitFor(() => {
				expect(result.current.isError).toBe(true);
			});

			expect(result.current.error).toEqual(error);
		});
	});

	describe('useUpdateCategory', () => {
		it('should update category successfully', async () => {
			const categoryRequest: CategoryRequestDTO = {
				userId: '1',
				name: 'Updated Food',
				icon: 'utensils',
				type: 'EXPENSE',
			};

			const mockCategory: Category = {
				categoryId: 1,
				name: 'Updated Food',
				icon: 'utensils',
				type: 'EXPENSE',
				createdAt: '2024-01-01T00:00:00Z',
			};

			mockUpdateCategory.mockResolvedValueOnce(mockCategory);

			const { result } = renderHook(() => useUpdateCategory(), {
				wrapper: createWrapper(),
			});

			result.current.mutate({ id: 1, category: categoryRequest });

			await waitFor(() => {
				expect(result.current.isSuccess).toBe(true);
			});

			expect(result.current.data).toEqual(mockCategory);
			expect(mockUpdateCategory).toHaveBeenCalledTimes(1);
			expect(mockUpdateCategory).toHaveBeenCalledWith(1, categoryRequest);
		});

		it('should handle error when updating category fails', async () => {
			const error = new Error('Failed to update category');
			const categoryRequest: CategoryRequestDTO = {
				userId: '1',
				name: 'Test',
				icon: 'test-icon',
				type: 'EXPENSE',
			};

			mockUpdateCategory.mockRejectedValueOnce(error);

			const { result } = renderHook(() => useUpdateCategory(), {
				wrapper: createWrapper(),
			});

			result.current.mutate({ id: 1, category: categoryRequest });

			await waitFor(() => {
				expect(result.current.isError).toBe(true);
			});

			expect(result.current.error).toEqual(error);
		});
	});

	describe('useDeleteCategory', () => {
		it('should delete category successfully', async () => {
			mockDeleteCategory.mockResolvedValueOnce(undefined);

			const { result } = renderHook(() => useDeleteCategory(), {
				wrapper: createWrapper(),
			});

			result.current.mutate({ id: 1, userId: '1' });

			await waitFor(() => {
				expect(result.current.isSuccess).toBe(true);
			});

			expect(result.current.data).toBeUndefined();
			expect(mockDeleteCategory).toHaveBeenCalledTimes(1);
			expect(mockDeleteCategory).toHaveBeenCalledWith(1, '1');
		});

		it('should handle error when deleting category fails', async () => {
			const error = new Error('Failed to delete category');

			mockDeleteCategory.mockRejectedValueOnce(error);

			const { result } = renderHook(() => useDeleteCategory(), {
				wrapper: createWrapper(),
			});

			result.current.mutate({ id: 1, userId: '1' });

			await waitFor(() => {
				expect(result.current.isError).toBe(true);
			});

			expect(result.current.error).toEqual(error);
		});
	});
});
