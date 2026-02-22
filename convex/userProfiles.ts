import { getAuthUserId } from '@convex-dev/auth/server';
import { mutation } from './_generated/server';
import { v } from 'convex/values';

export const updateProfile = mutation({
  args: {
    city: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const existing = await ctx.db
      .query('userProfiles')
      .withIndex('userId', (q) => q.eq('userId', userId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        city: args.city ?? existing.city,
      });
      return existing._id;
    }
    return await ctx.db.insert('userProfiles', {
      userId,
      city: args.city,
      isAdmin: false,
    });
  },
});

export const updateLastLogin = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const existing = await ctx.db
      .query('userProfiles')
      .withIndex('userId', (q) => q.eq('userId', userId))
      .first();

    const now = Date.now();
    if (existing) {
      await ctx.db.patch(existing._id, { lastLoginAt: now });
      return existing._id;
    }
    return await ctx.db.insert('userProfiles', {
      userId,
      lastLoginAt: now,
      isAdmin: false,
    });
  },
});
