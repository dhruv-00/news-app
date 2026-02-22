import { useMutation } from 'convex/react';
import { useCallback, useEffect } from 'react';
import { AppState, type AppStateStatus } from 'react-native';

import { api } from '@/convex/_generated/api';
import TrackingService from '../services/tracking-service';

export function useSessionTracker() {
  const recordSession = useMutation(api.sessions.recordSession);

  const handleStateChange = useCallback(
    (nextState: AppStateStatus) => {
      console.log('App state changed to', nextState);
      if (
        nextState === 'background' ||
        nextState === 'inactive' ||
        nextState === 'unknown'
      ) {
        const sessionData = TrackingService.onBackground();
        console.log('Session data', sessionData);
        recordSession(sessionData)
          .then(() => {
            console.log('Session recorded');
          })
          .catch(() => {
            console.error('Failed to record session');
          });
      } else if (nextState === 'active') {
        TrackingService.onActive();
      }
    },
    [recordSession]
  );

  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleStateChange);
    return () => subscription.remove();
  }, [handleStateChange]);
}
