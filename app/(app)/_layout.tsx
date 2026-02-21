import { Stack } from 'expo-router';
import { useThemeColor } from 'heroui-native';
import React, { useCallback } from 'react';

import { ThemeToggle } from '@/components/theme-toggle';

function DrawerLayout() {
  const themeColorForeground = useThemeColor('foreground');
  const themeColorBackground = useThemeColor('background');

  const renderThemeToggle = useCallback(() => <ThemeToggle />, []);

  return (
    <Stack
      screenOptions={{
        headerTintColor: themeColorForeground,
        headerStyle: { backgroundColor: themeColorBackground },
        headerTitleStyle: {
          fontWeight: '600',
          color: themeColorForeground,
        },
        headerRight: renderThemeToggle,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerTitle: 'Home',
        }}
      />
    </Stack>
  );
}

export default DrawerLayout;
