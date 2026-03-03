// Hesap Makinesi Ekranı — Ana Uygulama Arayüzü
import React, { useState, useRef, useCallback } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
    Dimensions,
    Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import RENKLER from '../utils/renkler';

// Ekran Boyutlarını Alma
const { width: EKRAN_GENISLIGI } = Dimensions.get('window');

// Mobil Görünüm için Maksimum Genişlik Sınırı
const MAKS_GENISLIK = 414;
const KULLANILAN_GENISLIK = Math.min(EKRAN_GENISLIGI, MAKS_GENISLIK);

// Buton Boyutu Hesaplaması (4 Sütun, Kenar Boşlukları ile)
const BUTON_KENARI = 16;
const BUTON_ARASI = 12;
const BUTON_BOYUTU = (KULLANILAN_GENISLIK - BUTON_KENARI * 2 - BUTON_ARASI * 3) / 4;

const HesapMakinesi = ({ navigation }) => {
    // Ekranda Gösterilen Değer
    const [ekranDegeri, setEkranDegeri] = useState('0');
    // Önceki Sayı Değeri
    const [oncekiDeger, setOncekiDeger] = useState(null);
    // Seçilen İşlem Türü
    const [islem, setIslem] = useState(null);
    // Yeni Sayı Girişi Durumu
    const [yeniGiris, setYeniGiris] = useState(true);
    // İşlem Geçmişi Metni
    const [gecmisMetni, setGecmisMetni] = useState('');

    // Buton Basma Animasyonu için Referans
    const butonAnimasyonlari = useRef({}).current;

    // Buton Animasyonu Oluşturma Fonksiyonu
    const animasyonAl = useCallback((id) => {
        if (!butonAnimasyonlari[id]) {
            butonAnimasyonlari[id] = new Animated.Value(1);
        }
        return butonAnimasyonlari[id];
    }, []);

    // Buton Basma Efekti Fonksiyonu
    const butonBasmaEfekti = useCallback((id) => {
        const anim = animasyonAl(id);
        Animated.sequence([
            Animated.timing(anim, {
                toValue: 0.85,
                duration: 60,
                useNativeDriver: true,
            }),
            Animated.spring(anim, {
                toValue: 1,
                tension: 300,
                friction: 10,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    // Sayıyı Biçimlendirme Fonksiyonu (Binlik Ayracı Ekleme)
    const sayiyiBicimledir = (deger) => {
        if (deger === 'Hata') return 'Hata';
        const metin = String(deger);
        // Ondalık Kısmı Ayırma
        const parcalar = metin.split('.');
        const tamKisim = parcalar[0];
        const ondalikKisim = parcalar.length > 1 ? '.' + parcalar[1] : '';

        // Negatif Sayı Kontrolü
        const negatifMi = tamKisim.startsWith('-');
        const mutlakDeger = negatifMi ? tamKisim.slice(1) : tamKisim;

        // Binlik Ayracı Ekleme İşlemi
        const bicimlendirilmis = mutlakDeger.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return (negatifMi ? '-' : '') + bicimlendirilmis + ondalikKisim;
    };

    // Rakam Butonuna Basıldığında Çalışan Fonksiyon
    const rakamBasildi = (rakam) => {
        if (yeniGiris) {
            // Yeni Giriş Başlatma
            setEkranDegeri(rakam === '.' ? '0.' : rakam);
            setYeniGiris(false);
        } else {
            // Çift Ondalık Nokta Engelleme
            if (rakam === '.' && ekranDegeri.includes('.')) return;
            // Mevcut Değere Ekleme
            if (ekranDegeri === '0' && rakam !== '.') {
                setEkranDegeri(rakam);
            } else {
                // Maksimum Karakter Sınırı Kontrolü
                if (ekranDegeri.replace('.', '').length >= 12) return;
                setEkranDegeri(ekranDegeri + rakam);
            }
        }
    };

    // İşlem Butonuna Basıldığında Çalışan Fonksiyon
    const islemBasildi = (secilenIslem) => {
        const mevcutDeger = parseFloat(ekranDegeri);

        if (oncekiDeger !== null && !yeniGiris) {
            // Önceki İşlemi Hesaplama
            const sonuc = hesapla(oncekiDeger, mevcutDeger, islem);
            setEkranDegeri(String(sonuc));
            setOncekiDeger(sonuc);
            // Geçmiş Metnini Güncelleme
            setGecmisMetni(`${sayiyiBicimledir(sonuc)} ${islemSembolAl(secilenIslem)}`);
        } else {
            setOncekiDeger(mevcutDeger);
            // Geçmiş Metnini Güncelleme
            setGecmisMetni(`${sayiyiBicimledir(mevcutDeger)} ${islemSembolAl(secilenIslem)}`);
        }

        setIslem(secilenIslem);
        setYeniGiris(true);
    };

    // İşlem Sembolünü Alma Fonksiyonu
    const islemSembolAl = (islemTuru) => {
        const semboller = {
            toplama: '+',
            cikarma: '−',
            carpma: '×',
            bolme: '÷',
        };
        return semboller[islemTuru] || '';
    };

    // Matematiksel Hesaplama Fonksiyonu
    const hesapla = (sayi1, sayi2, islemTuru) => {
        let sonuc;
        switch (islemTuru) {
            case 'toplama':
                sonuc = sayi1 + sayi2;
                break;
            case 'cikarma':
                sonuc = sayi1 - sayi2;
                break;
            case 'carpma':
                sonuc = sayi1 * sayi2;
                break;
            case 'bolme':
                // Sıfıra Bölme Kontrolü
                if (sayi2 === 0) return 'Hata';
                sonuc = sayi1 / sayi2;
                break;
            default:
                return sayi2;
        }
        // Ondalık Hassasiyet Düzeltmesi
        return parseFloat(sonuc.toPrecision(12));
    };

    // Eşittir Butonuna Basıldığında Çalışan Fonksiyon
    const esittirBasildi = () => {
        if (oncekiDeger === null || islem === null) return;

        const mevcutDeger = parseFloat(ekranDegeri);
        const sonuc = hesapla(oncekiDeger, mevcutDeger, islem);

        // Geçmiş Metnini Güncelleme
        setGecmisMetni(
            `${sayiyiBicimledir(oncekiDeger)} ${islemSembolAl(islem)} ${sayiyiBicimledir(mevcutDeger)} =`
        );
        setEkranDegeri(String(sonuc));
        setOncekiDeger(null);
        setIslem(null);
        setYeniGiris(true);
    };

    // Tümünü Silme (AC) Fonksiyonu
    const tumunuSil = () => {
        setEkranDegeri('0');
        setOncekiDeger(null);
        setIslem(null);
        setYeniGiris(true);
        setGecmisMetni('');
    };

    // İşaret Değiştirme (±) Fonksiyonu
    const isaretDegistir = () => {
        if (ekranDegeri === '0' || ekranDegeri === 'Hata') return;
        setEkranDegeri(
            ekranDegeri.startsWith('-') ? ekranDegeri.slice(1) : '-' + ekranDegeri
        );
    };

    // Yüzde Hesaplama Fonksiyonu
    const yuzdeHesapla = () => {
        if (ekranDegeri === 'Hata') return;
        const deger = parseFloat(ekranDegeri);
        setEkranDegeri(String(deger / 100));
        setYeniGiris(true);
    };

    // Son Karakteri Silme (⌫) Fonksiyonu
    const sonKarakteriSil = () => {
        if (ekranDegeri === 'Hata' || yeniGiris) return;
        if (ekranDegeri.length === 1 || (ekranDegeri.length === 2 && ekranDegeri.startsWith('-'))) {
            setEkranDegeri('0');
            setYeniGiris(true);
        } else {
            setEkranDegeri(ekranDegeri.slice(0, -1));
        }
    };

    // Ekran Yazı Boyutunu Dinamik Olarak Ayarlama
    const yaziBoyutuHesapla = () => {
        const uzunluk = ekranDegeri.length;
        if (uzunluk <= 6) return 64;
        if (uzunluk <= 8) return 52;
        if (uzunluk <= 10) return 42;
        if (uzunluk <= 13) return 34;
        return 28;
    };

    // Yuvarlak Buton Bileşeni Oluşturma Fonksiyonu
    const ButonOlustur = ({ deger, etiket, tip, onPress, genis }) => {
        const animDeger = animasyonAl(deger);
        // Buton Türüne Göre Stil Belirleme
        const butonStili =
            tip === 'islem' ? stiller.islemButonu :
                tip === 'fonksiyon' ? stiller.fonksiyonButon :
                    stiller.rakamButonu;

        const metinStili =
            tip === 'islem' ? stiller.islemMetni :
                tip === 'fonksiyon' ? stiller.fonksiyonMetni :
                    stiller.rakamMetni;

        return (
            <Animated.View
                style={[
                    { transform: [{ scale: animDeger }] },
                    genis ? { width: BUTON_BOYUTU * 2 + BUTON_ARASI } : { width: BUTON_BOYUTU },
                ]}
            >
                <TouchableOpacity
                    style={[
                        stiller.buton,
                        butonStili,
                        genis && stiller.genisButon,
                        // Aktif İşlem Butonunu Vurgulama
                        islem && deger === islem && stiller.aktifIslemButon,
                    ]}
                    onPress={() => {
                        butonBasmaEfekti(deger);
                        onPress();
                    }}
                    activeOpacity={0.7}
                >
                    <Text
                        style={[
                            stiller.butonMetni,
                            metinStili,
                            islem && deger === islem && stiller.aktifIslemMetni,
                        ]}
                    >
                        {etiket}
                    </Text>
                </TouchableOpacity>
            </Animated.View>
        );
    };

    return (
        <View style={stiller.disKapsayici}>
            <View style={stiller.kapsayici}>
                <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

                {/* Ekran Alanı — Turuncu Gradyan Üst Bölüm */}
                <LinearGradient
                    colors={['#ff9500', '#ff7b00', '#e86800']}
                    style={stiller.ekranAlani}
                >
                    {/* Geri Dönüş Butonu */}
                    <TouchableOpacity
                        style={stiller.geriButonu}
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={stiller.geriButonuMetni}>‹</Text>
                    </TouchableOpacity>

                    {/* Hesaplama Geçmişi Gösterimi */}
                    <Text style={stiller.gecmisMetni} numberOfLines={1}>
                        {gecmisMetni}
                    </Text>

                    {/* Ana Sonuç Ekranı */}
                    <Text
                        style={[
                            stiller.ekranMetni,
                            { fontSize: yaziBoyutuHesapla() },
                            ekranDegeri === 'Hata' && stiller.hataMetni,
                        ]}
                        numberOfLines={1}
                        adjustsFontSizeToFit
                    >
                        {sayiyiBicimledir(ekranDegeri)}
                    </Text>
                </LinearGradient>

                {/* Butonlar Alanı — Koyu Alt Bölüm */}
                <View style={stiller.butonlarAlani}>
                    {/* Son Karakteri Silme Butonu */}
                    <View style={stiller.silSatiri}>
                        <TouchableOpacity
                            style={stiller.geriSilButonu}
                            onPress={sonKarakteriSil}
                            activeOpacity={0.7}
                        >
                            <Text style={stiller.geriSilMetni}>⌫</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Birinci Satır: AC, ±, %, ÷ */}
                    <View style={stiller.butonSatiri}>
                        <ButonOlustur deger="AC" etiket="AC" tip="fonksiyon" onPress={tumunuSil} />
                        <ButonOlustur deger="isaret" etiket="±" tip="fonksiyon" onPress={isaretDegistir} />
                        <ButonOlustur deger="yuzde" etiket="%" tip="fonksiyon" onPress={yuzdeHesapla} />
                        <ButonOlustur deger="bolme" etiket="÷" tip="islem" onPress={() => islemBasildi('bolme')} />
                    </View>

                    {/* İkinci Satır: 7, 8, 9, × */}
                    <View style={stiller.butonSatiri}>
                        <ButonOlustur deger="7" etiket="7" tip="rakam" onPress={() => rakamBasildi('7')} />
                        <ButonOlustur deger="8" etiket="8" tip="rakam" onPress={() => rakamBasildi('8')} />
                        <ButonOlustur deger="9" etiket="9" tip="rakam" onPress={() => rakamBasildi('9')} />
                        <ButonOlustur deger="carpma" etiket="×" tip="islem" onPress={() => islemBasildi('carpma')} />
                    </View>

                    {/* Üçüncü Satır: 4, 5, 6, − */}
                    <View style={stiller.butonSatiri}>
                        <ButonOlustur deger="4" etiket="4" tip="rakam" onPress={() => rakamBasildi('4')} />
                        <ButonOlustur deger="5" etiket="5" tip="rakam" onPress={() => rakamBasildi('5')} />
                        <ButonOlustur deger="6" etiket="6" tip="rakam" onPress={() => rakamBasildi('6')} />
                        <ButonOlustur deger="cikarma" etiket="−" tip="islem" onPress={() => islemBasildi('cikarma')} />
                    </View>

                    {/* Dördüncü Satır: 1, 2, 3, + */}
                    <View style={stiller.butonSatiri}>
                        <ButonOlustur deger="1" etiket="1" tip="rakam" onPress={() => rakamBasildi('1')} />
                        <ButonOlustur deger="2" etiket="2" tip="rakam" onPress={() => rakamBasildi('2')} />
                        <ButonOlustur deger="3" etiket="3" tip="rakam" onPress={() => rakamBasildi('3')} />
                        <ButonOlustur deger="toplama" etiket="+" tip="islem" onPress={() => islemBasildi('toplama')} />
                    </View>

                    {/* Beşinci Satır: 0 (Geniş), virgül, = */}
                    <View style={stiller.butonSatiri}>
                        <ButonOlustur deger="0" etiket="0" tip="rakam" onPress={() => rakamBasildi('0')} genis />
                        <ButonOlustur deger="." etiket="," tip="rakam" onPress={() => rakamBasildi('.')} />
                        <ButonOlustur deger="esittir" etiket="=" tip="islem" onPress={esittirBasildi} />
                    </View>
                </View>
            </View>
        </View>
    );
};

// Hesap Makinesi Stilleri
const stiller = StyleSheet.create({
    // Dış Kapsayıcı — Ortalamalı Tam Ekran
    disKapsayici: {
        flex: 1,
        backgroundColor: '#1c1c1e',
        alignItems: 'center',
    },

    // Ana Kapsayıcı — Mobil Genişlikle Sınırlı
    kapsayici: {
        flex: 1,
        backgroundColor: '#1c1c1e',
        width: '100%',
        maxWidth: MAKS_GENISLIK,
    },

    // Ekran Alanı — Turuncu Gradyan Üst Bölüm
    ekranAlani: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 24,
        paddingBottom: 20,
        paddingTop: 50,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },

    // Geri Dönüş Butonu Stili
    geriButonu: {
        position: 'absolute',
        top: 50,
        left: 16,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },

    // Geri Butonu Metin Stili
    geriButonuMetni: {
        fontSize: 26,
        color: '#fff',
        marginTop: -2,
        fontWeight: '300',
    },

    // Geçmiş Metin Stili
    gecmisMetni: {
        fontSize: 18,
        color: 'rgba(255, 255, 255, 0.7)',
        textAlign: 'right',
        marginBottom: 8,
        minHeight: 24,
    },

    // Ekran Metin Stili — Büyük Sonuç Gösterimi
    ekranMetni: {
        color: '#fff',
        fontWeight: '300',
        textAlign: 'right',
    },

    // Hata Metin Stili
    hataMetni: {
        color: '#ff3b30',
    },

    // Butonlar Alanı — Koyu Alt Bölüm
    butonlarAlani: {
        paddingHorizontal: BUTON_KENARI,
        paddingBottom: 30,
        paddingTop: 12,
        backgroundColor: '#1c1c1e',
    },

    // Son Karakter Silme Satırı
    silSatiri: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginBottom: 10,
        paddingRight: 4,
    },

    // Geri Silme Butonu Stili
    geriSilButonu: {
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 12,
    },

    // Geri Silme Metin Stili
    geriSilMetni: {
        fontSize: 22,
        color: 'rgba(255, 255, 255, 0.5)',
    },

    // Buton Satırı Stili
    butonSatiri: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: BUTON_ARASI,
    },

    // Genel Buton Stili — Yuvarlak
    buton: {
        height: BUTON_BOYUTU,
        borderRadius: BUTON_BOYUTU / 2,
        justifyContent: 'center',
        alignItems: 'center',
    },

    // Geniş Buton Stili (Sıfır Butonu için)
    genisButon: {
        borderRadius: BUTON_BOYUTU / 2,
        paddingLeft: BUTON_BOYUTU * 0.35,
        alignItems: 'flex-start',
    },

    // Genel Buton Metin Stili
    butonMetni: {
        fontSize: 30,
        fontWeight: '400',
    },

    // Rakam Butonu Stili — Koyu Gri Daire
    rakamButonu: {
        backgroundColor: '#333333',
    },

    // Rakam Metin Stili
    rakamMetni: {
        color: '#fff',
        fontSize: 30,
    },

    // Fonksiyon Butonu Stili (AC, ±, %) — Açık Gri
    fonksiyonButon: {
        backgroundColor: '#a5a5a5',
    },

    // Fonksiyon Metin Stili
    fonksiyonMetni: {
        color: '#1c1c1e',
        fontSize: 24,
        fontWeight: '600',
    },

    // İşlem Butonu Stili (+, −, ×, ÷) — Turuncu
    islemButonu: {
        backgroundColor: '#ff9500',
    },

    // İşlem Metin Stili
    islemMetni: {
        color: '#fff',
        fontSize: 34,
        fontWeight: '500',
    },

    // Aktif İşlem Butonu Vurgulama Stili — Beyaz
    aktifIslemButon: {
        backgroundColor: '#fff',
    },

    // Aktif İşlem Metin Stili
    aktifIslemMetni: {
        color: '#ff9500',
    },
});

export default HesapMakinesi;
