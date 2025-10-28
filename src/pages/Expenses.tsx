import { useState, useEffect } from "react";
import { Filter, Plus, Search } from "lucide-react";
import { getAllExpenses, createExpense, updateExpense, deleteExpense } from "../services/expenseService";
import { getAllCategories } from "../services/categoryService";
import { ExpenseResponseDTO, ExpenseRequestDTO, Category } from "../types/expense";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseTable from "../components/ExpenseTable";

export default function Expenses() {
    const [showAddModal, setShowAddModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("all");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [amountMin, setAmountMin] = useState("");
    const [amountMax, setAmountMax] = useState("");
    const [expenses, setExpenses] = useState<ExpenseResponseDTO[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingExpense, setEditingExpense] = useState<ExpenseResponseDTO | null>(null);
    const [formData, setFormData] = useState({
        description: "",
        amount: "",
        categoryId: "",
        paymentMethod: "",
        expenseDate: "",
        userId: 1, // Assuming userId is 1 for now
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [expensesData, categoriesData] = await Promise.all([
                    getAllExpenses(1), // Assuming userId is 1
                    getAllCategories(1)
                ]);
                setExpenses(expensesData);
                // Filter categories to only show expense categories
                const expenseCategories = categoriesData.filter(cat => cat.type === 'EXPENSE');
                setCategories(expenseCategories);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleEdit = (expense: ExpenseResponseDTO) => {
        setEditingExpense(expense);
        setFormData({
            description: expense.description,
            amount: expense.amount.toString(),
            categoryId: expense.category.categoryId.toString(),
            paymentMethod: expense.paymentMethod,
            expenseDate: expense.expenseDate,
            userId: expense.userUserId,
        });
        setShowAddModal(true);
    };

    const handleDelete = async (expense: ExpenseResponseDTO) => {
        if (confirm('Are you sure you want to delete this expense?')) {
            try {
                await deleteExpense(expense.expenseId, expense.userUserId);
                setExpenses(expenses.filter(e => e.expenseId !== expense.expenseId));
            } catch (error) {
                console.error('Failed to delete expense:', error);
            }
        }
    };

    const handleSubmit = async (dto: ExpenseRequestDTO) => {
        try {
            if (editingExpense) {
                const updated = await updateExpense(editingExpense.expenseId, dto);
                setExpenses(expenses.map(e => e.expenseId === editingExpense.expenseId ? updated : e));
            } else {
                const newExpense = await createExpense(dto);
                setExpenses([...expenses, newExpense]);
            }
            setShowAddModal(false);
            setEditingExpense(null);
            setFormData({
                description: "",
                amount: "",
                categoryId: "",
                paymentMethod: "",
                expenseDate: "",
                userId: 1,
            });
        } catch (error) {
            console.error('Failed to save expense:', error);
        }
    };

    const openAddModal = () => {
        setEditingExpense(null);
        setFormData({
            description: "",
            amount: "",
            categoryId: "",
            paymentMethod: "",
            expenseDate: "",
            userId: 1,
        });
        setShowAddModal(true);
    };

    const filteredExpenses = expenses.filter((expense) => {
        const matchesSearch = expense.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        const matchesCategory =
            selectedCategory === "all" || expense.category.name === selectedCategory;
        const matchesPaymentMethod =
            selectedPaymentMethod === "all" || expense.paymentMethod === selectedPaymentMethod;
        const matchesDateFrom = !dateFrom || expense.expenseDate >= dateFrom;
        const matchesDateTo = !dateTo || expense.expenseDate <= dateTo;
        const matchesAmountMin = !amountMin || expense.amount >= parseFloat(amountMin);
        const matchesAmountMax = !amountMax || expense.amount <= parseFloat(amountMax);

        return matchesSearch && matchesCategory && matchesPaymentMethod &&
            matchesDateFrom && matchesDateTo && matchesAmountMin && matchesAmountMax;
    });

    const totalExpenses = filteredExpenses.reduce(
        (sum, expense) => sum + expense.amount,
        0,
    );

    // Get unique payment methods from expenses
    const paymentMethods = Array.from(new Set(expenses.map(expense => expense.paymentMethod))).sort();

    return (
        <div className="page-transition space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold mb-2">Expenses</h1>
                    <p className="text-gray-600">Track and manage your spending</p>
                </div>
                <button
                    onClick={openAddModal}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    Add Expense
                </button>
            </div>

            <div className="card bg-gradient-to-br from-orange-500 to-red-500 border-0 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-orange-100 mb-2 text-sm">
                            Total Expenses This Month
                        </div>
                        <div className="text-5xl font-bold">
                            ₹{totalExpenses.toFixed(2)}
                        </div>
                    </div>
                    <div
                        className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-sm">
                        <Search className="w-10 h-10" />
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search expenses..."
                        className="input-field pl-12 w-full"
                    />
                </div>
                <div className="relative">
                    <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="input-field pl-12 pr-8 appearance-none cursor-pointer"
                    >
                        <option value="all">All Categories</option>
                        {categories.map((cat) => (
                            <option key={cat.categoryId} value={cat.name}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="relative">
                    <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                        value={selectedPaymentMethod}
                        onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                        className="input-field pl-12 pr-8 appearance-none cursor-pointer"
                    >
                        <option value="all">All Payment Methods</option>
                        {paymentMethods.map((method) => (
                            <option key={method} value={method}>
                                {method}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date From</label>
                    <input
                        type="date"
                        value={dateFrom}
                        onChange={(e) => setDateFrom(e.target.value)}
                        className="input-field w-full"
                    />
                </div>
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date To</label>
                    <input
                        type="date"
                        value={dateTo}
                        onChange={(e) => setDateTo(e.target.value)}
                        className="input-field w-full"
                    />
                </div>
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Min Amount (₹)</label>
                    <input
                        type="number"
                        step="0.01"
                        value={amountMin}
                        onChange={(e) => setAmountMin(e.target.value)}
                        placeholder="0.00"
                        className="input-field w-full"
                    />
                </div>
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Amount (₹)</label>
                    <input
                        type="number"
                        step="0.01"
                        value={amountMax}
                        onChange={(e) => setAmountMax(e.target.value)}
                        placeholder="0.00"
                        className="input-field w-full"
                    />
                </div>
            </div>

            <div className="flex justify-end">
                <button
                    onClick={() => {
                        setSearchQuery("");
                        setSelectedCategory("all");
                        setSelectedPaymentMethod("all");
                        setDateFrom("");
                        setDateTo("");
                        setAmountMin("");
                        setAmountMax("");
                    }}
                    className="btn-secondary text-sm"
                >
                    Clear All Filters
                </button>
            </div>

            <ExpenseTable
                expenses={filteredExpenses}
                onEdit={handleEdit}
                onDelete={handleDelete}
                loading={loading}
            />

            <ExpenseForm
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                onSubmit={handleSubmit}
                editingExpense={editingExpense}
                initialData={formData}
            />
        </div>
    );
}
