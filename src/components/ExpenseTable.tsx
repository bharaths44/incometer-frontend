import { useState } from "react";
import { Edit2, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { ExpenseResponseDTO } from "../types/expense";
import Icon from "../utils/iconUtils";

interface ExpenseTableProps {
    expenses: ExpenseResponseDTO[];
    onEdit: (expense: ExpenseResponseDTO) => void;
    onDelete: (expense: ExpenseResponseDTO) => void;
    loading: boolean;
}

export default function ExpenseTable({ expenses, onEdit, onDelete, loading }: ExpenseTableProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const totalPages = Math.ceil(expenses.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedExpenses = expenses.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    if (loading) {
        return <div className="text-center py-8">Loading expenses...</div>;
    }

    return (
        <div className="space-y-4">
            <div className="overflow-x-auto">
                <table className="w-full table-auto border-collapse">
                    <thead>
                        <tr className="border-b border-gray-200">
                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Category</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Description</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Amount</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Payment Method</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                            <th className="text-center py-3 px-4 font-semibold text-gray-700">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedExpenses.map((expense) => (
                            <tr key={expense.expenseId} className="border-b border-gray-100 hover:bg-gray-50">
                                <td className="py-3 px-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                                            <Icon name={expense.category.icon} size={16} className="text-gray-600" />
                                        </div>
                                        <span className="text-sm font-medium">{expense.category.name}</span>
                                    </div>
                                </td>
                                <td className="py-3 px-4 text-gray-900">{expense.description}</td>
                                <td className="py-3 px-4 font-semibold text-gray-900">${expense.amount.toFixed(2)}</td>
                                <td className="py-3 px-4 text-gray-600">{expense.paymentMethod}</td>
                                <td className="py-3 px-4 text-gray-600">
                                    {new Date(expense.expenseDate).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                    })}
                                </td>
                                <td className="py-3 px-4 text-center">
                                    <div className="flex gap-2 justify-center">
                                        <button
                                            onClick={() => onEdit(expense)}
                                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                        >
                                            <Edit2 className="w-4 h-4 text-gray-600" />
                                        </button>
                                        <button
                                            onClick={() => onDelete(expense)}
                                            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4 text-red-600" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                        Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, expenses.length)} of {expenses.length} expenses
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={`px-3 py-2 rounded-lg border ${currentPage === page
                                    ? 'bg-blue-500 text-white border-blue-500'
                                    : 'border-gray-200 hover:bg-gray-50'
                                    }`}
                            >
                                {page}
                            </button>
                        ))}
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}