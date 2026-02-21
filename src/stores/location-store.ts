import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type CitySelect = {
  cityName: string;
  countryCode: string;
};

type LocationState = {
  selectedCity: CitySelect | null;
  setSelectedCity: (city: CitySelect | null) => void;
};

const secureStorage =
  Platform.OS === 'ios' || Platform.OS === 'android'
    ? {
        getItem: (name: string) => SecureStore.getItemAsync(name),
        setItem: (name: string, value: string) =>
          SecureStore.setItemAsync(name, value),
        removeItem: (name: string) => SecureStore.deleteItemAsync(name),
      }
    : {
        getItem: async () => null,
        setItem: async () => {},
        removeItem: async () => {},
      };

export const useLocationStore = create<LocationState>()(
  persist(
    (set) => ({
      selectedCity: null,
      setSelectedCity: (city) => set({ selectedCity: city }),
    }),
    {
      name: 'location-store',
      storage: createJSONStorage(() => secureStorage),
      partialize: (state) => ({ selectedCity: state.selectedCity }),
    },
  ),
);
