// disable next line type checking to ensure React to be inscope and surpress warning from TS type check
// @ts-ignore
import React from "react";
import { CommentsPlugin } from "@udecode/plate-comments/react";
import { useEditorPlugin } from "@udecode/plate-common/react";

import { Avatar, AvatarFallback, AvatarImage } from "./avatar";

export function CommentAvatar({ userId }: { userId: null | string }) {
  const { useOption } = useEditorPlugin(CommentsPlugin);
  const user = useOption("userById", userId);

  if (!user) return null;

  return (
    <Avatar className="size-5">
      <AvatarImage alt={user.name} src={user.avatarUrl} />
      <AvatarFallback>{user.name?.[0]}</AvatarFallback>
    </Avatar>
  );
}
