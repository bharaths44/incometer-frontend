import { Category, CategoryRequestDTO } from '@/types/category';
import { API_BASE_URL } from '@/lib/constants';

const API_BASE_URL_CATEGORIES = `${API_BASE_URL}/categories`;

export const getAllCategories = async (userId: number): Promise<Category[]> => {
	console.log('Fetching categories for user:', userId);
	const response = await fetch(`${API_BASE_URL_CATEGORIES}/user/${userId}`);
	console.log('Response status:', response.status);
	if (!response.ok) {
		throw new Error('Failed to fetch categories');
	}
	return response.json();
};

export const createCategory = async (
	category: CategoryRequestDTO
): Promise<Category> => {
	console.log('Creating category:', category);
	const response = await fetch(`${API_BASE_URL_CATEGORIES}`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(category),
	});
	console.log('Response status:', response.status);
	if (!response.ok) {
		const errorText = await response.text();
		console.log('Error response:', errorText);
		throw new Error('Failed to create category');
	}
	const newCategory = await response.json();
	return newCategory;
};

export const updateCategory = async (
	id: number,
	category: CategoryRequestDTO
): Promise<Category> => {
	console.log('Updating category:', id, category);
	const response = await fetch(`${API_BASE_URL_CATEGORIES}/${id}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(category),
	});
	console.log('Response status:', response.status);
	if (!response.ok) {
		const errorText = await response.text();
		console.log('Error response:', errorText);
		throw new Error('Failed to update category');
	}
	const updatedCategory = await response.json();
	return updatedCategory;
};

export const deleteCategory = async (
	id: number,
	userId: number
): Promise<void> => {
	console.log('Deleting category:', id, 'for user:', userId);
	const response = await fetch(`${API_BASE_URL_CATEGORIES}/${userId}/${id}`, {
		method: 'DELETE',
	});
	console.log('Response status:', response.status);
	if (!response.ok) {
		const errorText = await response.text();
		console.log('Error response:', errorText);
		throw new Error('Failed to delete category');
	}
};
