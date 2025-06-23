"use client";

import ChatBotContainer from "@/container/ChatBotContainer/ChatBotContainer";
import React, { useContext, createContext, useState } from "react";

type ChatContextType = {
  isOpen: boolean;
  handleOpenChatContainer: () => void;
  handleCloseChatContainer: () => void;
};

export const ChatContext = createContext({} as ChatContextType);

export const ChatContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // States
  const [isOpen, setIsOpen] = useState(false);

  // Utils
  const handleOpenChatContainer = () => {
    setIsOpen((prevState) => !prevState);
  };

  const handleCloseChatContainer = () => {
    setIsOpen(false);
  };

  return (
    <ChatContext.Provider
      value={{ isOpen, handleOpenChatContainer, handleCloseChatContainer }}
    >
      {children}
      <ChatBotContainer />
    </ChatContext.Provider>
  );
};

export const useChatBot = () => {
  const context = useContext(ChatContext);

  if (!context) {
    throw new Error("UseChatBot must be used within a ChatBot Provider");
  }
};
