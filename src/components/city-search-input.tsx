import { api } from '@/convex/_generated/api';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { useAction } from 'convex/react';
import { Input, Label, TextField, useThemeColor } from 'heroui-native';
import { useCallback, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from 'react-native';
import { withUniwind } from 'uniwind';
import { CitySelect } from '../types/places';

const StyledIonicons = withUniwind(Ionicons);

interface Props {
  onCitySelect: (city: CitySelect) => void;
  placeholder?: string;
  defaultValue?: string;
}

export function CitySearchInput({
  onCitySelect,
  placeholder = 'Search for a city...',
  defaultValue = '',
}: Props) {
  const [query, setQuery] = useState(defaultValue);
  const [isFocused, setIsFocused] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );
  const themeColorMuted = useThemeColor('muted');
  const fetchPredictions = useAction(api.location.fetchPredictions);
  const fetchDetails = useAction(api.location.fetchPlaceDetails);
  const { data: predictions = [], isFetching } = useQuery({
    queryKey: ['place-predictions', query],
    queryFn: () => fetchPredictions({ input: query }),
    select(data) {
      return data.map((p) => ({
        place_id: p.place_id,
        description: p.description,
        main_text: p?.main_text ?? p?.description ?? '',
      }));
    },
  });

  const fetchPlaceDetails = useCallback(
    async (placeId: string) => {
      try {
        const details = await fetchDetails({ placeId });
        if (details) {
          onCitySelect(details);
        }
      } catch (error) {
        console.error(error);
      }
    },
    [onCitySelect, predictions]
  );

  const handleSelect = useCallback(
    (pred: { place_id: string; description: string; main_text: string }) => {
      setQuery(pred.description);
      setIsFocused(false);
      fetchPlaceDetails(pred.place_id);
    },
    []
  );

  const handleChangeText = useCallback((text: string) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      setQuery(text);
    }, 500);
  }, []);

  const showSuggestions = isFocused && predictions.length > 0;

  return (
    <View className="relative z-10">
      <TextField>
        <Label>City</Label>
        <View className="relative">
          <Input
            placeholder={placeholder}
            defaultValue={query}
            onChangeText={handleChangeText}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            autoCapitalize="words"
            autoCorrect={false}
            className="pr-10"
          />
          <View className="absolute right-3 top-0 bottom-0 justify-center">
            {isFetching ? (
              <ActivityIndicator size="small" color={themeColorMuted} />
            ) : (
              <StyledIonicons
                name="location-outline"
                size={20}
                className="text-muted"
              />
            )}
          </View>
        </View>
      </TextField>

      {showSuggestions && (
        <View className="absolute top-full left-0 right-0 mt-1 bg-background border border-default rounded-xl shadow-lg max-h-60 overflow-hidden">
          {isFetching ? (
            <View className="p-4 items-center">
              <ActivityIndicator />
            </View>
          ) : (
            <FlatList
              data={predictions}
              keyExtractor={(item) => item.place_id}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => handleSelect(item)}
                  className="px-4 py-3 border-b border-default last:border-b-0 active:bg-muted/50"
                >
                  <Text className="text-foreground font-medium">
                    {item.main_text}
                  </Text>
                  <Text className="text-muted text-sm mt-0.5">
                    {item.description}
                  </Text>
                </Pressable>
              )}
            />
          )}
        </View>
      )}
    </View>
  );
}
