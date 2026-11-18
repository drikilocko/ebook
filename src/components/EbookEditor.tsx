import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import { Feather } from '@expo/vector-icons';
import { LocalizedText as Text } from '../context/LanguageContext';
import { createEbookReaderScript, EbookHeading, EbookTocGroup, groupEbookHeadings } from '../lib/ebookReader';
import { buildEbookJsonNavigation, renderEbookJsonDocument } from '../lib/ebookJson';

interface EbookEditorProps {
    sourceUrl: string;
    format: 'html' | 'pdf' | 'json';
}

export const EbookEditor: React.FC<EbookEditorProps> = ({ sourceUrl, format }) => {
    const [groups, setGroups] = useState<EbookTocGroup[]>([]);
    const [jsonGroups, setJsonGroups] = useState<EbookTocGroup[]>([]);
    const [activeHeadingId, setActiveHeadingId] = useState<string | null>(null);
    const [jsonHtml, setJsonHtml] = useState<string | null>(null);
    const compactLayout = useWindowDimensions().width < 760;
    const injectedJavaScript = useMemo(
        () => (format === 'html' ? createEbookReaderScript() : undefined),
        [format],
    );

    React.useEffect(() => {
        if (format !== 'json') {
            setJsonHtml(null);
            setJsonGroups([]);
            return;
        }

        let cancelled = false;
        fetch(sourceUrl)
            .then((response) => { if (!response.ok) throw new Error('Impossible de charger le fichier JSON.'); return response.json(); })
            .then((payload: unknown) => {
                if (!cancelled) {
                    setJsonHtml(renderEbookJsonDocument(payload));
                    setJsonGroups(buildEbookJsonNavigation(payload));
                }
            })
            .catch(() => {
                if (!cancelled) setJsonHtml(renderEbookJsonDocument({ title: 'Document', text: 'Le contenu JSON ne peut pas être lu.' }));
            });

        return () => { cancelled = true; };
    }, [format, sourceUrl]);

    const handleMessage = (event: WebViewMessageEvent) => {
        if (format !== 'html') return;
        try {
            const message: unknown = JSON.parse(event.nativeEvent.data);
            if (
                typeof message !== 'object'
                || message === null
                || !('type' in message)
                || message.type !== 'ebook-toc'
                || !('headings' in message)
                || !Array.isArray(message.headings)
            ) return;
            const headings = message.headings.filter((item): item is EbookHeading => (
                typeof item === 'object'
                && item !== null
                && 'id' in item && typeof item.id === 'string'
                && /^ebook-heading-\d+$/.test(item.id)
                && 'title' in item && typeof item.title === 'string'
                && 'level' in item && typeof item.level === 'number' && item.level >= 1 && item.level <= 3
            ));
            setGroups(groupEbookHeadings(headings));
        } catch {
            setGroups([]);
        }
    };

    const jumpToHeading = (id: string) => {
        setActiveHeadingId(id);
        const script = `var heading=document.getElementById("${id}")||document.querySelector('[data-ebook-reader-id="${id}"]');if(heading){heading.scrollIntoView({behavior:'smooth',block:'start'});}true;`;
        webViewRef.current?.injectJavaScript(script);
    };

    const webViewRef = React.useRef<WebView>(null);
    const navigationGroups = format === 'json' ? jsonGroups : groups;

    return (
        <View style={[styles.layout, compactLayout && styles.compactLayout]}>
            {navigationGroups.length > 0 ? (
                <View style={[styles.toc, compactLayout && styles.compactToc]}>
                    <View style={styles.tocHeader}>
                        <Feather name="list" size={16} color="#6d28d9" />
                        <Text style={styles.tocTitle}>{format === 'json' ? 'Sommaire' : 'Tomes et chapitres'}</Text>
                    </View>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {navigationGroups.map((group) => (
                            <View key={group.id} style={styles.tocGroup}>
                                <TouchableOpacity
                                    style={[styles.tomeButton, activeHeadingId === group.id && styles.activeItem]}
                                    onPress={() => jumpToHeading(group.id)}
                                >
                                    <Text style={styles.tomeText} numberOfLines={2}>{group.title}</Text>
                                    {group.page ? <Text style={styles.pageReference}>p. {group.page}</Text> : null}
                                </TouchableOpacity>
                                {group.chapters.map((chapter) => (
                                    <TouchableOpacity
                                        key={chapter.id}
                                        style={[
                                            styles.chapterButton,
                                            chapter.level === 3 && styles.subChapterButton,
                                            activeHeadingId === chapter.id && styles.activeItem,
                                        ]}
                                        onPress={() => jumpToHeading(chapter.id)}
                                    >
                                        <Text style={styles.chapterText} numberOfLines={3}>{chapter.title}</Text>
                                        {chapter.page ? <Text style={styles.pageReference}>p. {chapter.page}</Text> : null}
                                    </TouchableOpacity>
                                ))}
                            </View>
                        ))}
                    </ScrollView>
                </View>
            ) : null}
            {format === 'json' ? (
                <WebView
                    ref={webViewRef}
                    key={`${format}:${sourceUrl}`}
                    source={{ html: jsonHtml || '<html><body><p>Chargement…</p></body></html>' }}
                    style={styles.reader}
                    originWhitelist={['*']}
                    startInLoadingState
                />
            ) : (
                <WebView
                    ref={webViewRef}
                    key={`${format}:${sourceUrl}`}
                    source={{ uri: sourceUrl }}
                    style={styles.reader}
                    injectedJavaScript={injectedJavaScript}
                    onMessage={handleMessage}
                    originWhitelist={['*']}
                    startInLoadingState
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    layout: { flex: 1, flexDirection: 'row', minHeight: 0, backgroundColor: '#f1f5f9' },
    compactLayout: { flexDirection: 'column' },
    toc: { width: 270, flexShrink: 0, backgroundColor: '#ffffff', borderRightWidth: 1, borderRightColor: '#e2e8f0' },
    compactToc: { width: '100%', maxHeight: 210, borderRightWidth: 0, borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
    tocHeader: { minHeight: 54, flexDirection: 'row', alignItems: 'center', gap: 9, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
    tocTitle: { color: '#172033', fontSize: 13, fontWeight: '800' },
    tocGroup: { paddingHorizontal: 10, paddingTop: 10 },
    tomeButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 6, paddingHorizontal: 9, paddingVertical: 10, borderRadius: 9 },
    tomeText: { color: '#172033', fontSize: 12, fontWeight: '800', lineHeight: 18 },
    chapterButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 6, marginLeft: 8, paddingHorizontal: 10, paddingVertical: 8, borderRadius: 8 },
    subChapterButton: { marginLeft: 18 },
    chapterText: { color: '#64748b', fontSize: 12, lineHeight: 17 },
    pageReference: { color: '#7c3aed', fontSize: 10, fontWeight: '800' },
    activeItem: { backgroundColor: '#f3e8ff' },
    reader: { flex: 1, backgroundColor: '#f1f5f9' },
});
