import { Category, CategoryRequestDTO } from "@/types/category";


const API_BASE_URL = 'http://localhost:8080/api/categories';
const cache: { [key: string]: Category[] } = {};

export const getAllCategories = async (userId: number): Promise<Category[]> => {
    const cacheKey = `categories_${userId}`;
    if (!cache[cacheKey]) {
        console.log('Fetching categories for user:', userId);
        const response = await fetch(`${API_BASE_URL}/user/${userId}`);
        console.log('Response status:', response.status);
        if (!response.ok) {
            throw new Error('Failed to fetch categories');
        }
        cache[cacheKey] = await response.json();
    }
    return cache[cacheKey];
};

export const createCategory = async (category: CategoryRequestDTO): Promise<Category> => {
    console.log('Creating category:', category);
    const response = await fetch(`${API_BASE_URL}`, {
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
    // Invalidate cache
    delete cache[`categories_${category.userId}`];
    return newCategory;
};

export const getCategoryById = async (id: number): Promise<Category> => {
    const response = await fetch(`${API_BASE_URL}/${id}`);
    if (!response.ok) {
        throw new Error('Failed to fetch category');
    }
    return response.json();
};