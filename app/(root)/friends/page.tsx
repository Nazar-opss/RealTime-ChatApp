import ConversationFallback from "@/components/shared/conversation/ConversationFallback";
import ItemList from "@/components/shared/item-list/ItemList";
import React from "react";
import AddFriendDialog from "./_components/AddFriendDialog";

type Props = {};

const FriendsPage = (props: Props) => {
  return (
    <>
      <ItemList action={<AddFriendDialog />} title="Friends">
        FriendsPage
      </ItemList>
      <ConversationFallback />
    </>
  );
};

export default FriendsPage;
