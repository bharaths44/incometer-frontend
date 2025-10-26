import {useState} from "react";
import {Calendar, DollarSign, Edit2, Plus, Search, Trash2, TrendingUp,} from "lucide-react";

export default function Income() {
    const [showAddModal, setShowAddModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const incomeEntries = [
        {
            id: 1,
            source: "Salary",
            amount: 5000.0,
            date: "2025-10-20",
            type: "Recurring",
            icon: "💰",
            color: "bg-green-100 text-green-600",
        },
        {
            id: 2,
            source: "Freelance Project",
            amount: 2500.0,
            date: "2025-10-18",
            type: "One-time",
            icon: "💼",
            color: "bg-blue-100 text-blue-600",
        },
        {
            id: 3,
            source: "Investment Returns",
            amount: 850.0,
            date: "2025-10-15",
            type: "Passive",
            icon: "📈",
            color: "bg-emerald-100 text-emerald-600",
        },
        {
            id: 4,
            source: "Side Hustle",
            amount: 450.0,
            date: "2025-10-12",
            type: "One-time",
            icon: "🚀",
            color: "bg-cyan-100 text-cyan-600",
        },
        {
            id: 5,
            source: "Rental Income",
            amount: 1200.0,
            date: "2025-10-10",
            type: "Recurring",
            icon: "🏠",
            color: "bg-teal-100 text-teal-600",
        },
        {
            id: 6,
            source: "Bonus",
            amount: 1500.0,
            date: "2025-10-05",
            type: "One-time",
            icon: "🎁",
            color: "bg-green-100 text-green-600",
        },
    ];

    const filteredIncome = incomeEntries.filter((income) =>
        income.source.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    const totalIncome = filteredIncome.reduce(
        (sum, income) => sum + income.amount,
        0,
    );
    const recurringIncome = filteredIncome
        .filter((i) => i.type === "Recurring")
        .reduce((sum, i) => sum + i.amount, 0);
    const oneTimeIncome = filteredIncome
        .filter((i) => i.type === "One-time")
        .reduce((sum, i) => sum + i.amount, 0);

    const incomeStats = [
        {
            label: "Total Income",
            value: `$${totalIncome.toFixed(2)}`,
            color: "from-green-500 to-emerald-600",
            icon: DollarSign,
        },
        {
            label: "Recurring",
            value: `$${recurringIncome.toFixed(2)}`,
            color: "from-blue-500 to-cyan-600",
            icon: TrendingUp,
        },
        {
            label: "One-time",
            value: `$${oneTimeIncome.toFixed(2)}`,
            color: "from-emerald-500 to-teal-600",
            icon: Calendar,
        },
    ];

    return (
        <div className="page-transition space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold mb-2">Income</h1>
                    <p className="text-gray-600">Track all your income sources</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus className="w-5 h-5"/>
                    Add Income
                </button>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {incomeStats.map((stat, index) => (
                    <div
                        key={index}
                        className={`card bg-gradient-to-br ${stat.color} border-0 text-white`}
                        style={{animationDelay: `${index * 100}ms`}}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-white/80 mb-2 text-sm">{stat.label}</div>
                                <div className="text-4xl font-bold">{stat.value}</div>
                            </div>
                            <div
                                className="w-16 h-16 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-sm">
                                <stat.icon className="w-8 h-8"/>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="card">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold">Income History</h2>
                    <div className="relative flex-1 max-w-md ml-6">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search income sources..."
                            className="input-field pl-12 w-full"
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    {filteredIncome.map((income, index) => (
                        <div
                            key={income.id}
                            className="flex items-center justify-between p-5 rounded-2xl hover:bg-gray-50 transition-all duration-200 group"
                            style={{animationDelay: `${index * 50}ms`}}
                        >
                            <div className="flex items-center gap-4">
                                <div
                                    className={`w-14 h-14 ${income.color} rounded-2xl flex items-center justify-center text-2xl`}
                                >
                                    {income.icon}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg text-gray-900">
                                        {income.source}
                                    </h3>
                                    <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                    <span className="px-2 py-1 bg-gray-100 rounded-lg font-medium">
                      {income.type}
                    </span>
                                        <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5"/>
                                            {new Date(income.date).toLocaleDateString("en-US", {
                                                month: "long",
                                                day: "numeric",
                                                year: "numeric",
                                            })}
                    </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-green-600">
                                        +${income.amount.toFixed(2)}
                                    </div>
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
                    ))}
                </div>
            </div>

            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 z-50">
                    <div className="card max-w-md w-full animate-in">
                        <h2 className="text-2xl font-bold mb-6">Add New Income</h2>
                        <form className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Income Source
                                </label>
                                <input
                                    type="text"
                                    className="input-field"
                                    placeholder="e.g., Freelance Project"
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
                                    Type
                                </label>
                                <select className="input-field">
                                    <option value="one-time">One-time</option>
                                    <option value="recurring">Recurring</option>
                                    <option value="passive">Passive</option>
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
                                    Add Income
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
