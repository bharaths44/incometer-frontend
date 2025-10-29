import { Category, CategoryDto } from "./category";
import { PaymentMethodResponseDTO } from "./paymentMethod";



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

