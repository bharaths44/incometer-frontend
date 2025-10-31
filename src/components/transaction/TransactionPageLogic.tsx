import { useState } from "react";
import { TransactionResponseDTO, TransactionRequestDTO } from "@/types/transaction";
import { useExpenseTransactions, useIncomeTransactions, useCreateExpense, useCreateIncome, useUpdateExpense, useUpdateIncome, useDeleteExpense, useDeleteIncome } from "@/hooks/useTransactions";
import { useCategories } from "@/hooks/useCategories";

export const useTransactionPageLogic = (config: { type: 'expense' | 'income' }) => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("all");
    const [dateFrom, setDateFrom] = useState<Date | undefined>();
    const [dateTo, setDateTo] = useState<Date | undefined>();
    const [amountMin, setAmountMin] = useState("");
    const [amountMax, setAmountMax] = useState("");
    const userId = 1; // Assuming userId is 1 for now

    // Use React Query hooks
    const { data: expenseTransactions = [], isLoading: expenseLoading } = useExpenseTransactions(userId);
    const { data: incomeTransactions = [], isLoading: incomeLoading } = useIncomeTransactions(userId);
    const { data: allCategories = [] } = useCategories(userId);

    // Choose data based on config type
    const transactions = config.type === 'expense' ? expenseTransactions : incomeTransactions;
    const loading = config.type === 'expense' ? expenseLoading : incomeLoading;

    // Filter categories based on transaction type
    const categories = allCategories.filter(cat => cat.type === (config.type === 'expense' ? 'EXPENSE' : 'INCOME'));

    // Mutation hooks
    const createExpenseMutation = useCreateExpense();
    const createIncomeMutation = useCreateIncome();
    const updateExpenseMutation = useUpdateExpense();
    const updateIncomeMutation = useUpdateIncome();
    const deleteExpenseMutation = useDeleteExpense();
    const deleteIncomeMutation = useDeleteIncome();

    const [editingTransaction, setEditingTransaction] = useState<TransactionResponseDTO | null>(null);
    const [formData, setFormData] = useState({
        description: "",
        amount: "",
        categoryId: "",
        paymentMethodId: "",
        date: "",
        userId: 1, // Assuming userId is 1 for now
    });

    const handleEdit = (transaction: TransactionResponseDTO) => {
        setEditingTransaction(transaction);
        setFormData({
            description: transaction.description,
            amount: transaction.amount.toString(),
            categoryId: transaction.category.categoryId.toString(),
            paymentMethodId: transaction.paymentMethod.paymentMethodId.toString(),
            date: transaction.transactionDate,
            userId: transaction.userUserId,
        });
        setShowAddModal(true);
    };

    const handleDelete = async (transaction: TransactionResponseDTO) => {
        if (confirm(`Are you sure you want to delete this ${config.type}?`)) {
            try {
                if (config.type === 'expense') {
                    await deleteExpenseMutation.mutateAsync({ id: transaction.transactionId, userId: transaction.userUserId });
                } else {
                    await deleteIncomeMutation.mutateAsync({ id: transaction.transactionId, userId: transaction.userUserId });
                }
            } catch (error) {
                console.error(`Failed to delete ${config.type}:`, error);
            }
        }
    };

    const handleSubmit = async (dto: TransactionRequestDTO) => {
        try {
            if (editingTransaction) {
                if (config.type === 'expense') {
                    await updateExpenseMutation.mutateAsync({ id: editingTransaction.transactionId, dto });
                } else {
                    await updateIncomeMutation.mutateAsync({ id: editingTransaction.transactionId, dto });
                }
            } else {
                if (config.type === 'expense') {
                    await createExpenseMutation.mutateAsync(dto);
                } else {
                    await createIncomeMutation.mutateAsync(dto);
                }
            }
            setShowAddModal(false);
            setEditingTransaction(null);
            setFormData({
                description: "",
                amount: "",
                categoryId: "",
                paymentMethodId: "",
                date: "",
                userId: 1,
            });
        } catch (error) {
            console.error(`Failed to save ${config.type}:`, error);
        }
    };

    const openAddModal = () => {
        setEditingTransaction(null);
        setFormData({
            description: "",
            amount: "",
            categoryId: "",
            paymentMethodId: "",
            date: "",
            userId: 1,
        });
        setShowAddModal(true);
    };

    const clearFilters = () => {
        setSearchQuery("");
        setSelectedCategory("all");
        setSelectedPaymentMethod("all");
        setDateFrom(undefined);
        setDateTo(undefined);
        setAmountMin("");
        setAmountMax("");
    };

    const filteredTransactions = transactions.filter((transaction) => {
        const matchesSearch = transaction.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        const matchesCategory =
            selectedCategory === "all" || transaction.category.name === selectedCategory;
        const matchesPaymentMethod =
            selectedPaymentMethod === "all" || transaction.paymentMethod.paymentMethodId.toString() === selectedPaymentMethod;
        const matchesDateFrom = !dateFrom || new Date(transaction.transactionDate) >= dateFrom;
        const matchesDateTo = !dateTo || new Date(transaction.transactionDate) <= dateTo;
        const matchesAmountMin = !amountMin || transaction.amount >= parseFloat(amountMin);
        const matchesAmountMax = !amountMax || transaction.amount <= parseFloat(amountMax);

        return matchesSearch && matchesCategory && matchesPaymentMethod &&
            matchesDateFrom && matchesDateTo && matchesAmountMin && matchesAmountMax;
    });

    // Get unique payment methods from transactions
    const uniquePaymentMethods = Array.from(
        new Map(
            transactions
                .map(transaction => transaction.paymentMethod)
                .filter(method => method) // Filter out null/undefined
                .map(method => [method.paymentMethodId, method])
        ).values()
    ).sort((a, b) => (a.displayName || '').localeCompare(b.displayName || ''));

    return {
        // State
        showAddModal,
        setShowAddModal,
        editingTransaction,
        formData,

        // Data
        transactions: filteredTransactions,
        categories,
        paymentMethods: uniquePaymentMethods,
        loading,

        // Filter state
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        selectedPaymentMethod,
        setSelectedPaymentMethod,
        dateFrom,
        setDateFrom,
        dateTo,
        setDateTo,
        amountMin,
        setAmountMin,
        amountMax,
        setAmountMax,

        // Actions
        handleEdit,
        handleDelete,
        handleSubmit,
        openAddModal,
        clearFilters,
    };
};