import { Category, CategoryRequestDTO } from "@/types/category";
import { API_BASE_URL } from "@/lib/constants";


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

export const createCategory = async (category: CategoryRequestDTO): Promise<Category> => {
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

export const getCategoryById = async (id: number): Promise<Category> => {
    const response = await fetch(`${API_BASE_URL_CATEGORIES}/${id}`);
    if (!response.ok) {
        throw new Error('Failed to fetch category');
    }
    return response.json();
};