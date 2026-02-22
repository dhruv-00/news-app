import { useQuery } from 'convex/react';
import { Text, View } from 'react-native';

import { api } from '@/convex/_generated/api';

function formatDate(ts: number): string {
  return new Date(ts).toLocaleString();
}

export default function AdminSearchLogs() {
  const logs = useQuery(api.admin.listSearchLogs, {});

  const formatDuration = (duration: number): string => {
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = duration % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  if (logs === undefined) {
    return (
      <View style={{ padding: 24 }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (logs === null) {
    return (
      <View style={{ padding: 24 }}>
        <Text>Access denied</Text>
      </View>
    );
  }

  return (
    <View style={{ padding: 24, flex: 1 }}>
      <Text style={{ fontSize: 24, fontWeight: '600', marginBottom: 24 }}>
        Search Logs
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
          <Text style={{ flex: 2, fontWeight: '600' }}>Search query</Text>
          <Text style={{ flex: 1, fontWeight: '600' }}>Date/time</Text>
          <Text style={{ flex: 1, fontWeight: '600' }}>Active duration</Text>
        </View>
        {logs.length === 0 ? (
          <View style={{ padding: 24, alignItems: 'center' }}>
            <Text style={{ color: '#666' }}>No search logs yet</Text>
          </View>
        ) : (
          logs.map((log) => (
            <View
              key={log._id}
              style={{
                flexDirection: 'row',
                padding: 12,
                borderBottomWidth: 1,
                borderBottomColor: '#f3f4f6',
              }}
            >
              <Text style={{ flex: 1 }}>{log.userEmail ?? '-'}</Text>
              <Text style={{ flex: 2 }} numberOfLines={2}>
                {log.searchQuery}
              </Text>
              <Text style={{ flex: 1 }}>{formatDate(log.timestamp)}</Text>
              <Text style={{ flex: 1 }}>
                {formatDuration(log.activeTimestamp)}
              </Text>
            </View>
          ))
        )}
      </View>
    </View>
  );
}
