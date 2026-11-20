import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LocalizedText as Text } from '../context/LanguageContext';
import {
    EbookHeading,
    EbookTocGroup,
    EBOOK_NAV_SPACER_CSS,
    EBOOK_READER_CSS,
    groupEbookHeadings,
} from '../lib/ebookReader';
import { EbookBottomNav, EbookSidePanel } from './EbookNavigation';
import { buildEbookJsonNavigation, EbookJsonColorScheme, renderEbookJsonDocument } from '../lib/ebookJson';

interface EbookEditorProps {
    sourceUrl: string;
    format: 'html' | 'pdf' | 'json';
    title?: string;
}

/** Tracks which heading is on screen and how far the reader has scrolled inside the iframe. */
const installScrollSpy = (
    frame: HTMLIFrameElement,
    report: (activeId: string | null, progress: number) => void,
    withSpacer: boolean,
): (() => void) => {
    const win = frame.contentWindow;
    const doc = frame.contentDocument;
    if (!win || !doc) return () => undefined;

    if (withSpacer && !doc.getElementById('ebook-nav-spacer')) {
        const spacer = doc.createElement('style');
        spacer.id = 'ebook-nav-spacer';
        spacer.textContent = EBOOK_NAV_SPACER_CSS;
        (doc.head || doc.documentElement).appendChild(spacer);
    }

    let frameRequest = 0;
    let lastId: string | null | undefined;
    let lastProgress = -1;

    const measure = () => {
        frameRequest = 0;
        const marked = doc.querySelectorAll<HTMLElement>('[data-ebook-reader-id]');
        const targets = marked.length ? marked : doc.querySelectorAll<HTMLElement>('.reader-page[id]');
        const threshold = win.innerHeight * 0.3;
        let activeId: string | null = null;
        for (const element of Array.from(targets)) {
            if (element.getBoundingClientRect().top > threshold) break;
            activeId = element.getAttribute('data-ebook-reader-id') || element.id;
        }
        const root = doc.scrollingElement || doc.documentElement;
        const max = Math.max(1, root.scrollHeight - win.innerHeight);
        const progress = Math.round(Math.min(1, Math.max(0, root.scrollTop / max)) * 200) / 200;
        if (activeId !== lastId || progress !== lastProgress) {
            lastId = activeId;
            lastProgress = progress;
            report(activeId, progress);
        }
    };
    const onScroll = () => {
        if (!frameRequest) frameRequest = win.requestAnimationFrame(measure);
    };

    win.addEventListener('scroll', onScroll, { passive: true });
    win.addEventListener('resize', onScroll);
    measure();
    return () => {
        win.removeEventListener('scroll', onScroll);
        win.removeEventListener('resize', onScroll);
        if (frameRequest) win.cancelAnimationFrame(frameRequest);
    };
};

