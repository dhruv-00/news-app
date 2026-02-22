import { getAuthUserId } from '@convex-dev/auth/server';
import { v } from 'convex/values';
import { mutation } from './_generated/server';

export const recordSession = mutation({
  args: {
    loginTime: v.number(),
    logoutTime: v.number(),
    durationSeconds: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    return await ctx.db.insert('userSessions', {
      userId,
      loginTime: args.loginTime,
      logoutTime: args.logoutTime,
      durationSeconds: args.durationSeconds,
    });
  },
});
