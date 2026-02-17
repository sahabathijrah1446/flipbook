import React, { useCallback, useState } from 'react';
import { Upload, FileText, Image as ImageIcon, X } from 'lucide-react';

const FileUploader = ({ onFilesSelected }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [selectedFileName, setSelectedFileName] = useState(null);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const processFiles = (files) => {
        if (!files || files.length === 0) return;

        const fileList = Array.from(files);

        // Simple validation: check if it's all images or one PDF
        const isPDF = fileList.length === 1 && fileList[0].type === 'application/pdf';
        const areImages = fileList.every(file => file.type.startsWith('image/'));

        if (isPDF || areImages) {
            setSelectedFileName(fileList.length === 1 ? fileList[0].name : `${fileList.length} images selected`);
            onFilesSelected(fileList, isPDF ? 'pdf' : 'images');
        } else {
            alert('Mohon unggah hanya satu file PDF atau beberapa file gambar (JPG/PNG).');
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        processFiles(e.dataTransfer.files);
    };

    const handleFileInput = (e) => {
        processFiles(e.target.files);
    };

    const clearSelection = () => {
        setSelectedFileName(null);
        onFilesSelected(null, null);
    };

    return (
        <div className="w-full max-w-2xl mx-auto p-6">
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-2xl p-12 transition-all flex flex-col items-center justify-center text-center cursor-pointer
          ${isDragging
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-neutral-700 hover:border-neutral-500 bg-neutral-800/50'
                    }`}
            >
                <input
                    type="file"
                    id="fileInput"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleFileInput}
                    accept=".pdf,image/*"
                    multiple
                />

                <div className="bg-neutral-900 p-4 rounded-full mb-4 shadow-xl">
                    <Upload className={`w-8 h-8 ${isDragging ? 'text-blue-400 animate-bounce' : 'text-neutral-400'}`} />
                </div>

                {selectedFileName ? (
                    <div className="flex flex-col items-center">
                        <span className="text-lg font-medium text-white mb-2">{selectedFileName}</span>
                        <button
                            onClick={(e) => { e.stopPropagation(); clearSelection(); }}
                            className="text-sm text-red-400 hover:text-red-300 flex items-center gap-1"
                        >
                            <X size={14} /> Batalkan
                        </button>
                    </div>
                ) : (
                    <>
                        <h3 className="text-xl font-semibold text-white mb-2">Unggah PDF atau Gambar</h3>
                        <p className="text-neutral-400 text-sm mb-6">
                            Seret dan lepas file di sini atau klik untuk mencari
                        </p>
                        <div className="flex gap-4 text-xs text-neutral-500">
                            <span className="flex items-center gap-1"><FileText size={14} /> PDF Ebook</span>
                            <span className="flex items-center gap-1"><ImageIcon size={14} /> JPG/PNG Series</span>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default FileUploader;
