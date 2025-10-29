export interface CategoryRequestDTO {
    userId: number;
    name: string;
    icon: string;
    type: 'INCOME' | 'EXPENSE';
}

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

