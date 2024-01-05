import React from 'react';
import { Button } from 'react-bootstrap';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const GeneratePDF = ({ quotationData }) => {
    const handleGeneratePDF = () => {
        const input = document.getElementById('quotation-container');
        console.log(input)
        html2canvas(input).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF();
            pdf.addImage(imgData,'PNG',0,0,input.offsetWidth * 0.75,input.offsetHeight * 0.75);
            pdf.save(`Quotation_${quotationData.quotation_id}.pdf`);
        });
    };

    return (
        <div>
            <Button variant="secondary" onClick={handleGeneratePDF}>
                Generate PDF
            </Button>
        </div>
    );
};

export default GeneratePDF;
