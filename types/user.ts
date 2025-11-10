export interface UserStats {
	userId: string;
	userName: string;
	userEmail: string;
	accountCreatedAt: string;
	totalTransactions: number;
	totalExpenses: number;
	totalIncome: number;
	totalExpenseAmount: number;
	totalIncomeAmount: number;
	firstTransactionDate: string | null;
}
