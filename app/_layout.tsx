import '@/global.css';
import { AppThemeProvider } from '@/src/contexts/app-theme-context';
import { queryClient } from '@/src/lib/query';
import { ConvexAuthProvider } from '@convex-dev/auth/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ConvexProvider, ConvexReactClient, useConvexAuth } from 'convex/react';
import { Stack } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { HeroUINativeProvider, Spinner } from 'heroui-native';
import { Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';

const secureStorage = {
  getItem: SecureStore.getItemAsync,
  setItem: SecureStore.setItemAsync,
  removeItem: SecureStore.deleteItemAsync,
};

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
});

function AppLayout() {
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (isLoading) {
    return <Spinner />;
  }

  const isWeb = Platform.OS === 'web';
  return (
    <Stack>
      <Stack.Protected guard={!isWeb && isAuthenticated}>
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
      </Stack.Protected>
      <Stack.Protected guard={!isWeb && !isAuthenticated}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack.Protected>
      <Stack.Protected guard={isWeb}>
        <Stack.Screen name="(admin)" options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  );
}

export default function Layout() {
  return (
    <QueryClientProvider client={queryClient}>
      <ConvexAuthProvider
        client={convex}
        storage={
          Platform.OS === 'android' || Platform.OS === 'ios'
            ? secureStorage
            : undefined
        }
      >
        <ConvexProvider client={convex}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <KeyboardProvider>
              <AppThemeProvider>
                <HeroUINativeProvider>
                  <AppLayout />
                </HeroUINativeProvider>
              </AppThemeProvider>
            </KeyboardProvider>
          </GestureHandlerRootView>
        </ConvexProvider>
      </ConvexAuthProvider>
    </QueryClientProvider>
  );
}
