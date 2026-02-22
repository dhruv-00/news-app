import { useQuery } from 'convex/react';
import { Text, View } from 'react-native';

import { api } from '@/convex/_generated/api';

function formatDate(ts: number | null): string {
  if (!ts) return '-';
  return new Date(ts).toLocaleString();
}

export default function AdminUsers() {
  const users = useQuery(api.admin.listUsers, {});

  if (users === undefined) {
    return (
      <View style={{ padding: 24 }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (users === null) {
    return (
      <View style={{ padding: 24 }}>
        <Text>Access denied</Text>
      </View>
    );
  }

  return (
    <View style={{ padding: 24, flex: 1 }}>
      <Text style={{ fontSize: 24, fontWeight: '600', marginBottom: 24 }}>
        Users List
      </Text>
      <View
        style={{
          backgroundColor: '#fff',
          borderRadius: 8,
          borderWidth: 1,
          borderColor: '#e5e5e5',
          overflow: 'hidden',
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            padding: 12,
            backgroundColor: '#f9fafb',
            borderBottomWidth: 1,
            borderBottomColor: '#e5e5e5',
          }}
        >
          <Text style={{ flex: 1, fontWeight: '600' }}>Name</Text>
          <Text style={{ flex: 1, fontWeight: '600' }}>Email</Text>
          <Text style={{ flex: 1, fontWeight: '600' }}>City</Text>
          <Text style={{ flex: 1, fontWeight: '600' }}>Last login</Text>
        </View>
        {users.length === 0 ? (
          <View style={{ padding: 24, alignItems: 'center' }}>
            <Text style={{ color: '#666' }}>No users yet</Text>
          </View>
        ) : (
          users.map((user) => (
            <View
              key={user._id}
              style={{
                flexDirection: 'row',
                padding: 12,
                borderBottomWidth: 1,
                borderBottomColor: '#f3f4f6',
              }}
            >
              <Text style={{ flex: 1 }}>{user.name ?? '-'}</Text>
              <Text style={{ flex: 1 }}>{user.email ?? '-'}</Text>
              <Text style={{ flex: 1 }}>{user.city ?? '-'}</Text>
              <Text style={{ flex: 1 }}>{formatDate(user.lastLoginAt)}</Text>
            </View>
          ))
        )}
      </View>
    </View>
  );
}
