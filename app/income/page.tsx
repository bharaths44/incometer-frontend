'use client';

import { AppLayout } from '@/components/layout/app-layout';
import TransactionPage from '@/components/transaction/TransactionPage';
import { TransactionConfig } from '@/types/transaction';
import { API_BASE_URL } from '@/lib/constants';

const incomeConfig: TransactionConfig = {
	type: 'income',
	title: 'Income',
	description: 'Track all your income sources',
	addButtonText: 'Add Income',
	formTitle: 'Income',
	tableHeaders: {
		category: 'Category',
		description: 'Description',
		amount: 'Amount',
		paymentMethod: 'Received Method',
		date: 'Date',
		actions: 'Actions',
	},
	formLabels: {
		description: 'Income Source',
		amount: 'Amount',
		category: 'Category',
		paymentMethod: 'Received Method',
		date: 'Date',
	},
	api: {
		baseUrl: `${API_BASE_URL}/transactions`,
		create: `${API_BASE_URL}/transactions`,
		getAll: `${API_BASE_URL}/transactions?userId=:userId&type=INCOME`,
		update: `${API_BASE_URL}/transactions/:id`,
		delete: `${API_BASE_URL}/transactions/:userId/:id`,
		getById: `${API_BASE_URL}/transactions/:userId/:id`,
		getByDateRange: `${API_BASE_URL}/transactions/:userId/date-range?startDate=:startDate&endDate=:endDate&type=INCOME`,
	},
};

export default function IncomePage() {
	return (
		<AppLayout>
			<TransactionPage config={incomeConfig} />
		</AppLayout>
	);
}
