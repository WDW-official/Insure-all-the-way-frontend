"use client";

import Ai from "@/assets/svgIcons/Ai";
import Button from "@/components/Button/Button";
import { useToast } from "@/context/ToastContext";
import { Copy, Loader } from "lucide-react";
import { useEffect, useRef } from "react";
import classes from "./ChatMessages.module.css";

interface Message {
  _id: string;
  role: "user" | "assistant";
  message: string;
  createdAt?: string;
}

interface ChatMessagesProps {
  messages: Message[];
  isLoading?: boolean;
  chatsIsLoading: boolean;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  isLoading,
  chatsIsLoading,
}) => {
  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Hooks
  const { showToast } = useToast();

  // Effects
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "auto" });
    }
  }, []);

  if (chatsIsLoading) {
    return (
      <section className={classes.loader}>
        <Loader className="animate-spin" size={16} />
      </section>
    );
  }

  return (
    <section ref={containerRef} className={classes.container}>
      {messages.length === 0 && !isLoading && (
        <div className={classes.empty}>
          <Ai />
          <h4>Ask our AI anything on Insurance</h4>
        </div>
      )}

      {messages.map((msg) => (
        <div
          key={msg._id}
          className={`${classes.messageWrapper} ${
            msg.role === "user" ? classes.user : classes.assistant
          }`}
        >
          {/* Chat Bubble */}
          <div
            className={classes.bubble}
            dangerouslySetInnerHTML={{ __html: msg?.message }}
          />

          {/* Copy Button Below */}
          <Button
            className={classes.copyButton}
            title="Copy message"
            onClick={() => {
              const plainText = msg?.message?.replace(/<[^>]+>/g, ""); // remove HTML tags
              navigator.clipboard.writeText(plainText || "");
              showToast("Copied successfully", "success");
            }}
            type="bordered"
          >
            <Copy size={16} />
            <span>Copy</span>
          </Button>
        </div>
      ))}

      {isLoading && (
        <div className={`${classes.messageWrapper} ${classes.assistant}`}>
          <div className={`${classes.bubble} ${classes.loading}`}>
            <span className={classes.dot}></span>
            <span className={classes.dot}></span>
            <span className={classes.dot}></span>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </section>
  );
};

export default ChatMessages;
