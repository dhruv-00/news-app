import { getAuthUserId } from '@convex-dev/auth/server';
import { v } from 'convex/values';
import { mutation } from './_generated/server';

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
      await ctx.db.patch('userProfiles', existing._id, {
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
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query('users')
      .withIndex('email', (q) => q.eq('email', args.email))
      .first();
    if (!user?._id) {
      console.log('No user found');
      return null;
    }
    const userId = user._id;
    const now = Date.now();
    const existing = await ctx.db
      .query('userProfiles')
      .withIndex('userId', (q) => q.eq('userId', userId))
      .first();
    if (existing) {
      await ctx.db.patch('userProfiles', existing._id, { lastLoginAt: now });
      return existing._id;
    }
    return await ctx.db.insert('userProfiles', { userId, lastLoginAt: now });
  },
});
