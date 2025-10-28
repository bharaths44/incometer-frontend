import { ArrowDownRight, ArrowUpRight, Calendar, DollarSign, TrendingDown, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

export default function Dashboard() {
    const [animatedBalance, setAnimatedBalance] = useState(0);
    const targetBalance = 8450.75;

    useEffect(() => {
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
    }, []);

    const stats = [
        {
            label: "Total Income",
            value: "₹12,450.00",
            change: "+12.5%",
            icon: TrendingUp,
            color: "text-green-600",
            bgColor: "bg-green-100",
            trend: "up",
        },
        {
            label: "Total Expenses",
            value: "₹4,125.25",
            change: "-8.2%",
            icon: TrendingDown,
            color: "text-red-600",
            bgColor: "bg-red-100",
            trend: "down",
        },
        {
            label: "Net Balance",
            value: `₹${animatedBalance.toFixed(2)}`,
            change: "+4.3%",
            icon: DollarSign,
            color: "text-blue-600",
            bgColor: "bg-blue-100",
            trend: "up",
        },
    ];

    const recentTransactions = [
        {
            id: 1,
            name: "Grocery Shopping",
            category: "Food",
            amount: -125.5,
            date: "Today",
            icon: "🛒",
        },
        {
            id: 2,
            name: "Freelance Project",
            category: "Income",
            amount: 2500.0,
            date: "Yesterday",
            icon: "💼",
        },
        {
            id: 3,
            name: "Netflix Subscription",
            category: "Entertainment",
            amount: -15.99,
            date: "2 days ago",
            icon: "🎬",
        },
        {
            id: 4,
            name: "Coffee Shop",
            category: "Food",
            amount: -8.5,
            date: "3 days ago",
            icon: "☕",
        },
        {
            id: 5,
            name: "Salary Deposit",
            category: "Income",
            amount: 5000.0,
            date: "5 days ago",
            icon: "💰",
        },
    ];

    const categoryBreakdown = [
        {
            categoryName: "Food & Dining",
            totalSpent: 850,
            percentageOfTotal: 32,
        },
        {
            categoryName: "Transportation",
            totalSpent: 420,
            percentageOfTotal: 16,
        },
        {
            categoryName: "Entertainment",
            totalSpent: 280,
            percentageOfTotal: 11,
        },
        { categoryName: "Shopping", totalSpent: 650, percentageOfTotal: 24 },
        {
            categoryName: "Bills & Utilities",
            totalSpent: 450,
            percentageOfTotal: 17,
        },
    ];

    return (
        <div className="page-transition space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
                    <p className="text-gray-600 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date().toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                    </p>
                </div>
            </div>

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

            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 card">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold">Recent Transactions</h2>
                        <button className="text-green-600 hover:text-green-700 font-medium text-sm">
                            View All
                        </button>
                    </div>
                    <div className="space-y-4">
                        {recentTransactions.map((transaction) => (
                            <div
                                key={transaction.id}
                                className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-colors duration-200"
                            >
                                <div className="flex items-center gap-4">
                                    <div
                                        className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-2xl">
                                        {transaction.icon}
                                    </div>
                                    <div>
                                        <div className="font-semibold text-gray-900">
                                            {transaction.name}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            {transaction.category} • {transaction.date}
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className={`text-lg font-bold ${transaction.amount > 0 ?
                                        "text-green-600" :
                                        "text-gray-900"}`}
                                >
                                    {transaction.amount > 0 ? "+" : ""}
                                    {transaction.amount.toFixed(2)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="card">
                    <h2 className="text-xl font-bold mb-6">Spending by Category</h2>
                    <div className="space-y-5">
                        {categoryBreakdown.map((item, index) => (
                            <div key={index}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-700">
                                        {item.categoryName}
                                    </span>
                                    <span className="text-sm font-bold text-gray-900">
                                        ₹{item.totalSpent}
                                    </span>
                                </div>
                                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-green-500 rounded-full transition-all duration-1000 ease-out"
                                        style={{
                                            width: `${item.percentageOfTotal}%`,
                                            animationDelay: `${index * 100}ms`,
                                        }}
                                    />
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                    {item.percentageOfTotal}% of spending
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="card bg-gradient-to-br from-green-500 to-emerald-600 border-0 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-green-100 mb-2">Financial Health Score</div>
                        <div className="text-5xl font-bold mb-2">85/100</div>
                        <div className="text-green-50">
                            Excellent! Keep up the great work.
                        </div>
                    </div>
                    <div className="w-32 h-32 relative">
                        <svg className="transform -rotate-90" viewBox="0 0 120 120">
                            <circle
                                cx="60"
                                cy="60"
                                r="54"
                                stroke="rgba(255,255,255,0.2)"
                                strokeWidth="12"
                                fill="none"
                            />
                            <circle
                                cx="60"
                                cy="60"
                                r="54"
                                stroke="white"
                                strokeWidth="12"
                                fill="none"
                                strokeDasharray={`${2 * Math.PI * 54 * 0.85} ${2 * Math.PI * 54}`}
                                className="transition-all duration-1000"
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <DollarSign className="w-12 h-12" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
