import { ExpenseRequestDTO, ExpenseResponseDTO } from '../types/expense';

const API_BASE_URL = 'http://localhost:8080/api/expenses';

export const createExpense = async (dto: ExpenseRequestDTO): Promise<ExpenseResponseDTO> => {
    console.log('Creating expense:', dto);
    const response = await fetch(`${API_BASE_URL}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dto),
    });
    console.log('Response status:', response.status);
    if (!response.ok) {
        const errorText = await response.text();
        console.log('Error response:', errorText);
        throw new Error('Failed to create expense');
    }
    return response.json();
};

export const getAllExpenses = async (userId: number): Promise<ExpenseResponseDTO[]> => {
    const response = await fetch(`${API_BASE_URL}?userId=${userId}`);
    if (!response.ok) {
        throw new Error('Failed to fetch expenses');
    }
    return response.json();
};

export const updateExpense = async (id: number, dto: ExpenseRequestDTO): Promise<ExpenseResponseDTO> => {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dto),
    });
    if (!response.ok) {
        throw new Error('Failed to update expense');
    }
    return response.json();
};

export const deleteExpense = async (id: number, userId: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/${userId}/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Failed to delete expense');
    }
};

export const getExpenseById = async (userId: number, id: number): Promise<ExpenseResponseDTO> => {
    const response = await fetch(`${API_BASE_URL}/${userId}/${id}`);
    if (!response.ok) {
        throw new Error('Failed to fetch expense');
    }
    return response.json();
};

export const getExpensesByDateRange = async (userId: number, startDate: string, endDate: string): Promise<ExpenseResponseDTO[]> => {
    const response = await fetch(`${API_BASE_URL}/${userId}/date-range?startDate=${startDate}&endDate=${endDate}`);
    if (!response.ok) {
        throw new Error('Failed to fetch expenses by date range');
    }
    return response.json();
};