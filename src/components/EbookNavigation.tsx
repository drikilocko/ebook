import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
    Animated,
    Easing,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Feather } from '@expo/vector-icons';
import { LocalizedText as Text } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { EbookNavItem, EbookTocGroup, flattenEbookNavigation } from '../lib/ebookReader';

interface EbookNavigationProps {
    groups: EbookTocGroup[];
    activeId: string | null;
    progress: number;
    onJump: (id: string) => void;
    title?: string;
}

const useNavigationState = (groups: EbookTocGroup[], activeId: string | null) => {
    const items = useMemo(() => flattenEbookNavigation(groups), [groups]);
    const activeIndex = activeId ? items.findIndex((item) => item.id === activeId) : -1;
    const activeItem = activeIndex >= 0 ? items[activeIndex] : null;
    const previous = activeIndex > 0 ? items[activeIndex - 1] : null;
    const next = activeIndex < items.length - 1 ? items[activeIndex + 1] : null;
    return { items, activeIndex, activeItem, previous, next };
};

const useSmoothProgress = (progress: number) => {
    const value = useRef(new Animated.Value(progress)).current;
    useEffect(() => {
        Animated.timing(value, {
            toValue: progress,
            duration: 220,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: false,
        }).start();
    }, [progress, value]);
    return value.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'], extrapolate: 'clamp' });
};

/* ------------------------------------------------------------------ */
/* Table of contents list (shared by the side panel and the sheet)     */
/* ------------------------------------------------------------------ */

const TocList: React.FC<{
    items: EbookNavItem[];
    activeId: string | null;
    onSelect: (id: string) => void;
    onRowLayout?: (id: string, y: number) => void;
    dense?: boolean;
}> = ({ items, activeId, onSelect, onRowLayout, dense }) => {
    const { palette } = useTheme();
    let chapterNumber = 0;

    return (
        <View style={styles.tocList}>
            {items.map((item) => {
                const active = item.id === activeId;
                if (item.isGroup) {
                    return (
                        <Pressable
                            key={item.id}
                            onLayout={(event) => onRowLayout?.(item.id, event.nativeEvent.layout.y)}
                            onPress={() => onSelect(item.id)}
                            style={({ hovered, pressed }: { hovered?: boolean; pressed: boolean }) => [
                                styles.groupRow,
                                (hovered || pressed) && { backgroundColor: palette.surfaceAlt },
                                active && { backgroundColor: palette.surfaceAlt },
                            ]}
                        >
                            <View style={[styles.groupMark, { backgroundColor: palette.accent }]} />
                            <Text style={[styles.groupText, { color: palette.text }]} numberOfLines={2}>{item.title}</Text>
                            {item.page ? <Text style={[styles.pageText, { color: palette.muted }]}>p. {item.page}</Text> : null}
                        </Pressable>
                    );
                }
                chapterNumber += 1;
                return (
                    <Pressable
                        key={item.id}
                        onLayout={(event) => onRowLayout?.(item.id, event.nativeEvent.layout.y)}
                        onPress={() => onSelect(item.id)}
                        style={({ hovered, pressed }: { hovered?: boolean; pressed: boolean }) => [
                            styles.chapterRow,
                            dense && styles.chapterRowDense,
                            item.level >= 3 && styles.subChapterRow,
                            (hovered || pressed) && !active && { backgroundColor: palette.surfaceAlt },
                            active && { backgroundColor: `${palette.accent}22` },
                        ]}
                    >
                        <View style={[styles.rail, { backgroundColor: active ? palette.accent : palette.border }]} />
                        <Text style={[styles.chapterIndex, { color: active ? palette.accent : palette.muted }]}>
                            {String(chapterNumber).padStart(2, '0')}
                        </Text>
                        <Text
                            style={[
                                styles.chapterText,
                                { color: active ? palette.text : palette.muted },
                                active && styles.chapterTextActive,
                            ]}
                            numberOfLines={2}
                        >
                            {item.title}
                        </Text>
                        {item.page ? <Text style={[styles.pageText, { color: palette.muted }]}>{item.page}</Text> : null}
                    </Pressable>
                );
            })}
        </View>
    );
};

