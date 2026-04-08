import { query, mutation, action } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { api } from "./_generated/api";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    return await ctx.db
      .query("videos")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

export const get = query({
  args: { id: v.id("videos") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: { prompt: v.string(), title: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    return await ctx.db.insert("videos", {
      userId,
      prompt: args.prompt,
      title: args.title,
      status: "generating",
      createdAt: Date.now(),
    });
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("videos"),
    status: v.union(v.literal("generating"), v.literal("completed"), v.literal("failed")),
    storageId: v.optional(v.id("_storage")),
    videoUrl: v.optional(v.string()),
    thumbnailBase64: v.optional(v.string()),
    errorMessage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, {
      ...updates,
      ...(updates.status === "completed" ? { completedAt: Date.now() } : {}),
    });
  },
});

export const remove = mutation({
  args: { id: v.id("videos") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const video = await ctx.db.get(args.id);
    if (!video || video.userId !== userId) throw new Error("Not found");

    await ctx.db.delete(args.id);
  },
});

export const generate = action({
  args: { videoId: v.id("videos"), prompt: v.string() },
  handler: async (ctx, args) => {
    try {
      // First generate a thumbnail image for the video
      const thumbnailPrompt = `Pixar-style 3D animated scene: ${args.prompt}, cute cartoon characters, vibrant colors, soft lighting, family-friendly, magical atmosphere`;

      const thumbnailBase64 = await ctx.runAction(api.ai.generateImage, {
        prompt: thumbnailPrompt,
      });

      // Generate the video with Pixar-style prompt
      const videoPrompt = `Pixar-style 3D animated short video for kids: ${args.prompt}. Cute cartoon characters with big expressive eyes, vibrant colors, smooth animation, magical atmosphere, family-friendly, heartwarming, soft lighting, high quality animation`;

      const result = await ctx.runAction(api.ai.generateVideo, {
        prompt: videoPrompt,
        aspectRatio: "16:9",
        ...(thumbnailBase64 ? { referenceImage: thumbnailBase64 } : {}),
      });

      await ctx.runMutation(api.videos.updateStatus, {
        id: args.videoId,
        status: "completed",
        storageId: result.storageId,
        videoUrl: result.url ?? undefined,
        thumbnailBase64: thumbnailBase64 ?? undefined,
      });
    } catch (error) {
      await ctx.runMutation(api.videos.updateStatus, {
        id: args.videoId,
        status: "failed",
        errorMessage: error instanceof Error ? error.message : "Video generation failed",
      });
    }
  },
});

export const getVideoUrl = query({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});
