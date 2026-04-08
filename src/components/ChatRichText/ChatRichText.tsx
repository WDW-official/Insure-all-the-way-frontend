"use client";

import { sanitizeChatHtml } from "@/helpers/sanitizeChatHtml";
import { useMemo } from "react";

type ChatRichTextProps = {
  className?: string;
  content: string;
};

const ChatRichText = ({ className, content }: ChatRichTextProps) => {
  const safeHtml = useMemo(() => sanitizeChatHtml(content), [content]);

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: safeHtml }}
    />
  );
};

export default ChatRichText;
