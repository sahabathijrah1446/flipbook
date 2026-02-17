import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { EbookService } from '../services/ebookService';
import FlipbookViewer from '../components/FlipbookViewer';
import PDFRenderer from '../components/PDFRenderer';
import { ChevronLeft, ChevronRight, Loader2, Home, ExternalLink } from 'lucide-react';


const ViewFlipbook = () => {
    const { id } = useParams();
    const [ebook, setEbook] = useState(null);
    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const flipbookRef = useRef(null);

    useEffect(() => {
        const fetchEbook = async () => {
            try {
                const data = await EbookService.getEbookById(id);
                setEbook(data);

                const publicUrl = EbookService.getPublicUrl(data.file_path);

                if (data.type === 'pdf') {
                    // Start with just the PDF public URL, then PDFRenderer will fill it
                    setPages([publicUrl]);
                } else {
                    // Convert storage paths back to public URLs
                    if (data.pages && data.pages.length > 0) {
                        const urls = data.pages.map(path => EbookService.getPublicUrl(path));
                        setPages(urls);
                    } else {
                        setPages([publicUrl]);
                    }
                }
            } catch (err) {
                setError('Ebook tidak ditemukan atau terjadi kesalahan.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchEbook();
    }, [id]);

    const handlePDFProcessingComplete = (renderedPages) => {
        setPages(renderedPages);
    };


    if (loading) {
        return (
            <div className="min-h-screen bg-[#0f0f0f] flex flex-col items-center justify-center gap-4 text-white">
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
                <p className="text-neutral-400">Menyiapkan ebook...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#0f0f0f] flex flex-col items-center justify-center gap-6 text-white text-center p-6">
                <div className="text-6xl text-neutral-700">:(</div>
                <h1 className="text-2xl font-bold">{error}</h1>
                <Link to="/" className="px-6 py-2 bg-blue-600 rounded-full flex items-center gap-2 hover:bg-blue-500 transition-all">
                    <Home size={18} /> Kembali ke Beranda
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0f0f0f] flex flex-col items-center justify-center p-4">
            {/* Mini Header */}
            <div className="fixed top-0 left-0 right-0 h-14 bg-black/30 backdrop-blur-md flex items-center justify-between px-6 border-b border-white/5 z-50">
                <h1 className="text-sm font-medium text-neutral-400 truncate max-w-[200px] sm:max-w-md">
                    {ebook?.title}
                </h1>
                <div className="flex items-center gap-4">
                    <Link to="/" className="text-xs text-neutral-500 hover:text-white transition-colors flex items-center gap-1">
                        Buat milikmu <ExternalLink size={12} />
                    </Link>
                </div>
            </div>

            <FlipbookViewer pages={pages} ref={flipbookRef} />

            {ebook?.type === 'pdf' && pages.length === 1 && (
                <div className="hidden">
                    <PDFRenderer
                        file={pages[0]}
                        onProcessingComplete={handlePDFProcessingComplete}
                        onProcessingError={(err) => console.error(err)}
                    />
                </div>
            )}

            {/* Controls */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-6 bg-black/60 backdrop-blur-xl border border-white/10 px-8 py-4 rounded-full shadow-2xl z-50">
                <button
                    onClick={() => flipbookRef.current?.prevPage()}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors text-white"
                >
                    <ChevronLeft size={24} />
                </button>

                <div className="text-sm font-medium text-neutral-400">
                    {pages.length} Halaman
                </div>

                <button
                    onClick={() => flipbookRef.current?.nextPage()}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors text-white"
                >
                    <ChevronRight size={24} />
                </button>
            </div>
        </div>
    );
};

export default ViewFlipbook;
