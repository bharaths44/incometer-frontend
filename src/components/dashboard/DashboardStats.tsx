import { ArrowDownRight, ArrowUpRight, DollarSign, TrendingDown, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { useExpenseSummary } from "../../hooks/useAnalytics";

interface DashboardStatsProps {
    userId: number;
}

export default function DashboardStats({ userId }: DashboardStatsProps) {
    const { data: summary, isLoading: loading } = useExpenseSummary(userId);
    const [animatedBalance, setAnimatedBalance] = useState(0);

    useEffect(() => {
        if (summary) {
            // Start animation for net balance
            animateBalance(summary.netSavings);
        }
    }, [summary]);

    const animateBalance = (targetBalance: number) => {
        let start = 0;
        const duration = 1000;
        const increment = targetBalance / (duration / 16);

        const timer = setInterval(() => {
            start += increment;
            if (start >= targetBalance) {
                setAnimatedBalance(targetBalance);
                clearInterval(timer);
            } else {
                setAnimatedBalance(start);
            }
        }, 16);

        return () => clearInterval(timer);
    };

    if (loading) {
        return (
            <div className="grid md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="card animate-pulse">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 bg-gray-200 rounded-2xl"></div>
                            <div className="w-16 h-4 bg-gray-200 rounded"></div>
                        </div>
                        <div className="w-24 h-8 bg-gray-200 rounded mb-1"></div>
                        <div className="w-20 h-4 bg-gray-200 rounded"></div>
                    </div>
                ))}
            </div>
        );
    }

    if (!summary) {
        return <div className="text-center py-8">Failed to load dashboard stats</div>;
    }

    const stats = [
        {
            label: "Total Income",
            value: `₹${summary.totalIncome.toFixed(2)}`,
            change: "+12.5%", // This would need to be calculated from previous period
            icon: TrendingUp,
            color: "text-green-600",
            bgColor: "bg-green-100",
            trend: "up",
        },
        {
            label: "Total Expenses",
            value: `₹${summary.totalExpense.toFixed(2)}`,
            change: "-8.2%", // This would need to be calculated from previous period
            icon: TrendingDown,
            color: "text-red-600",
            bgColor: "bg-red-100",
            trend: "down",
        },
        {
            label: "Net Balance",
            value: `₹${animatedBalance.toFixed(2)}`,
            change: "+4.3%", // This would need to be calculated from previous period
            icon: DollarSign,
            color: "text-blue-600",
            bgColor: "bg-blue-100",
            trend: summary.netSavings >= 0 ? "up" : "down",
        },
    ];

    return (
        <div className="grid md:grid-cols-3 gap-6">
            {stats.map((stat, index) => (
                <div
                    key={index}
                    className="card group"
                    style={{ animationDelay: `${index * 100}ms` }}
                >
                    <div className="flex items-start justify-between mb-4">
                        <div
                            className={`w-12 h-12 ${stat.bgColor} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                        >
                            <stat.icon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                        <div
                            className={`flex items-center gap-1 text-sm font-medium ${stat.trend === "up" ?
                                "text-green-600" :
                                "text-orange-600"}`}
                        >
                            {stat.trend === "up" ? (
                                <ArrowUpRight className="w-4 h-4" />
                            ) : (
                                <ArrowDownRight className="w-4 h-4" />
                            )}
                            {stat.change}
                        </div>
                    </div>
                    <div className="text-3xl font-bold mb-1">{stat.value}</div>
                    <div className="text-gray-600 text-sm">{stat.label}</div>
                </div>
            ))}
        </div>
    );
}