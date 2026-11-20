import React, { useMemo, useState } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import {
    createEbookReaderScript,
    createEbookScrollSpyScript,
    EbookHeading,
    EbookTocGroup,
    groupEbookHeadings,
} from '../lib/ebookReader';
import { EbookBottomNav, EbookSidePanel } from './EbookNavigation';
import { buildEbookJsonNavigation, renderEbookJsonDocument } from '../lib/ebookJson';

interface EbookEditorProps {
    sourceUrl: string;
    format: 'html' | 'pdf' | 'json';
    title?: string;
}

export const EbookEditor: React.FC<EbookEditorProps> = ({ sourceUrl, format, title }) => {
    const [groups, setGroups] = useState<EbookTocGroup[]>([]);
    const [jsonGroups, setJsonGroups] = useState<EbookTocGroup[]>([]);
    const [activeHeadingId, setActiveHeadingId] = useState<string | null>(null);
    const [jsonHtml, setJsonHtml] = useState<string | null>(null);
    const [readingProgress, setReadingProgress] = useState(0);
    const compactLayout = useWindowDimensions().width < 760;
    const injectedJavaScript = useMemo(() => {
        const spy = createEbookScrollSpyScript(compactLayout);
        if (format === 'html') return `${createEbookReaderScript()}
${spy}`;
        if (format === 'json') return spy;
        return undefined;
    }, [compactLayout, format]);

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
        try {
            const message: unknown = JSON.parse(event.nativeEvent.data);
            if (
                typeof message === 'object'
                && message !== null
                && 'type' in message
                && message.type === 'ebook-progress'
            ) {
                const activeId = 'activeId' in message && typeof message.activeId === 'string' ? message.activeId : null;
                const progress = 'progress' in message && typeof message.progress === 'number' ? message.progress : 0;
                setActiveHeadingId(activeId);
                setReadingProgress(Math.min(1, Math.max(0, progress)));
                return;
            }
            if (format !== 'html') return;
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
        <View style={styles.layout}>
            {navigationGroups.length > 0 && !compactLayout ? (
                <EbookSidePanel
                    groups={navigationGroups}
                    activeId={activeHeadingId}
                    progress={readingProgress}
                    onJump={jumpToHeading}
                    title={title}
                />
            ) : null}
            <View style={styles.readerArea}>
                {format === 'json' ? (
                    <WebView
                        ref={webViewRef}
                        key={`${format}:${sourceUrl}`}
                        source={{ html: jsonHtml || '<html><body><p>Chargement…</p></body></html>' }}
                        style={styles.reader}
                        injectedJavaScript={injectedJavaScript}
                        onMessage={handleMessage}
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
                {navigationGroups.length > 0 && compactLayout ? (
                    <EbookBottomNav
                        groups={navigationGroups}
                        activeId={activeHeadingId}
                        progress={readingProgress}
                        onJump={jumpToHeading}
                        title={title}
                    />
                ) : null}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    layout: { flex: 1, flexDirection: 'row', minHeight: 0, backgroundColor: '#f1f5f9' },
    readerArea: { flex: 1, minWidth: 0 },
    reader: { flex: 1, backgroundColor: '#f1f5f9' },
});
