import { useState, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { ArrowRight, Lock, Mail, Loader2, Sparkles } from "lucide-react";

export default function Login() {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (!formData.email || !formData.password) {
            setError("Please fill in all fields");
            setLoading(false);
            return;
        }

        const result = await login(formData);

        if (result.success) {
            if (result.user.role === 'admin') {
                navigate("/admin");
            } else {
                navigate(from);
            }
        } else {
            setError(result.message || "Invalid credentials");
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-paper-bg flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Patterns */}
            <div className="absolute inset-0 z-0 opacity-10"
                style={{
                    backgroundImage: 'url("/images/diwali-festival-patterned-background.png")',
                    backgroundSize: '400px',
                }}>
            </div>

            {/* Floating Orbs */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-marigold/20 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-sindoor/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="w-full max-w-md bg-white/90 backdrop-blur-md rounded-[2.5rem] shadow-2xl border border-white/50 relative z-10 overflow-hidden">
                <div className="h-2 bg-linear-to-r from-sindoor via-marigold to-sindoor"></div>

                <div className="p-8 md:p-12">
                    <div className="text-center mb-10">
                        <div className="flex justify-center mb-6">
                            <img
                                src="/logo.png"
                                alt="Shyampuja Logo"
                                className="w-24 h-24 object-contain drop-shadow-lg"
                            />
                        </div>
                        <h1 className="text-3xl font-serif font-bold text-heritage-dark mb-2">Welcome Back</h1>
                        <p className="text-stone-500 font-sans">Sign in to your spiritual journey</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl flex items-center gap-2 animate-shake">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-stone-400 group-focus-within:text-sindoor transition-colors">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-4 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-marigold/50 focus:border-marigold transition-all font-medium text-heritage-dark placeholder:text-stone-400"
                                    placeholder="Email Address"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-stone-400 group-focus-within:text-sindoor transition-colors">
                                    <Lock className="w-5 h-5" />
                                </div>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-4 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-marigold/50 focus:border-marigold transition-all font-medium text-heritage-dark placeholder:text-stone-400"
                                    placeholder="Password"
                                />
                            </div>
                            <div className="flex justify-end">
                                <Link
                                    to="/forgot-password"
                                    className="text-xs font-bold text-sindoor hover:text-marigold transition-colors uppercase tracking-wide"
                                >
                                    Forgot Password?
                                </Link>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-linear-to-r from-sindoor to-marigold text-white py-4 rounded-xl font-bold shadow-lg hover:shadow-sindoor/30 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Signing in...</span>
                                </>
                            ) : (
                                <>
                                    <span>Sign In</span>
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>


                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-stone-500 text-sm">
                            Don't have an account?{" "}
                            <Link to="/signup" className="text-sindoor font-bold hover:text-marigold transition-colors">
                                Create Account
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
