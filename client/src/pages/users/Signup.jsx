import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../utils/axios";
import { ArrowRight, Lock, Mail, Loader2, User, Phone, Sparkles } from "lucide-react";

export default function Signup() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        mobile: "",
        password: "",
        role: "user" // Default role
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

        if (!formData.name || !formData.email || !formData.mobile || !formData.password) {
            setError("Please fill in all fields");
            setLoading(false);
            return;
        }

        try {
            const response = await api.post("/auth/register", formData);
            if (response.data.success) {
                // Assuming successful registration redirects to login or auto-login
                // For simplicity, let's redirect to login with a success message (or auto-navigate if handled)
                // Actually, let's just navigate to login so they can verify and login properly.
                // Or auto-login if the API returns a token (it doesn't in the snippet I saw, just success).
                // API snippet: returns { success: true, message: "User registered successfully", userId }
                navigate("/login", { state: { message: "Account created successfully! Please log in." } });
            }
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
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
            <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-marigold/20 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-sindoor/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="w-full max-w-md bg-white/90 backdrop-blur-md rounded-[2.5rem] shadow-2xl border border-white/50 relative z-10 overflow-hidden">
                <div className="h-2 bg-linear-to-r from-sindoor via-marigold to-sindoor"></div>

                <div className="p-8 md:p-12">
                    <div className="text-center mb-8">
                        <div className="flex justify-center mb-6">
                            <img
                                src="/logo.png"
                                alt="Shyampuja Logo"
                                className="w-20 h-20 object-contain drop-shadow-lg"
                            />
                        </div>
                        <h1 className="text-3xl font-serif font-bold text-heritage-dark mb-2">Create Account</h1>
                        <p className="text-stone-500 font-sans">Join our spiritual community</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl flex items-center gap-2 animate-shake">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-stone-400 group-focus-within:text-sindoor transition-colors">
                                    <User className="w-5 h-5" />
                                </div>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-4 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-marigold/50 focus:border-marigold transition-all font-medium text-heritage-dark placeholder:text-stone-400"
                                    placeholder="Full Name"
                                />
                            </div>
                        </div>

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
                                    <Phone className="w-5 h-5" />
                                </div>
                                <input
                                    type="tel"
                                    name="mobile"
                                    value={formData.mobile}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-4 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-marigold/50 focus:border-marigold transition-all font-medium text-heritage-dark placeholder:text-stone-400"
                                    placeholder="Mobile Number"
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
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-linear-to-r from-sindoor to-marigold text-white py-4 rounded-xl font-bold shadow-lg hover:shadow-sindoor/30 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Creating Account...</span>
                                </>
                            ) : (
                                <>
                                    <span>Sign Up</span>
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-stone-500 text-sm">
                            Already have an account?{" "}
                            <Link to="/login" className="text-sindoor font-bold hover:text-marigold transition-colors">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
