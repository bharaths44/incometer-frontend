import {
	TransactionRequestDTO,
	TransactionResponseDTO,
	TransactionConfig,
} from '../types/transaction';
import { API_BASE_URL } from '../lib/constants';

// Helper function to build API URLs
const buildApiUrls = (type: 'EXPENSE' | 'INCOME') => ({
	baseUrl: `${API_BASE_URL}/transactions`,
	create: `${API_BASE_URL}/transactions`,
	getAll: `${API_BASE_URL}/transactions?userId=:userId&type=${type}`,
	update: `${API_BASE_URL}/transactions/:id`,
	delete: `${API_BASE_URL}/transactions/:userId/:id`,
	getById: `${API_BASE_URL}/transactions/:userId/:id`,
	getByDateRange: `${API_BASE_URL}/transactions/:userId/date-range?startDate=:startDate&endDate=:endDate&type=${type}`,
});

// Base configuration for transaction services
const createTransactionConfig = (
	type: 'expense' | 'income'
): TransactionConfig => {
	const isExpense = type === 'expense';
	const typeLabel = isExpense ? 'Expense' : 'Income';
	const paymentMethodLabel = isExpense ? 'Payment Method' : 'Received Method';
	const descriptionLabel = isExpense ? 'Expense Name' : 'Income Source';

	return {
		type,
		title: isExpense ? 'Expenses' : 'Income',
		description: isExpense
			? 'Track and manage your spending'
			: 'Track all your income sources',
		addButtonText: `Add ${typeLabel}`,
		formTitle: typeLabel,
		tableHeaders: {
			category: 'Category',
			description: 'Description',
			amount: 'Amount',
			paymentMethod: paymentMethodLabel,
			date: 'Date',
			actions: 'Actions',
		},
		formLabels: {
			description: descriptionLabel,
			amount: 'Amount',
			category: 'Category',
			paymentMethod: paymentMethodLabel,
			date: 'Date',
		},
		api: buildApiUrls(isExpense ? 'EXPENSE' : 'INCOME'),
	};
};

export class TransactionService {
	public config: TransactionConfig;

	constructor(config: TransactionConfig) {
		this.config = config;
	}

	private mapApiResponseToGeneric(
		apiResponse: TransactionResponseDTO
	): TransactionResponseDTO {
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

	private mapGenericDtoToApi(dto: TransactionRequestDTO): {
		userId: number;
		categoryId: number;
		amount: number;
		description: string;
		paymentMethodId: number;
		transactionDate: string;
		transactionType: string;
	} {
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
		return this.mapApiResponseToGeneric(data);
	}

	async getAll(userId: number): Promise<TransactionResponseDTO[]> {
		const response = await fetch(
			`${this.config.api.baseUrl}?userId=${userId}&type=${this.config.type === 'expense' ? 'EXPENSE' : 'INCOME'}`
		);
		if (!response.ok) {
			throw new Error(`Failed to fetch ${this.config.type}s`);
		}
		const data = await response.json();
		return data.map((item: TransactionResponseDTO) =>
			this.mapApiResponseToGeneric(item)
		);
	}

	async update(
		id: number,
		dto: TransactionRequestDTO
	): Promise<TransactionResponseDTO> {
		const apiDto = this.mapGenericDtoToApi(dto);
		const response = await fetch(
			`${this.config.api.update.replace(':id', id.toString())}`,
			{
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(apiDto),
			}
		);
		if (!response.ok) {
			throw new Error(`Failed to update ${this.config.type}`);
		}
		const data = await response.json();
		return this.mapApiResponseToGeneric(data);
	}

	async delete(id: number, userId: number): Promise<void> {
		const response = await fetch(
			`${this.config.api.delete.replace(':userId', userId.toString()).replace(':id', id.toString())}`,
			{
				method: 'DELETE',
			}
		);
		if (!response.ok) {
			throw new Error(`Failed to delete ${this.config.type}`);
		}
	}

	async getById(userId: number, id: number): Promise<TransactionResponseDTO> {
		const response = await fetch(
			`${this.config.api.getById.replace(':userId', userId.toString()).replace(':id', id.toString())}`
		);
		if (!response.ok) {
			throw new Error(`Failed to fetch ${this.config.type}`);
		}
		const data = await response.json();
		return this.mapApiResponseToGeneric(data);
	}

	async getByDateRange(
		userId: number,
		startDate: string,
		endDate: string
	): Promise<TransactionResponseDTO[]> {
		const url = this.config.api.getByDateRange
			.replace(':userId', userId.toString())
			.replace(':startDate', startDate)
			.replace(':endDate', endDate);
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(
				`Failed to fetch ${this.config.type}s by date range`
			);
		}
		const data = await response.json();
		return data.map((item: TransactionResponseDTO) =>
			this.mapApiResponseToGeneric(item)
		);
	}
}

// Factory functions to create configured services
export const createExpenseService = () =>
	new TransactionService(createTransactionConfig('expense'));

export const createIncomeService = () =>
	new TransactionService(createTransactionConfig('income'));
