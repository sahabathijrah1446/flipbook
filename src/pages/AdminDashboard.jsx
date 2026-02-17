import React, { useEffect, useState } from 'react';
import {
    Users,
    BookOpen,
    Eye,
    ArrowUpRight,
    Search,
    Filter
} from 'lucide-react';
import { EbookService } from '../services/ebookService';
import { supabase } from '../lib/supabase';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalBooks: 0,
        totalUsers: 0,
        totalViews: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Fetch total books
                const { count: booksCount } = await supabase
                    .from('ebooks')
                    .select('*', { count: 'exact', head: true });

                // Fetch total users (from profiles)
                const { count: usersCount } = await supabase
                    .from('profiles')
                    .select('*', { count: 'exact', head: true });

                setStats({
                    totalBooks: booksCount || 0,
                    totalUsers: usersCount || 0,
                    totalViews: 452 // Mock for now until we add views column
                });
            } catch (err) {
                console.error('Error fetching admin stats:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const StatCard = ({ title, value, icon: Icon, trend }) => (
        <div className="bg-[#161616] p-6 rounded-2xl border border-white/5 relative overflow-hidden group">
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-white/5 rounded-xl group-hover:bg-blue-600/10 transition-colors">
                    <Icon className="text-neutral-400 group-hover:text-blue-500 transition-colors" size={24} />
                </div>
                {trend && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">
                        <ArrowUpRight size={12} /> {trend}
                    </span>
                )}
            </div>
            <div>
                <p className="text-sm font-medium text-neutral-500">{title}</p>
                <h3 className="text-2xl font-bold text-white mt-1">
                    {loading ? '...' : value.toLocaleString()}
                </h3>
            </div>
            <div className="absolute -right-2 -bottom-2 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
                <Icon size={120} />
            </div>
        </div>
    );

    return (
        <div className="p-8">
            <header className="mb-10">
                <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
                <p className="text-neutral-500 mt-2">Selamat datang kembali di pusat kendali Antigravity Flip.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <StatCard title="Total Ebooks" value={stats.totalBooks} icon={BookOpen} trend="+12%" />
                <StatCard title="Total Users" value={stats.totalUsers} icon={Users} trend="+5%" />
                <StatCard title="Total Page Views" value={stats.totalViews} icon={Eye} trend="+40%" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-[#161616] rounded-2xl border border-white/5 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold text-white">Recent Ebooks</h2>
                        <button className="text-xs text-blue-500 hover:text-blue-400 font-medium">Lihat Semua</button>
                    </div>
                    <div className="space-y-4">
                        <p className="text-sm text-neutral-500 italic">Data aktivitas terbaru akan muncul di sini.</p>
                    </div>
                </div>

                <div className="bg-[#161616] rounded-2xl border border-white/5 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold text-white">System Status</h2>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                            <span className="text-sm text-neutral-400">Supabase Connection</span>
                            <span className="flex items-center gap-2 text-xs font-bold text-emerald-500 uppercase">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" /> Online
                            </span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                            <span className="text-sm text-neutral-400">PDF Generator Engine</span>
                            <span className="flex items-center gap-2 text-xs font-bold text-emerald-500 uppercase">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" /> Ready
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
