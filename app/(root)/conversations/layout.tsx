import ItemList from "@/components/shared/item-list/ItemList";
import React, { PropsWithChildren } from "react";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type Props = PropsWithChildren<{}>;

const ConversationsLayout = ({ children }: Props) => {
  return (
    <>
      <ItemList title="Conversations">Conversations Page</ItemList>
      {children}
    </>
  );
};

export default ConversationsLayout;
