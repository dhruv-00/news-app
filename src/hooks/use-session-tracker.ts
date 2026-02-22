import { useMutation } from 'convex/react';
import { useCallback, useEffect, useRef } from 'react';
import { AppState, type AppStateStatus } from 'react-native';

import { api } from '@/convex/_generated/api';

export function useSessionTracker() {
  const recordSession = useMutation(api.sessions.recordSession);
  const updateLastLogin = useMutation(api.userProfiles.updateLastLogin);
  const sessionStartRef = useRef<number | null>(null);
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);

  const handleStateChange = useCallback(
    (nextState: AppStateStatus) => {
      const prevState = appStateRef.current;
      appStateRef.current = nextState;

      if (nextState === 'active') {
        sessionStartRef.current = Date.now();
        updateLastLogin().catch(() => {});
      } else if (
        (nextState === 'background' || nextState === 'inactive') &&
        prevState === 'active' &&
        sessionStartRef.current
      ) {
        const now = Date.now();
        const loginTime = sessionStartRef.current;
        const durationSeconds = Math.round((now - loginTime) / 1000);
        sessionStartRef.current = null;
        if (durationSeconds > 0) {
          recordSession({
            loginTime,
            logoutTime: now,
            durationSeconds,
          }).catch(() => {});
        }
      }
    },
    [recordSession, updateLastLogin],
  );

  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleStateChange);
    if (AppState.currentState === 'active') {
      sessionStartRef.current = Date.now();
    }
    return () => subscription.remove();
  }, [handleStateChange]);
}
