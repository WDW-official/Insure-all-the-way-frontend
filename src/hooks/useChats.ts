import useGetHook from "./useGetHook";

export const useConversations = (enabled = true) => {
  return useGetHook(enabled ? "/chatbot/conversations" : null);
};

export const useConversationChats = (conversationId?: string) => {
  const url = conversationId ? `/chatbot/chats/${conversationId}` : null;

  return useGetHook(url);
};
