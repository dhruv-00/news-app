import { authTables } from '@convex-dev/auth/server';
import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

const schema = defineSchema({
  ...authTables,
  userProfiles: defineTable({
    userId: v.id('users'),
    city: v.optional(v.string()),
    lastLoginAt: v.optional(v.number()),
    isAdmin: v.optional(v.boolean()),
  })
    .index('userId', ['userId'])
    .index('isAdmin', ['isAdmin']),
  searchLogs: defineTable({
    userId: v.id('users'),
    searchQuery: v.string(),
    timestamp: v.number(),
    activeTimestamp: v.number(),
  })
    .index('userId', ['userId'])
    .index('timestamp', ['timestamp']),
  userSessions: defineTable({
    userId: v.id('users'),
    loginTime: v.number(),
    logoutTime: v.number(),
    durationSeconds: v.number(),
  })
    .index('userId', ['userId'])
    .index('loginTime', ['loginTime']),
});

export default schema;
