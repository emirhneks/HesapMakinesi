// Ana Uygulama Bileşeni — Navigasyon Yönetimi
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Ekran Bileşenlerinin İçe Aktarılması
import AnaSayfa from './src/screens/AnaSayfa';
import HesapMakinesi from './src/screens/HesapMakinesi';

// Navigasyon Yığını Oluşturma
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    // Navigasyon Kapsayıcısı
    <NavigationContainer>
      <Stack.Navigator
        // Başlangıç Ekranı Ayarı
        initialRouteName="AnaSayfa"
        // Ekran Geçiş Seçenekleri
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          gestureEnabled: true,
        }}
      >
        {/* Ana Sayfa Ekranı */}
        <Stack.Screen name="AnaSayfa" component={AnaSayfa} />
        {/* Hesap Makinesi Ekranı */}
        <Stack.Screen name="HesapMakinesi" component={HesapMakinesi} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
