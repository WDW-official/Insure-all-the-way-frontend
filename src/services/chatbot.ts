"use client";

import axios from "axios";
import axiosInstance from "./index";

export const CHATBOT_CONVERSATIONS_KEY = "/chatbot/conversations";

export type SendChatMessagePayload = {
  message: string;
  userId?: string | null;
  conversationId: string;
};

export const createChatConversation = (title?: string) => {
  return axiosInstance.post(CHATBOT_CONVERSATIONS_KEY, {
    title,
  });
};

export const renameChatConversation = (
  conversationId: string,
  title: string,
) => {
  return axiosInstance.put(
    `${CHATBOT_CONVERSATIONS_KEY}/${conversationId}`,
    {
      title,
    },
  );
};

export const deleteChatConversation = (conversationId: string) => {
  return axiosInstance.delete(`${CHATBOT_CONVERSATIONS_KEY}/${conversationId}`);
};

export const sendChatMessage = ({
  message,
  userId,
  conversationId,
}: SendChatMessagePayload) => {
  if (!process.env.NEXT_PUBLIC_CHATBOT_BACKEND_API_URL) {
    throw new Error("Chatbot service is not configured");
  }

  return axios.post(
    `${process.env.NEXT_PUBLIC_CHATBOT_BACKEND_API_URL}/chat`,
    {
      message,
      user_id: userId,
      conversation_id: conversationId,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    },
  );
};
