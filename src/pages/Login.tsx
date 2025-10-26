import {useState} from "react";
import {ArrowRight, Lock, Mail, TrendingUp} from "lucide-react";

interface LoginProps {
    onLogin: () => void;
    onSwitchToSignup: () => void;
}

export default function Login({onLogin, onSwitchToSignup}: LoginProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onLogin();
    };

    return (
        <div
            className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-emerald-50/40 flex items-center justify-center px-6 page-transition">
            <div className="w-full max-w-md">
                <div className="text-center mb-10">
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <div
                            className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center">
                            <TrendingUp className="w-7 h-7 text-white"/>
                        </div>
                        <span
                            className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Incometer
            </span>
                    </div>
                    <h1 className="text-4xl font-bold mb-3">Welcome back</h1>
                    <p className="text-gray-600">
                        Sign in to continue your financial journey
                    </p>
                </div>

                <div className="card">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="input-field pl-12"
                                    placeholder="you@example.com"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="input-field pl-12"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                                />
                                <span className="text-gray-600">Remember me</span>
                            </label>
                            <button
                                type="button"
                                className="text-green-600 hover:text-green-700 font-medium"
                            >
                                Forgot password?
                            </button>
                        </div>

                        <button
                            type="submit"
                            className="btn-primary w-full flex items-center justify-center gap-2"
                        >
                            Sign In
                            <ArrowRight className="w-5 h-5"/>
                        </button>
                    </form>
                </div>

                <p className="text-center text-gray-600 mt-6">
                    Don't have an account?{" "}
                    <button
                        onClick={onSwitchToSignup}
                        className="text-green-600 hover:text-green-700 font-semibold"
                    >
                        Sign up free
                    </button>
                </p>
            </div>
        </div>
    );
}
