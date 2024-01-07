const handleGeneratePDF = () => {
    const input = document.getElementById('quotation-container');

    html2canvas(input).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();

        // Add image to the PDF
        pdf.addImage(imgData, 'PNG', 0, 0, input.offsetWidth * 0.75, input.offsetHeight * 0.75);

        // Move to the last page
        pdf.setPage(pdf.internal.getNumberOfPages() + 1);

        // Add footer text
        const footerText = `
            Declaration: This is a computer-generated document. No signature is required.
            Bank Details: Your Bank Name, Account Number: XXXX-XXXX-XXXX, Branch: XXXX.
            Receiver Signature: ____________________________
            Authorized Signature: ____________________________
        `;

        // Set position for footer
        const footerHeight = 50; // Adjust as needed
        const pageHeight = pdf.internal.pageSize.getHeight();

        // Add footer text to the last page
        pdf.text(10, pageHeight - footerHeight - 10, footerText);

        // Save the PDF
        pdf.save(`Quotation_${quotationData.quotation_id}.pdf`);
    });
};
