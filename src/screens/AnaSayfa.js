// Ana Sayfa Ekranı — Başlangıç Noktası
import React, { useRef, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Animated,
    StatusBar,
    Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import RENKLER from '../utils/renkler';

// Ekran Boyutlarını Alma
const { width: EKRAN_GENISLIGI } = Dimensions.get('window');

const AnaSayfa = ({ navigation }) => {
    // Animasyon Değerlerinin Tanımlanması
    const baslikAnimasyon = useRef(new Animated.Value(0)).current;
    const bilgiAnimasyon = useRef(new Animated.Value(0)).current;
    const butonAnimasyon = useRef(new Animated.Value(0)).current;
    const butonOlcek = useRef(new Animated.Value(1)).current;
    const parlamaAnimasyon = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Sıralı Giriş Animasyonlarının Başlatılması
        Animated.sequence([
            // Başlık için Yukarı Kayma Animasyonu
            Animated.timing(baslikAnimasyon, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            // Öğrenci Bilgileri için Belirme Animasyonu
            Animated.timing(bilgiAnimasyon, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
            }),
            // Buton için Büyüme Animasyonu
            Animated.spring(butonAnimasyon, {
                toValue: 1,
                tension: 50,
                friction: 7,
                useNativeDriver: true,
            }),
        ]).start();

        // Sürekli Parlama Efekti Döngüsü
        Animated.loop(
            Animated.sequence([
                Animated.timing(parlamaAnimasyon, {
                    toValue: 1,
                    duration: 2000,
                    useNativeDriver: true,
                }),
                Animated.timing(parlamaAnimasyon, {
                    toValue: 0,
                    duration: 2000,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    // Butona Basıldığında Küçülme Efekti
    const butonBasildi = () => {
        Animated.sequence([
            Animated.timing(butonOlcek, {
                toValue: 0.9,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(butonOlcek, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            }),
        ]).start(() => {
            // Hesap Makinesi Ekranına Geçiş
            navigation.navigate('HesapMakinesi');
        });
    };

    // Parlama Efekti için Opaklık Değeri
    const parlamaOpakligi = parlamaAnimasyon.interpolate({
        inputRange: [0, 1],
        outputRange: [0.3, 0.7],
    });

    return (
        <LinearGradient
            colors={[RENKLER.gradyanBaslangic, RENKLER.gradyanOrta, RENKLER.gradyanBitis]}
            style={stiller.kapsayici}
        >
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

            {/* Dekoratif Arka Plan Daireleri */}
            <Animated.View style={[stiller.dekoratifDaire1, { opacity: parlamaOpakligi }]} />
            <Animated.View style={[stiller.dekoratifDaire2, { opacity: parlamaOpakligi }]} />

            {/* Ana İçerik Alanı */}
            <View style={stiller.icerikAlani}>
                {/* Uygulama Başlığı */}
                <Animated.View
                    style={[
                        stiller.baslikKapsayici,
                        {
                            opacity: baslikAnimasyon,
                            transform: [
                                {
                                    translateY: baslikAnimasyon.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [30, 0],
                                    }),
                                },
                            ],
                        },
                    ]}
                >
                    {/* Hesap Makinesi İkonu */}
                    <View style={stiller.ikonKapsayici}>
                        <Text style={stiller.ikonMetni}>🧮</Text>
                    </View>
                    <Text style={stiller.baslikMetni}>Hesap Makinesi</Text>
                </Animated.View>

                {/* Öğrenci Bilgileri Alanı */}
                <Animated.View style={[stiller.bilgiKapsayici, { opacity: bilgiAnimasyon }]}>
                    <Text style={stiller.bilgiNumara}>1233</Text>
                    <Text style={stiller.bilgiIsim}>Ali Efe Gözden</Text>
                    <Text style={stiller.bilgiSinif}>AMP 12. Sınıf / A Şubesi</Text>
                </Animated.View>

                {/* Başla Butonu */}
                <Animated.View
                    style={[
                        stiller.butonKapsayici,
                        {
                            opacity: butonAnimasyon,
                            transform: [{ scale: Animated.multiply(butonAnimasyon, butonOlcek) }],
                        },
                    ]}
                >
                    <TouchableOpacity
                        style={stiller.baslaButonu}
                        onPress={butonBasildi}
                        activeOpacity={0.8}
                    >
                        <LinearGradient
                            colors={[RENKLER.vurguTuruncu, '#ff6f00']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={stiller.butonGradyan}
                        >
                            <Text style={stiller.butonMetni}>Başla</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </LinearGradient>
    );
};

// Ana Sayfa Stilleri
const stiller = StyleSheet.create({
    // Ana Kapsayıcı Stili
    kapsayici: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    // Dekoratif Daire Stilleri
    dekoratifDaire1: {
        position: 'absolute',
        width: EKRAN_GENISLIGI * 0.8,
        height: EKRAN_GENISLIGI * 0.8,
        borderRadius: EKRAN_GENISLIGI * 0.4,
        backgroundColor: RENKLER.vurguTuruncu,
        opacity: 0.05,
        top: -EKRAN_GENISLIGI * 0.2,
        right: -EKRAN_GENISLIGI * 0.3,
    },
    dekoratifDaire2: {
        position: 'absolute',
        width: EKRAN_GENISLIGI * 0.6,
        height: EKRAN_GENISLIGI * 0.6,
        borderRadius: EKRAN_GENISLIGI * 0.3,
        backgroundColor: RENKLER.vurguMavi,
        opacity: 0.05,
        bottom: -EKRAN_GENISLIGI * 0.1,
        left: -EKRAN_GENISLIGI * 0.2,
    },

    // İçerik Alanı Stili
    icerikAlani: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 30,
    },

    // Başlık Kapsayıcı Stili
    baslikKapsayici: {
        alignItems: 'center',
        marginBottom: 24,
    },

    // İkon Kapsayıcı Stili
    ikonKapsayici: {
        width: 100,
        height: 100,
        borderRadius: 30,
        backgroundColor: 'rgba(255, 149, 0, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
        borderWidth: 1,
        borderColor: 'rgba(255, 149, 0, 0.2)',
    },

    // İkon Metin Stili
    ikonMetni: {
        fontSize: 48,
    },

    // Başlık Metin Stili
    baslikMetni: {
        fontSize: 36,
        fontWeight: '700',
        color: RENKLER.metinBeyaz,
        textAlign: 'center',
        letterSpacing: 1,
    },

    // Öğrenci Bilgileri Kapsayıcı Stili
    bilgiKapsayici: {
        alignItems: 'center',
        marginBottom: 50,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        paddingVertical: 20,
        paddingHorizontal: 30,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
    },

    // Öğrenci Numarası Stili
    bilgiNumara: {
        fontSize: 20,
        fontWeight: '700',
        color: RENKLER.vurguTuruncu,
        marginBottom: 6,
        letterSpacing: 2,
    },

    // Öğrenci İsim Stili
    bilgiIsim: {
        fontSize: 18,
        fontWeight: '600',
        color: RENKLER.metinBeyaz,
        marginBottom: 4,
    },

    // Öğrenci Sınıf Bilgisi Stili
    bilgiSinif: {
        fontSize: 14,
        color: RENKLER.metinGri,
        letterSpacing: 0.5,
    },

    // Buton Kapsayıcı Stili
    butonKapsayici: {
        width: '100%',
        alignItems: 'center',
    },

    // Başla Butonu Stili
    baslaButonu: {
        borderRadius: 20,
        shadowColor: RENKLER.vurguTuruncu,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
        elevation: 12,
    },

    // Buton Gradyan Stili
    butonGradyan: {
        paddingVertical: 18,
        paddingHorizontal: 80,
        borderRadius: 20,
        alignItems: 'center',
    },

    // Buton Metin Stili
    butonMetni: {
        fontSize: 22,
        fontWeight: '700',
        color: RENKLER.metinBeyaz,
        letterSpacing: 2,
    },
});

export default AnaSayfa;
