import { useEffect, useState } from "react";
import { Calendar } from "lucide-react";
import SpendingByCategory from "../components/analytics/SpendingByCategory";
import FinancialOverview from "../components/analytics/FinancialOverview";
import BudgetOverview from "../components/analytics/BudgetOverview";
import ProjectedBalance from "../components/analytics/ProjectedBalance";
import { CategoryAnalytics, BudgetAnalytics, ExpenseSummary, } from "../types/analytics";
import { fetchCategoryBreakdown, fetchBudgetAnalytics, fetchExpenseSummary } from "../services/analyticsService";

export default function Analytics() {

    const [categoryBreakdown, setCategoryBreakdown] = useState<CategoryAnalytics[]>([]);
    const [expenseSummary, setExpenseSummary] = useState<ExpenseSummary | null>(null);
    const [budgetAnalytics, setBudgetAnalytics] = useState<BudgetAnalytics[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const userId = 1; // TODO: Get from auth context

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [categoriesData, expenseSummaryData, budgetData] = await Promise.all([

                    fetchCategoryBreakdown(userId),
                    fetchExpenseSummary(userId),
                    fetchBudgetAnalytics(userId)
                ]);


                setCategoryBreakdown(categoriesData);
                setExpenseSummary(expenseSummaryData);
                setBudgetAnalytics(budgetData);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [userId]);

    if (loading) {
        return (
            <div className="page-transition space-y-8">
                <div className="flex items-center justify-center h-64">
                    <div className="text-xl">Loading analytics...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="page-transition space-y-8">
                <div className="flex items-center justify-center h-64">
                    <div className="text-xl text-red-600">Error: {error}</div>
                </div>
            </div>
        );
    }

    return (
        <div className="page-transition space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold mb-2">Analytics</h1>
                    <p className="text-gray-600 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        October 2025
                    </p>
                </div>
                <div className="flex gap-3">
                    <button className="btn-secondary text-sm">Last 30 Days</button>
                    <button className="btn-secondary text-sm">Last 6 Months</button>
                </div>
            </div>



            <div className="grid lg:grid-cols-2 gap-6">
                <SpendingByCategory categoryBreakdown={categoryBreakdown} />
                {expenseSummary && <FinancialOverview expenseSummary={expenseSummary} />}
            </div>

            <ProjectedBalance />

            <BudgetOverview budgetAnalytics={budgetAnalytics} />
        </div>
    );
}
