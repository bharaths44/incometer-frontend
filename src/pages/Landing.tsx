import {ArrowRight, BarChart3, Sparkles, TrendingUp, Wallet,} from "lucide-react";

interface LandingProps {
    onGetStarted: () => void;
}

export default function Landing({onGetStarted}: LandingProps) {
    const features = [
        {
            icon: Wallet,
            title: "Smart Expense Tracking",
            description:
                "Effortlessly track every dollar with intuitive categorization and insights.",
        },
        {
            icon: TrendingUp,
            title: "Income Management",
            description:
                "Monitor all income streams and understand your financial growth.",
        },
        {
            icon: BarChart3,
            title: "Visual Analytics",
            description:
                "Beautiful charts and reports that make sense of your finances.",
        },
        {
            icon: Sparkles,
            title: "AI Financial Assistant",
            description:
                "Get instant answers to your budgeting questions with AI-powered chat.",
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-emerald-50/40 page-transition">
            <div className="max-w-7xl mx-auto px-6 py-16">
                <nav className="flex items-center justify-between mb-20">
                    <div className="flex items-center gap-3">
                        <div
                            className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-white"/>
                        </div>
                        <span
                            className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Incometer
            </span>
                    </div>
                    <button onClick={onGetStarted} className="btn-secondary text-sm">
                        Sign In
                    </button>
                </nav>

                <div className="text-center max-w-4xl mx-auto mb-20">
                    <div className="inline-block mb-6">
            <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
              Your Financial Command Center
            </span>
                    </div>
                    <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
                        Track expenses,
                        <br/>
                        <span
                            className="bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 bg-clip-text text-transparent">
              grow wealth.
            </span>
                    </h1>
                    <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                        Experience a fresh approach to personal finance. Beautifully
                        designed, incredibly simple, powered by intelligence.
                    </p>
                    <button
                        onClick={onGetStarted}
                        className="btn-primary text-lg px-8 py-4 inline-flex items-center gap-2 group"
                    >
                        Get Started Free
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform"/>
                    </button>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="card group cursor-default"
                            style={{animationDelay: `${index * 100}ms`}}
                        >
                            <div
                                className="w-14 h-14 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                <feature.icon className="w-7 h-7 text-green-600"/>
                            </div>
                            <h3 className="text-lg font-semibold mb-2 text-gray-900">
                                {feature.title}
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>

                <div
                    className="card max-w-4xl mx-auto text-center py-12 bg-gradient-to-br from-green-500 to-emerald-600 border-0">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Ready to take control?
                    </h2>
                    <p className="text-green-50 text-lg mb-8 max-w-xl mx-auto">
                        Join thousands making smarter financial decisions every day.
                    </p>
                    <button
                        onClick={onGetStarted}
                        className="bg-white text-green-600 px-8 py-4 rounded-2xl font-semibold hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 inline-flex items-center gap-2"
                    >
                        Start Your Journey
                        <ArrowRight className="w-5 h-5"/>
                    </button>
                </div>
            </div>
        </div>
    );
}
