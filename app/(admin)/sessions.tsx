import { useQuery } from 'convex/react';
import { Text, View } from 'react-native';

import { api } from '@/convex/_generated/api';

function formatDate(ts: number): string {
  return new Date(ts).toLocaleString();
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
}

export default function AdminSessions() {
  const sessions = useQuery(api.admin.listSessions, {});

  if (sessions === undefined) {
    return (
      <View style={{ padding: 24 }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (sessions === null) {
    return (
      <View style={{ padding: 24 }}>
        <Text>Access denied</Text>
      </View>
    );
  }

  return (
    <View style={{ padding: 24, flex: 1 }}>
      <Text style={{ fontSize: 24, fontWeight: '600', marginBottom: 24 }}>
        User Sessions
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
          <Text style={{ flex: 1, fontWeight: '600' }}>User email</Text>
          <Text style={{ flex: 1, fontWeight: '600' }}>Login time</Text>
          <Text style={{ flex: 1, fontWeight: '600' }}>Logout time</Text>
          <Text style={{ flex: 1, fontWeight: '600' }}>Duration</Text>
        </View>
        {sessions.length === 0 ? (
          <View style={{ padding: 24, alignItems: 'center' }}>
            <Text style={{ color: '#666' }}>No sessions yet</Text>
          </View>
        ) : (
          sessions.map((session) => (
            <View
              key={session._id}
              style={{
                flexDirection: 'row',
                padding: 12,
                borderBottomWidth: 1,
                borderBottomColor: '#f3f4f6',
              }}
            >
              <Text style={{ flex: 1 }}>{session.userEmail ?? '-'}</Text>
              <Text style={{ flex: 1 }}>{formatDate(session.loginTime)}</Text>
              <Text style={{ flex: 1 }}>{formatDate(session.logoutTime)}</Text>
              <Text style={{ flex: 1 }}>
                {formatDuration(session.durationSeconds)}
              </Text>
            </View>
          ))
        )}
      </View>
    </View>
  );
}
