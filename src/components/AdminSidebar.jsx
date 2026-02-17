import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    BookOpen,
    Users,
    Settings,
    ChevronLeft,
    LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminSidebar = () => {
    const { signOut } = useAuth();

    return (
        <aside className="w-64 bg-[#161616] border-r border-white/5 flex flex-col h-screen fixed left-0 top-0 z-50">
            <div className="p-6 border-b border-white/5">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">
                        A
                    </div>
                    <div>
                        <h2 className="text-sm font-bold text-white leading-none">Admin Panel</h2>
                        <p className="text-[10px] text-neutral-500 mt-1 uppercase tracking-wider">Antigravity Flip</p>
                    </div>
                </div>
            </div>

            <nav className="flex-1 p-4 space-y-1">
                <NavLink
                    to="/admin"
                    end
                    className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-blue-600/10 text-blue-500' : 'text-neutral-400 hover:text-white hover:bg-white/5'}`}
                >
                    <LayoutDashboard size={20} />
                    <span className="text-sm font-medium">Dashboard</span>
                </NavLink>

                <NavLink
                    to="/admin/library"
                    className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-blue-600/10 text-blue-500' : 'text-neutral-400 hover:text-white hover:bg-white/5'}`}
                >
                    <BookOpen size={20} />
                    <span className="text-sm font-medium">Global Library</span>
                </NavLink>

                <NavLink
                    to="/admin/users"
                    className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-blue-600/10 text-blue-500' : 'text-neutral-400 hover:text-white hover:bg-white/5'}`}
                >
                    <Users size={20} />
                    <span className="text-sm font-medium">User Mgmt</span>
                </NavLink>

                <div className="pt-4 mt-4 border-t border-white/5">
                    <NavLink
                        to="/admin/settings"
                        className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-blue-600/10 text-blue-500' : 'text-neutral-400 hover:text-white hover:bg-white/5'}`}
                    >
                        <Settings size={20} />
                        <span className="text-sm font-medium">Settings</span>
                    </NavLink>
                </div>
            </nav>

            <div className="p-4 border-t border-white/5">
                <button
                    onClick={signOut}
                    className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-neutral-400 hover:text-red-400 hover:bg-red-400/5 transition-all"
                >
                    <LogOut size={20} />
                    <span className="text-sm font-medium">Keluar</span>
                </button>
            </div>
        </aside>
    );
};

export default AdminSidebar;
