import { Ionicons } from '@expo/vector-icons';
import { Button } from 'heroui-native';
import { useCallback } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { withUniwind } from 'uniwind';

import { CitySearchInput } from '@/src/components/city-search-input';
import type { CitySelect } from '@/src/stores/location-store';

const StyledIonicons = withUniwind(Ionicons);

type LocationPickerProps = {
  selectedCity: CitySelect | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onCitySelect: (city: CitySelect) => void;
};

export default function LocationPicker({
  selectedCity,
  isOpen,
  onOpenChange,
  onCitySelect,
}: LocationPickerProps) {
  const insets = useSafeAreaInsets();

  const handleCitySelect = useCallback(
    (city: CitySelect) => {
      onCitySelect(city);
      onOpenChange(false);
    },
    [onCitySelect, onOpenChange]
  );

  return (
    <>
      <Pressable
        onPress={() => onOpenChange(true)}
        className="flex-row items-center gap-2 py-2 pr-3 rounded-lg active:bg-muted/50"
      >
        <StyledIonicons name="location" size={22} className="text-muted" />
        <Text
          className="text-foreground font-medium text-base"
          numberOfLines={1}
        >
          {selectedCity ? selectedCity.cityName : 'Select location'}
        </Text>
        <StyledIonicons name="chevron-down" size={18} className="text-muted" />
      </Pressable>

      <Modal
        visible={isOpen}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={() => onOpenChange(false)}
      >
        <View
          className="flex-1 bg-background"
          style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
        >
          <View className="flex-row items-center justify-between px-4 py-4 border-b border-default">
            <Text className="text-foreground font-semibold text-lg">
              Select city
            </Text>
            <Button
              variant="tertiary"
              size="sm"
              onPress={() => onOpenChange(false)}
            >
              Cancel
            </Button>
          </View>
          <View className="flex-1 px-4 pt-4">
            <Text className="text-muted text-sm mb-4">
              Search and select a city to see local news
            </Text>
            <CitySearchInput
              onCitySelect={handleCitySelect}
              placeholder="Search for a city..."
            />
          </View>
        </View>
      </Modal>
    </>
  );
}
