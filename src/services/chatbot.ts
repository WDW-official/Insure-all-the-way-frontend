"use client";

import axiosInstance from "./index";

export const CHATBOT_CONVERSATIONS_KEY = "/chatbot/conversations";

export type SendChatMessagePayload = {
  message: string;
  guestSessionId?: string | null;
  conversationId: string;
};

type GuestPayloadType = {
  guestSessionId?: string | null;
};

const buildGuestPayload = ({ guestSessionId }: GuestPayloadType = {}) => ({
  guest_session_id: guestSessionId || undefined,
});

export const createChatConversation = (
  title?: string,
  guestSessionId?: string | null,
) => {
  return axiosInstance.post(CHATBOT_CONVERSATIONS_KEY, {
    title,
    ...buildGuestPayload({ guestSessionId }),
  });
};

export const renameChatConversation = (
  conversationId: string,
  title: string,
  guestSessionId?: string | null,
) => {
  return axiosInstance.put(
    `${CHATBOT_CONVERSATIONS_KEY}/${conversationId}`,
    {
      title,
      ...buildGuestPayload({ guestSessionId }),
    },
  );
};

export const deleteChatConversation = (
  conversationId: string,
  guestSessionId?: string | null,
) => {
  return axiosInstance.delete(`${CHATBOT_CONVERSATIONS_KEY}/${conversationId}`, {
    data: buildGuestPayload({ guestSessionId }),
  });
};

export const sendChatMessage = ({
  message,
  guestSessionId,
  conversationId,
}: SendChatMessagePayload) => {
  return axiosInstance.post(
    "/chatbot/message",
    {
      message,
      conversation_id: conversationId,
      ...buildGuestPayload({ guestSessionId }),
    },
  );
};
