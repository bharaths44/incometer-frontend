import {ReactNode, useState} from "react";
import {BarChart3, LayoutDashboard, LogOut, Menu, Settings, TrendingDown, TrendingUp, User, X,} from "lucide-react";
import ChatBot from "./ChatBot";

interface LayoutProps {
    children: ReactNode;
    currentPage: string;
    onNavigate: (page: string) => void;
    onLogout: () => void;
}

export default function Layout({
                                   children,
                                   currentPage,
                                   onNavigate,
                                   onLogout,
                               }: LayoutProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navItems = [
        {id: "dashboard", label: "Dashboard", icon: LayoutDashboard},
        {id: "expenses", label: "Expenses", icon: TrendingDown},
        {id: "income", label: "Income", icon: TrendingUp},
        {id: "analytics", label: "Analytics", icon: BarChart3},
        {id: "profile", label: "Profile", icon: User},
        {id: "settings", label: "Settings", icon: Settings},
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/20 to-emerald-50/30">
            <nav className="bg-white border-b border-gray-100 sticky top-0 z-40 backdrop-blur-lg bg-white/95">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
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

                        <div className="hidden md:flex items-center gap-2">
                            {navItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => onNavigate(item.id)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                                        currentPage === item.id
                                        ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md"
                                        : "text-gray-600 hover:bg-gray-100"
                                    }`}
                                >
                                    <item.icon className="w-4 h-4"/>
                                    {item.label}
                                </button>
                            ))}
                            <button
                                onClick={onLogout}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-red-600 hover:bg-red-50 transition-all duration-200 ml-2"
                            >
                                <LogOut className="w-4 h-4"/>
                                Logout
                            </button>
                        </div>

                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2 hover:bg-gray-100 rounded-xl transition-colors"
                        >
                            {isMobileMenuOpen ? (
                                <X className="w-6 h-6"/>
                            ) : (
                                 <Menu className="w-6 h-6"/>
                             )}
                        </button>
                    </div>

                    {isMobileMenuOpen && (
                        <div className="md:hidden mt-4 pt-4 border-t border-gray-100 space-y-2">
                            {navItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        onNavigate(item.id);
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                                        currentPage === item.id
                                        ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                                        : "text-gray-600 hover:bg-gray-100"
                                    }`}
                                >
                                    <item.icon className="w-5 h-5"/>
                                    {item.label}
                                </button>
                            ))}
                            <button
                                onClick={onLogout}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-red-600 hover:bg-red-50 transition-all duration-200"
                            >
                                <LogOut className="w-5 h-5"/>
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 py-8">{children}</main>

            <ChatBot/>
        </div>
    );
}
