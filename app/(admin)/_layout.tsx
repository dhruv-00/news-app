import { useAuthActions } from '@convex-dev/auth/react';
import { useQuery } from 'convex/react';
import { Link, Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { Platform, Text, TouchableOpacity, View } from 'react-native';

import { api } from '@/convex/_generated/api';

function AdminGuard({ children }: { children: React.ReactNode }) {
  const isAdmin = useQuery(api.admin.isAdmin, {});
  const isAdminLoading = isAdmin === undefined;
  const router = useRouter();
  const segments = useSegments();
  const isLoginPage = segments[segments.length - 1] === 'login';

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    if (isAdminLoading) return;

    if (isAdmin && isLoginPage) {
      router.replace('/users');
    } else if (!isAdmin && !isLoginPage) {
      router.replace('/login');
    }
  }, [isAdmin, isAdminLoading, isLoginPage, router]);

  if (Platform.OS !== 'web') return null;
  if (isAdminLoading && !isLoginPage) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <View>Loading...</View>
      </View>
    );
  }
  if (!isAdmin && !isLoginPage) {
    return null;
  }
  return <>{children}</>;
}

function AdminNav() {
  const { signOut } = useAuthActions();

  return (
    <View
      style={{
        flexDirection: 'row',
        padding: 16,
        gap: 24,
        alignItems: 'center',
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e5e5',
      }}
    >
      <Link href="/users">
        <Text style={{ color: '#333', fontWeight: '500' }}>Users</Text>
      </Link>
      <Link href="/search-logs">
        <Text style={{ color: '#333', fontWeight: '500' }}>Search Logs</Text>
      </Link>
      <Link href="/sessions">
        <Text style={{ color: '#333', fontWeight: '500' }}>User Sessions</Text>
      </Link>
      <View style={{ marginLeft: 'auto', flexDirection: 'row', gap: 16 }}>
        <Link href="/">
          <Text style={{ color: '#666', fontSize: 14 }}>Dashboard</Text>
        </Link>
        <TouchableOpacity onPress={() => signOut()}>
          <Text style={{ color: '#666', fontSize: 14 }}>Sign out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function AdminLayout() {
  const segments = useSegments();
  const isLoginPage = segments[segments.length - 1] === 'login';

  return (
    <AdminGuard>
      <View style={{ flex: 1 }}>
        {!isLoginPage && <AdminNav />}
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="login" />
          <Stack.Screen name="users" />
          <Stack.Screen name="search-logs" />
          <Stack.Screen name="sessions" />
        </Stack>
      </View>
    </AdminGuard>
  );
}
