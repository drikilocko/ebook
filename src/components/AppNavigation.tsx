import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { Feather } from '@expo/vector-icons';
import { useLanguage } from '../context/LanguageContext';
import { useShop } from '../context/ShopContext';
import { useTheme } from '../context/ThemeContext';

type NavigationTab = 'shop' | 'wishlist' | 'cart' | 'account' | 'admin';
type NavigationItem = {
    id: NavigationTab;
    icon: keyof typeof Feather.glyphMap;
    fr: string;
    en: string;
};

const navigationItems: NavigationItem[] = [
    { id: 'shop', icon: 'home', fr: 'Boutique', en: 'Shop' },
    { id: 'wishlist', icon: 'heart', fr: 'Favoris', en: 'Saved' },
    { id: 'cart', icon: 'shopping-bag', fr: 'Panier', en: 'Cart' },
    { id: 'account', icon: 'user', fr: 'Compte', en: 'Account' },
    { id: 'admin', icon: 'shield', fr: 'Admin', en: 'Admin' },
];

interface AppNavigationProps {
    vertical: boolean;
}

export const AppNavigation: React.FC<AppNavigationProps> = ({ vertical }) => {
    const { activeScreen, navigateTo, user, setShowAuthModal, cartCount, wishlist } = useShop();
    const { language } = useLanguage();
    const { palette, theme } = useTheme();
    const dockColor = theme === 'dark'
        ? 'rgba(23,40,41,0.88)'
        : theme === 'cream'
            ? 'rgba(255,250,240,0.88)'
            : 'rgba(255,255,255,0.78)';
    const dockBorder = theme === 'dark'
        ? 'rgba(226,199,111,0.24)'
        : theme === 'cream'
            ? 'rgba(167,124,67,0.24)'
            : 'rgba(255,255,255,0.82)';
    const selectedTab: NavigationTab = activeScreen === 'product-detail'
        ? 'shop'
        : activeScreen === 'checkout' || activeScreen === 'order-success'
            ? 'cart'
            : activeScreen === 'reader'
                ? 'account'
                : activeScreen === 'admin'
                    ? 'admin'
                    : activeScreen;
    const visibleItems = navigationItems.filter((item) => item.id !== 'admin' || user?.role === 'admin');

    const openTab = (tab: NavigationTab) => {
        if (tab === 'account' && !user) {
            setShowAuthModal(true);
            return;
        }
        navigateTo(tab === 'admin' && activeScreen === 'admin' ? 'shop' : tab);
    };

    return (
        <View style={[styles.positioner, vertical ? styles.positionerVertical : styles.positionerHorizontal, styles.passThrough]}>
            <BlurView
                intensity={72}
                tint={theme === 'dark' ? 'dark' : 'light'}
                style={[
                    styles.dock,
                    vertical ? styles.dockVertical : styles.dockHorizontal,
                    { backgroundColor: dockColor, borderColor: dockBorder },
                ]}
            >
                {visibleItems.map((item) => {
                    const active = selectedTab === item.id;
                    const label = language === 'fr' ? item.fr : item.en;
                    const badgeCount = item.id === 'cart' ? cartCount : item.id === 'wishlist' ? wishlist.length : 0;
                    return (
                        <TouchableOpacity
                            key={item.id}
                            accessibilityRole="button"
                            accessibilityLabel={label}
                            accessibilityState={{ selected: active }}
                            onPress={() => openTab(item.id)}
                            activeOpacity={0.75}
                            style={[
                                styles.item,
                                vertical ? styles.itemVertical : styles.itemHorizontal,
                                active && { backgroundColor: palette.surfaceAlt },
                            ]}
                        >
                            <View style={styles.iconWrap}>
                                <Feather
                                    name={item.icon}
                                    size={19}
                                    color={active ? palette.text : palette.muted}
                                />
                                {badgeCount > 0 ? (
                                    <View style={[styles.badge, { backgroundColor: palette.accent }]}>
                                        <Text style={[styles.badgeText, { color: palette.accentText }]}>{badgeCount > 9 ? '9+' : badgeCount}</Text>
                                    </View>
                                ) : null}
                            </View>
                            <Text
                                numberOfLines={1}
                                style={[styles.label, { color: active ? palette.text : palette.muted }]}
                            >
                                {label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </BlurView>
        </View>
    );
};

const styles = StyleSheet.create({
    positioner: {
        position: 'absolute',
        zIndex: 20,
    },
    passThrough: {
        pointerEvents: 'box-none',
    },
    positionerVertical: {
        left: 18,
        top: 0,
        bottom: 0,
        justifyContent: 'center',
    },
    positionerHorizontal: {
        left: 12,
        right: 12,
        bottom: 12,
    },
    dock: {
        overflow: 'hidden',
        borderRadius: 24,
        borderWidth: 1,
        shadowColor: '#0f172a',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.14,
        shadowRadius: 20,
        elevation: 10,
    },
    dockVertical: {
        width: 82,
        padding: 6,
        gap: 5,
    },
    dockHorizontal: {
        flexDirection: 'row',
        padding: 5,
        gap: 2,
    },
    item: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 17,
    },
    itemVertical: {
        width: 68,
        minHeight: 62,
        gap: 4,
    },
    itemHorizontal: {
        flex: 1,
        minWidth: 0,
        minHeight: 58,
        gap: 3,
    },
    iconWrap: {
        width: 26,
        height: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    label: {
        maxWidth: '100%',
        fontSize: 9,
        lineHeight: 12,
        fontWeight: '700',
    },
    badge: {
        position: 'absolute',
        top: -4,
        right: -8,
        minWidth: 16,
        height: 16,
        paddingHorizontal: 3,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ffffff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    badgeText: {
        color: '#183332',
        fontSize: 9,
        lineHeight: 12,
        fontWeight: '900',
    },
});
