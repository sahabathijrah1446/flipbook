import React from 'react';
import FileUploader from '../components/FileUploader';
import FlipbookViewer from '../components/FlipbookViewer';
import PDFRenderer from '../components/PDFRenderer';

const LandingPage = ({
    pages,
    orientation,
    isProcessing,
    pdfFile,
    handleFilesSelected,
    handlePDFProcessingComplete,
    handleReset,
    flipbookRef
}) => {
    return (
        <main className="flex-1 flex flex-col items-center justify-center p-4 relative">
            {!isProcessing && pages.length === 0 && (
                <div className="max-w-4xl w-full text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="space-y-4">
                        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tighter bg-gradient-to-b from-white to-neutral-500 bg-clip-text text-transparent">
                            Ubah PDF Menjadi <br /> Pengalaman 3D.
                        </h1>
                        <p className="text-neutral-400 text-lg sm:text-xl max-w-2xl mx-auto">
                            Platform premium untuk membagikan ebook dan dokumen Anda. Cukup upload, dapatkan link, dan bagikan ke audiens Anda.
                        </p>
                    </div>

                    <FileUploader onFilesSelected={handleFilesSelected} />
                </div>
            )}

            {isProcessing && (
                <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-blue-500">PDF</div>
                    </div>
                    <p className="text-neutral-400 animate-pulse font-medium">Memproses dokumen premium Anda...</p>
                </div>
            )}

            {pages.length > 0 && (
                <div className="w-full flex flex-col items-center animate-in zoom-in-95 duration-500">
                    <FlipbookViewer pages={pages} ref={flipbookRef} orientation={orientation} />
                </div>
            )}

            {pdfFile && (
                <PDFRenderer
                    file={pdfFile}
                    onProcessingComplete={handlePDFProcessingComplete}
                    onProcessingError={(err) => {
                        console.error(err);
                        alert('Gagal memproses PDF. Pastikan file valid.');
                        handleReset();
                    }}
                />
            )}
        </main>
    );
};

export default LandingPage;
