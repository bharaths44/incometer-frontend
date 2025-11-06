import {
	getAllCategories,
	createCategory,
	updateCategory,
	deleteCategory,
} from '@/services/categoryService';
import { Category, CategoryRequestDTO } from '@/types/category';

// Mock the authenticatedFetch function
jest.mock('@/lib/authFetch', () => ({
	authenticatedFetch: jest.fn(),
}));

import { authenticatedFetch } from '@/lib/authFetch';

const mockAuthenticatedFetch = authenticatedFetch as jest.MockedFunction<
	typeof authenticatedFetch
>;

describe('categoryService', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('getAllCategories', () => {
		it('should fetch categories successfully', async () => {
			const mockCategories: Category[] = [
				{
					categoryId: 1,
					name: 'Food',
					icon: 'shopping-bag',
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

			mockAuthenticatedFetch.mockResolvedValueOnce({
				ok: true,
				status: 200,
				json: async () => mockCategories,
			} as Response);

			const result = await getAllCategories('1');

			expect(mockAuthenticatedFetch).toHaveBeenCalledWith(
				'http://localhost:8080/api/categories/user/1'
			);
			expect(result).toEqual(mockCategories);
		});

		it('should throw error when fetch fails', async () => {
			mockAuthenticatedFetch.mockResolvedValueOnce({
				ok: false,
				status: 500,
			} as Response);

			await expect(getAllCategories('1')).rejects.toThrow(
				'Failed to fetch categories'
			);
		});
	});

	describe('createCategory', () => {
		it('should create category successfully', async () => {
			const categoryRequest: CategoryRequestDTO = {
				name: 'Entertainment',
				type: 'EXPENSE',
				userId: '1',
				icon: 'film',
			};

			const mockCreatedCategory: Category = {
				categoryId: 3,
				name: 'Entertainment',
				icon: 'film',
				type: 'EXPENSE',
				createdAt: '2024-01-01T00:00:00Z',
			};

			mockAuthenticatedFetch.mockResolvedValueOnce({
				ok: true,
				status: 201,
				json: async () => mockCreatedCategory,
			} as Response);

			const result = await createCategory(categoryRequest);

			expect(mockAuthenticatedFetch).toHaveBeenCalledWith(
				'http://localhost:8080/api/categories',
				{
					method: 'POST',
					body: JSON.stringify(categoryRequest),
				}
			);
			expect(result).toEqual(mockCreatedCategory);
		});

		it('should throw error when creation fails', async () => {
			const categoryRequest: CategoryRequestDTO = {
				name: 'Test',
				type: 'EXPENSE',
				userId: '1',
				icon: 'test-icon',
			};

			mockAuthenticatedFetch.mockResolvedValueOnce({
				ok: false,
				status: 400,
				text: async () => 'Bad Request',
			} as Response);

			await expect(createCategory(categoryRequest)).rejects.toThrow(
				'Failed to create category'
			);
		});
	});

	describe('updateCategory', () => {
		it('should update category successfully', async () => {
			const categoryRequest: CategoryRequestDTO = {
				name: 'Updated Food',
				type: 'EXPENSE',
				userId: '1',
				icon: 'shopping-bag',
			};

			const mockUpdatedCategory: Category = {
				categoryId: 1,
				name: 'Updated Food',
				icon: 'shopping-bag',
				type: 'EXPENSE',
				createdAt: '2024-01-01T00:00:00Z',
			};

			mockAuthenticatedFetch.mockResolvedValueOnce({
				ok: true,
				status: 200,
				json: async () => mockUpdatedCategory,
			} as Response);

			const result = await updateCategory(1, categoryRequest);

			expect(mockAuthenticatedFetch).toHaveBeenCalledWith(
				'http://localhost:8080/api/categories/1',
				{
					method: 'PUT',
					body: JSON.stringify(categoryRequest),
				}
			);
			expect(result).toEqual(mockUpdatedCategory);
		});

		it('should throw error when update fails', async () => {
			const categoryRequest: CategoryRequestDTO = {
				name: 'Test',
				type: 'EXPENSE',
				userId: '1',
				icon: 'test-icon',
			};

			mockAuthenticatedFetch.mockResolvedValueOnce({
				ok: false,
				status: 404,
				text: async () => 'Not Found',
			} as Response);

			await expect(updateCategory(1, categoryRequest)).rejects.toThrow(
				'Failed to update category'
			);
		});
	});

	describe('deleteCategory', () => {
		it('should delete category successfully', async () => {
			mockAuthenticatedFetch.mockResolvedValueOnce({
				ok: true,
				status: 204,
			} as Response);

			await expect(deleteCategory(1, '1')).resolves.toBeUndefined();

			expect(mockAuthenticatedFetch).toHaveBeenCalledWith(
				'http://localhost:8080/api/categories/1/1',
				{
					method: 'DELETE',
				}
			);
		});

		it('should throw error when deletion fails', async () => {
			mockAuthenticatedFetch.mockResolvedValueOnce({
				ok: false,
				status: 403,
				text: async () => 'Forbidden',
			} as Response);

			await expect(deleteCategory(1, '1')).rejects.toThrow(
				'Failed to delete category'
			);
		});
	});
});
