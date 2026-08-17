"use client";
import ConversationFallback from "@/components/shared/conversation/ConversationFallback";
import React from "react";
import AddFriendDialog from "./_components/AddFriendDialog";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Loader2, User } from "lucide-react";
import Request from "./_components/Request";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";


const FriendsPage = () => {
  const requests = useQuery(api.requests.get);
  const friends = useQuery(api.friends.get);
  return (
    <>
      <Card className="hidden h-full w-full p-2 lg:flex lg:w-80 lg:flex-none">
        <div className="flex h-full min-h-0 w-full flex-col">
          <section className="flex min-h-0 flex-1 flex-col">
            <div className="mb-4 flex items-center justify-between">
              <h1 className="text-2xl font-semibold tracking-tight">
                Friends {friends ? `(${friends.length})` : ""}
              </h1>
              <AddFriendDialog />
            </div>
            <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto pr-1">
              {!friends ? (
                <Loader2 className="m-auto h-8 w-8 animate-spin" />
              ) : friends.length === 0 ? (
                <p className="m-auto text-center text-sm text-muted-foreground">
                  No friends found
                </p>
              ) : (
                friends.map((item, index: number) => {
                  const friendData = item?.friend || item;
                  const conversationId = item?.conversationId || "missing-id";
                  if (!friendData || !friendData.username) return null;
                  return (
                    <Link
                      key={friendData._id || index}
                      href={`/conversations/${conversationId}`}
                      className="w-full"
                    >
                      <Card className="flex items-center gap-4 p-2">
                        <Avatar>
                          <AvatarImage src={friendData?.imageUrl} />
                          <AvatarFallback>
                            <User />
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex min-w-0 flex-col">
                          <h4 className="truncate">{friendData?.username}</h4>
                          <p className="truncate text-xs text-muted-foreground">
                            {friendData?.email}
                          </p>
                        </div>
                      </Card>
                    </Link>
                  )

                  })
                )
              }
            </div>
          </section>

          <div className="my-2 border-t" />

          <section className="flex min-h-0 flex-1 flex-col">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold tracking-tight">
                Friend requests {requests ? `(${requests.length})` : ""}
              </h2>
            </div>
            <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto pr-1">
              {!requests ? (
                <Loader2 className="m-auto h-8 w-8 animate-spin" />
              ) : requests.length === 0 ? (
                <p className="m-auto text-center text-sm text-muted-foreground">
                  No friend requests found
                </p>
              ) : (
                requests.map((request) => (
                  <Request
                    key={request.request._id}
                    id={request.request._id}
                    imageUrl={request.sender.imageUrl}
                    username={request.sender.username}
                    email={request.sender.email}
                  />
                ))
              )}
            </div>
          </section>
        </div>
      </Card>
      <ConversationFallback />
    </>
  );
};

export default FriendsPage;
