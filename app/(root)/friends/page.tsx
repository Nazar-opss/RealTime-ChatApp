import ConversationFallback from "@/components/shared/conversation/ConversationFallBack";
import ItemList from "@/components/shared/item-list/ItemList";
import React from "react";

type Props = {};

const FriendsPage = (props: Props) => {
  return (
    <>
      <ItemList title="Friends">FriendsPage</ItemList>
      <ConversationFallback />
    </>
  );
};

export default FriendsPage;
