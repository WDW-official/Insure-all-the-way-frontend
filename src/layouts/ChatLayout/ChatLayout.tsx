"use client";

import ChatMessages from "@/container/ChatMessages/ChatMessages";
import ChatPrompt from "@/container/ChatPrompt/ChatPrompt";
import ChatSideBar from "@/container/ChatSideBar/ChatSideBar";
import { AuthContext } from "@/context/AuthContext";
import { requestHandler } from "@/helpers/requestHandler";
import { useConversationChats, useConversations } from "@/hooks/useChats";
import useError from "@/hooks/useError";
import {
  chatBotChatType,
  conversationType,
  requestType,
} from "@/utilities/types";
import { useParams, useRouter } from "next/navigation";
import { useContext, useEffect, useMemo, useState } from "react";
import { mutate } from "swr";
import classes from "./ChatLayout.module.css";

const ChatLayout = () => {
  // States
  const [chats, setChats] = useState<chatBotChatType[]>([]);
  const [requestState, setRequestState] = useState<requestType>({
    isLoading: false,
    data: null,
    error: null,
  });

  // contect
  const { user } = useContext(AuthContext);

  // Router
  const { chatId } = useParams();
  const router = useRouter();

  const addMessages = (message: chatBotChatType) => {
    setChats((prevState) => [...prevState, message]);
  };

  // Hooks
  const { isLoading: conversationsIsLoading, data: conversationData } =
    useConversations();
  const { isLoading: chatsIsLoading, data: chatsData } = useConversationChats(
    chatId as string
  );

  // Memos
  const conversations: conversationType[] = useMemo(() => {
    return conversationData?.data?.conversations;
  }, [conversationData]);

  // Hopks
  const { errorFlowFunction } = useError();

  const handleSendChatRequest = (message: chatBotChatType) => {
    requestHandler({
      url: `${process.env.NEXT_PUBLIC_CHATBOT_BACKEND_API_URL}/chat`,
      data: {
        message: message?.message,
        user_id: user?._id,
        conversation_id: chatId,
      },
      method: "POST",
      state: requestState,
      setState: setRequestState,
      successFunction(res) {
        const messageRes: chatBotChatType = {
          _id: String(new Date()),
          message: res?.data?.reply,
          role: "assistant",
          createdAt: String(new Date()),
        };

        addMessages(messageRes);
        mutate(`/chatbot/chats/${chatId}`);
      },

      errorFunction(err) {
        errorFlowFunction(err);
      },
    });
  };

  // Effects
  useEffect(() => {
    if (chatsData) {
      setChats(chatsData?.data?.chats);
    }
  }, [chatsData]);

  useEffect(() => {
    if (conversationData && !chatId) {
      router.push(`/chat/${conversations?.[0]?._id}`);
    }
  }, [conversationData]);

  return (
    <section className={classes.container}>
      <ChatSideBar
        loading={conversationsIsLoading}
        conversations={conversations}
      />
      <section className={classes.children}>
        <ChatMessages
          messages={chats as any}
          isLoading={requestState?.isLoading}
          chatsIsLoading={chatsIsLoading}
        />
        {chatId && (
          <ChatPrompt
            addMessage={addMessages}
            onSend={handleSendChatRequest}
            loading={requestState?.isLoading}
          />
        )}
      </section>

      <div className={classes.ellipse1}></div>
      <div className={classes.ellipse2}></div>
    </section>
  );
};

export default ChatLayout;
