import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  scrapingJobs: defineTable({
    // User association
    userId: v.string(), // clerk user ID

    // user Input
    originalPrompt: v.string(),
    // Saved data from BD perplexity scrapper
    analysisPrompt: v.optional(v.string()),

    // BrightData job tracking
    snapshotId: v.optional(v.string()),

    status: v.union(
      v.literal("pending"),
      v.literal("running"),
      v.literal("analyzing"),
      v.literal("completed"),
      v.literal("failed"),
    ),

    // Result {optional filled when webhook receives data}
    results: v.optional(v.array(v.any())),
    seoReport: v.optional(v.any()), // Structured SEO report from GPT API analysis
    error: v.optional(v.string()),

    // Metadata
    createdAt: v.number(),
    completedAt: v.optional(v.number())
  })
    .index("by_status", ["status"])
    .index("by_created_at", ["createdAt"])
    .index("by_user", ["userId"])
    .index("by_user_and_created_at", ["userId", "createdAt"])
})
