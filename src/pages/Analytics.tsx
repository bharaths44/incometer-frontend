import { TrendingUp, TrendingDown, Calendar, PieChart, BarChart3, DollarSign } from 'lucide-react';

export default function Analytics() {
  const monthlyTrends = [
    { month: 'Apr', income: 8500, expenses: 4200 },
    { month: 'May', income: 9200, expenses: 4800 },
    { month: 'Jun', income: 8800, expenses: 4500 },
    { month: 'Jul', income: 10500, expenses: 5200 },
    { month: 'Aug', income: 11200, expenses: 5800 },
    { month: 'Sep', income: 10800, expenses: 5400 },
    { month: 'Oct', income: 12450, expenses: 6100 }
  ];

  const maxValue = Math.max(...monthlyTrends.flatMap(m => [m.income, m.expenses]));

  const categoryBreakdown = [
    { category: 'Food & Dining', amount: 1250, percentage: 32, color: 'bg-orange-500', transactions: 45 },
    { category: 'Transportation', amount: 680, percentage: 17, color: 'bg-blue-500', transactions: 28 },
    { category: 'Entertainment', amount: 420, percentage: 11, color: 'bg-green-500', transactions: 15 },
    { category: 'Shopping', amount: 950, percentage: 24, color: 'bg-pink-500', transactions: 22 },
    { category: 'Bills & Utilities', amount: 640, percentage: 16, color: 'bg-yellow-500', transactions: 8 }
  ];

  const insights = [
    {
      title: 'Top Spending Category',
      value: 'Food & Dining',
      detail: '$1,250 this month',
      icon: '🍽️',
      color: 'from-orange-500 to-red-500'
    },
    {
      title: 'Savings Rate',
      value: '51%',
      detail: '+5% from last month',
      icon: '📊',
      color: 'from-green-500 to-emerald-600'
    },
    {
      title: 'Average Daily Spending',
      value: '$138.50',
      detail: 'Below target of $150',
      icon: '💳',
      color: 'from-blue-500 to-cyan-600'
    }
  ];

  return (
    <div className="page-transition space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">Analytics</h1>
          <p className="text-gray-600 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            October 2025
          </p>
        </div>
        <div className="flex gap-3">
          <button className="btn-secondary text-sm">
            Last 30 Days
          </button>
          <button className="btn-secondary text-sm">
            Last 6 Months
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {insights.map((insight, index) => (
          <div
            key={index}
            className={`card bg-gradient-to-br ${insight.color} border-0 text-white`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="text-5xl mb-4">{insight.icon}</div>
            <div className="text-white/80 text-sm mb-1">{insight.title}</div>
            <div className="text-3xl font-bold mb-2">{insight.value}</div>
            <div className="text-white/90 text-sm">{insight.detail}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-green-600" />
            Income vs Expenses
          </h2>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-gray-600">Income</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-500 rounded"></div>
              <span className="text-gray-600">Expenses</span>
            </div>
          </div>
        </div>

        <div className="flex items-end justify-between gap-4 h-80">
          {monthlyTrends.map((data, index) => (
            <div key={index} className="flex-1 flex flex-col items-center gap-3 h-full justify-end">
              <div className="flex flex-col items-center gap-2 w-full h-full justify-end">
                <div
                  className="w-full bg-green-500 rounded-t-xl transition-all duration-1000 ease-out hover:bg-green-600 cursor-pointer relative group"
                  style={{
                    height: `${(data.income / maxValue) * 100}%`,
                    animationDelay: `${index * 100}ms`
                  }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                    ${data.income.toLocaleString()}
                  </div>
                </div>
                <div
                  className="w-full bg-orange-500 rounded-t-xl transition-all duration-1000 ease-out hover:bg-orange-600 cursor-pointer relative group"
                  style={{
                    height: `${(data.expenses / maxValue) * 100}%`,
                    animationDelay: `${index * 100 + 50}ms`
                  }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                    ${data.expenses.toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="text-sm font-medium text-gray-600">{data.month}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
            <PieChart className="w-6 h-6 text-green-600" />
            Spending by Category
          </h2>
          <div className="space-y-6">
            {categoryBreakdown.map((item, index) => (
              <div key={index} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 ${item.color} rounded`}></div>
                    <span className="font-medium text-gray-900">{item.category}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900">${item.amount}</div>
                    <div className="text-xs text-gray-500">{item.transactions} transactions</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full transition-all duration-1000 ease-out`}
                      style={{
                        width: `${item.percentage}%`,
                        animationDelay: `${index * 100}ms`
                      }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-700 w-12 text-right">
                    {item.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
            <TrendingUp className="w-6 h-6 text-green-600" />
            Financial Overview
          </h2>
          <div className="space-y-4">
            <div className="p-5 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-700 font-medium">Net Income Growth</span>
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-green-600 mb-1">+18.7%</div>
              <div className="text-sm text-gray-600">Compared to last month</div>
            </div>

            <div className="p-5 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-700 font-medium">Expense Reduction</span>
                <TrendingDown className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-blue-600 mb-1">-8.2%</div>
              <div className="text-sm text-gray-600">You're spending less</div>
            </div>

            <div className="p-5 bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl border border-orange-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-700 font-medium">Monthly Savings</span>
                <DollarSign className="w-5 h-5 text-orange-600" />
              </div>
              <div className="text-3xl font-bold text-orange-600 mb-1">$6,325</div>
              <div className="text-sm text-gray-600">51% of income saved</div>
            </div>
          </div>
        </div>
      </div>

      <div className="card bg-gradient-to-br from-green-500 to-emerald-600 border-0 text-white">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-3">Projected Year-End Balance</h2>
            <div className="text-5xl font-bold mb-2">$95,400</div>
            <p className="text-green-50">
              Based on your current spending and income trends, you're on track to exceed your savings goal by 22%.
            </p>
          </div>
          <div className="text-8xl">🎯</div>
        </div>
      </div>
    </div>
  );
}
