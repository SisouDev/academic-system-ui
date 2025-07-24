import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const exportToPdf = async (elementId: string, fileName: string): Promise<void> => {
    const input = document.getElementById(elementId);
    if (!input) {
        console.error(`Elemento com id "${elementId}" não encontrado.`);
        return;
    }

    const elementsToHide = input.querySelectorAll<HTMLElement>('.no-print');
    elementsToHide.forEach(el => el.style.display = 'none');

    console.log("Iniciando captura do canvas...");

    await new Promise(resolve => requestAnimationFrame(resolve));

    try {
        const canvas = await html2canvas(input, {
            scale: 2.5,
            useCORS: true,
            logging: true,
            backgroundColor: '#ffffff',
        });

        console.log(`Canvas gerado com sucesso. Dimensões: ${canvas.width}x${canvas.height}`);

        const imgData = canvas.toDataURL('image/png', 1.0);
        const pdf = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'a4',
            compress: true,
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const canvasAspectRatio = canvas.width / canvas.height;

        let finalImgWidth = pdfWidth;
        let finalImgHeight = pdfWidth / canvasAspectRatio;

        if (finalImgHeight > pdfHeight) {
            finalImgHeight = pdfHeight;
            finalImgWidth = pdfHeight * canvasAspectRatio;
        }

        const offsetX = (pdfWidth - finalImgWidth) / 2;
        const offsetY = (pdfHeight - finalImgHeight) / 2;

        pdf.addImage(imgData, 'PNG', offsetX, offsetY, finalImgWidth, finalImgHeight);
        pdf.save(fileName);
        console.log("PDF salvo com sucesso.");

    } catch (error) {
        console.error("Erro ao gerar o PDF:", error);
    } finally {
        elementsToHide.forEach(el => el.style.display = '');
    }
};