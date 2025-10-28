import { useState } from "react";
import { Edit2, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { ExpenseResponseDTO } from "../../types/expense";
import Icon from "../../utils/iconUtils";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

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
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Category</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Payment Method</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-center">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedExpenses.map((expense) => (
                            <TableRow key={expense.expenseId}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                                            <Icon name={expense.category.icon} size={16} className="text-gray-600" />
                                        </div>
                                        <span className="text-sm font-medium">{expense.category.name}</span>
                                    </div>
                                </TableCell>
                                <TableCell>{expense.description}</TableCell>
                                <TableCell className="font-semibold">₹{expense.amount.toFixed(2)}</TableCell>
                                <TableCell>{expense.paymentMethod.displayName}</TableCell>
                                <TableCell>
                                    {new Date(expense.expenseDate).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                    })}
                                </TableCell>
                                <TableCell className="text-center">
                                    <div className="flex gap-2 justify-center">
                                        <Button
                                            onClick={() => onEdit(expense)}
                                            variant="ghost"
                                            size="icon"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            onClick={() => onDelete(expense)}
                                            variant="ghost"
                                            size="icon"
                                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                        Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, expenses.length)} of {expenses.length} expenses
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            variant="outline"
                            size="icon"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </Button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <Button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                variant={currentPage === page ? "default" : "outline"}
                                size="sm"
                            >
                                {page}
                            </Button>
                        ))}
                        <Button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            variant="outline"
                            size="icon"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}