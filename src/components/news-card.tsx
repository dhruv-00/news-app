import { Image } from 'expo-image';
import { Card } from 'heroui-native';
import { Linking, Pressable, Text, View } from 'react-native';
import { NewsItem } from '../types/news';

type NewsCardProps = {
  newsItem: NewsItem;
};

function formatDate(raw: string): string {
  if (!raw) return '';
  try {
    const [date, time] = raw.split(', ');
    return `${date}, ${time}`;
  } catch {
    return raw;
  }
}

export function NewsCard({ newsItem }: NewsCardProps) {
  const handlePress = () => {
    if (newsItem.link) Linking.openURL(newsItem.link);
  };

  return (
    <Pressable onPress={handlePress}>
      <Card variant="secondary" className="rounded-xl overflow-hidden">
        <Card.Body className="gap-2 flex-row items-center">
          <Card.Header>
            <Image
              cachePolicy="memory-disk"
              priority="high"
              source={{ uri: newsItem.thumbnail }}
              style={{ width: 80, height: 80, borderRadius: 10 }}
            />
          </Card.Header>
          <View className="flex-1">
            <Text
              className="text-foreground font-semibold text-base"
              numberOfLines={2}
            >
              {newsItem.title}
            </Text>
            <View className="flex-row items-center gap-1 mt-2">
              <Text className="text-muted text-sm">{newsItem.source}</Text>
              {newsItem.date ? (
                <>
                  <Text className="text-muted text-xs">•</Text>
                  <Text className="text-muted text-sm">
                    {formatDate(newsItem.date)}
                  </Text>
                </>
              ) : null}
            </View>
            {newsItem.snippet ? (
              <Text className="text-muted text-sm mt-1" numberOfLines={2}>
                {newsItem.snippet}
              </Text>
            ) : null}
          </View>
        </Card.Body>
      </Card>
    </Pressable>
  );
}
