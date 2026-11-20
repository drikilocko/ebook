import { Platform } from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { renderEbookJsonDocument } from './ebookJson';

const printHtmlOnWeb = (html: string): Promise<void> => new Promise((resolve, reject) => {
    const frame = document.createElement('iframe');
    frame.setAttribute('title', 'Prévisualisation PDF');
    frame.style.position = 'fixed';
    frame.style.width = '1px';
    frame.style.height = '1px';
    frame.style.right = '0';
    frame.style.bottom = '0';
    frame.style.border = '0';
    frame.style.opacity = '0';

    frame.onload = () => {
        const printWindow = frame.contentWindow;
        if (!printWindow) {
            frame.remove();
            reject(new Error('Impossible de préparer le PDF.'));
            return;
        }
        printWindow.addEventListener('afterprint', () => frame.remove(), { once: true });
        try {
            printWindow.focus();
            printWindow.print();
            resolve();
        } catch (printError) {
            frame.remove();
            reject(printError);
        }
    };
    frame.onerror = () => {
        frame.remove();
        reject(new Error('Impossible de charger le document pour l’impression.'));
    };
    frame.srcdoc = html;
    document.body.appendChild(frame);
});

export const downloadEbookJsonAsPdf = async (url: string, title: string): Promise<void> => {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Impossible de charger le livre (HTTP ${response.status}).`);
    const html = renderEbookJsonDocument(await response.json());

    if (Platform.OS === 'web') {
        await printHtmlOnWeb(html);
        return;
    }

    if (!await Sharing.isAvailableAsync()) {
        throw new Error('Le partage de fichiers PDF n’est pas disponible sur cet appareil.');
    }
    const pdf = await Print.printToFileAsync({ html });
    await Sharing.shareAsync(pdf.uri, {
        dialogTitle: `Télécharger ${title}`,
        mimeType: 'application/pdf',
        UTI: 'com.adobe.pdf',
    });
};
