import { v } from 'convex/values';
import { action } from './_generated/server';
import GoogleApiService from './services/google_api_service';

export const fetchPredictions = action({
  args: {
    input: v.string(),
  },
  handler: async (ctx, args) => {
    return GoogleApiService.fetchPredictions(args.input);
  },
});

export const fetchPlaceDetails = action({
  args: {
    placeId: v.string(),
  },
  handler: async (ctx, args) => {
    return GoogleApiService.fetchPlaceDetails(args.placeId);
  },
});
