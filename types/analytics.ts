export interface CategoryAnalytics {
	categoryName: string;
	totalSpent: number;
	percentageOfTotal: number;
}

export interface BudgetAnalytics {
	categoryName: string;
	spent: number;
	limit: number;
	remaining: number;
	usagePercentage: number;
	exceeded: boolean;
}

export interface ExpenseSummary {
	totalIncome: number;
	totalExpense: number;
	netSavings: number;
	currentMonthExpense: number;
	currentMonthIncome: number;
	incomePercentageChange: number | null;
	expensePercentageChange: number | null;
	savingsPercentageChange: number | null;
}
