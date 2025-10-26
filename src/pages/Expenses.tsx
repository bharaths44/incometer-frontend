import {useState} from "react";
import {Calendar, Edit2, Filter, Plus, Search, Tag, Trash2,} from "lucide-react";

export default function Expenses() {
    const [showAddModal, setShowAddModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");

    const expenses = [
        {
            id: 1,
            name: "Grocery Shopping",
            category: "Food & Dining",
            amount: 125.5,
            date: "2025-10-26",
            icon: "🛒",
            color: "bg-orange-100 text-orange-600",
        },
        {
            id: 2,
            name: "Gas Station",
            category: "Transportation",
            amount: 45.0,
            date: "2025-10-25",
            icon: "⛽",
            color: "bg-blue-100 text-blue-600",
        },
        {
            id: 3,
            name: "Netflix Subscription",
            category: "Entertainment",
            amount: 15.99,
            date: "2025-10-24",
            icon: "🎬",
            color: "bg-green-100 text-green-600",
        },
        {
            id: 4,
            name: "Coffee Shop",
            category: "Food & Dining",
            amount: 8.5,
            date: "2025-10-23",
            icon: "☕",
            color: "bg-orange-100 text-orange-600",
        },
        {
            id: 5,
            name: "Electric Bill",
            category: "Bills & Utilities",
            amount: 85.0,
            date: "2025-10-22",
            icon: "⚡",
            color: "bg-yellow-100 text-yellow-600",
        },
        {
            id: 6,
            name: "Pharmacy",
            category: "Healthcare",
            amount: 32.5,
            date: "2025-10-21",
            icon: "💊",
            color: "bg-red-100 text-red-600",
        },
        {
            id: 7,
            name: "Restaurant Dinner",
            category: "Food & Dining",
            amount: 68.75,
            date: "2025-10-20",
            icon: "🍽️",
            color: "bg-orange-100 text-orange-600",
        },
        {
            id: 8,
            name: "Online Shopping",
            category: "Shopping",
            amount: 145.99,
            date: "2025-10-19",
            icon: "🛍️",
            color: "bg-pink-100 text-pink-600",
        },
    ];

    const categories = [
        "all",
        "Food & Dining",
        "Transportation",
        "Entertainment",
        "Bills & Utilities",
        "Healthcare",
        "Shopping",
    ];

    const filteredExpenses = expenses.filter((expense) => {
        const matchesSearch = expense.name
                                     .toLowerCase()
                                     .includes(searchQuery.toLowerCase());
        const matchesCategory =
            selectedCategory === "all" || expense.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const totalExpenses = filteredExpenses.reduce(
        (sum, expense) => sum + expense.amount,
        0,
    );

    return (
        <div className="page-transition space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold mb-2">Expenses</h1>
                    <p className="text-gray-600">Track and manage your spending</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus className="w-5 h-5"/>
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
                            ${totalExpenses.toFixed(2)}
                        </div>
                    </div>
                    <div
                        className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-sm">
                        <Trash2 className="w-10 h-10"/>
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search expenses..."
                        className="input-field pl-12 w-full"
                    />
                </div>
                <div className="relative">
                    <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="input-field pl-12 pr-8 appearance-none cursor-pointer"
                    >
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat === "all" ? "All Categories" : cat}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                {filteredExpenses.map((expense, index) => (
                    <div
                        key={expense.id}
                        className="card group"
                        style={{animationDelay: `${index * 50}ms`}}
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-4">
                                <div
                                    className={`w-14 h-14 ${expense.color} rounded-2xl flex items-center justify-center text-2xl`}
                                >
                                    {expense.icon}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg text-gray-900">
                                        {expense.name}
                                    </h3>
                                    <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                    <span className="flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5"/>
                        {expense.category}
                    </span>
                                        <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5"/>
                                            {new Date(expense.date).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                            })}
                    </span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold text-gray-900 mb-2">
                                    ${expense.amount.toFixed(2)}
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                                        <Edit2 className="w-4 h-4 text-gray-600"/>
                                    </button>
                                    <button className="p-2 hover:bg-red-50 rounded-xl transition-colors">
                                        <Trash2 className="w-4 h-4 text-red-600"/>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 z-50">
                    <div className="card max-w-md w-full animate-in">
                        <h2 className="text-2xl font-bold mb-6">Add New Expense</h2>
                        <form className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Expense Name
                                </label>
                                <input
                                    type="text"
                                    className="input-field"
                                    placeholder="e.g., Grocery Shopping"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Amount
                                </label>
                                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                    $
                  </span>
                                    <input
                                        type="number"
                                        step="0.01"
                                        className="input-field pl-8"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Category
                                </label>
                                <select className="input-field">
                                    {categories
                                        .filter((c) => c !== "all")
                                        .map((cat) => (
                                            <option key={cat} value={cat}>
                                                {cat}
                                            </option>
                                        ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Date
                                </label>
                                <input type="date" className="input-field"/>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="btn-secondary flex-1"
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn-primary flex-1">
                                    Add Expense
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
