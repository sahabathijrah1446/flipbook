import React, { useState } from 'react';
import { Copy, Check, ExternalLink, X, Share2, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const ShareModal = ({ isOpen, onClose, ebookId, title }) => {
    const [copied, setCopied] = useState(false);

    if (!isOpen) return null;

    const shareUrl = `${window.location.origin}/v/${ebookId}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-neutral-900 border border-white/10 w-full max-w-lg rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-300 relative">
                {/* Background Glow */}
                <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-600/20 rounded-full blur-[80px]"></div>
                <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-600/20 rounded-full blur-[80px]"></div>

                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 text-neutral-500 hover:text-white transition-colors z-10"
                >
                    <X size={20} />
                </button>

                <div className="p-8 md:p-10 flex flex-col items-center text-center relative">
                    <div className="w-20 h-20 bg-blue-600/10 rounded-3xl flex items-center justify-center mb-6 border border-blue-500/20">
                        <Sparkles className="text-blue-500 w-10 h-10" />
                    </div>

                    <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Flipbook Siap Dibagikan!</h2>
                    <p className="text-neutral-400 mb-8 max-w-sm">
                        Ebook <span className="text-white font-medium">"{title}"</span> telah berhasil diunggah dan dikonversi ke format premium.
                    </p>

                    <div className="w-full space-y-4">
                        <div className="relative group">
                            <div className="absolute inset-0 bg-blue-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="relative flex items-center bg-black/40 border border-white/10 rounded-2xl p-2 pl-5">
                                <span className="text-neutral-500 text-sm truncate mr-4 flex-1 text-left">
                                    {shareUrl}
                                </span>
                                <button
                                    onClick={handleCopy}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all active:scale-95 ${copied
                                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                            : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/40'
                                        }`}
                                >
                                    {copied ? <Check size={16} /> : <Copy size={16} />}
                                    {copied ? 'Tersalin' : 'Salin Link'}
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Link
                                to={`/v/${ebookId}`}
                                target="_blank"
                                className="flex items-center justify-center gap-2 py-4 bg-neutral-800 hover:bg-neutral-700 text-white rounded-2xl font-semibold transition-all border border-white/5"
                            >
                                <ExternalLink size={18} /> Lihat Publik
                            </Link>
                            <button
                                onClick={onClose}
                                className="flex items-center justify-center gap-2 py-4 bg-white/5 hover:bg-white/10 text-neutral-300 rounded-2xl font-semibold transition-all border border-white/5"
                            >
                                Kembali ke Editor
                            </button>
                        </div>
                    </div>

                    <p className="mt-8 text-[11px] text-neutral-600 uppercase tracking-[0.2em]">
                        Digital Product by Antigravity Flip
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ShareModal;
