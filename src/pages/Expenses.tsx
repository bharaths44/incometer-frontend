import { useState, useEffect } from "react";
import { Filter, Plus, Search, CalendarIcon } from "lucide-react";
import { getAllExpenses, createExpense, updateExpense, deleteExpense } from "../services/expenseService";
import { getAllCategories } from "../services/categoryService";
import { ExpenseResponseDTO, ExpenseRequestDTO, Category } from "../types/expense";
import ExpenseForm from "../components/expense/ExpenseForm";
import ExpenseTable from "../components/expense/ExpenseTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";

export default function Expenses() {
    const [showAddModal, setShowAddModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("all");
    const [dateFrom, setDateFrom] = useState<Date | undefined>();
    const [dateTo, setDateTo] = useState<Date | undefined>();
    const [isDateFromOpen, setIsDateFromOpen] = useState(false);
    const [isDateToOpen, setIsDateToOpen] = useState(false);
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
        paymentMethodId: "",
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
                // const expenseCategories = categoriesData.filter(cat => cat.type === 'EXPENSE');
                // setCategories(expenseCategories);
                setCategories(categoriesData);
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
            paymentMethodId: expense.paymentMethod.paymentMethodId.toString(),
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
                paymentMethodId: "",
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
            paymentMethodId: "",
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
            selectedPaymentMethod === "all" || expense.paymentMethod.paymentMethodId.toString() === selectedPaymentMethod;
        const matchesDateFrom = !dateFrom || new Date(expense.expenseDate) >= dateFrom;
        const matchesDateTo = !dateTo || new Date(expense.expenseDate) <= dateTo;
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
    const uniquePaymentMethods = Array.from(
        new Map(
            expenses
                .map(expense => expense.paymentMethod)
                .filter(method => method) // Filter out null/undefined
                .map(method => [method.paymentMethodId, method])
        ).values()
    ).sort((a, b) => (a.displayName || '').localeCompare(b.displayName || ''));

    return (
        <div className="page-transition space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold mb-2">Expenses</h1>
                    <p className="text-gray-600">Track and manage your spending</p>
                </div>
                <Button onClick={openAddModal}>
                    <Plus className="w-5 h-5 mr-2" />
                    Add Expense
                </Button>
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
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search expenses..."
                        className="pl-12"
                    />
                </div>
                <div className="relative">
                    <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="pl-12">
                            <SelectValue placeholder="All Categories" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            {categories.map((cat) => (
                                <SelectItem key={`filter-category-${cat.categoryId}`} value={cat.name}>
                                    {cat.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="relative">
                    <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
                    <Select value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
                        <SelectTrigger className="pl-12">
                            <SelectValue placeholder="All Payment Methods" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Payment Methods</SelectItem>
                            {uniquePaymentMethods.map((method) => (
                                <SelectItem key={`filter-payment-${method.paymentMethodId}`} value={method.paymentMethodId.toString()}>
                                    {method.displayName}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                    <Label className="block text-sm font-medium mb-1">Date From</Label>
                    <Popover open={isDateFromOpen} onOpenChange={setIsDateFromOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className={`w-full justify-start text-left font-normal ${!dateFrom && "text-muted-foreground"
                                    }`}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {dateFrom ? format(dateFrom, "PPP") : "Pick a date"}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={dateFrom}
                                onSelect={(date) => {
                                    setDateFrom(date);
                                    setIsDateFromOpen(false);
                                }}
                                autoFocus
                            />
                        </PopoverContent>
                    </Popover>
                </div>
                <div className="flex-1">
                    <Label className="block text-sm font-medium mb-1">Date To</Label>
                    <Popover open={isDateToOpen} onOpenChange={setIsDateToOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className={`w-full justify-start text-left font-normal ${!dateTo && "text-muted-foreground"
                                    }`}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {dateTo ? format(dateTo, "PPP") : "Pick a date"}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={dateTo}
                                onSelect={(date) => {
                                    setDateTo(date);
                                    setIsDateToOpen(false);
                                }}
                                autoFocus
                            />
                        </PopoverContent>
                    </Popover>
                </div>
                <div className="flex-1">
                    <Label className="block text-sm font-medium mb-1">Min Amount (₹)</Label>
                    <Input
                        type="number"
                        step="0.01"
                        value={amountMin}
                        onChange={(e) => setAmountMin(e.target.value)}
                        placeholder="0.00"
                    />
                </div>
                <div className="flex-1">
                    <Label className="block text-sm font-medium mb-1">Max Amount (₹)</Label>
                    <Input
                        type="number"
                        step="0.01"
                        value={amountMax}
                        onChange={(e) => setAmountMax(e.target.value)}
                        placeholder="0.00"
                    />
                </div>
            </div>

            <div className="flex justify-end">
                <Button
                    onClick={() => {
                        setSearchQuery("");
                        setSelectedCategory("all");
                        setSelectedPaymentMethod("all");
                        setDateFrom(undefined);
                        setDateTo(undefined);
                        setIsDateFromOpen(false);
                        setIsDateToOpen(false);
                        setAmountMin("");
                        setAmountMax("");
                    }}
                    variant="secondary"
                >
                    Clear All Filters
                </Button>
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
