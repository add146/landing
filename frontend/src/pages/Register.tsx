import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layers, Loader2, Check, X } from 'lucide-react';
import { authApi } from '../api/auth';
import { useAuthStore } from '../store/authStore';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const setAuth = useAuthStore((state) => state.setAuth);

    // Password strength validation
    const passwordChecks = {
        length: password.length >= 6,
        hasLetter: /[a-zA-Z]/.test(password),
        hasNumber: /\d/.test(password),
    };
    const passwordStrength = Object.values(passwordChecks).filter(Boolean).length;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!agreedToTerms) {
            setError('Please agree to the terms of service');
            return;
        }

        if (passwordStrength < 2) {
            setError('Password is too weak. Use at least 6 characters with letters and numbers.');
            return;
        }

        setLoading(true);

        try {
            const response = await authApi.register({ name, email, password });
            setAuth(response.user, response.token);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-950 p-4">
            <div className="w-full max-w-[480px] bg-gray-900 rounded-xl shadow-xl border border-gray-800 overflow-hidden">
                {/* Header */}
                <div className="flex flex-col items-center pt-10 px-8 pb-2">
                    <div className="w-12 h-12 bg-primary-500/10 rounded-lg flex items-center justify-center mb-4">
                        <Layers className="text-primary-500 w-7 h-7" />
                    </div>
                    <h1 className="text-white tracking-tight text-[28px] font-bold leading-tight text-center">
                        Create Account
                    </h1>
                    <p className="text-gray-400 text-sm font-normal leading-normal pt-2 text-center max-w-xs">
                        Start building beautiful landing pages today.
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="px-8 pb-10 pt-4 flex flex-col gap-5">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <label className="flex flex-col gap-1.5">
                        <span className="text-white text-sm font-medium leading-normal">Full Name</span>
                        <input
                            className="w-full rounded-lg border border-gray-700 bg-gray-800 text-white placeholder:text-gray-500 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 h-12 px-4 text-sm transition-colors"
                            placeholder="John Doe"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </label>

                    <label className="flex flex-col gap-1.5">
                        <span className="text-white text-sm font-medium leading-normal">Email Address</span>
                        <input
                            className="w-full rounded-lg border border-gray-700 bg-gray-800 text-white placeholder:text-gray-500 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 h-12 px-4 text-sm transition-colors"
                            placeholder="name@company.com"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </label>

                    <label className="flex flex-col gap-1.5">
                        <span className="text-white text-sm font-medium leading-normal">Password</span>
                        <input
                            className="w-full rounded-lg border border-gray-700 bg-gray-800 text-white placeholder:text-gray-500 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 h-12 px-4 text-sm transition-colors"
                            placeholder="••••••••"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        {/* Password Strength Indicator */}
                        {password && (
                            <div className="space-y-2 mt-2">
                                <div className="flex gap-1">
                                    <div className={`h-1.5 flex-1 rounded ${passwordStrength >= 1 ? 'bg-red-500' : 'bg-gray-700'}`} />
                                    <div className={`h-1.5 flex-1 rounded ${passwordStrength >= 2 ? 'bg-yellow-500' : 'bg-gray-700'}`} />
                                    <div className={`h-1.5 flex-1 rounded ${passwordStrength >= 3 ? 'bg-green-500' : 'bg-gray-700'}`} />
                                </div>
                                <div className="text-xs space-y-1">
                                    <div className="flex items-center gap-2">
                                        {passwordChecks.length ? (
                                            <Check className="w-3 h-3 text-green-500" />
                                        ) : (
                                            <X className="w-3 h-3 text-gray-500" />
                                        )}
                                        <span className={passwordChecks.length ? 'text-green-500' : 'text-gray-500'}>
                                            At least 6 characters
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {passwordChecks.hasLetter ? (
                                            <Check className="w-3 h-3 text-green-500" />
                                        ) : (
                                            <X className="w-3 h-3 text-gray-500" />
                                        )}
                                        <span className={passwordChecks.hasLetter ? 'text-green-500' : 'text-gray-500'}>
                                            Contains letters
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {passwordChecks.hasNumber ? (
                                            <Check className="w-3 h-3 text-green-500" />
                                        ) : (
                                            <X className="w-3 h-3 text-gray-500" />
                                        )}
                                        <span className={passwordChecks.hasNumber ? 'text-green-500' : 'text-gray-500'}>
                                            Contains numbers
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </label>

                    <label className="flex items-start gap-2 cursor-pointer select-none">
                        <input
                            className="text-primary-500 rounded border-gray-700 bg-gray-800 focus:ring-primary-500 w-4 h-4 mt-0.5 transition-colors cursor-pointer"
                            type="checkbox"
                            checked={agreedToTerms}
                            onChange={(e) => setAgreedToTerms(e.target.checked)}
                        />
                        <span className="text-sm text-gray-300">
                            I agree to the{' '}
                            <Link to="/terms" className="text-primary-500 hover:underline">
                                Terms of Service
                            </Link>{' '}
                            and{' '}
                            <Link to="/privacy" className="text-primary-500 hover:underline">
                                Privacy Policy
                            </Link>
                        </span>
                    </label>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary-500 hover:bg-primary-600 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-medium rounded-lg h-12 flex items-center justify-center transition-colors shadow-sm mt-2"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
                    </button>
                </form>

                {/* Footer */}
                <div className="bg-gray-800/50 px-8 py-4 border-t border-gray-800 flex justify-center items-center">
                    <p className="text-gray-400 text-sm">
                        Already have an account?
                        <Link to="/login" className="text-primary-500 font-medium hover:underline ml-1">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
