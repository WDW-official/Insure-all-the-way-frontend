"use client";

import Button from "@/components/Button/Button";
import Loader from "@/components/Loader/Loader";
import ChatMessages from "@/container/ChatMessages/ChatMessages";
import ChatPrompt from "@/container/ChatPrompt/ChatPrompt";
import ChatSideBar from "@/container/ChatSideBar/ChatSideBar";
import { AuthContext } from "@/context/AuthContext";
import { useConversationChats, useConversations } from "@/hooks/useChats";
import useError from "@/hooks/useError";
import {
  CHATBOT_CONVERSATIONS_KEY,
  createChatConversation,
  sendChatMessage,
} from "@/services/chatbot";
import {
  buildChatRequestMessage,
  CHAT_PAGE_EMPTY_STATE,
  CHAT_PAGE_STARTER_PROMPTS,
  createChatMessage,
  parseStoredChatMessage,
} from "@/utilities/chatbot";
import {
  chatBotChatType,
  chatReplyReferenceType,
  conversationType,
} from "@/utilities/types";
import { Menu, MessageSquareText } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useContext, useEffect, useMemo, useState } from "react";
import { mutate } from "swr";
import classes from "./ChatLayout.module.css";

const ChatLayout = () => {
  const [messages, setMessages] = useState<chatBotChatType[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [isCreatingConversation, setIsCreatingConversation] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [replyToMessage, setReplyToMessage] =
    useState<chatReplyReferenceType | null>(null);
  const [isMobileView, setIsMobileView] = useState(false);

  const { user } = useContext(AuthContext);
  const { errorFlowFunction } = useError();

  const { chatId } = useParams();
  const router = useRouter();

  const currentConversationId = Array.isArray(chatId) ? chatId[0] : chatId;
  const chatKey = currentConversationId
    ? `/chatbot/chats/${currentConversationId}`
    : null;

  const { isLoading: conversationsIsLoading, data: conversationData } =
    useConversations();
  const { isLoading: chatsIsLoading, data: chatsData } = useConversationChats(
    currentConversationId as string | undefined,
  );

  const conversations: conversationType[] = useMemo(
    () => conversationData?.data?.conversations || [],
    [conversationData],
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const updateViewportState = () => setIsMobileView(mediaQuery.matches);

    updateViewportState();
    mediaQuery.addEventListener("change", updateViewportState);

    return () => {
      mediaQuery.removeEventListener("change", updateViewportState);
    };
  }, []);

  useEffect(() => {
    if (!chatKey) {
      setMessages([]);
      setReplyToMessage(null);
      return;
    }

    if (chatsData?.data?.chats) {
      setMessages(
        chatsData.data.chats.map((message: chatBotChatType) => {
          const parsedMessage = parseStoredChatMessage(
            message.message,
            message.role,
          );

          return {
            ...message,
            ...parsedMessage,
            status: "sent" as const,
          };
        }),
      );
    }
  }, [chatKey, chatsData]);

  useEffect(() => {
    setReplyToMessage(null);
  }, [currentConversationId]);

  useEffect(() => {
    if (conversationsIsLoading || currentConversationId) {
      return;
    }

    if (conversations.length > 0) {
      router.replace(`/chat/${conversations[0]?._id}`);
      return;
    }

    if (isCreatingConversation) {
      return;
    }

    setIsCreatingConversation(true);

    createChatConversation()
      .then((response) => {
        mutate(CHATBOT_CONVERSATIONS_KEY);
        router.replace(`/chat/${response?.data?.conversation?._id}`);
      })
      .catch((error) => {
        errorFlowFunction(error);
      })
      .finally(() => {
        setIsCreatingConversation(false);
      });
  }, [
    conversations,
    conversationsIsLoading,
    currentConversationId,
    errorFlowFunction,
    isCreatingConversation,
    router,
  ]);

  const sendMessageToAssistant = async (
    messageText: string,
    messageId?: string,
    replyReference: chatReplyReferenceType | null = null,
  ) => {
    if (!currentConversationId || !messageText.trim()) {
      return;
    }

    const pendingUserMessage = messageId
      ? null
      : createChatMessage({
          message: messageText,
          role: "user",
          replyTo: replyReference,
          status: "pending",
        });
    const targetMessageId = messageId || pendingUserMessage?._id;

    setIsSending(true);
    setReplyToMessage(null);

    setMessages((prevState) => {
      if (!messageId && pendingUserMessage) {
        return [
          ...prevState,
          pendingUserMessage,
        ];
      }

      return prevState.map((message) =>
        message._id === targetMessageId
          ? {
              ...message,
              status: "pending" as const,
            }
          : message,
      );
    });

    try {
      const response = await sendChatMessage({
        message: buildChatRequestMessage({
          message: messageText,
          replyTo: replyReference,
        }),
        userId: user?._id,
        conversationId: currentConversationId,
      });

      setMessages((prevState) => {
        const nextState = prevState.map((message) =>
          message._id === targetMessageId
            ? {
                ...message,
                status: "sent" as const,
              }
            : message,
        );

        return [
          ...nextState,
          createChatMessage({
            message: response?.data?.reply,
            role: "assistant",
          }),
        ];
      });

      mutate(CHATBOT_CONVERSATIONS_KEY);
    } catch (error) {
      setMessages((prevState) =>
        prevState.map((message) =>
          message._id === targetMessageId
            ? {
                ...message,
                status: "retryable" as const,
              }
            : message,
        ),
      );

      errorFlowFunction(error);
    } finally {
      setIsSending(false);
    }
  };

  const handleRetryMessage = (messageId: string) => {
    const messageToRetry = messages.find((message) => message._id === messageId);

    if (!messageToRetry) {
      return;
    }

    sendMessageToAssistant(
      messageToRetry.message,
      messageId,
      messageToRetry.replyTo || null,
    );
  };

  const handlePromptSend = (prompt: string) => {
    if (isSending || !currentConversationId) {
      return;
    }

    sendMessageToAssistant(prompt, undefined, replyToMessage);
  };

  const isInitialising =
    conversationsIsLoading ||
    isCreatingConversation ||
    (!currentConversationId && conversations.length === 0);

  return (
    <section className={classes.page}>
      <div
        className={`${classes.mobileBackdrop} ${
          sidebarOpen ? classes.mobileBackdropOpen : ""
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      <section className={classes.container}>
        <ChatSideBar
          activeConversationId={currentConversationId as string | undefined}
          conversations={conversations}
          isOpen={sidebarOpen}
          loading={conversationsIsLoading}
          onClose={() => setSidebarOpen(false)}
        />

        <section className={classes.threadPanel}>
          <header className={classes.threadHeader}>
            <div className={classes.threadHeaderContent}>
              {isMobileView && (
                <Button
                  className={classes.menuButton}
                  title="Open conversations"
                  type="tertiary"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu size={18} />
                </Button>
              )}

              <div>
                <span className={classes.eyebrow}>
                  {CHAT_PAGE_EMPTY_STATE.eyebrow}
                </span>
                <h1>Uju</h1>
                <p>Insurance help for policies, claims, quotes, and cover.</p>
              </div>
            </div>

            <div className={classes.threadMeta}>
              <MessageSquareText size={18} />
              <span>{conversations.length} conversations</span>
            </div>
          </header>

          {isInitialising ? (
            <Loader className={classes.loader} />
          ) : (
            <>
              <ChatMessages
                chatsIsLoading={Boolean(currentConversationId) && chatsIsLoading}
                emptyState={CHAT_PAGE_EMPTY_STATE}
                isLoading={isSending}
                messages={messages}
                onPromptSelect={handlePromptSend}
                onReply={setReplyToMessage}
                onRetry={handleRetryMessage}
                starterPrompts={CHAT_PAGE_STARTER_PROMPTS}
                variant="page"
              />

              <ChatPrompt
                disabled={!currentConversationId}
                loading={isSending}
                onCancelReply={() => setReplyToMessage(null)}
                onSend={sendMessageToAssistant}
                placeholder="Ask about your policy, quote, claim, or coverage…"
                replyTo={replyToMessage}
              />
            </>
          )}
        </section>
      </section>
    </section>
  );
};

export default ChatLayout;
