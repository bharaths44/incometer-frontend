import { PieChart } from 'lucide-react';
import { CategoryAnalytics } from '../../types/analytics';


interface SpendingByCategoryProps {
    categoryBreakdown: CategoryAnalytics[];
}

export default function SpendingByCategory({ categoryBreakdown }: SpendingByCategoryProps) {
    return (
        <div className="card">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
                <PieChart className="w-6 h-6 text-green-600" />
                Spending by Category
            </h2>
            <div className="space-y-6">
                {categoryBreakdown.map((item, index) => (
                    <div key={index} className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="font-medium text-gray-900">
                                    {item.categoryName}
                                </span>
                            </div>
                            <div className="text-right">
                                <div className="font-bold text-gray-900">
                                    ${item.totalSpent}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-green-500 rounded-full transition-all duration-1000 ease-out"
                                    style={{
                                        width: `${item.percentageOfTotal}%`,
                                        animationDelay: `${index * 100}ms`,
                                    }}
                                />
                            </div>
                            <span className="text-sm font-semibold text-gray-700 w-12 text-right">
                                {item.percentageOfTotal}%
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
