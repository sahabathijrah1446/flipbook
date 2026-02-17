import React, { useEffect, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

// Standard worker setup for Vite
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const PDFRenderer = ({ file, onProcessingComplete, onProcessingError }) => {
    const [numPages, setNumPages] = useState(null);
    const [renderedPages, setRenderedPages] = useState([]);
    const [isProcessing, setIsProcessing] = useState(true);

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
        setRenderedPages([]);
    };

    const handlePageRenderSuccess = async (page) => {
        // Detect orientation from the first page
        if (page.pageNumber === 1) {
            const orientation = page.width > page.height ? 'landscape' : 'portrait';
            // Store orientation for later use in onProcessingComplete
            setOrientation(orientation);
        }

        // Each page is rendered to a canvas by react-pdf.
        const canvas = document.querySelector(`.pdf-page-${page.pageNumber} canvas`);
        if (canvas) {
            const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
            setRenderedPages(prev => {
                const newPages = [...prev];
                newPages[page.pageNumber - 1] = dataUrl;
                return newPages;
            });
        }
    };

    const [orientation, setOrientation] = useState('portrait');

    useEffect(() => {
        if (numPages && renderedPages.length === numPages) {
            setIsProcessing(false);
            onProcessingComplete(renderedPages, orientation);
        }
    }, [renderedPages, numPages, onProcessingComplete, orientation]);


    return (
        <div className="hidden">
            <Document
                file={file}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={onProcessingError}
            >
                {numPages && Array.from(new Array(numPages), (el, index) => (
                    <Page
                        key={`page_${index + 1}`}
                        pageNumber={index + 1}
                        onRenderSuccess={handlePageRenderSuccess}
                        className={`pdf-page-${index + 1}`}
                        width={800} // High enough resolution for clear reading
                    />
                ))}
            </Document>
        </div>
    );
};

export default PDFRenderer;
