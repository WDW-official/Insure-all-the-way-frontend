import useGetHook from "./useGetHook";

export const useConversations = () => {
  return useGetHook("/chatbot/conversations");
};

export const useConversationChats = (conversationId?: string) => {
  const url = conversationId ? `/chatbot/chats/${conversationId}` : null;

  return useGetHook(url);
};