/* ------------------------------------------------------------------ */
/* Large screens: elegant left panel                                   */
/* ------------------------------------------------------------------ */

export const EbookSidePanel: React.FC<EbookNavigationProps> = ({ groups, activeId, progress, onJump, title }) => {
    const { palette } = useTheme();
    const { items, activeIndex, previous, next } = useNavigationState(groups, activeId);
    const progressWidth = useSmoothProgress(progress);
    const [collapsed, setCollapsed] = useState(false);
    const width = useRef(new Animated.Value(300)).current;
    const scrollRef = useRef<ScrollView>(null);
    const rowOffsets = useRef<Record<string, number>>({});

    useEffect(() => {
        Animated.timing(width, {
            toValue: collapsed ? 64 : 300,
            duration: 260,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: false,
        }).start();
    }, [collapsed, width]);

    // Keep the active chapter visible while the reader scrolls.
    useEffect(() => {
        if (!activeId) return;
        const y = rowOffsets.current[activeId];
        if (typeof y === 'number') scrollRef.current?.scrollTo({ y: Math.max(0, y - 120), animated: true });
    }, [activeId]);

    const chapterCount = items.filter((item) => !item.isGroup).length || items.length;

    return (
        <Animated.View style={[styles.panel, { width, backgroundColor: palette.surface, borderRightColor: palette.border }]}>
            <View style={[styles.panelHeader, collapsed && styles.panelHeaderCollapsed]}>
                {!collapsed ? (
                    <View style={styles.panelHeading}>
                        <Text style={[styles.eyebrow, { color: palette.accent }]}>SOMMAIRE</Text>
                        <Text style={[styles.panelTitle, { color: palette.text }]} numberOfLines={2}>{title || 'Lecture'}</Text>
                        <Text style={[styles.panelMeta, { color: palette.muted }]}>
                            {chapterCount} chapitres · {Math.round(progress * 100)} %
                        </Text>
                    </View>
                ) : null}
                <TouchableOpacity
                    accessibilityLabel={collapsed ? 'Afficher le sommaire' : 'Réduire le sommaire'}
                    onPress={() => setCollapsed((value) => !value)}
                    style={[styles.iconButton, { borderColor: palette.border }]}
                >
                    <Feather name={collapsed ? 'chevrons-right' : 'chevrons-left'} size={16} color={palette.text} />
                </TouchableOpacity>
            </View>

            <View style={[styles.progressTrack, { backgroundColor: palette.surfaceAlt }, collapsed && styles.progressTrackCollapsed]}>
                <Animated.View style={[styles.progressFill, { width: progressWidth, backgroundColor: palette.accent }]} />
            </View>

            {collapsed ? (
                <View style={styles.collapsedRail}>
                    <TouchableOpacity
                        disabled={!previous}
                        onPress={() => previous && onJump(previous.id)}
                        style={[styles.iconButton, { borderColor: palette.border }, !previous && styles.disabled]}
                    >
                        <Feather name="chevron-up" size={16} color={palette.text} />
                    </TouchableOpacity>
                    <Text style={[styles.collapsedCount, { color: palette.muted }]}>
                        {activeIndex >= 0 ? activeIndex + 1 : '–'}/{items.length}
                    </Text>
                    <TouchableOpacity
                        disabled={!next && activeIndex >= 0}
                        onPress={() => { const target = next || items[0]; if (target) onJump(target.id); }}
                        style={[styles.iconButton, { borderColor: palette.border }, !next && activeIndex >= 0 && styles.disabled]}
                    >
                        <Feather name="chevron-down" size={16} color={palette.text} />
                    </TouchableOpacity>
                </View>
            ) : (
                <>
                    <ScrollView ref={scrollRef} style={styles.panelScroll} showsVerticalScrollIndicator={false}>
                        <TocList
                            items={items}
                            activeId={activeId}
                            onSelect={onJump}
                            onRowLayout={(id, y) => { rowOffsets.current[id] = y; }}
                        />
                    </ScrollView>
                    <View style={[styles.panelFooter, { borderTopColor: palette.border }]}>
                        <TouchableOpacity
                            disabled={!previous}
                            onPress={() => previous && onJump(previous.id)}
                            style={[styles.footerButton, { borderColor: palette.border }, !previous && styles.disabled]}
                        >
                            <Feather name="arrow-left" size={14} color={palette.text} />
                            <Text style={[styles.footerText, { color: palette.text }]}>Précédent</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            disabled={!next && activeIndex >= 0}
                            onPress={() => { const target = next || items[0]; if (target) onJump(target.id); }}
                            style={[
                                styles.footerButton,
                                styles.footerButtonPrimary,
                                { backgroundColor: palette.text, borderColor: palette.text },
                                !next && activeIndex >= 0 && styles.disabled,
                            ]}
                        >
                            <Text style={[styles.footerText, { color: palette.surface }]}>Suivant</Text>
                            <Feather name="arrow-right" size={14} color={palette.surface} />
                        </TouchableOpacity>
                    </View>
                </>
            )}
        </Animated.View>
    );
};

