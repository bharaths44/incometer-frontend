import { useRecentTransactions } from "../../hooks/useTransactions";

interface RecentTransactionsProps {
    userId: number;
    limit?: number;
}

export default function RecentTransactions({ userId, limit = 5 }: RecentTransactionsProps) {
    const { data: transactions = [], isLoading: loading } = useRecentTransactions(userId, limit);

    const getTransactionIcon = (description: string, type: string) => {
        const desc = description.toLowerCase();
        if (type === 'INCOME') {
            if (desc.includes('salary') || desc.includes('deposit')) return '💰';
            if (desc.includes('freelance') || desc.includes('project')) return '💼';
            return '💵';
        } else {
            if (desc.includes('grocery') || desc.includes('food')) return '🛒';
            if (desc.includes('coffee') || desc.includes('drink')) return '☕';
            if (desc.includes('netflix') || desc.includes('subscription')) return '🎬';
            if (desc.includes('transport') || desc.includes('bus') || desc.includes('taxi')) return '🚗';
            return '💳';
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = now.getTime() - date.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    if (loading) {
        return (
            <div className="lg:col-span-2 card">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold">Recent Transactions</h2>
                </div>
                <div className="space-y-4">
                    {[...Array(limit)].map((_, i) => (
                        <div key={i} className="flex items-center justify-between p-4 rounded-2xl animate-pulse">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gray-200 rounded-2xl"></div>
                                <div>
                                    <div className="w-32 h-4 bg-gray-200 rounded mb-2"></div>
                                    <div className="w-24 h-3 bg-gray-200 rounded"></div>
                                </div>
                            </div>
                            <div className="w-16 h-4 bg-gray-200 rounded"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="lg:col-span-2 card">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Recent Transactions</h2>
            </div>
            <div className="space-y-4">
                {transactions.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        No transactions found
                    </div>
                ) : (
                    transactions.map((transaction) => (
                        <div
                            key={transaction.transactionId}
                            className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-colors duration-200"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-2xl">
                                    {getTransactionIcon(transaction.description, transaction.transactionType)}
                                </div>
                                <div>
                                    <div className="font-semibold text-gray-900">
                                        {transaction.description}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        {transaction.category.name} • {formatDate(transaction.transactionDate)}
                                    </div>
                                </div>
                            </div>
                            <div
                                className={`text-lg font-bold ${transaction.transactionType === 'INCOME' ? "text-green-600" : "text-gray-900"
                                    }`}
                            >
                                {transaction.transactionType === 'INCOME' ? "+" : "-"}
                                ₹{Math.abs(transaction.amount).toFixed(2)}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}