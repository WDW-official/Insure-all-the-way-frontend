import useGetHook from "./useGetHook";

const getGuestSessionQuery = (guestSessionId?: string | null) => {
  if (!guestSessionId) {
    return "";
  }

  return `?guest_session_id=${encodeURIComponent(guestSessionId)}`;
};

export const useConversations = (
  enabled = true,
  guestSessionId?: string | null,
) => {
  const queryString = getGuestSessionQuery(guestSessionId);
  return useGetHook(enabled ? `/chatbot/conversations${queryString}` : null);
};

export const useConversationChats = (
  conversationId?: string,
  guestSessionId?: string | null,
) => {
  const queryString = getGuestSessionQuery(guestSessionId);
  const url = conversationId
    ? `/chatbot/chats/${conversationId}${queryString}`
    : null;

  return useGetHook(url);
};
