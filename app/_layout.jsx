import { Stack } from "expo-router";
import "./global.css";
import { AuthProvider } from "../context/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState, useCallback } from "react";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";
import { View, ActivityIndicator } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

// keep splash visible until we hide it manually
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // 🧩 Load custom fonts
        await Font.loadAsync({
          "Outfit-Regular": require("../assets/fonts/Outfit-Regular.ttf"),
          "Outfit-Medium": require("../assets/fonts/Outfit-Medium.ttf"),
          "Outfit-Bold": require("../assets/fonts/Outfit-Bold.ttf"),
          "SpaceMono-Regular": require("../assets/fonts/SpaceMono-Regular.ttf"),
        });

        // ⏳ Small delay (optional) to make transition smooth
        await new Promise((resolve) => setTimeout(resolve, 200));
      } catch (e) {
        console.warn("Font loading error:", e);
      } finally {
        setAppReady(true);
      }
    }

    prepare();
  }, []);

  // When fonts are loaded, hide splash
  useEffect(() => {
    if (appReady) {
      SplashScreen.hideAsync();
    }
  }, [appReady]);

  if (!appReady) {
    // optional backup loader (rarely visible)
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView>
    <AuthProvider>
      <SafeAreaView className="flex-1 bg-surface-0">
        <Stack screenOptions={{ headerShown: false }} />
      </SafeAreaView>
    </AuthProvider>
    </GestureHandlerRootView>
  );
}
