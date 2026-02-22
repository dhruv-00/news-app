import { internalMutation } from './_generated/server';
import { v } from 'convex/values';

/**
 * Run once from Convex dashboard to promote a user to admin.
 * Example: npx convex run seedAdmin:promoteToAdmin '{"email":"admin@example.com"}'
 */
export const promoteToAdmin = internalMutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query('users')
      .withIndex('email', (q) => q.eq('email', args.email))
      .first();
    if (!user) throw new Error(`User not found: ${args.email}`);

    const existing = await ctx.db
      .query('userProfiles')
      .withIndex('userId', (q) => q.eq('userId', user._id))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, { isAdmin: true });
      return existing._id;
    }
    return await ctx.db.insert('userProfiles', {
      userId: user._id,
      isAdmin: true,
    });
  },
});
