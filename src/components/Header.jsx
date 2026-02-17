import React from 'react';
import { Share2, RotateCcw, Loader2, LogIn, LogOut, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = ({
    user,
    authLoading,
    pages,
    onShare,
    onReset,
    onLoginClick,
    onLogoutClick,
    ebookId
}) => {
    return (
        <header className="h-16 border-b border-neutral-800 bg-black/50 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-50">
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold italic shadow-[0_0_20px_rgba(37,99,235,0.4)] text-white">A</div>
                <span className="font-bold text-xl tracking-tight hidden sm:block text-white">Antigravity<span className="text-blue-500">Flip</span></span>
            </Link>

            <div className="flex items-center gap-3">
                {pages.length > 0 && (
                    <>
                        <button
                            onClick={onShare}
                            disabled={!ebookId}
                            className={`px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium transition-all ${ebookId
                                    ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/40'
                                    : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                                }`}
                        >
                            <Share2 size={16} /> {ebookId ? 'Share Link' : 'Uploading...'}
                        </button>
                        <button
                            onClick={onReset}
                            className="p-2 text-neutral-400 hover:text-white transition-colors"
                            title="Reset"
                        >
                            <RotateCcw size={20} />
                        </button>
                    </>
                )}

                <div className="h-6 w-px bg-neutral-800 mx-2" />

                {authLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin text-neutral-500" />
                ) : user ? (
                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-neutral-800/50 rounded-full border border-neutral-700 text-xs text-neutral-400">
                            <User size={12} />
                            <span className="max-w-[100px] truncate">{user.email}</span>
                        </div>
                        <button
                            onClick={onLogoutClick}
                            className="text-neutral-400 hover:text-red-400 transition-colors"
                            title="Logout"
                        >
                            <LogOut size={20} />
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={onLoginClick}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-full flex items-center gap-2 text-sm font-semibold shadow-lg shadow-blue-900/20 transition-all active:scale-95 text-white"
                    >
                        <LogIn size={16} /> Masuk
                    </button>
                )}
            </div>
        </header>
    );
};

export default Header;
