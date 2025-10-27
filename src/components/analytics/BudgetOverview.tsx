import { AlertTriangle, CheckCircle, DollarSign } from 'lucide-react';
import { BudgetAnalytics } from '../../types/analytics';

interface BudgetOverviewProps {
    budgetAnalytics: BudgetAnalytics[];
}

export default function BudgetOverview({ budgetAnalytics }: BudgetOverviewProps) {
    return (
        <div className="card">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
                <DollarSign className="w-6 h-6 text-green-600" />
                Budget Overview
            </h2>
            <div className="space-y-4">
                {budgetAnalytics.map((budget, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-2xl border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-900">
                                {budget.categoryName}
                            </span>
                            {budget.exceeded ? (
                                <AlertTriangle className="w-5 h-5 text-red-600" />
                            ) : (
                                <CheckCircle className="w-5 h-5 text-green-600" />
                            )}
                        </div>
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-gray-600">Spent: ${budget.spent}</span>
                            <span className="text-sm text-gray-600">Limit: ${budget.limit}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Remaining: ${budget.remaining}</span>
                            <span className={`text-sm font-semibold ${budget.exceeded ? 'text-red-600' : 'text-green-600'}`}>
                                {budget.usagePercentage}%
                            </span>
                        </div>
                        <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className={`h-full ${budget.exceeded ? 'bg-red-500' : 'bg-green-500'} rounded-full transition-all duration-1000 ease-out`}
                                style={{
                                    width: `${Math.min(budget.usagePercentage, 100)}%`,
                                    animationDelay: `${index * 100}ms`,
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}