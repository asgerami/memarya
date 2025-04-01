'use client'

import { File } from 'lucide-react';
import React, { useState } from 'react';

const PdfViewer = ({ fileurl }) => {
    const [isLoading, setIsLoading] = useState(true);

    const handlePdfLoad = () => {
        setIsLoading(false);
    };

    return (
        <div className="relative">
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-200">
                    <div className="animate-pulse "><File/></div>
                </div>
            )}
            <iframe
                src={fileurl + "#toolbar=0"}
                height="90vh"
                width="100%"
                className="h-[90vh]"
                onLoad={handlePdfLoad} // Trigger when the PDF is loaded
                title="PDF Viewer"
            />
        </div>
    );
}

export default PdfViewer;