/* ------------------------------------------------------------------ */
/* Mobile: detached floating glass bar + glass sheet                   */
/* ------------------------------------------------------------------ */

const Glass: React.FC<{ style?: object; children: React.ReactNode; dark: boolean }> = ({ style, children, dark }) => (
    <View style={[styles.glassShell, dark ? styles.glassShellDark : styles.glassShellLight, style]}>
        <BlurView
            intensity={Platform.OS === 'android' ? 60 : 40}
            tint={dark ? 'dark' : 'light'}
            experimentalBlurMethod="dimezisBlurView"
            style={StyleSheet.absoluteFill}
        />
        {Platform.OS === 'web' ? (
            <View
                pointerEvents="none"
                style={[
                    StyleSheet.absoluteFill,
                    // react-native-web forwards these to CSS for a real frosted-glass effect.
                    { backdropFilter: 'blur(22px) saturate(180%)', WebkitBackdropFilter: 'blur(22px) saturate(180%)' } as object,
                ]}
            />
        ) : null}
        {children}
    </View>
);

export const EbookBottomNav: React.FC<EbookNavigationProps> = ({ groups, activeId, progress, onJump }) => {
    const { palette, theme } = useTheme();
    const dark = theme === 'dark';
    const { items, activeIndex, activeItem, previous, next } = useNavigationState(groups, activeId);
    const progressWidth = useSmoothProgress(progress);
    const [sheetOpen, setSheetOpen] = useState(false);
    const [sheetMounted, setSheetMounted] = useState(false);
    const sheet = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (sheetOpen) setSheetMounted(true);
        Animated.timing(sheet, {
            toValue: sheetOpen ? 1 : 0,
            duration: sheetOpen ? 320 : 220,
            easing: sheetOpen ? Easing.out(Easing.cubic) : Easing.in(Easing.cubic),
            useNativeDriver: Platform.OS !== 'web',
        }).start(({ finished }) => {
            if (finished && !sheetOpen) setSheetMounted(false);
        });
    }, [sheet, sheetOpen]);

    const select = (id: string) => {
        setSheetOpen(false);
        onJump(id);
    };

    const goNext = () => {
        const target = next || (activeIndex < 0 ? items[0] : null);
        if (target) onJump(target.id);
    };

    const label = activeItem?.title || (items.length ? 'Commencer la lecture' : 'Lecture');
    const counter = activeIndex >= 0 ? `${activeIndex + 1} / ${items.length}` : `${items.length} parties`;

    return (
        <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
            {sheetMounted ? (
                <>
                    <Animated.View style={[StyleSheet.absoluteFill, styles.backdrop, { opacity: sheet }]}>
                        <Pressable style={StyleSheet.absoluteFill} onPress={() => setSheetOpen(false)} accessibilityLabel="Fermer le sommaire" />
                    </Animated.View>
                    <Animated.View
                        style={[
                            styles.sheetWrap,
                            {
                                opacity: sheet,
                                transform: [{ translateY: sheet.interpolate({ inputRange: [0, 1], outputRange: [40, 0] }) }],
                            },
                        ]}
                    >
                        <Glass dark={dark} style={styles.sheet}>
                            <View style={[styles.sheetHandle, { backgroundColor: palette.muted }]} />
                            <View style={styles.sheetHeader}>
                                <View>
                                    <Text style={[styles.eyebrow, { color: palette.accent }]}>SOMMAIRE</Text>
                                    <Text style={[styles.panelMeta, { color: palette.muted }]}>
                                        {Math.round(progress * 100)} % lu
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    accessibilityLabel="Fermer"
                                    onPress={() => setSheetOpen(false)}
                                    style={[styles.roundButton, styles.roundButtonGhost]}
                                >
                                    <Feather name="x" size={18} color={palette.text} />
                                </TouchableOpacity>
                            </View>
                            <ScrollView style={styles.sheetScroll} showsVerticalScrollIndicator={false}>
                                <TocList items={items} activeId={activeId} onSelect={select} dense />
                            </ScrollView>
                        </Glass>
                    </Animated.View>
                </>
            ) : null}

            <View pointerEvents="box-none" style={styles.barWrap}>
                <Glass dark={dark} style={styles.bar}>
                    <TouchableOpacity
                        accessibilityLabel="Chapitre précédent"
                        disabled={!previous}
                        onPress={() => previous && onJump(previous.id)}
                        style={[styles.roundButton, !previous && styles.disabled]}
                    >
                        <Feather name="chevron-left" size={20} color={palette.text} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        accessibilityLabel="Ouvrir le sommaire"
                        activeOpacity={0.75}
                        onPress={() => setSheetOpen((value) => !value)}
                        style={styles.barCenter}
                    >
                        <View style={styles.barCenterTop}>
                            <Feather name={sheetOpen ? 'chevron-down' : 'list'} size={13} color={palette.accent} />
                            <Text style={[styles.barCounter, { color: palette.muted }]}>{counter}</Text>
                        </View>
                        <Text style={[styles.barTitle, { color: palette.text }]} numberOfLines={1}>{label}</Text>
                        <View style={[styles.barTrack, { backgroundColor: dark ? 'rgba(255,255,255,0.14)' : 'rgba(15,23,42,0.08)' }]}>
                            <Animated.View style={[styles.progressFill, { width: progressWidth, backgroundColor: palette.accent }]} />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        accessibilityLabel="Chapitre suivant"
                        disabled={!next && activeIndex >= 0}
                        onPress={goNext}
                        style={[styles.roundButton, styles.roundButtonAccent, { backgroundColor: palette.accent }, !next && activeIndex >= 0 && styles.disabled]}
                    >
                        <Feather name="chevron-right" size={20} color={palette.accentText} />
                    </TouchableOpacity>
                </Glass>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    /* Shared list */
    tocList: { paddingHorizontal: 10, paddingBottom: 12 },
    groupRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 14, marginBottom: 4, paddingHorizontal: 10, paddingVertical: 9, borderRadius: 10 },
    groupMark: { width: 6, height: 6, borderRadius: 3, transform: [{ rotate: '45deg' }] },
    groupText: { flex: 1, fontSize: 11, fontWeight: '800', letterSpacing: 1.2, textTransform: 'uppercase', lineHeight: 16 },
    chapterRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingRight: 10, paddingVertical: 10, borderRadius: 10, overflow: 'hidden' },
    chapterRowDense: { paddingVertical: 12 },
    subChapterRow: { marginLeft: 14 },
    rail: { width: 3, alignSelf: 'stretch', borderRadius: 2, marginLeft: 4 },
    chapterIndex: { width: 20, fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
    chapterText: { flex: 1, fontSize: 13, lineHeight: 18 },
    chapterTextActive: { fontWeight: '700' },
    pageText: { fontSize: 10, fontWeight: '600' },

    /* Side panel */
    panel: { flexShrink: 0, borderRightWidth: 1, overflow: 'hidden' },
    panelHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, paddingHorizontal: 20, paddingTop: 22, paddingBottom: 16 },
    panelHeaderCollapsed: { justifyContent: 'center', paddingHorizontal: 0 },
    panelHeading: { flex: 1, gap: 4 },
    eyebrow: { fontSize: 10, fontWeight: '800', letterSpacing: 2.4 },
    panelTitle: { fontSize: 17, fontWeight: '800', lineHeight: 23 },
    panelMeta: { fontSize: 11, fontWeight: '500' },
    iconButton: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center', borderRadius: 10, borderWidth: 1 },
    progressTrack: { height: 3, marginHorizontal: 20, marginBottom: 8, borderRadius: 2, overflow: 'hidden' },
    progressTrackCollapsed: { marginHorizontal: 14 },
    progressFill: { height: '100%', borderRadius: 2 },
    panelScroll: { flex: 1 },
    collapsedRail: { alignItems: 'center', gap: 12, paddingTop: 12 },
    collapsedCount: { fontSize: 10, fontWeight: '700' },
    panelFooter: { flexDirection: 'row', gap: 8, padding: 14, borderTopWidth: 1 },
    footerButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: 12, borderWidth: 1 },
    footerButtonPrimary: {},
    footerText: { fontSize: 12, fontWeight: '700' },
    disabled: { opacity: 0.35 },

    /* Glass */
    glassShell: {
        overflow: 'hidden',
        borderWidth: 1,
        shadowColor: '#0f172a',
        shadowOpacity: 0.18,
        shadowRadius: 24,
        shadowOffset: { width: 0, height: 10 },
        elevation: 12,
    },
    glassShellLight: { backgroundColor: 'rgba(255,255,255,0.62)', borderColor: 'rgba(255,255,255,0.75)' },
    glassShellDark: { backgroundColor: 'rgba(16,28,29,0.62)', borderColor: 'rgba(255,255,255,0.12)' },

    /* Floating bar */
    barWrap: { position: 'absolute', left: 14, right: 14, bottom: 16, alignItems: 'center' },
    bar: { width: '100%', maxWidth: 520, flexDirection: 'row', alignItems: 'center', gap: 10, padding: 8, borderRadius: 26 },
    roundButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.35)' },
    roundButtonGhost: { width: 36, height: 36, borderRadius: 18 },
    roundButtonAccent: {},
    barCenter: { flex: 1, minWidth: 0, gap: 3, paddingVertical: 2 },
    barCenterTop: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    barCounter: { fontSize: 10, fontWeight: '700', letterSpacing: 0.8 },
    barTitle: { fontSize: 13, fontWeight: '700' },
    barTrack: { height: 3, borderRadius: 2, overflow: 'hidden', marginTop: 3 },

    /* Sheet */
    backdrop: { backgroundColor: 'rgba(15,23,42,0.28)' },
    sheetWrap: { position: 'absolute', left: 10, right: 10, bottom: 88, top: 56, justifyContent: 'flex-end', alignItems: 'center' },
    sheet: { width: '100%', maxWidth: 540, maxHeight: '100%', borderRadius: 26, paddingTop: 8 },
    sheetHandle: { alignSelf: 'center', width: 38, height: 4, borderRadius: 2, opacity: 0.35, marginBottom: 8 },
    sheetHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 8 },
    sheetScroll: { flexGrow: 0 },
});
