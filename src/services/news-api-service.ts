import { NewsItem } from '../types/news';

class NewsApiService {
  private static get apiKey() {
    return '039b91f3475508652be322bd838c505c2e559372850ac552d63b9a792b841318';
    // return process.env.EXPO_PUBLIC_NEWS_API_KEY;
  }

  static async fetchNews(args: {
    cityName: string;
    countryCode?: string;
    query?: string;
  }) {
    const apiKey = this.apiKey;
    if (!apiKey) {
      throw new Error('SERPAPI_API_KEY is not configured');
    }

    const query = encodeURIComponent(
      args.query ?? `latest news in ${args.cityName}`
    );
    const url = `https://serpapi.com/search.json?engine=google_news&q=${query}&gl=${args.countryCode}&hl=en&api_key=${apiKey}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`SerpAPI request failed: ${response.status}`);
    }

    const data = (await response.json()) as {
      news_results?: Array<{
        title?: string;
        source?: { name?: string };
        date?: string;
        iso_date?: string;
        snippet?: string;
        link?: string;
        highlight?: {
          thumbnail: string;
        };
        stories?: Array<{
          title?: string;
          source?: { name?: string };
          date?: string;
          iso_date?: string;
          snippet?: string;
          link?: string;
          thumbnail: string;
        }>;
      }>;
      error?: string;
    };

    if (data.error) {
      throw new Error(data.error);
    }

    const results: NewsItem[] = [];

    for (const item of data.news_results ?? []) {
      if (item.stories) {
        for (const story of item.stories) {
          results.push({
            title: story.title ?? '',
            source: story.source?.name ?? '',
            date: story.date ?? story.iso_date ?? '',
            snippet: story.snippet,
            link: story.link ?? '',
            thumbnail: story.thumbnail,
          });
        }
      } else {
        results.push({
          title: item.title ?? '',
          source: item.source?.name ?? '',
          date: item.date ?? item.iso_date ?? '',
          snippet: item.snippet,
          link: item.link ?? '',
          thumbnail: item.highlight?.thumbnail ?? '',
        });
      }
    }

    return results;
  }
}

export default NewsApiService;
