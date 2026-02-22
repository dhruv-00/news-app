import { useMutation } from 'convex/react';
import { Label, SearchField, Spinner, TextField } from 'heroui-native';
import { useCallback, useState } from 'react';
import {
  FlatList,
  Keyboard,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  TextInputSubmitEditingEventData,
  View,
} from 'react-native';

import { api } from '@/convex/_generated/api';
import LocationPicker from '@/src/components/location-picker';
import LogOutButton from '@/src/components/log-out-button';
import { NewsCard } from '@/src/components/news-card';
import NewsApiService from '@/src/services/news-api-service';
import TrackingService from '@/src/services/tracking-service';
import { useLocationStore } from '@/src/stores/location-store';
import { useQuery } from '@tanstack/react-query';

export default function Dashboard() {
  const logSearch = useMutation(api.searchLogs.logSearch);
  const updateProfile = useMutation(api.userProfiles.updateProfile);
  const selectedCity = useLocationStore((s) => s.selectedCity);
  const setSelectedCity = useLocationStore((s) => s.setSelectedCity);
  const [newsSearchQuery, setNewsSearchQuery] = useState('');

  const { data: news = [], isFetching } = useQuery({
    queryKey: [
      'news',
      selectedCity?.cityName,
      selectedCity?.countryCode,
      newsSearchQuery,
    ],
    queryFn: () =>
      NewsApiService.fetchNews({
        cityName: selectedCity?.cityName ?? '',
        countryCode: selectedCity?.countryCode ?? '',
        query: newsSearchQuery,
      }),
  });
  const [locationModalOpen, setLocationModalOpen] = useState(false);

  const handleSearchSubmit = useCallback(
    (e: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => {
      Keyboard.dismiss();
      const query = e.nativeEvent.text?.trim() ?? '';
      setNewsSearchQuery(query);
      if (query) {
        const activeTimestamp = TrackingService.currentSessionDuration();
        const now = Date.now();
        logSearch({
          searchQuery: query,
          timestamp: now,
          activeTimestamp: activeTimestamp,
        });
      }
    },
    [logSearch]
  );

  const hasNews = news.length > 0;
  const showNews = hasNews && !isFetching;

  const emptyComponent = isFetching ? (
    <View className="flex-1 py-16 items-center justify-center">
      <Spinner size="lg" />
    </View>
  ) : (
    <View className="py-16 items-center justify-center">
      <Text className="text-muted text-center">
        No news found. Try a different search or location.
      </Text>
    </View>
  );

  return (
    <View className="flex-1 p-safe bg-background">
      <View className="flex-1 px-4 pb-4">
        <View className="flex-row items-center justify-between py-4 gap-3">
          <View className="flex-1 min-w-0">
            <LocationPicker
              selectedCity={selectedCity}
              isOpen={locationModalOpen}
              onOpenChange={setLocationModalOpen}
              onCitySelect={(city) => {
                setSelectedCity(city);
                updateProfile({
                  city: `${city.cityName}, ${city.countryCode.toUpperCase()}`,
                }).catch(() => {});
              }}
            />
          </View>
          <LogOutButton />
        </View>

        <View className="mb-4">
          <TextField>
            <Label>Search news</Label>
            <SearchField className="mt-1">
              <SearchField.Group>
                <SearchField.SearchIcon className="text-muted" />
                <SearchField.Input
                  defaultValue={newsSearchQuery}
                  placeholder="Search for news on the web..."
                  onSubmitEditing={handleSearchSubmit}
                  returnKeyType="search"
                />
                <SearchField.ClearButton />
              </SearchField.Group>
            </SearchField>
          </TextField>
        </View>
        {showNews && (
          <View className="mb-4">
            <Text className="text-foreground font-medium">
              {!!newsSearchQuery
                ? `Results for "${newsSearchQuery}"`
                : selectedCity
                  ? `Latest news in ${selectedCity.cityName}`
                  : 'News'}
            </Text>
          </View>
        )}
        <FlatList
          data={news}
          renderItem={({ item }) => <NewsCard newsItem={item} />}
          keyExtractor={(item) => item.link}
          style={styles.flatList}
          ListEmptyComponent={emptyComponent}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flatList: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
  },
});
