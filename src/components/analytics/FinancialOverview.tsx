import { DollarSign, TrendingDown, TrendingUp } from 'lucide-react';
import { ExpenseSummary } from '../../types/analytics';

interface FinancialOverviewProps {
    expenseSummary: ExpenseSummary;
}

export default function FinancialOverview({ expenseSummary }: FinancialOverviewProps) {
    return (
        <div className="card">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
                <TrendingUp className="w-6 h-6 text-green-600" />
                Financial Overview
            </h2>
            <div className="space-y-4">
                <div className="p-5 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-700 font-medium">
                            Total Income
                        </span>
                        <TrendingUp className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="text-3xl font-bold text-green-600 mb-1">
                        ${expenseSummary.totalIncome}
                    </div>
                    <div className="text-sm text-gray-600">
                        Overall income
                    </div>
                </div>

                <div className="p-5 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-100">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-700 font-medium">
                            Total Expense
                        </span>
                        <TrendingDown className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="text-3xl font-bold text-blue-600 mb-1">${expenseSummary.totalExpense}</div>
                    <div className="text-sm text-gray-600">Total spending</div>
                </div>

                <div className="p-5 bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl border border-orange-100">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-700 font-medium">
                            Net Savings
                        </span>
                        <DollarSign className="w-5 h-5 text-orange-600" />
                    </div>
                    <div className="text-3xl font-bold text-orange-600 mb-1">
                        ${expenseSummary.netSavings}
                    </div>
                    <div className="text-sm text-gray-600">Savings amount</div>
                </div>

                <div className="p-5 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-100">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-700 font-medium">
                            Current Month Income
                        </span>
                        <TrendingUp className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="text-3xl font-bold text-purple-600 mb-1">
                        ${expenseSummary.currentMonthIncome}
                    </div>
                    <div className="text-sm text-gray-600">This month's income</div>
                </div>

                <div className="p-5 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl border border-yellow-100">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-700 font-medium">
                            Current Month Expense
                        </span>
                        <TrendingDown className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div className="text-3xl font-bold text-yellow-600 mb-1">
                        ${expenseSummary.currentMonthExpense}
                    </div>
                    <div className="text-sm text-gray-600">This month's spending</div>
                </div>
            </div>
        </div>
    );
}
