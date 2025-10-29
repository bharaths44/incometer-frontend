import { TransactionRequestDTO, TransactionResponseDTO, TransactionConfig } from '../types/transaction';

export class TransactionService {
    public config: TransactionConfig;
    static cache: { [key: string]: TransactionResponseDTO[] } = {};

    constructor(config: TransactionConfig) {
        this.config = config;
    }

    private mapApiResponseToGeneric(apiResponse: any): TransactionResponseDTO {
        return {
            transactionId: apiResponse.transactionId,
            userUserId: apiResponse.userUserId,
            category: apiResponse.category,
            amount: apiResponse.amount,
            description: apiResponse.description,
            paymentMethod: apiResponse.paymentMethod,
            transactionDate: apiResponse.transactionDate,
            transactionType: apiResponse.transactionType,
            createdAt: apiResponse.createdAt,
        };
    }

    private mapGenericDtoToApi(dto: TransactionRequestDTO): any {
        return {
            userId: dto.userId,
            categoryId: dto.categoryId,
            amount: dto.amount,
            description: dto.description,
            paymentMethodId: dto.paymentMethodId,
            transactionDate: dto.transactionDate,
            transactionType: dto.transactionType,
        };
    }

    async create(dto: TransactionRequestDTO): Promise<TransactionResponseDTO> {
        console.log(`Creating ${this.config.type}:`, dto);
        const apiDto = this.mapGenericDtoToApi(dto);
        const response = await fetch(`${this.config.api.baseUrl}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(apiDto),
        });
        console.log('Response status:', response.status);
        if (!response.ok) {
            const errorText = await response.text();
            console.log('Error response:', errorText);
            throw new Error(`Failed to create ${this.config.type}`);
        }
        const data = await response.json();
        // Invalidate cache
        delete TransactionService.cache[`transactions_${dto.userId}`];
        return this.mapApiResponseToGeneric(data);
    }

    async getAll(userId: number): Promise<TransactionResponseDTO[]> {
        const cacheKey = `transactions_${userId}`;
        if (!TransactionService.cache[cacheKey]) {
            const response = await fetch(`${this.config.api.baseUrl}?userId=${userId}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch transactions`);
            }
            const data = await response.json();
            TransactionService.cache[cacheKey] = data;
        }
        return TransactionService.cache[cacheKey].filter(t => t.transactionType === (this.config.type === 'expense' ? 'EXPENSE' : 'INCOME'));
    }

    async update(id: number, dto: TransactionRequestDTO): Promise<TransactionResponseDTO> {
        const apiDto = this.mapGenericDtoToApi(dto);
        const response = await fetch(`${this.config.api.update.replace(':id', id.toString())}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(apiDto),
        });
        if (!response.ok) {
            throw new Error(`Failed to update ${this.config.type}`);
        }
        const data = await response.json();
        // Invalidate cache
        delete TransactionService.cache[`transactions_${dto.userId}`];
        return this.mapApiResponseToGeneric(data);
    }

    async delete(id: number, userId: number): Promise<void> {
        const response = await fetch(`${this.config.api.delete.replace(':userId', userId.toString()).replace(':id', id.toString())}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error(`Failed to delete ${this.config.type}`);
        }
        // Invalidate cache
        delete TransactionService.cache[`transactions_${userId}`];
    }

    async getById(userId: number, id: number): Promise<TransactionResponseDTO> {
        const response = await fetch(`${this.config.api.getById.replace(':userId', userId.toString()).replace(':id', id.toString())}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch ${this.config.type}`);
        }
        const data = await response.json();
        return this.mapApiResponseToGeneric(data);
    }

    async getByDateRange(userId: number, startDate: string, endDate: string): Promise<TransactionResponseDTO[]> {
        const url = this.config.api.getByDateRange
            .replace(':userId', userId.toString())
            .replace(':startDate', startDate)
            .replace(':endDate', endDate);
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch ${this.config.type}s by date range`);
        }
        const data = await response.json();
        return data.map((item: any) => this.mapApiResponseToGeneric(item));
    }
}

// Factory functions to create configured services
export const createExpenseService = () => new TransactionService({
    type: 'expense',
    title: 'Expenses',
    description: 'Track and manage your spending',
    addButtonText: 'Add Expense',
    formTitle: 'Expense',
    tableHeaders: {
        category: 'Category',
        description: 'Description',
        amount: 'Amount',
        paymentMethod: 'Payment Method',
        date: 'Date',
        actions: 'Actions'
    },
    formLabels: {
        description: 'Expense Name',
        amount: 'Amount',
        category: 'Category',
        paymentMethod: 'Payment Method',
        date: 'Date'
    },
    api: {
        baseUrl: 'http://localhost:8080/api/transactions',
        create: 'http://localhost:8080/api/transactions',
        getAll: 'http://localhost:8080/api/transactions?userId=:userId&type=EXPENSE',
        update: 'http://localhost:8080/api/transactions/:id',
        delete: 'http://localhost:8080/api/transactions/:userId/:id',
        getById: 'http://localhost:8080/api/transactions/:userId/:id',
        getByDateRange: 'http://localhost:8080/api/transactions/:userId/date-range?startDate=:startDate&endDate=:endDate&type=EXPENSE'
    }
});

export const createIncomeService = () => new TransactionService({
    type: 'income',
    title: 'Income',
    description: 'Track all your income sources',
    addButtonText: 'Add Income',
    formTitle: 'Income',
    tableHeaders: {
        category: 'Category',
        description: 'Description',
        amount: 'Amount',
        paymentMethod: 'Payment Method',
        date: 'Date',
        actions: 'Actions'
    },
    formLabels: {
        description: 'Income Source',
        amount: 'Amount',
        category: 'Category',
        paymentMethod: 'Payment Method',
        date: 'Date'
    },
    api: {
        baseUrl: 'http://localhost:8080/api/transactions',
        create: 'http://localhost:8080/api/transactions',
        getAll: 'http://localhost:8080/api/transactions?userId=:userId&type=INCOME',
        update: 'http://localhost:8080/api/transactions/:id',
        delete: 'http://localhost:8080/api/transactions/:userId/:id',
        getById: 'http://localhost:8080/api/transactions/:userId/:id',
        getByDateRange: 'http://localhost:8080/api/transactions/:userId/date-range?startDate=:startDate&endDate=:endDate&type=INCOME'
    }
});