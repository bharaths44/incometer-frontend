import { BarChart3 } from 'lucide-react';
import { MonthlyData } from '../../types/analytics';


interface IncomeExpensesChartProps {
    monthlyTrends: MonthlyData[];
}

export default function IncomeExpensesChart({ monthlyTrends }: IncomeExpensesChartProps) {
    const maxValue = Math.max(
        ...monthlyTrends.flatMap((m) => [m.income, m.expenses]),
    );

    return (
        <div className="card">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <BarChart3 className="w-6 h-6 text-green-600" />
                    Income vs Expenses
                </h2>
                <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-green-500 rounded"></div>
                        <span className="text-gray-600">Income</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-orange-500 rounded"></div>
                        <span className="text-gray-600">Expenses</span>
                    </div>
                </div>
            </div>

            <div className="flex items-end justify-between gap-4 h-80">
                {monthlyTrends.map((data, index) => (
                    <div
                        key={index}
                        className="flex-1 flex flex-col items-center gap-3 h-full justify-end"
                    >
                        <div className="flex flex-col items-center gap-2 w-full h-full justify-end">
                            <div
                                className="w-full bg-green-500 rounded-t-xl transition-all duration-1000 ease-out hover:bg-green-600 cursor-pointer relative group"
                                style={{
                                    height: `${(data.income / maxValue) * 100}%`,
                                    animationDelay: `${index * 100}ms`,
                                }}
                            >
                                <div
                                    className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap"
                                >
                                    ${data.income.toLocaleString()}
                                </div>
                            </div>
                            <div
                                className="w-full bg-orange-500 rounded-t-xl transition-all duration-1000 ease-out hover:bg-orange-600 cursor-pointer relative group"
                                style={{
                                    height: `${(data.expenses / maxValue) * 100}%`,
                                    animationDelay: `${index * 100 + 50}ms`,
                                }}
                            >
                                <div
                                    className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap"
                                >
                                    ${data.expenses.toLocaleString()}
                                </div>
                            </div>
                        </div>
                        <div className="text-sm font-medium text-gray-600">
                            {data.month}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
