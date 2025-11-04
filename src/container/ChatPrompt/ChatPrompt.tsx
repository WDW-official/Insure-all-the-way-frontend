"use client";

import { useRef, useState } from "react";
import Button from "@/components/Button/Button";
import { Send } from "lucide-react";
import classes from "./ChatPrompt.module.css";
import { chatBotChatType } from "@/utilities/types";

interface Props {
  addMessage: (message: chatBotChatType) => void;
  onSend: (message: chatBotChatType) => void;
  loading: boolean;
}

const ChatPrompt: React.FC<Props> = ({ addMessage, onSend, loading }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [message, setMessage] = useState("");

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setMessage(newValue);

    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`;
    }
  };

  const handleSend = () => {
    if (!message.trim()) return;

    const messageObj = {
      _id: String(Math.random()),
      message: message.trim(),
      role: "user",
      createdAt: String(new Date()),
    };

    addMessage(messageObj);
    setMessage("");

    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
    }

    setTimeout(() => {
      onSend(messageObj);
    }, 500);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <section className={classes.container}>
      <div className={classes.inputContainer}>
        <textarea
          ref={textareaRef}
          placeholder="Ask me anything about insurance"
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          rows={1}
          value={message}
        />
        <Button onClick={handleSend} disabled={loading}>
          <Send size={20} color="#fff" />
        </Button>
      </div>
    </section>
  );
};

export default ChatPrompt;
