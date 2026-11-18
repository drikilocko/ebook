import React, { useEffect, useRef, useState } from 'react';
import {
    AppState,
    ActivityIndicator,
    Linking,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LocalizedText as Text, LocalizedTextInput as TextInput } from '../context/LanguageContext';
import { useShop } from '../context/ShopContext';
import { Header } from '../components/Header';
import {
    formatPayDunyaPhone,
    initiatePayDunyaCardPayment,
    initiatePayDunyaPayment,
    PAYDUNYA_COUNTRIES,
    requiresPayDunyaOtp,
    usdToXOF,
} from '../lib/paydunya';
import { getErrorMessage } from '../lib/supabase';
import { Order } from '../types';

export const CheckoutScreen: React.FC = () => {
    const {
        cart,
        cartSubtotal,
        cartTotal,
        user,
        authLoading,
        setShowAuthModal,
        placeOrder,
        confirmOrderPayment,
        formatPrice,
        navigateTo,
    } = useShop();
    const [countryId, setCountryId] = useState('TG');
    const [operatorKey, setOperatorKey] = useState('tmoney-tg');
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [cardholderName, setCardholderName] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [cardExpiry, setCardExpiry] = useState('');
    const [cardCvv, setCardCvv] = useState('');
    const [paymentType, setPaymentType] = useState<'card' | 'mobile'>('card');
    const [order, setOrder] = useState<Order | null>(null);
    const [busy, setBusy] = useState(false);
    const [autoCheckPayment, setAutoCheckPayment] = useState(false);
    const [checkingPayment, setCheckingPayment] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const confirmPaymentRef = useRef(confirmOrderPayment);
    const navigateToRef = useRef(navigateTo);
    const checkingPaymentRef = useRef(false);
    const paymentHandledRef = useRef(false);
    confirmPaymentRef.current = confirmOrderPayment;
    navigateToRef.current = navigateTo;

    const country = PAYDUNYA_COUNTRIES.find((item) => item.id === countryId) ?? PAYDUNYA_COUNTRIES[0];
    const operator = country.operators.find((item) => item.key === operatorKey) ?? country.operators[0];
    const phoneRules = {
        min: operator.minPhoneDigits ?? country.minDigits,
        max: operator.maxPhoneDigits ?? country.maxDigits,
        example: operator.phonePlaceholder ?? country.phonePlaceholder,
    };

    useEffect(() => {
        if (!authLoading && !user) setShowAuthModal(true);
    }, [authLoading, user, setShowAuthModal]);

    useEffect(() => {
        if (!order?.id || !autoCheckPayment) return;
        let active = true;
        const checkPayment = async () => {
            if (!active || checkingPaymentRef.current || paymentHandledRef.current) return;
            checkingPaymentRef.current = true;
            setCheckingPayment(true);
            try {
                const status = await confirmPaymentRef.current(order.id);
                if (!active) return;
                if (status === 'paid') {
                    paymentHandledRef.current = true;
                    setAutoCheckPayment(false);
                    setMessage('Paiement confirmé par PayDunya. Votre bibliothèque est maintenant accessible.');
                    navigateToRef.current('order-success');
                } else if (status === 'failed') {
                    paymentHandledRef.current = true;
                    setAutoCheckPayment(false);
                    setOrder((current) => current ? { ...current, paymentStatus: 'failed' } : null);
                    setError('Le paiement a échoué ou a été annulé. Vous pouvez réessayer.');
                } else if (status === 'initiating') {
                    paymentHandledRef.current = true;
                    setAutoCheckPayment(false);
                    setError('Le paiement n’a pas été démarré. Vérifiez vos informations puis réessayez.');
                } else if (status === 'pending') {
                    setError(null);
                    setMessage('Vérification automatique en cours. Vos ebooks seront débloqués dès la confirmation de PayDunya.');
                }
            } catch (paymentError) {
                if (active) setError(getErrorMessage(paymentError));
            } finally {
                checkingPaymentRef.current = false;
                if (active) setCheckingPayment(false);
            }
        };
        void checkPayment();
        const interval = setInterval(() => {
            if (AppState.currentState === 'active') void checkPayment();
        }, 5000);
        const subscription = AppState.addEventListener('change', (state) => {
            if (state === 'active') void checkPayment();
        });
        return () => {
            active = false;
            clearInterval(interval);
            subscription.remove();
        };
    }, [order?.id, autoCheckPayment]);

    const handlePay = async () => {
        setError(null);
        setMessage(null);
        setAutoCheckPayment(false);
        paymentHandledRef.current = false;
        if (!user) {
            setShowAuthModal(true);
            return;
        }
        if (cart.length === 0 && !order) {
            setError('Votre panier est vide. Choisissez un ebook avant de payer.');
            return;
        }
        let paymentMethod: Order['paymentMethod'] = 'card';
        let formattedPhone = '';
        let normalizedCardNumber = '';
        let normalizedCardCvv = '';
        let cardExpiryMonth = '';
        let cardExpiryYear = '';
        if (paymentType === 'mobile') {
            formattedPhone = formatPayDunyaPhone(phone, country, operator.key) || '';
            if (!formattedPhone) {
                setError(`Saisissez un numéro valide (${phoneRules.min}${phoneRules.min === phoneRules.max ? '' : ` à ${phoneRules.max}`} chiffres, ex. ${phoneRules.example}).`);
                return;
            }
            if (requiresPayDunyaOtp(operator.key) && !otp.trim()) {
                setError('Saisissez le code de paiement demandé par votre opérateur.');
                return;
            }
            paymentMethod = operator.key === 'tmoney-tg'
                ? 'tmoney'
                : operator.key === 'flooz-tg'
                    ? 'flooz'
                    : 'paydunya';
        } else {
            normalizedCardNumber = cardNumber.replace(/\D/g, '');
            normalizedCardCvv = cardCvv.replace(/\D/g, '');
            const cardExpiryParts = cardExpiry.match(/^(0[1-9]|1[0-2])\/(\d{2})$/);
            const cardName = cardholderName.trim() || user.name.trim();
            const currentDate = new Date();
            const expiryYear = cardExpiryParts ? 2000 + Number(cardExpiryParts[2]) : 0;
            const expiryMonth = cardExpiryParts ? Number(cardExpiryParts[1]) : 0;
            const expired = cardExpiryParts
                && (expiryYear < currentDate.getFullYear()
                    || (expiryYear === currentDate.getFullYear() && expiryMonth < currentDate.getMonth() + 1));
            if (
                !cardName
                || normalizedCardNumber.length < 12
                || normalizedCardNumber.length > 19
                || !cardExpiryParts
                || expired
                || normalizedCardCvv.length < 3
                || normalizedCardCvv.length > 4
            ) {
                setError('Vérifiez le nom, le numéro de carte, la date d’expiration et le cryptogramme.');
                return;
            }
            cardExpiryMonth = cardExpiryParts[1];
            cardExpiryYear = cardExpiryParts[2];
        }

        setBusy(true);
        try {
            const currentOrder = order ?? await placeOrder(undefined, paymentMethod);
            if (!currentOrder) return;
            setOrder(currentOrder);

            if (paymentType === 'card') {
                const result = await initiatePayDunyaCardPayment(currentOrder.id, {
                    fullName: cardholderName.trim() || user.name,
                    cardNumber: normalizedCardNumber,
                    cardCvv: normalizedCardCvv,
                    cardExpiredDateMonth: cardExpiryMonth,
                    cardExpiredDateYear: cardExpiryYear,
                });
                if (!result.success || !result.invoiceToken) {
                    if (result.paymentStatus === 'pending' && result.invoiceToken) {
                        setMessage('Le statut du paiement est incertain. Vérification automatique en cours avant tout nouvel essai.');
                        setAutoCheckPayment(true);
                    }
                    throw new Error(result.error || 'Le paiement par carte n’a pas pu être démarré.');
                }
                setMessage(result.message || `Paiement par carte envoyé. Montant : ${result.amountXOF?.toLocaleString()} FCFA. Vérification automatique en cours.`);
                setAutoCheckPayment(true);
                if (result.paymentUrl) {
                    const paymentUrl = new URL(result.paymentUrl);
                    if (paymentUrl.protocol !== 'https:' || !/(^|\.)paydunya\.com$/i.test(paymentUrl.hostname)) {
                        throw new Error('Le lien de vérification bancaire est invalide.');
                    }
                    setMessage('Une vérification 3-D Secure de votre banque est nécessaire pour finaliser le paiement.');
                    await Linking.openURL(paymentUrl.toString());
                }
                return;
            }

            const result = await initiatePayDunyaPayment(
                currentOrder.id,
                operator.key,
                formattedPhone,
                {
                    amountXOF: usdToXOF(currentOrder.total),
                    customerName: user.name,
                    customerEmail: user.email,
                    otp: otp.trim(),
                }
            );
            if (!result.success) {
                throw new Error(result.error || 'Le paiement n’a pas pu être démarré.');
            }
            setMessage(`${result.message} Montant : ${result.amountXOF?.toLocaleString()} FCFA. La confirmation sera vérifiée automatiquement.`);
            setAutoCheckPayment(true);
            if (result.paymentUrl) {
                const paymentUrl = new URL(result.paymentUrl);
                if (paymentUrl.protocol !== 'https:') {
                    throw new Error('Le lien de paiement PayDunya est invalide.');
                }
                await Linking.openURL(paymentUrl.toString());
            }
        } catch (paymentError) {
            setError(getErrorMessage(paymentError));
        } finally {
            setBusy(false);
            if (paymentType === 'card') {
                setCardNumber('');
                setCardExpiry('');
                setCardCvv('');
            }
        }
    };

    return (
        <View style={styles.container}>
            <Header />
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigateTo('cart')}>
                    <Feather name="arrow-left" size={17} color="#475569" />
                    <Text style={styles.backText}>Retour au panier</Text>
                </TouchableOpacity>

                <View style={styles.intro}>
                    <View style={styles.iconCircle}><Feather name="book-open" size={24} color="#ffffff" /></View>
                    <Text style={styles.title}>Paiement sécurisé</Text>
                    <Text style={styles.subtitle}>Après confirmation du paiement, vos ebooks seront disponibles dans « Mes livres ».</Text>
                </View>

                {cart.length > 0 && (
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Votre sélection</Text>
                        {cart.map((item) => (
                            <View key={item.product.id} style={styles.line}>
                                <Text style={styles.lineName}>{item.product.name}</Text>
                                <Text style={styles.linePrice}>{formatPrice(item.product.price * item.quantity)}</Text>
                            </View>
                        ))}
                        <View style={styles.separator} />
                        <View style={styles.line}>
                            <Text style={styles.totalLabel}>Total</Text>
                            <Text style={styles.total}>{formatPrice(cartTotal || cartSubtotal)}</Text>
                        </View>
                    </View>
                )}

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Choisissez votre mode de paiement</Text>
                    <View style={styles.paymentChoices}>
                        <TouchableOpacity
                            style={[styles.paymentChoice, paymentType === 'card' && styles.paymentChoiceActive]}
                            onPress={() => setPaymentType('card')}
                        >
                            <Feather name="credit-card" size={20} color={paymentType === 'card' ? '#6d28d9' : '#64748b'} />
                            <View style={styles.choiceTextGroup}>
                                <Text style={styles.choiceTitle}>Carte bancaire</Text>
                                <Text style={styles.choiceSubtitle}>Paiement sécurisé sur PayDunya</Text>
                            </View>
                            {paymentType === 'card' && <Feather name="check-circle" size={17} color="#6d28d9" />}
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.paymentChoice, paymentType === 'mobile' && styles.paymentChoiceActive]}
                            onPress={() => {
                                setPaymentType('mobile');
                                setCardNumber('');
                                setCardExpiry('');
                                setCardCvv('');
                            }}
                        >
                            <Feather name="smartphone" size={20} color={paymentType === 'mobile' ? '#6d28d9' : '#64748b'} />
                            <View style={styles.choiceTextGroup}>
                                <Text style={styles.choiceTitle}>Mobile Money</Text>
                                <Text style={styles.choiceSubtitle}>T-Money, Flooz et opérateurs disponibles</Text>
                            </View>
                            {paymentType === 'mobile' && <Feather name="check-circle" size={17} color="#6d28d9" />}
                        </TouchableOpacity>
                    </View>

                    {paymentType === 'mobile' ? (
                    <>
                    <Text style={styles.helper}>Choisissez votre pays et votre opérateur, puis confirmez la demande sur votre téléphone.</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.options}>
                        {PAYDUNYA_COUNTRIES.map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                style={[styles.countryButton, countryId === item.id && styles.optionActive]}
                                onPress={() => {
                                    setCountryId(item.id);
                                    setOperatorKey(item.operators[0].key);
                                }}
                            >
                                <Text style={[styles.optionText, countryId === item.id && styles.optionTextActive]}>
                                    {item.flag} {item.name}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    <View style={styles.operatorList}>
                        {country.operators.map((item) => (
                            <TouchableOpacity
                                key={item.key}
                                style={[styles.operatorButton, operatorKey === item.key && styles.optionActive]}
                                onPress={() => setOperatorKey(item.key)}
                            >
                                <Text style={[styles.optionText, operatorKey === item.key && styles.optionTextActive]}>
                                    {item.name}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Text style={styles.label}>Numéro {operator.name}</Text>
                    <View style={styles.phoneRow}>
                        <Text style={styles.prefix}>{country.dialCode}</Text>
                        <TextInput
                            style={styles.phoneInput}
                            value={phone}
                            onChangeText={setPhone}
                            keyboardType="phone-pad"
                            placeholder={phoneRules.example}
                        />
                    </View>

                    {requiresPayDunyaOtp(operator.key) && (
                        <>
                            <Text style={styles.label}>Code de paiement</Text>
                            <TextInput
                                style={styles.input}
                                value={otp}
                                onChangeText={setOtp}
                                secureTextEntry
                                placeholder="Code demandé par l’opérateur"
                            />
                        </>
                    )}
                    </>
                    ) : (
                        <>
                            <Text style={styles.helper}>Saisissez les informations de votre carte sur cette page. Une authentification 3-D Secure peut être demandée par votre banque.</Text>
                            <Text style={styles.label}>Nom sur la carte</Text>
                            <TextInput
                                style={styles.input}
                                value={cardholderName}
                                onChangeText={setCardholderName}
                                autoCapitalize="words"
                                placeholder={user?.name || 'Nom complet'}
                                editable={!busy}
                            />
                            <Text style={styles.label}>Numéro de carte</Text>
                            <TextInput
                                style={styles.input}
                                value={cardNumber}
                                onChangeText={setCardNumber}
                                keyboardType="number-pad"
                                placeholder="1234 5678 9012 3456"
                                maxLength={23}
                                editable={!busy}
                            />
                            <View style={styles.cardInputRow}>
                                <View style={styles.cardInputGroup}>
                                    <Text style={styles.label}>Expiration (MM/AA)</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={cardExpiry}
                                        onChangeText={(value) => {
                                            const digits = value.replace(/\D/g, '').slice(0, 4);
                                            setCardExpiry(digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits);
                                        }}
                                        keyboardType="number-pad"
                                        placeholder="MM/AA"
                                        maxLength={5}
                                        editable={!busy}
                                    />
                                </View>
                                <View style={styles.cardInputGroup}>
                                    <Text style={styles.label}>Cryptogramme</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={cardCvv}
                                        onChangeText={(value) => setCardCvv(value.replace(/\D/g, '').slice(0, 4))}
                                        keyboardType="number-pad"
                                        secureTextEntry
                                        placeholder="CVV"
                                        maxLength={4}
                                        editable={!busy}
                                    />
                                </View>
                            </View>
                            <Text style={styles.cardInfo}>Les données de carte sont transmises à PayDunya pour le traitement et ne sont pas enregistrées dans la base de l’application.</Text>
                        </>
                    )}

                    <TouchableOpacity
                        style={[styles.primaryButton, (busy || autoCheckPayment) && styles.disabledButton]}
                        onPress={handlePay}
                        disabled={busy || autoCheckPayment}
                    >
                        {busy || autoCheckPayment ? <ActivityIndicator color="#ffffff" /> : <Feather name="lock" size={17} color="#ffffff" />}
                        <Text style={styles.primaryButtonText}>
                            {busy
                                ? 'TRAITEMENT…'
                                : autoCheckPayment
                                    ? 'PAIEMENT EN COURS…'
                                : order
                                    ? 'RÉESSAYER LE PAIEMENT'
                                    : paymentType === 'card'
                                        ? 'PAYER PAR CARTE'
                                        : 'PAYER PAR MOBILE MONEY'}
                        </Text>
                    </TouchableOpacity>

                    {autoCheckPayment && (
                        <View style={styles.checkButton}>
                            {checkingPayment
                                ? <ActivityIndicator size="small" color="#6d28d9" />
                                : <Feather name="refresh-cw" size={17} color="#6d28d9" />}
                            <Text style={styles.checkButtonText}>Vérification automatique du paiement…</Text>
                        </View>
                    )}
                    {error ? <Text style={styles.error}>{error}</Text> : null}
                    {message ? <Text style={styles.message}>{message}</Text> : null}
                </View>
                <Text style={styles.secureNote}>Les livres numériques sont délivrés uniquement après confirmation du paiement par PayDunya.</Text>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc' },
    content: { width: '100%', maxWidth: 760, alignSelf: 'center', padding: 20, paddingBottom: 48 },
    backButton: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 10 },
    backText: { color: '#475569', fontWeight: '700' },
    intro: { alignItems: 'center', paddingVertical: 22 },
    iconCircle: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#6d28d9', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
    title: { color: '#0f172a', fontSize: 26, fontWeight: '900' },
    subtitle: { color: '#64748b', fontSize: 14, lineHeight: 21, textAlign: 'center', marginTop: 8, maxWidth: 520 },
    card: { backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderWidth: 1, borderRadius: 20, padding: 20, marginTop: 16 },
    cardTitle: { color: '#0f172a', fontSize: 18, fontWeight: '900', marginBottom: 12 },
    helper: { color: '#64748b', fontSize: 13, lineHeight: 19, marginBottom: 14 },
    paymentChoices: { gap: 9, marginBottom: 16 },
    paymentChoice: { flexDirection: 'row', alignItems: 'center', gap: 11, borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 13, padding: 13, backgroundColor: '#ffffff' },
    paymentChoiceActive: { borderColor: '#8b5cf6', backgroundColor: '#faf5ff' },
    choiceTextGroup: { flex: 1 },
    choiceTitle: { color: '#0f172a', fontSize: 13, fontWeight: '900' },
    choiceSubtitle: { color: '#64748b', fontSize: 11, marginTop: 3 },
    cardInfo: { color: '#475569', backgroundColor: '#f8fafc', borderRadius: 11, padding: 12, fontSize: 12, lineHeight: 18, marginBottom: 13 },
    line: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginVertical: 6 },
    lineName: { flex: 1, color: '#334155', fontSize: 13, fontWeight: '600' },
    linePrice: { color: '#334155', fontWeight: '700' },
    separator: { height: 1, backgroundColor: '#e2e8f0', marginVertical: 10 },
    totalLabel: { color: '#0f172a', fontWeight: '800', fontSize: 15 },
    total: { color: '#6d28d9', fontWeight: '900', fontSize: 20 },
    options: { gap: 8, paddingBottom: 10 },
    countryButton: { borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 12, paddingVertical: 9, paddingHorizontal: 12 },
    optionActive: { backgroundColor: '#f3e8ff', borderColor: '#8b5cf6' },
    optionText: { color: '#475569', fontSize: 12, fontWeight: '700' },
    optionTextActive: { color: '#6d28d9' },
    operatorList: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 18 },
    operatorButton: { borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 11, paddingVertical: 9, paddingHorizontal: 12 },
    label: { color: '#334155', fontSize: 12, fontWeight: '800', marginBottom: 7, marginTop: 3 },
    phoneRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 12, marginBottom: 14, paddingHorizontal: 13, backgroundColor: '#ffffff' },
    prefix: { color: '#6d28d9', fontWeight: '800', borderRightWidth: 1, borderRightColor: '#e2e8f0', paddingRight: 12 },
    phoneInput: { flex: 1, color: '#0f172a', paddingHorizontal: 12, paddingVertical: 12, fontSize: 15 },
    input: { borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, color: '#0f172a', marginBottom: 14 },
    cardInputRow: { flexDirection: 'row', gap: 12 },
    cardInputGroup: { flex: 1 },
    primaryButton: { minHeight: 50, backgroundColor: '#6d28d9', borderRadius: 14, flexDirection: 'row', gap: 10, alignItems: 'center', justifyContent: 'center', marginTop: 8 },
    disabledButton: { opacity: 0.65 },
    primaryButtonText: { color: '#ffffff', fontSize: 13, fontWeight: '900', letterSpacing: 0.3 },
    checkButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 15 },
    checkButtonText: { color: '#6d28d9', fontWeight: '800', fontSize: 13 },
    error: { color: '#dc2626', backgroundColor: '#fef2f2', padding: 12, borderRadius: 10, marginTop: 8, fontSize: 13, lineHeight: 19 },
    message: { color: '#166534', backgroundColor: '#f0fdf4', padding: 12, borderRadius: 10, marginTop: 8, fontSize: 13, lineHeight: 19 },
    secureNote: { color: '#64748b', fontSize: 12, lineHeight: 18, textAlign: 'center', marginTop: 18 },
});
