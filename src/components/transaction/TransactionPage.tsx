import { useState, useEffect } from "react";
import { Filter, Plus, Search, CalendarIcon } from "lucide-react";
import { getAllCategories } from "../../services/categoryService";
import { TransactionResponseDTO, TransactionRequestDTO, TransactionConfig } from "../../types/transaction";
import TransactionForm from "./TransactionForm";
import TransactionTable from "./TransactionTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Category } from "@/types/category";
import { TransactionService } from "../../services/transactionService";

interface TransactionPageProps {
    config: TransactionConfig;
    service: TransactionService;
}

export default function TransactionPage({ config, service }: TransactionPageProps) {
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
    const [transactions, setTransactions] = useState<TransactionResponseDTO[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingTransaction, setEditingTransaction] = useState<TransactionResponseDTO | null>(null);
    const [formData, setFormData] = useState({
        description: "",
        amount: "",
        categoryId: "",
        paymentMethodId: "",
        date: "",
        userId: 1, // Assuming userId is 1 for now
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [transactionsData, categoriesData] = await Promise.all([
                    service.getAll(1), // Assuming userId is 1
                    getAllCategories(1)
                ]);
                setTransactions(transactionsData);
                setCategories(categoriesData.filter(cat => cat.type === (config.type === 'expense' ? 'EXPENSE' : 'INCOME')));
            } catch (error) {
                console.error(`Failed to fetch ${config.type} data:`, error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [service, config.type]);

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
                await service.delete(transaction.transactionId, transaction.userUserId);
                setTransactions(transactions.filter(t => t.transactionId !== transaction.transactionId));
            } catch (error) {
                console.error(`Failed to delete ${config.type}:`, error);
            }
        }
    };

    const handleSubmit = async (dto: TransactionRequestDTO) => {
        try {
            if (editingTransaction) {
                const updated = await service.update(editingTransaction.transactionId, dto);
                setTransactions(transactions.map(t => t.transactionId === editingTransaction.transactionId ? updated : t));
            } else {
                const newTransaction = await service.create(dto);
                setTransactions([...transactions, newTransaction]);
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

    const totalAmount = filteredTransactions.reduce(
        (sum, transaction) => sum + transaction.amount,
        0,
    );

    // Get unique payment methods from transactions
    const uniquePaymentMethods = Array.from(
        new Map(
            transactions
                .map(transaction => transaction.paymentMethod)
                .filter(method => method) // Filter out null/undefined
                .map(method => [method.paymentMethodId, method])
        ).values()
    ).sort((a, b) => (a.displayName || '').localeCompare(b.displayName || ''));

    return (
        <div className="page-transition space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold mb-2">{config.title}</h1>
                    <p className="text-gray-600">{config.description}</p>
                </div>
                <Button onClick={openAddModal}>
                    <Plus className="w-5 h-5 mr-2" />
                    {config.addButtonText}
                </Button>
            </div>

            <div className={`card bg-gradient-to-br ${config.type === 'expense' ? 'from-orange-500 to-red-500' : 'from-green-500 to-emerald-500'} border-0 text-white`}>
                <div className="flex items-center justify-between">
                    <div>
                        <div className={`text-${config.type === 'expense' ? 'orange' : 'green'}-100 mb-2 text-sm`}>
                            Total {config.title} This Month
                        </div>
                        <div className="text-5xl font-bold">
                            {config.type === 'income' ? '+' : ''}₹{totalAmount.toFixed(2)}
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
                        placeholder={`Search ${config.type}s...`}
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

            <TransactionTable
                transactions={filteredTransactions}
                onEdit={handleEdit}
                onDelete={handleDelete}
                loading={loading}
                config={config}
            />

            <TransactionForm
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                onSubmit={handleSubmit}
                editingTransaction={editingTransaction}
                initialData={formData}
                config={config}
            />
        </div>
    );
}