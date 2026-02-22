import SessionTracker from '@/src/components/session-tracker';
import { Stack } from 'expo-router';

export default function AppLayout() {
  return (
    <>
      <SessionTracker />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
      </Stack>
    </>
  );
}
