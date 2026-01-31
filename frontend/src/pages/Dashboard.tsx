import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { authApi } from '../api/auth';
import { LogOut, User } from 'lucide-react';

export default function Dashboard() {
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();

    const handleLogout = async () => {
        try {
            await authApi.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            logout();
            navigate('/login');
        }
    };

    return (
        <div className="min-h-screen bg-gray-950">
            {/* Header */}
            <header className="bg-gray-900 border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <h1 className="text-2xl font-bold gradient-text">Landing Page Builder</h1>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="glass-effect rounded-xl p-8 max-w-2xl">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-primary-500/10 rounded-full flex items-center justify-center">
                            <User className="w-8 h-8 text-primary-500" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">Welcome, {user?.name}!</h2>
                            <p className="text-gray-400">{user?.email}</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-gray-800/50 rounded-lg p-4">
                            <h3 className="text-white font-semibold mb-2">Getting Started</h3>
                            <p className="text-gray-400 text-sm">
                                This is your dashboard. The website builder features will be available in Phase 3 of development.
                            </p>
                        </div>

                        <div className="bg-green-500/10 border border-green-500/50 rounded-lg p-4">
                            <h3 className="text-green-400 font-semibold mb-2">✓ Phase 1 Complete</h3>
                            <p className="text-gray-400 text-sm">
                                Authentication system is now working! You can register, login, and logout.
                            </p>
                        </div>

                        <div className="bg-blue-500/10 border border-blue-500/50 rounded-lg p-4">
                            <h3 className="text-blue-400 font-semibold mb-2">Next: Phase 2 & 3</h3>
                            <ul className="text-gray-400 text-sm space-y-1 list-disc list-inside">
                                <li>Core Backend APIs (Websites, Pages, Sections)</li>
                                <li>Page Editor with Drag & Drop</li>
                                <li>Website Publishing</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
