import { useState } from 'react';
import { PDFDocument } from 'pdfjs-dist';

function YourComponent() {
    const [pdfContent, setPdfContent] = useState('');

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = async (e) => {
            const contents = e.target.result;
            const pdf = await PDFDocument.load(contents);
            const pages = pdf.getPages();
            let extractedText = '';

            for (const page of pages) {
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map((item) => item.str).join(' ');
                extractedText += pageText;
            }

            setPdfContent(extractedText);
        };

        reader.readAsArrayBuffer(file);
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            <div>{pdfContent}</div>
        </div>
    );
}

export default YourComponent;