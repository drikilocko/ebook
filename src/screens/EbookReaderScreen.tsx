import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Linking, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LocalizedText as Text } from '../context/LanguageContext';
import { Header } from '../components/Header';
import { EbookEditor } from '../components/EbookEditor';
import { useShop } from '../context/ShopContext';
import { downloadEbookJsonAsPdf } from '../lib/ebookPdf';
import { getErrorMessage } from '../lib/supabase';

export const EbookReaderScreen: React.FC = () => {
    const { selectedBook, selectedBookOrderId, getEbookUrl, navigateTo } = useShop();
    const [url, setUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(false);
    const ebookFormat = selectedBook?.ebookFormat
        ?? (selectedBook?.ebookStoragePath?.toLowerCase().endsWith('.json')
            ? 'json'
            : selectedBook?.ebookStoragePath?.toLowerCase().endsWith('.html')
                || selectedBook?.ebookStoragePath?.toLowerCase().endsWith('.htm')
                ? 'html'
                : 'pdf');

    useEffect(() => {
        let mounted = true;
        setUrl(null);
        setError(null);
        setLoading(true);
        if (!selectedBook || (!selectedBookOrderId && selectedBook.price !== 0)) {
            setError('Aucun livre sélectionné. Ouvrez un ebook depuis Mes livres.');
            setLoading(false);
            return () => { mounted = false; };
        }
        if (!selectedBook.ebookStoragePath) {
            setError('Le fichier de ce livre n’est pas encore disponible. Contactez le support.');
            setLoading(false);
            return () => { mounted = false; };
        }
        getEbookUrl(selectedBookOrderId, selectedBook.id)
            .then((signedUrl) => {
                if (mounted) setUrl(signedUrl);
            })
            .catch((readError: unknown) => {
                if (mounted) setError(getErrorMessage(readError));
            })
            .finally(() => {
                if (mounted) setLoading(false);
            });
        return () => { mounted = false; };
    }, [selectedBook, selectedBookOrderId, getEbookUrl]);

    const handleDownload = async () => {
        if (!selectedBook || !url || downloading || (!selectedBookOrderId && selectedBook.price !== 0)) return;
        setError(null);
        setDownloading(true);
        try {
            if (ebookFormat === 'json') {
                await downloadEbookJsonAsPdf(url, selectedBook.name);
                return;
            }

            const downloadUrl = await getEbookUrl(selectedBookOrderId, selectedBook.id, true);
            await Linking.openURL(downloadUrl);
        } catch (downloadError) {
            setError(getErrorMessage(downloadError));
        } finally {
            setDownloading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Header />
            <View style={styles.toolbar}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigateTo(selectedBookOrderId ? 'account' : 'shop')}
                >
                    <Feather name="arrow-left" size={17} color="#475569" />
                    <Text style={styles.backText}>{selectedBookOrderId ? 'Mes livres' : 'Boutique'}</Text>
                </TouchableOpacity>
                <Text style={styles.title} numberOfLines={1}>{selectedBook?.name || 'Lecture de l’ebook'}</Text>
                <TouchableOpacity
                    style={styles.downloadButton}
                    onPress={() => void handleDownload()}
                    disabled={downloading || loading || !url}
                    accessibilityState={{ disabled: downloading || loading || !url }}
                >
                    <Feather name="download" size={16} color="#ffffff" />
                    <Text style={styles.downloadText}>
                        {downloading ? 'PRÉPARATION…' : ebookFormat === 'json' ? 'TÉLÉCHARGER PDF' : 'TÉLÉCHARGER'}
                    </Text>
                </TouchableOpacity>
            </View>
            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color="#6d28d9" />
                    <Text style={styles.helper}>Ouverture de votre livre…</Text>
                </View>
            ) : error ? (
                <ScrollView contentContainerStyle={styles.center}>
                    <Feather name="alert-circle" size={34} color="#b91c1c" />
                    <Text style={styles.error}>{error}</Text>
                    <Text style={styles.helper}>Vérifiez que le fichier HTML, JSON ou PDF a bien été ajouté au bucket privé « ebooks ».</Text>
                </ScrollView>
            ) : url ? (
                <EbookEditor
                    sourceUrl={url}
                    title={selectedBook?.name}
                    format={ebookFormat}
                />
            ) : null}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc' },
    toolbar: { width: '100%', maxWidth: 1200, alignSelf: 'center', flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 18, paddingVertical: 12, backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
    backButton: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    backText: { color: '#475569', fontWeight: '700', fontSize: 13 },
    title: { flex: 1, minWidth: 80, color: '#0f172a', fontWeight: '800', fontSize: 14 },
    downloadButton: { flexDirection: 'row', alignItems: 'center', gap: 7, backgroundColor: '#6d28d9', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10 },
    downloadText: { color: '#ffffff', fontWeight: '900', fontSize: 10 },
    center: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: 28, gap: 12 },
    helper: { color: '#64748b', fontSize: 13, lineHeight: 20, textAlign: 'center', maxWidth: 420 },
    error: { color: '#b91c1c', fontSize: 15, fontWeight: '800', textAlign: 'center', lineHeight: 22 },
});
