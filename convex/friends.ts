import { ConvexError } from "convex/values";
import { query } from "./_generated/server";
import { getUserByClerkId } from "./_utils";

export const get = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const currentUser = await getUserByClerkId({
      ctx,
      clerkId: identity.subject,
    });

    if (!currentUser) {
      throw new ConvexError("User not found");
    }

    const friendships1 = await ctx.db
      .query("friends")
      .withIndex("by_user1", (q) => q.eq("user1", currentUser._id))
      .collect();
      
    const friendships2 = await ctx.db
      .query("friends")
      .withIndex("by_user2", (q) => q.eq("user2", currentUser._id))
      .collect();

    const allFriendships = [...friendships1, ...friendships2];

    
    const friends = await Promise.all(
      allFriendships.map(async (friendship) => {
        const friendId = friendship.user1 === currentUser._id 
          ? friendship.user2 
          : friendship.user1;

        const friend = await ctx.db.get(friendId);

        if (!friend) {
          throw new ConvexError("Friend could not be found");
        }
        return {
          friend,
          conversationId: friendship.conversationId,
        };
      })
    );
    
    return friends;
  },
});