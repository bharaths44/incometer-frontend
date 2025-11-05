import { useState } from 'react';
import {
	TransactionRequestDTO,
	TransactionResponseDTO,
} from '@/types/transaction';
import {
	useCreateExpense,
	useCreateIncome,
	useDeleteExpense,
	useDeleteIncome,
	useExpenseTransactions,
	useIncomeTransactions,
	useUpdateExpense,
	useUpdateIncome,
} from '@/hooks/useTransactions';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { useCategories } from '@/hooks/useCategories';

export const useTransactionPageLogic = (config: {
	type: 'expense' | 'income';
}) => {
	const [showAddModal, setShowAddModal] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedCategory, setSelectedCategory] = useState('all');
	const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('all');
	const [dateFrom, setDateFrom] = useState<Date | undefined>();
	const [dateTo, setDateTo] = useState<Date | undefined>();
	const [amountMin, setAmountMin] = useState('');
	const [amountMax, setAmountMax] = useState('');
	const { user } = useAuthContext();
	const userId = user ? user.userId : '1'; // Fallback to '1' if not authenticated

	// Use React Query hooks
	const { data: expenseTransactions = [], isLoading: expenseLoading } =
		useExpenseTransactions(userId);
	const { data: incomeTransactions = [], isLoading: incomeLoading } =
		useIncomeTransactions(userId);
	const { data: allCategories = [] } = useCategories(userId);

	// Choose data based on config type
	const transactions =
		config.type === 'expense' ? expenseTransactions : incomeTransactions;
	const loading = config.type === 'expense' ? expenseLoading : incomeLoading;

	// Filter categories based on transaction type
	const categories = allCategories.filter(
		(cat) => cat.type === (config.type === 'expense' ? 'EXPENSE' : 'INCOME')
	);

	// Mutation hooks
	const createExpenseMutation = useCreateExpense();
	const createIncomeMutation = useCreateIncome();
	const updateExpenseMutation = useUpdateExpense();
	const updateIncomeMutation = useUpdateIncome();
	const deleteExpenseMutation = useDeleteExpense();
	const deleteIncomeMutation = useDeleteIncome();

	const [editingTransaction, setEditingTransaction] =
		useState<TransactionResponseDTO | null>(null);
	const [transactionToDelete, setTransactionToDelete] =
		useState<TransactionResponseDTO | null>(null);
	const [formData, setFormData] = useState({
		description: '',
		amount: '',
		categoryId: '',
		paymentMethodId: '',
		date: '',
		userId: userId,
	});

	const handleEdit = (transaction: TransactionResponseDTO) => {
		setEditingTransaction(transaction);
		setFormData({
			description: transaction.description,
			amount: transaction.amount.toString(),
			categoryId: transaction.category.categoryId.toString(),
			paymentMethodId:
				transaction.paymentMethod.paymentMethodId.toString(),
			date: transaction.transactionDate,
			userId: transaction.userUserId,
		});
		setShowAddModal(true);
	};

	const handleDelete = (transaction: TransactionResponseDTO) => {
		setTransactionToDelete(transaction);
	};

	const confirmDelete = async () => {
		if (!transactionToDelete) return;

		try {
			if (config.type === 'expense') {
				await deleteExpenseMutation.mutateAsync({
					id: transactionToDelete.transactionId,
					userId: transactionToDelete.userUserId,
				});
			} else {
				await deleteIncomeMutation.mutateAsync({
					id: transactionToDelete.transactionId,
					userId: transactionToDelete.userUserId,
				});
			}
			setTransactionToDelete(null);
		} catch (error) {
			console.error(`Failed to delete ${config.type}:`, error);
		}
	};

	const cancelDelete = () => {
		setTransactionToDelete(null);
	};

	const handleSubmit = async (dto: TransactionRequestDTO) => {
		try {
			// Validate date is not in the future
			const transactionDate = new Date(dto.transactionDate);
			const today = new Date();
			today.setHours(23, 59, 59, 999); // Set to end of today

			if (transactionDate > today) {
				console.error('Transaction date cannot be in the future');
				alert(
					'Transaction date cannot be in the future. Please select today or an earlier date.'
				);
				return;
			}

			if (editingTransaction) {
				if (config.type === 'expense') {
					await updateExpenseMutation.mutateAsync({
						id: editingTransaction.transactionId,
						dto,
					});
				} else {
					await updateIncomeMutation.mutateAsync({
						id: editingTransaction.transactionId,
						dto,
					});
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
				description: '',
				amount: '',
				categoryId: '',
				paymentMethodId: '',
				date: '',
				userId: userId,
			});
		} catch (error) {
			console.error(`Failed to save ${config.type}:`, error);
		}
	};

	const openAddModal = () => {
		setEditingTransaction(null);
		setFormData({
			description: '',
			amount: '',
			categoryId: '',
			paymentMethodId: '',
			date: '',
			userId: userId,
		});
		setShowAddModal(true);
	};

	const clearFilters = () => {
		setSearchQuery('');
		setSelectedCategory('all');
		setSelectedPaymentMethod('all');
		setDateFrom(undefined);
		setDateTo(undefined);
		setAmountMin('');
		setAmountMax('');
	};

	const filteredTransactions = transactions
		.filter((transaction) => {
			const searchLower = searchQuery.toLowerCase();
			const matchesSearch =
				!searchQuery ||
				transaction.description.toLowerCase().includes(searchLower) ||
				transaction.category.name.toLowerCase().includes(searchLower) ||
				transaction.paymentMethod.displayName
					.toLowerCase()
					.includes(searchLower) ||
				transaction.paymentMethod.name
					.toLowerCase()
					.includes(searchLower) ||
				transaction.amount.toString().includes(searchQuery) ||
				new Date(transaction.transactionDate)
					.toLocaleDateString('en-US', {
						year: 'numeric',
						month: 'short',
						day: 'numeric',
					})
					.toLowerCase()
					.includes(searchLower);
			const matchesCategory =
				selectedCategory === 'all' ||
				transaction.category.name === selectedCategory;
			const matchesPaymentMethod =
				selectedPaymentMethod === 'all' ||
				transaction.paymentMethod.paymentMethodId.toString() ===
					selectedPaymentMethod;
			const matchesDateFrom =
				!dateFrom || new Date(transaction.transactionDate) >= dateFrom;
			const matchesDateTo =
				!dateTo || new Date(transaction.transactionDate) <= dateTo;
			const matchesAmountMin =
				!amountMin || transaction.amount >= parseFloat(amountMin);
			const matchesAmountMax =
				!amountMax || transaction.amount <= parseFloat(amountMax);

			return (
				matchesSearch &&
				matchesCategory &&
				matchesPaymentMethod &&
				matchesDateFrom &&
				matchesDateTo &&
				matchesAmountMin &&
				matchesAmountMax
			);
		})
		.sort((a, b) => {
			// Sort by date descending (newest first)
			return (
				new Date(b.transactionDate).getTime() -
				new Date(a.transactionDate).getTime()
			);
		});

	// Get unique payment methods from transactions
	const uniquePaymentMethods = Array.from(
		new Map(
			transactions
				.map((transaction) => transaction.paymentMethod)
				.filter((method) => method) // Filter out null/undefined
				.map((method) => [method.paymentMethodId, method])
		).values()
	).sort((a, b) => (a.displayName || '').localeCompare(b.displayName || ''));

	return {
		// State
		showAddModal,
		setShowAddModal,
		editingTransaction,
		formData,
		transactionToDelete,

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
		confirmDelete,
		cancelDelete,
		handleSubmit,
		openAddModal,
		clearFilters,
	};
};
