import { getAuthUserId } from '@convex-dev/auth/server';
import { query } from './_generated/server';

export const listUsers = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const profile = await ctx.db
      .query('userProfiles')
      .withIndex('userId', (q) => q.eq('userId', userId))
      .first();
    if (!profile?.isAdmin) return null;

    const users = await ctx.db.query('users').collect();
    const profiles = await ctx.db.query('userProfiles').collect();
    const profileMap = new Map(profiles.map((p) => [p.userId, p]));

    return users.map((user) => {
      const p = profileMap.get(user._id);
      return {
        _id: user._id,
        name: user.name,
        email: user.email,
        city: p?.city ?? null,
        lastLoginAt: p?.lastLoginAt ?? null,
      };
    });
  },
});

export const listSearchLogs = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const profile = await ctx.db
      .query('userProfiles')
      .withIndex('userId', (q) => q.eq('userId', userId))
      .first();
    if (!profile?.isAdmin) return null;

    const logs = await ctx.db
      .query('searchLogs')
      .withIndex('timestamp')
      .order('desc')
      .take(500);
    const users = await ctx.db.query('users').collect();
    const userMap = new Map(users.map((u) => [u._id, u]));

    return logs.map((log) => ({
      ...log,
      userEmail: userMap.get(log.userId)?.email ?? null,
    }));
  },
});

export const listSessions = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const profile = await ctx.db
      .query('userProfiles')
      .withIndex('userId', (q) => q.eq('userId', userId))
      .first();
    if (!profile?.isAdmin) return null;

    const sessions = await ctx.db
      .query('userSessions')
      .withIndex('loginTime')
      .order('desc')
      .take(500);
    const users = await ctx.db.query('users').collect();
    const userMap = new Map(users.map((u) => [u._id, u]));

    return sessions.map((s) => ({
      ...s,
      userEmail: userMap.get(s.userId)?.email ?? null,
    }));
  },
});

export const isAdmin = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return false;

    const profile = await ctx.db
      .query('userProfiles')
      .withIndex('userId', (q) => q.eq('userId', userId))
      .first();
    return profile?.isAdmin ?? false;
  },
});
