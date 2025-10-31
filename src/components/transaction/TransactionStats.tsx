import { TransactionResponseDTO } from "../../types/transaction";

interface TransactionStatsProps {
    transactions: TransactionResponseDTO[];
    type: 'expense' | 'income';
    title: string;
}

export default function TransactionStats({ transactions, type, title }: TransactionStatsProps) {
    const totalAmount = transactions.reduce(
        (sum, transaction) => sum + transaction.amount,
        0,
    );

    return (
        <div className={`card bg-gradient-to-br ${type === 'expense' ? 'from-orange-500 to-red-500' : 'from-green-500 to-emerald-500'} border-0 text-white`}>
            <div className="flex items-center justify-between">
                <div>
                    <div className={`text-${type === 'expense' ? 'orange' : 'green'}-100 mb-2 text-sm`}>
                        Total {title} This Month
                    </div>
                    <div className="text-5xl font-bold">
                        ₹{totalAmount.toFixed(2)}
                    </div>
                </div>
                <div
                    className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-sm">
                    <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                    </svg>
                </div>
            </div>
        </div>
    );
}