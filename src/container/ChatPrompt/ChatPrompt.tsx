"use client";

import Button from "@/components/Button/Button";
import {
  getChatMessageSnippet,
  getChatParticipantLabel,
} from "@/utilities/chatbot";
import { chatReplyReferenceType } from "@/utilities/types";
import { Reply, Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import classes from "./ChatPrompt.module.css";

interface Props {
  disabled?: boolean;
  loading: boolean;
  onSend: (message: string) => void;
  onCancelReply?: () => void;
  placeholder?: string;
  replyTo?: chatReplyReferenceType | null;
  variant?: "page" | "widget";
}

const ChatPrompt: React.FC<Props> = ({
  disabled,
  loading,
  onSend,
  onCancelReply,
  placeholder = "Ask me anything about insurance",
  replyTo,
  variant = "page",
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [message, setMessage] = useState("");

  const resizeTextarea = () => {
    if (!textareaRef.current) {
      return;
    }

    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = `${Math.min(
      textareaRef.current.scrollHeight,
      180,
    )}px`;
  };

  useEffect(() => {
    resizeTextarea();
  }, [message]);

  useEffect(() => {
    if (replyTo) {
      textareaRef.current?.focus();
    }
  }, [replyTo]);

  const handleSend = () => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage || loading || disabled) {
      return;
    }

    onSend(trimmedMessage);
    setMessage("");
  };

  return (
    <section
      className={`${classes.container} ${
        variant === "widget" ? classes.widgetContainer : ""
      }`}
    >
      <div
        className={`${classes.inputContainer} ${
          variant === "widget" ? classes.widgetInputContainer : ""
        }`}
      >
        {replyTo && (
          <div
            className={`${classes.replyBar} ${
              variant === "widget" ? classes.widgetReplyBar : ""
            }`}
          >
            <div className={classes.replyCopy}>
              <span>
                <Reply size={14} />
                Replying to {getChatParticipantLabel(replyTo.role)}
              </span>
              <p>{getChatMessageSnippet(replyTo.message, 140)}</p>
            </div>

            <button
              aria-label="Cancel reply"
              className={classes.replyCloseButton}
              onClick={onCancelReply}
              type="button"
            >
              <X size={14} />
            </button>
          </div>
        )}

        <textarea
          ref={textareaRef}
          disabled={disabled || loading}
          onChange={(event) => setMessage(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              handleSend();
            }
          }}
          placeholder={placeholder}
          rows={1}
          value={message}
        />

        <div
          className={`${classes.inputFooter} ${
            variant === "widget" ? classes.widgetInputFooter : ""
          }`}
        >
          <span className={variant === "widget" ? classes.widgetHint : ""}>
            {replyTo
              ? "Reply includes the referenced message."
              : "Enter sends, Shift + Enter adds a line."}
          </span>
          <Button
            className={`${classes.sendButton} ${
              variant === "widget" ? classes.widgetSendButton : ""
            }`}
            disabled={!message.trim() || loading || disabled}
            onClick={handleSend}
          >
            <Send size={18} color="#fff" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ChatPrompt;
