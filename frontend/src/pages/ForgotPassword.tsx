import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Layers, Loader2, Mail } from 'lucide-react';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // TODO: Implement password reset API call when backend is ready
            await new Promise((resolve) => setTimeout(resolve, 1500));
            setSent(true);
        } catch (err) {
            setError('Failed to send reset link. Please try again.');
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
                        {sent ? 'Check Your Email' : 'Forgot Password?'}
                    </h1>
                    <p className="text-gray-400 text-sm font-normal leading-normal pt-2 text-center max-w-xs">
                        {sent
                            ? `We've sent a password reset link to ${email}`
                            : "Enter your email and we'll send you a link to reset your password."}
                    </p>
                </div>

                {sent ? (
                    <div className="px-8 pb-10 pt-4 flex flex-col items-center gap-5">
                        <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center">
                            <Mail className="text-green-500 w-8 h-8" />
                        </div>
                        <Link
                            to="/login"
                            className="w-full bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg h-12 flex items-center justify-center transition-colors shadow-sm"
                        >
                            Back to Login
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="px-8 pb-10 pt-4 flex flex-col gap-5">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

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

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary-500 hover:bg-primary-600 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-medium rounded-lg h-12 flex items-center justify-center transition-colors shadow-sm mt-2"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send Reset Link'}
                        </button>

                        <Link
                            to="/login"
                            className="text-center text-gray-400 text-sm hover:text-primary-500 transition-colors"
                        >
                            ← Back to Login
                        </Link>
                    </form>
                )}
            </div>
        </div>
    );
}
