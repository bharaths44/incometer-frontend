'use client';

import { AppLayout } from '@/components/layout/app-layout';
import TransactionPage from '@/components/transaction/TransactionPage';
import { TransactionConfig } from '@/types/transaction';
import { API_BASE_URL } from '@/lib/constants';

const expenseConfig: TransactionConfig = {
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
		actions: 'Actions',
	},
	formLabels: {
		description: 'Expense Name',
		amount: 'Amount',
		category: 'Category',
		paymentMethod: 'Payment Method',
		date: 'Date',
	},
	api: {
		baseUrl: `${API_BASE_URL}/transactions`,
		create: `${API_BASE_URL}/transactions`,
		getAll: `${API_BASE_URL}/transactions?userId=:userId&type=EXPENSE`,
		update: `${API_BASE_URL}/transactions/:id`,
		delete: `${API_BASE_URL}/transactions/:userId/:id`,
		getById: `${API_BASE_URL}/transactions/:userId/:id`,
		getByDateRange: `${API_BASE_URL}/transactions/:userId/date-range?startDate=:startDate&endDate=:endDate&type=EXPENSE`,
	},
};

export default function ExpensePage() {
	return (
		<AppLayout>
			<TransactionPage config={expenseConfig} />
		</AppLayout>
	);
}
