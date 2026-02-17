import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import HTMLFlipBook from 'react-pageflip';

const Page = forwardRef((props, ref) => {
    return (
        <div className="bg-white shadow-2xl overflow-hidden" ref={ref} data-density="hard">
            <div className="w-full h-full relative">
                {props.children}
                {/* Subtle page gradient/fold effect */}
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-black/5 via-transparent to-transparent"></div>
            </div>
        </div>
    );
});

const FlipbookViewer = forwardRef(({ pages, orientation = 'portrait' }, ref) => {
    const flipBook = useRef(null);

    // Dynamic dimensions based on orientation
    const isLandscape = orientation === 'landscape';
    const bookWidth = isLandscape ? 700 : 500;
    const bookHeight = isLandscape ? 500 : 700;

    useImperativeHandle(ref, () => ({
        nextPage: () => flipBook.current.pageFlip().flipNext(),
        prevPage: () => flipBook.current.pageFlip().flipPrev(),
        getPageCount: () => flipBook.current.pageFlip().getPageCount(),
        getCurrentPage: () => flipBook.current.pageFlip().getCurrentPageIndex(),
    }));

    if (!pages || pages.length === 0) {
        return (
            <div className="flex items-center justify-center bg-neutral-800 rounded-xl border border-neutral-700 aspect-[4/3] w-full max-w-4xl mx-auto">
                <p className="text-neutral-500 italic">Antigravity Flipbook Viewer</p>
            </div>
        );
    }

    return (
        <div className="flex justify-center items-center py-5 sm:py-10 overflow-hidden w-full min-h-[400px] sm:min-h-[600px]">
            <HTMLFlipBook
                width={bookWidth}
                height={bookHeight}
                size="stretch"
                minWidth={280}
                maxWidth={isLandscape ? 1400 : 1000}
                minHeight={350}
                maxHeight={isLandscape ? 900 : 1533}
                maxShadowOpacity={0.5}
                showCover={!isLandscape}
                mobileScrollSupport={true}
                className="shadow-2xl"
                ref={flipBook}
                usePortrait={false}
                startPage={0}
                drawShadow={true}
                flippingTime={1000}
                useMouseEvents={true}
                clickEventForward={true}
            >


                {pages.map((page, index) => (
                    <Page key={index} number={index + 1}>
                        <div className="w-full h-full flex items-center justify-center p-0">
                            {typeof page === 'string' ? (
                                <img
                                    src={page}
                                    alt={`Page ${index + 1}`}
                                    className="w-full h-full object-contain pointer-events-none select-none"
                                />
                            ) : (
                                page
                            )}
                        </div>
                    </Page>
                ))}
            </HTMLFlipBook>
        </div>
    );
});

export default FlipbookViewer;
