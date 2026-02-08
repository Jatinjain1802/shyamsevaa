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

                        <div className="relative flex items-center gap-4 my-2">
                            <div className="h-px bg-stone-200 flex-1"></div>
                            <span className="text-stone-400 text-xs font-bold uppercase tracking-wider">Or continue with</span>
                            <div className="h-px bg-stone-200 flex-1"></div>
                        </div>

                        <button
                            type="button"
                            onClick={() => alert("Please configure Google OAuth Client ID first. See instructions.")}
                            className="w-full bg-white text-stone-600 py-4 rounded-xl font-bold border border-stone-200 shadow-sm hover:shadow-md hover:bg-stone-50 transition-all duration-300 flex items-center justify-center gap-3"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            <span>Sign in with Google</span>
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
