"use client";

import { useToast } from "@/context/ToastContext";
import {
  copyChatTextToClipboard,
  getChatMessageCopyText,
  getChatMessageSnippet,
  getChatParticipantLabel,
} from "@/utilities/chatbot";
import { chatBotChatType, chatReplyReferenceType } from "@/utilities/types";
import ChatRichText from "@/components/ChatRichText/ChatRichText";
import { Check, Copy, CornerUpLeft, Loader, RotateCcw } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import logo from "../../assets/images/logo.png";
import classes from "./ChatMessages.module.css";
import Logo from "@/components/Logo/Logo";

type EmptyStateType = {
  description: string;
  eyebrow: string;
  title: string;
};

interface ChatMessagesProps {
  chatsIsLoading: boolean;
  emptyState: EmptyStateType;
  isLoading?: boolean;
  messages: chatBotChatType[];
  onPromptSelect?: (prompt: string) => void;
  onReply?: (message: chatReplyReferenceType) => void;
  onRetry?: (messageId: string) => void;
  starterPrompts?: string[];
  variant?: "page" | "widget";
}

const ChatMessages: React.FC<ChatMessagesProps> = ({
  chatsIsLoading,
  emptyState,
  isLoading,
  messages,
  onPromptSelect,
  onReply,
  onRetry,
  starterPrompts = [],
  variant = "page",
}) => {
  const containerRef = useRef<HTMLElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const shouldAutoScrollRef = useRef(true);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    if (!shouldAutoScrollRef.current || !containerRef.current) {
      return;
    }

    containerRef.current.scrollTo({
      top: containerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [isLoading, messages]);

  const handleScroll = () => {
    if (!containerRef.current) {
      return;
    }

    const { clientHeight, scrollHeight, scrollTop } = containerRef.current;
    shouldAutoScrollRef.current =
      scrollTop + clientHeight >= scrollHeight - 72;
  };

  const handleCopyMessage = async (message: chatBotChatType) => {
    try {
      await copyChatTextToClipboard(getChatMessageCopyText(message));
      setCopiedMessageId(message._id);
      showToast(
        message.role === "assistant" ? "Response copied" : "Message copied",
        "success",
      );
      window.setTimeout(() => {
        setCopiedMessageId((currentMessageId) =>
          currentMessageId === message._id ? null : currentMessageId,
        );
      }, 1800);
    } catch (error) {
      showToast("Could not copy that message right now", "error");
    }
  };

  if (chatsIsLoading) {
    return (
      <section className={classes.loader}>
        <Loader className="animate-spin" size={18} />
      </section>
    );
  }

  const showEmptyState = messages.length === 0 && !isLoading;

  return (
    <section
      onScroll={handleScroll}
      ref={containerRef}
      className={`${classes.container} ${
        variant === "widget" ? classes.widgetContainer : ""
      }`}
    >
      {showEmptyState && (
        <div
          className={`${classes.empty} ${
            variant === "widget" ? classes.widgetEmpty : ""
          }`}
        >
          <Logo dimensions={{ width: 105, height: 65 }} />

          {/* <span className={classes.emptyEyebrow}>{emptyState.eyebrow}</span> */}
          <h4>{emptyState.title}</h4>
          <p>{emptyState.description}</p>

          {starterPrompts.length > 0 && (
            <div className={classes.promptGrid}>
              {starterPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => onPromptSelect?.(prompt)}
                  type="button"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {messages.map((message) => {
        const isUserMessage = message.role === "user";
        const isRetryable = message.status === "retryable";
        const isPending = message.status === "pending";

        return (
          <article
            className={`${classes.messageRow} ${
              isUserMessage ? classes.userRow : classes.assistantRow
            }`}
            key={message._id}
          >
            <div className={classes.avatar}>
              {isUserMessage ? "You" : "Uju"}
            </div>

            <div className={classes.messageColumn}>
              <div className={classes.messageMeta}>
                <span>{isUserMessage ? "You" : "Uju"}</span>
                {isPending && <small>Sending…</small>}
                {isRetryable && <small>Not sent</small>}
              </div>

              <div
                className={`${classes.bubble} ${
                  isUserMessage ? classes.userBubble : classes.assistantBubble
                } ${isRetryable ? classes.errorBubble : ""}`}
              >
                {message.replyTo && (
                  <div className={classes.replyPreview}>
                    <span>
                      Replying to{" "}
                      {getChatParticipantLabel(message.replyTo.role)}
                    </span>
                    <p>{getChatMessageSnippet(message.replyTo.message, 120)}</p>
                  </div>
                )}

                {isUserMessage ? (
                  <p>{message.message}</p>
                ) : (
                  <ChatRichText
                    className={classes.richText}
                    content={message.message}
                  />
                )}
              </div>

              <div className={classes.messageActions}>
                {!isPending && (
                  <button
                    className={classes.actionButton}
                    onClick={() => handleCopyMessage(message)}
                    type="button"
                  >
                    {copiedMessageId === message._id ? (
                      <Check size={14} />
                    ) : (
                      <Copy size={14} />
                    )}
                    {copiedMessageId === message._id ? "Copied" : "Copy"}
                  </button>
                )}

                {!isPending && onReply && (
                  <button
                    className={classes.actionButton}
                    onClick={() =>
                      onReply({
                        _id: message._id,
                        message: getChatMessageCopyText(message),
                        role: message.role,
                      })
                    }
                    type="button"
                  >
                    <CornerUpLeft size={14} />
                    Reply
                  </button>
                )}

                {isRetryable && onRetry && (
                  <button
                    className={`${classes.actionButton} ${classes.retryButton}`}
                    onClick={() => onRetry(message._id)}
                    type="button"
                  >
                    <RotateCcw size={14} />
                    Retry
                  </button>
                )}
              </div>
            </div>
          </article>
        );
      })}

      {isLoading && (
        <article className={`${classes.messageRow} ${classes.assistantRow}`}>
          <div className={classes.avatar}>Uju</div>

          <div className={classes.messageColumn}>
            <div className={classes.messageMeta}>
              <span>Uju</span>
              <small>Thinking…</small>
            </div>

            <div className={`${classes.bubble} ${classes.assistantBubble}`}>
              <div className={classes.loadingDots}>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        </article>
      )}

      <div ref={bottomRef} />
    </section>
  );
};

export default ChatMessages;
