import { v } from 'convex/values';
import { action } from './_generated/server';
import NewsApiService from './services/news_api_service';

export const fetchNews = action({
  args: {
    cityName: v.string(),
    countryCode: v.optional(v.string()),
    query: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return NewsApiService.fetchNews(args);
  },
});
