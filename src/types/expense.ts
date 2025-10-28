import { PaymentMethodResponseDTO } from "./paymentMethod";


export interface Category {
    categoryId: number;
    name: string;
    icon: string;
    type: 'INCOME' | 'EXPENSE';
    createdAt: string;
}

export interface CategoryDto {
    categoryId: number;
    name: string;
    icon: string;
}


export interface Expense {
    expenseId: number;
    category: Category;
    amount: number;
    description: string;
    paymentMethod: PaymentMethodResponseDTO;
    expenseDate: string;
    createdAt: string;
}

export interface ExpenseRequestDTO {
    userId: number;
    categoryId: number;
    amount: number;
    description: string;
    paymentMethodId: number;
    expenseDate: string;
}

export interface ExpenseResponseDTO {
    expenseId: number;
    userUserId: number;
    category: CategoryDto;
    amount: number;
    description: string;
    paymentMethod: PaymentMethodResponseDTO;
    expenseDate: string;
}

export interface CategoryRequestDTO {
    userId: number;
    name: string;
    icon: string;
    type: 'INCOME' | 'EXPENSE';
}