export const EbookEditor: React.FC<EbookEditorProps> = ({ sourceUrl, format, title }) => {
    const [htmlDocument, setHtmlDocument] = useState<string | null>(null);
    const [jsonDocument, setJsonDocument] = useState<unknown>(null);
    const [groups, setGroups] = useState<EbookTocGroup[]>([]);
    const [jsonGroups, setJsonGroups] = useState<EbookTocGroup[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [activeHeadingId, setActiveHeadingId] = useState<string | null>(null);
    const [backgroundColor, setBackgroundColor] = useState('#ffffff');
    const [textColor, setTextColor] = useState('#1f2937');
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [manualFullscreen, setManualFullscreen] = useState(false);
    const [fullscreenError, setFullscreenError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [readingProgress, setReadingProgress] = useState(0);
    const spyCleanupRef = useRef<() => void>(() => undefined);
    const frameRef = useRef<HTMLIFrameElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const readerCss = useMemo(() => EBOOK_READER_CSS, []);
    const compactLayout = useWindowDimensions().width < 760;
    const documentHtml = useMemo(() => (
        format === 'json' && jsonDocument !== null
            ? renderEbookJsonDocument(jsonDocument)
            : htmlDocument
    ), [format, htmlDocument, jsonDocument]);

    useEffect(() => {
        if (format === 'pdf') {
            setHtmlDocument(null);
            setJsonDocument(null);
            setGroups([]);
            setJsonGroups([]);
            setError(null);
            setIsLoading(false);
            return undefined;
        }

        const controller = new AbortController();
        setHtmlDocument(null);
        setJsonDocument(null);
        setGroups([]);
        setJsonGroups([]);
        setError(null);
        setIsLoading(true);

        const loadDocument = async () => {
            const response = await fetch(sourceUrl, { signal: controller.signal });
            if (!response.ok) throw new Error(`Impossible de charger le livre (HTTP ${response.status}).`);

            if (format === 'json') {
                const payload: unknown = await response.json();
                setJsonDocument(payload);
                setJsonGroups(buildEbookJsonNavigation(payload));
                return;
            }

            const source = await response.text();
            const parsed = new DOMParser().parseFromString(source, 'text/html');
            parsed.querySelectorAll('script, iframe, object, embed').forEach((element) => element.remove());
            parsed.querySelectorAll('*').forEach((element) => {
                Array.from(element.attributes).forEach((attribute) => {
                    if (/^on/i.test(attribute.name)) element.removeAttribute(attribute.name);
                });
            });
            parsed.querySelectorAll('meta[http-equiv="refresh" i]').forEach((element) => element.remove());
            parsed.querySelectorAll('base').forEach((element) => element.remove());
            const base = parsed.createElement('base');
            base.href = new URL('.', sourceUrl).href;
            parsed.head.prepend(base);
            const style = parsed.createElement('style');
            style.textContent = readerCss;
            parsed.head.append(style);

            const headings: EbookHeading[] = Array.from(parsed.body.querySelectorAll('h1, h2, h3'))
                .map((heading, index) => {
                    const id = `ebook-heading-${index}`;
                    heading.setAttribute('data-ebook-reader-id', id);
                    return {
                        id,
                        title: (heading.textContent || '').trim().slice(0, 180),
                        level: Number(heading.tagName.substring(1)),
                    };
                })
                .filter((heading) => heading.title.length > 0);
            setGroups(groupEbookHeadings(headings));
            setHtmlDocument(`<!doctype html>${parsed.documentElement.outerHTML}`);
        };

        loadDocument().catch((loadError: unknown) => {
            if (!controller.signal.aborted) {
                setError(loadError instanceof Error ? loadError.message : String(loadError));
            }
        }).finally(() => {
            if (!controller.signal.aborted) setIsLoading(false);
        });

        return () => controller.abort();
    }, [format, readerCss, sourceUrl]);

    useEffect(() => {
        const syncFullscreen = () => {
            setIsFullscreen(document.fullscreenElement === containerRef.current);
        };
        document.addEventListener('fullscreenchange', syncFullscreen);
        return () => document.removeEventListener('fullscreenchange', syncFullscreen);
    }, []);

    const applyReaderColors = useCallback(() => {
        const root = frameRef.current?.contentDocument?.documentElement;
        root?.style.setProperty('--reader-background', backgroundColor);
        root?.style.setProperty('--reader-text', textColor);
    }, [backgroundColor, textColor]);

    useEffect(() => {
        applyReaderColors();
    }, [applyReaderColors, documentHtml]);

    useEffect(() => () => spyCleanupRef.current(), []);

    const handleFrameLoad = () => {
        applyReaderColors();
        spyCleanupRef.current();
        const frame = frameRef.current;
        if (!frame) return;
        spyCleanupRef.current = installScrollSpy(frame, (activeId, progress) => {
            setActiveHeadingId(activeId);
            setReadingProgress(progress);
        }, true);
    };

    const jumpToHeading = (id: string) => {
        setActiveHeadingId(id);
        const document = frameRef.current?.contentDocument;
        const target = document?.getElementById(id)
            || document?.querySelector(`[data-ebook-reader-id="${id}"]`);
        target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const toggleFullscreen = async () => {
        const container = containerRef.current;
        if (!container) return;

        setFullscreenError(null);
        if (!container.requestFullscreen && document.fullscreenElement !== container) {
            setManualFullscreen((current) => !current);
            return;
        }

        try {
            if (document.fullscreenElement === container) {
                await document.exitFullscreen();
            } else {
                await container.requestFullscreen();
            }
        } catch (fullscreenError) {
            setFullscreenError(fullscreenError instanceof Error ? fullscreenError.message : 'Le plein écran n’est pas disponible.');
        }
    };

    const rootStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: isFullscreen || manualFullscreen ? '100vh' : '100%',
        minHeight: isFullscreen || manualFullscreen ? '100vh' : 400,
        backgroundColor: '#f1f5f9',
        ...(manualFullscreen ? { position: 'fixed', inset: 0, zIndex: 9999 } : {}),
    };
    const navigationGroups = format === 'json' ? jsonGroups : groups;

    const toolbar = (
        <View style={styles.toolbar}>
            {format !== 'pdf' ? (
                <View style={styles.colorControls}>
                    <View style={styles.colorControl}>
                        <Text style={styles.colorLabel}>Fond</Text>
                        <input
                            aria-label="Couleur du fond"
                            type="color"
                            value={backgroundColor}
                            onChange={(event) => setBackgroundColor(event.currentTarget.value)}
                            style={{ width: 34, height: 30, padding: 2, border: '1px solid #cbd5e1', borderRadius: 6, background: '#ffffff' }}
                        />
                    </View>
                    <View style={styles.colorControl}>
                        <Text style={styles.colorLabel}>Texte</Text>
                        <input
                            aria-label="Couleur du texte"
                            type="color"
                            value={textColor}
                            onChange={(event) => setTextColor(event.currentTarget.value)}
                            style={{ width: 34, height: 30, padding: 2, border: '1px solid #cbd5e1', borderRadius: 6, background: '#ffffff' }}
                        />
                    </View>
                </View>
            ) : <View style={styles.colorControls} />}
            <TouchableOpacity style={styles.fullscreenButton} onPress={() => void toggleFullscreen()}>
                <Feather name={isFullscreen || manualFullscreen ? 'minimize' : 'maximize'} size={15} color="#334155" />
                <Text style={styles.fullscreenText}>{isFullscreen || manualFullscreen ? 'Quitter le plein écran' : 'Plein écran'}</Text>
            </TouchableOpacity>
            {fullscreenError ? <Text style={styles.fullscreenError}>{fullscreenError}</Text> : null}
        </View>
    );

    if (format === 'pdf') {
        return (
            <div ref={containerRef} style={rootStyle}>
                {toolbar}
                <iframe
                    title="Lecteur PDF"
                    src={sourceUrl}
                    style={{ flex: 1, width: '100%', height: '100%', minHeight: 400, border: 0, background: '#ffffff' }}
                />
            </div>
        );
    }

    return (
        <div ref={containerRef} style={rootStyle}>
            {toolbar}
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
                <View style={styles.reader}>
                    {error ? (
                        <Text style={styles.error}>{error}</Text>
                    ) : documentHtml ? (
                        <iframe
                            ref={frameRef}
                            title="Lecteur de livre"
                            srcDoc={documentHtml}
                            onLoad={handleFrameLoad}
                            sandbox="allow-same-origin"
                            style={{ width: '100%', height: '100%', minHeight: 400, border: 0, backgroundColor }}
                        />
                    ) : (
                        <View style={styles.loading}>
                            {isLoading ? <ActivityIndicator size="large" color="#6d28d9" /> : null}
                            <Text style={styles.loadingText}>{isLoading ? 'Ouverture de votre livre…' : 'Aucun contenu à afficher.'}</Text>
                        </View>
                    )}
                    {navigationGroups.length > 0 && compactLayout && documentHtml ? (
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
        </div>
    );
};

const styles = StyleSheet.create({
    toolbar: { minHeight: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, paddingHorizontal: 14, paddingVertical: 7, backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
    colorControls: { flexDirection: 'row', alignItems: 'center', gap: 14 },
    colorControl: { flexDirection: 'row', alignItems: 'center', gap: 7 },
    colorLabel: { color: '#475569', fontSize: 12, fontWeight: '700' },
    fullscreenButton: { flexDirection: 'row', alignItems: 'center', gap: 7, paddingHorizontal: 10, paddingVertical: 7, borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 8, backgroundColor: '#ffffff' },
    fullscreenText: { color: '#334155', fontSize: 12, fontWeight: '700' },
    fullscreenError: { color: '#b91c1c', fontSize: 11 },
    layout: { flex: 1, flexDirection: 'row', minHeight: 0, backgroundColor: '#f1f5f9' },
    reader: { flex: 1, minWidth: 0, position: 'relative', backgroundColor: '#f1f5f9' },
    loading: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 12 },
    loadingText: { color: '#64748b', fontSize: 13 },
    error: { padding: 24, color: '#b91c1c', fontSize: 14, lineHeight: 22 },
});
