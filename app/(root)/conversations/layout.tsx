import React, { PropsWithChildren } from "react";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type Props = PropsWithChildren<{}>;

const ConversationsLayout = ({ children }: Props) => {
  return <div>{children}</div>;
};

export default ConversationsLayout;
