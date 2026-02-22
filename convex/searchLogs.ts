import { getAuthUserId } from '@convex-dev/auth/server';
import { mutation } from './_generated/server';
import { v } from 'convex/values';

export const logSearch = mutation({
  args: {
    searchQuery: v.string(),
    timestamp: v.number(),
    activeTimestamp: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    return await ctx.db.insert('searchLogs', {
      userId,
      searchQuery: args.searchQuery,
      timestamp: args.timestamp,
      activeTimestamp: args.activeTimestamp,
    });
  },
});
