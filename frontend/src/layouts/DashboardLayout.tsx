import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    FileText,
    Image,
    Settings,
    LogOut,
    Menu,
    X,
    CreditCard,
    Wand2
} from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '../store/authStore';

const navigation = [
    { name: 'My Websites', href: '/dashboard', icon: LayoutDashboard },
    { name: 'vCards', href: '/dashboard/vcards', icon: CreditCard },
    { name: 'Media Library', href: '/dashboard/media', icon: Image },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export default function DashboardLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile sidebar backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-gray-900/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white text-slate-900 border-r border-slate-200 transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:fixed lg:z-30
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center justify-between h-16 px-4 border-b border-slate-200">
                        <Link to="/dashboard" className="flex items-center space-x-2">
                            <FileText className="w-8 h-8 text-blue-600" />
                            <span className="text-xl font-bold text-slate-900">PageBuilder</span>
                        </Link>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden text-slate-500 hover:text-slate-900"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
                        {/* AI Wizard - Prominent CTA */}
                        <Link
                            to="/dashboard/ai-wizard"
                            className="flex items-center px-3 py-3 mb-4 text-sm font-medium rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
                        >
                            <Wand2 className="w-5 h-5 mr-3" />
                            <span className="flex-1">AI Website Wizard</span>
                            <span className="px-2 py-0.5 text-xs bg-white/20 rounded-full">
                                New
                            </span>
                        </Link>

                        {navigation.map((item) => {
                            const isActive = location.pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className={`
                    flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors
                    ${isActive
                                            ? 'bg-blue-50 text-blue-600'
                                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                        }
                  `}
                                >
                                    <item.icon className={`w-5 h-5 mr-3 ${isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-500'}`} />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User section */}
                    <div className="border-t border-slate-200 p-4">
                        <div className="flex items-center mb-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold border border-blue-200">
                                {user?.name?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div className="ml-3 flex-1 min-w-0">
                                <p className="text-sm font-medium text-slate-900 truncate">
                                    {user?.name || 'User'}
                                </p>
                                <p className="text-xs text-slate-500 truncate">
                                    {user?.email || ''}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-red-600 rounded-lg transition-colors"
                        >
                            <LogOut className="w-5 h-5 mr-3" />
                            Logout
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <div className="lg:pl-64">
                {/* Mobile header */}
                <header className="lg:hidden sticky top-0 z-30 bg-white border-b border-slate-200">
                    <div className="flex items-center justify-between h-16 px-4">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="text-slate-500 hover:text-slate-700"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <Link to="/dashboard" className="flex items-center space-x-2">
                            <FileText className="w-6 h-6 text-blue-600" />
                            <span className="text-lg font-bold text-slate-900">PageBuilder</span>
                        </Link>
                        <div className="w-6" /> {/* Spacer for centering */}
                    </div>
                </header>

                {/* Page content */}
                <main className="p-4 lg:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
