import { useAuthActions } from '@convex-dev/auth/react';
import { Ionicons } from '@expo/vector-icons';
import { Button, Dialog, Label, SearchField, TextField } from 'heroui-native';
import { useCallback, useState } from 'react';
import {
  Keyboard,
  NativeSyntheticEvent,
  Text,
  TextInputSubmitEditingEventData,
  View,
} from 'react-native';
import { withUniwind } from 'uniwind';

import { Container } from '@/src/components/container';
import LocationPicker from '@/src/components/location-picker';
import { NewsCard } from '@/src/components/news-card';
import NewsApiService from '@/src/services/news-api-service';
import { useLocationStore } from '@/src/stores/location-store';
import { useQuery } from '@tanstack/react-query';

const StyledIonicons = withUniwind(Ionicons);

export default function Dashboard() {
  const { signOut } = useAuthActions();
  const selectedCity = useLocationStore((s) => s.selectedCity);
  const setSelectedCity = useLocationStore((s) => s.setSelectedCity);
  const [newsSearchQuery, setNewsSearchQuery] = useState('');
  const { data: news = [], isLoading } = useQuery({
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
  console.log({ news });
  const [locationModalOpen, setLocationModalOpen] = useState(false);

  const handleSearchSubmit = useCallback(
    (e: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => {
      Keyboard.dismiss();
      setNewsSearchQuery(e.nativeEvent.text);
    },
    []
  );

  const handleSignOutConfirm = useCallback(async () => {
    await signOut();
  }, [signOut]);

  const isEmpty = !selectedCity && !newsSearchQuery.trim() && news.length === 0;
  const hasNews = news.length > 0;
  const showEmpty = isEmpty && !isLoading;
  const showNews = hasNews && !isLoading;

  return (
    <Container className="flex-1">
      <View className="px-4 pb-4">
        <View className="flex-row items-center justify-between py-4 gap-3">
          <View className="flex-1 min-w-0">
            <LocationPicker
              selectedCity={selectedCity}
              isOpen={locationModalOpen}
              onOpenChange={setLocationModalOpen}
              onCitySelect={setSelectedCity}
            />
          </View>
          <Dialog>
            <Dialog.Trigger>
              <Button variant="ghost" size="sm" className="min-w-0">
                <StyledIonicons
                  name="log-out-outline"
                  size={20}
                  className="text-muted"
                />
              </Button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay />
              <Dialog.Content className="mx-4">
                <Dialog.Title className="text-lg font-semibold">
                  Sign out
                </Dialog.Title>
                <Dialog.Description className="text-muted text-sm mt-1 mb-4">
                  Are you sure you want to sign out?
                </Dialog.Description>
                <View className="flex-row gap-2 justify-end">
                  <Dialog.Close>
                    <Button variant="tertiary">Cancel</Button>
                  </Dialog.Close>
                  <Button variant="danger" onPress={handleSignOutConfirm}>
                    Sign out
                  </Button>
                </View>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog>
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

        {showEmpty && (
          <View className="flex-1 py-16 items-center justify-center">
            <StyledIonicons
              name="newspaper-outline"
              size={64}
              className="text-muted mb-4"
            />
            <Text className="text-foreground font-medium text-lg text-center">
              Select a location or search for news
            </Text>
            <Text className="text-muted text-sm text-center mt-2 px-8">
              Tap the location above to pick a city for local news, or search
              below for news on any topic
            </Text>
          </View>
        )}

        {showNews && (
          <View>
            <View className="mb-4">
              <Text className="text-foreground font-medium">
                {!!newsSearchQuery
                  ? `Results for "${newsSearchQuery}"`
                  : selectedCity
                    ? `Latest news in ${selectedCity.cityName}`
                    : 'News'}
              </Text>
            </View>
            {news.map((item, i) => (
              <View key={`${item.link}-${i}`} className="mb-3">
                <NewsCard newsItem={item} />
              </View>
            ))}
          </View>
        )}

        {!showEmpty && !hasNews && (
          <View className="py-16 items-center justify-center">
            <Text className="text-muted text-center">
              No news found. Try a different search or location.
            </Text>
          </View>
        )}
      </View>
    </Container>
  );
}
